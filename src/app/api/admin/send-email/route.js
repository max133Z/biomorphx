import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';
import { sendOrderEmail } from '../../../../lib/email';

export async function POST(request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId обязателен' }, { status: 400 });
    }

    const pool = getDbPool();
    const [[order]] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    const html = `
      <h2>Информация о заказе #${orderId}</h2>
      <p><strong>Клиент:</strong> ${order.customer_name || ''}</p>
      <p><strong>Email:</strong> ${order.customer_email}</p>
      <p><strong>Телефон:</strong> ${order.customer_phone || ''}</p>
      <p><strong>Адрес:</strong> ${order.shipping_address || ''}</p>
      <h3>Товары:</h3>
      ${items.map(i => `<div style="margin:8px 0;">${i.title} — ${i.quantity} шт. × ${i.unit_price} ₽</div>`).join('')}
      <h3>Итого: ${order.total_price} ₽</h3>
    `;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_FROM) {
      await sendOrderEmail({
        to: process.env.ORDER_EMAIL_TO || order.customer_email,
        subject: `Информация о заказе #${orderId}`,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка повторной отправки email:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
