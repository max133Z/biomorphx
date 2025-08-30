import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Неверные параметры' }, { status: 400 });
    }

    const pool = getDbPool();
    
    // Обновляем статус заказа
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка обновления статуса заказа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
