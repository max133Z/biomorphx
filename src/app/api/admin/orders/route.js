import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';

export async function GET() {
  try {
    const pool = getDbPool();

    const [orders] = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC LIMIT 200`
    );

    const orderIds = orders.map(o => o.id);
    let itemsByOrder = {};
    if (orderIds.length) {
      const [items] = await pool.query(
        `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`,
        orderIds
      );
      for (const it of items) {
        if (!itemsByOrder[it.order_id]) itemsByOrder[it.order_id] = [];
        itemsByOrder[it.order_id].push(it);
      }
    }

    const result = orders.map(o => ({
      ...o,
      items: itemsByOrder[o.id] || [],
    }));

    return NextResponse.json({ orders: result });
  } catch (error) {
    console.error('Ошибка чтения заказов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
