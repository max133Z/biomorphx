import { NextResponse } from 'next/server';
import { getDbPool, initSchema } from '../../../lib/db';
import { sendOrderEmail } from '../../../lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body || {};
    const isTest = process.env.TEST_MODE === '1';
    if (!customer?.email || !Array.isArray(items) || !items.length || typeof total !== 'number') {
      return NextResponse.json({ error: 'Неверные данные заказа' }, { status: 400 });
    }

    // Тестовый режим — без БД и email
    if (isTest) {
      return NextResponse.json({ success: true, orderId: 1, test: true });
    }

    await initSchema();

    const pool = getDbPool();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [orderResult] = await conn.query(
        `INSERT INTO orders (customer_email, customer_name, customer_phone, shipping_address, total_price, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [
          customer.email,
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || null,
          customer.phone || null,
          customer.address || null,
          total,
        ]
      );
      const orderId = orderResult.insertId;

      for (const it of items) {
        await conn.query(
          `INSERT INTO order_items (order_id, product_id, title, quantity, unit_price)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, String(it.productId || it.id || ''), it.title || it.name || 'Товар', it.quantity || 1, it.unitPrice || it.price || 0]
        );
      }

      await conn.commit();

      const html = `
        <h2>Новый заказ #${orderId}</h2>
        <p><strong>Клиент:</strong> ${customer.firstName || ''} ${customer.lastName || ''}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Телефон:</strong> ${customer.phone || ''}</p>
        <p><strong>Адрес:</strong> ${customer.address || ''}</p>
        <h3>Товары:</h3>
        ${items.map(i => `<div style="margin:8px 0;">${i.title || i.name} — ${i.quantity} шт. × ${i.unitPrice || i.price} ₽</div>`).join('')}
        <h3>Итого: ${total} ₽</h3>
      `;

      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_FROM) {
        await sendOrderEmail({
          to: process.env.ORDER_EMAIL_TO || customer.email,
          subject: `Новый заказ #${orderId}`,
          html,
        });
      }

      return NextResponse.json({ success: true, orderId });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
