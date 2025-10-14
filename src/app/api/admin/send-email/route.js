import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';
import { sendOrderEmail } from '../../../../lib/email';
import { checkAdminAuth, sanitizeHtml } from '../../../../lib/auth';

export async function POST(request) {
  // Проверка авторизации
  const authError = checkAdminAuth(request);
  if (authError) return authError;

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
      <p><strong>Клиент:</strong> ${sanitizeHtml(order.customer_name || '')}</p>
      <p><strong>Email:</strong> ${sanitizeHtml(order.customer_email)}</p>
      <p><strong>Телефон:</strong> ${sanitizeHtml(order.customer_phone || '')}</p>
      <p><strong>Адрес:</strong> ${sanitizeHtml(order.shipping_address || '')}</p>
      <h3>Товары:</h3>
      ${items.map(i => `<div style="margin:8px 0;">${sanitizeHtml(i.title)} — ${i.quantity} шт. × ${i.unit_price} ₽</div>`).join('')}
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
