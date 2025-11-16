import { NextResponse } from 'next/server';
import { getDbPool, initSchema } from '../../../../lib/db';
import { checkAdminAuth } from '../../../../lib/auth';

export async function GET(request) {
  // Проверка авторизации
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    console.log('🔍 API: Начинаем получение заказов для админ панели...');
    
    // Инициализируем схему базы данных
    await initSchema();
    console.log('✅ API: Схема базы данных инициализирована');
    
    const pool = getDbPool();
    console.log('✅ API: Подключение к базе данных получено');
    
    // Проверяем подключение к базе данных
    const [testResult] = await pool.query('SELECT 1 as test');
    console.log('✅ API: Подключение к базе данных работает');
    
    // Получаем все заказы
    console.log('🔍 API: Запрашиваем заказы из базы данных...');
    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.customer_email,
        o.customer_name,
        o.customer_phone,
        o.shipping_address,
        o.total_price,
        o.status,
        o.created_at,
        o.email_sent
      FROM orders o
      ORDER BY o.created_at DESC
    `);
    
    console.log(`📊 API: Найдено ${orders.length} заказов в базе данных`);
    
    if (orders.length > 0) {
      console.log('📋 API: Примеры заказов:');
      orders.slice(0, 3).forEach(order => {
        console.log(`  - Заказ #${order.id}: ${order.customer_name} (${order.customer_email}) - ${order.total_price}₽`);
      });
    }

    // Для каждого заказа получаем товары
    console.log('🔍 API: Загружаем товары для каждого заказа...');
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.query(`
          SELECT 
            oi.product_id,
            oi.title,
            oi.quantity,
            oi.unit_price
          FROM order_items oi
          WHERE oi.order_id = ?
        `, [order.id]);

        return {
          ...order,
          items: items
        };
      })
    );

    console.log('✅ API: Заказы с товарами успешно загружены');
    console.log(`📊 API: Возвращаем ${ordersWithItems.length} заказов в админ панель`);

    return NextResponse.json({ 
      success: true,
      orders: ordersWithItems,
      count: ordersWithItems.length
    });
    
  } catch (error) {
    console.error('❌ API: Ошибка получения заказов:', error);
    console.error('❌ API: Детали ошибки:', {
      message: error.message,
      code: error.code,
      sql: error.sql,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      success: false,
      error: 'Ошибка сервера',
      details: error.message,
      orders: []
    }, { status: 500 });
  }
}
