import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';

export async function GET() {
  try {
    const pool = getDbPool();
    
    // Получаем все заказы с товарами
    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.customer_email,
        o.customer_name,
        o.customer_phone,
        o.shipping_address,
        o.total_price,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `);

    // Для каждого заказа получаем товары
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

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
