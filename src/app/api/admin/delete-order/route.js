import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';

export async function DELETE(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Неверные параметры' }, { status: 400 });
    }

    const pool = getDbPool();
    
    // Удаляем заказ (order_items удалятся автоматически благодаря CASCADE)
    await pool.query(
      'DELETE FROM orders WHERE id = ?',
      [orderId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления заказа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

