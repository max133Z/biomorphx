import { NextResponse } from 'next/server';
import { getDbPool, initSchema } from '../../../lib/db';
import { sendOrderEmail } from '../../../lib/email';
import { sanitizeHtml } from '../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

export async function POST(request) {
  // Rate limiting: макс 20 заказов в час с одного IP
  const ip = getClientIp(request);
  const limitCheck = checkRateLimit(`order:${ip}`, {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 час
    message: 'Слишком много заказов с вашего IP. Пожалуйста, попробуйте позже или свяжитесь с нами.'
  });

  if (!limitCheck.allowed) {
    const retryMinutes = Math.ceil((limitCheck.resetTime - Date.now()) / 1000 / 60);
    return NextResponse.json(
      { 
        error: '⏱️ Превышен лимит запросов',
        message: `Вы отправили много заказов за последний час. Пожалуйста, подождите ${retryMinutes} мин. или свяжитесь с нами напрямую.`,
        contact: {
          phone: '+7 999 041 37 55',
          text: 'Позвоните нам, и мы поможем оформить заказ'
        },
        retryAfter: Math.ceil((limitCheck.resetTime - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limitCheck.resetTime - Date.now()) / 1000))
        }
      }
    );
  }
  

  try {
    console.log('🔍 API: Начинаем создание заказа...');
    
    const body = await request.json();
    const { customer, items, total, orderHash } = body || {};
    const isTest = process.env.TEST_MODE === '1';
    
    console.log('📋 API: Данные заказа:', {
      customerEmail: customer?.email,
      itemsCount: items?.length,
      total,
      isTest
    });
    
    if (!customer?.email || !Array.isArray(items) || !items.length || typeof total !== 'number') {
      console.error('❌ API: Неверные данные заказа:', { customer, items, total });
      return NextResponse.json({ error: 'Неверные данные заказа' }, { status: 400 });
    }

    // Тестовый режим — без БД и email
    if (isTest) {
      console.log('✅ API: Тестовый режим - возвращаем успех');
      return NextResponse.json({ success: true, orderId: 1, test: true });
    }

    console.log('🔍 API: Инициализируем схему базы данных...');
    await initSchema();
    console.log('✅ API: Схема базы данных инициализирована');

    const pool = getDbPool();
    const conn = await pool.getConnection();
    console.log('✅ API: Подключение к базе данных получено');
    
    try {
      console.log('🔍 API: Начинаем транзакцию...');
      await conn.beginTransaction();

      // Проверяем, не был ли уже создан заказ с таким же хешем (защита от дублирования)
      if (orderHash) {
        console.log('🔍 API: Проверяем на дублирование заказа...');
        const [existingOrder] = await conn.query(
          'SELECT id FROM orders WHERE customer_email = ? AND total_price = ? AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE)',
          [customer.email, total]
        );
        
        if (existingOrder.length > 0) {
          console.log('⚠️ API: Найден дублирующий заказ:', existingOrder[0].id);
          await conn.rollback();
          return NextResponse.json({ 
            error: 'Похожий заказ уже был создан недавно. Если вы хотите оформить новый заказ, подождите 2 минуты или измените состав корзины.',
            orderId: existingOrder[0].id 
          }, { status: 409 });
        }
      }

      console.log('🔍 API: Создаем заказ в базе данных...');
      const [orderResult] = await conn.query(
        `INSERT INTO orders (customer_email, customer_name, customer_phone, shipping_address, total_price, status, email_sent, notes)
         VALUES (?, ?, ?, ?, ?, 'pending', FALSE, ?)`,
        [
          customer.email,
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || null,
          customer.phone || null,
          customer.address || null,
          total,
          customer.notes || null,
        ]
      );
      const orderId = orderResult.insertId;
      console.log('✅ API: Заказ создан с ID:', orderId);

      console.log('🔍 API: Добавляем товары в заказ...');
      for (const it of items) {
        await conn.query(
          `INSERT INTO order_items (order_id, product_id, title, quantity, unit_price)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, String(it.productId || it.id || ''), it.title || it.name || 'Товар', it.quantity || 1, it.unitPrice || it.price || 0]
        );
      }
      console.log('✅ API: Товары добавлены в заказ');

      console.log('🔍 API: Фиксируем транзакцию...');
      await conn.commit();
      console.log('✅ API: Транзакция зафиксирована');

      // Отправляем email только при создании нового заказа
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_FROM) {
        console.log('🔍 API: Отправляем email уведомление...');
        try {
          const html = `
            <h2>Новый заказ #${orderId}</h2>
            <p><strong>Клиент:</strong> ${sanitizeHtml(customer.firstName || '')} ${sanitizeHtml(customer.lastName || '')}</p>
            <p><strong>Email:</strong> ${sanitizeHtml(customer.email)}</p>
            <p><strong>Телефон:</strong> ${sanitizeHtml(customer.phone || '')}</p>
            <p><strong>Способ доставки:</strong> ${customer.deliveryMethod === 'cdek' ? 'СДЭК' : 
                                                    customer.deliveryMethod === 'post' ? 'Почта России' : 
                                                    customer.deliveryMethod === 'express' ? 'Экспресс доставка по Санкт-Петербургу' : 
                                                    'Не указан'}</p>
            <p><strong>${customer.deliveryMethod === 'cdek' ? 'Адрес пункта выдачи СДЭК' : 
                         customer.deliveryMethod === 'post' ? 'Адрес доставки' : 
                         customer.deliveryMethod === 'express' ? 'Адрес экспресс доставки' : 
                         'Адрес'}:</strong> ${sanitizeHtml(customer.address || '')}</p>
            ${customer.deliveryMethod === 'post' && customer.postIndex ? `<p><strong>Почтовый индекс:</strong> ${sanitizeHtml(customer.postIndex)}</p>` : ''}
            <p><strong>Способ оплаты:</strong> ${customer.paymentMethod === 'card' ? 'Банковская карта' : 
                                                  customer.paymentMethod === 'sbp' ? 'СБП (Система Быстрых Платежей)' : 
                                                  customer.paymentMethod === 'cash' ? 'Наличными при получении' : 
                                                  'Не указан'}</p>
            ${customer.notes ? `<p><strong>Комментарий к заказу:</strong> ${sanitizeHtml(customer.notes)}</p>` : ''}
            <h3>Товары:</h3>
            ${items.map(i => `<div style="margin:8px 0;">${sanitizeHtml(i.title || i.name)} — ${i.quantity} шт. × ${i.unitPrice || i.price} ₽</div>`).join('')}
            <h3>Итого: ${total} ₽</h3>
          `;

          await sendOrderEmail({
            to: process.env.ORDER_EMAIL_TO || customer.email,
            subject: `Новый заказ #${orderId}`,
            html,
          });

          console.log('✅ API: Email успешно отправлен');
        } catch (emailError) {
          console.error('❌ API: Ошибка отправки email:', emailError);
          // Не прерываем создание заказа из-за ошибки email
        }
      } else {
        console.log('⚠️ API: SMTP не настроен, пропускаем отправку email');
      }

      console.log('✅ API: Заказ успешно создан:', orderId);
      return NextResponse.json({ success: true, orderId });
      
    } catch (e) {
      console.error('❌ API: Ошибка в транзакции:', e);
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
      console.log('✅ API: Соединение с базой данных освобождено');
    }
  } catch (error) {
    console.error('❌ API: Критическая ошибка создания заказа:', error);
    console.error('❌ API: Stack trace:', error.stack);
    
    return NextResponse.json({ 
      success: false,
      error: 'Ошибка сервера',
      details: error.message
    }, { status: 500 });
  }
}
