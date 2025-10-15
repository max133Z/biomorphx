import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';
import { checkAdminAuth } from '../../../../lib/auth';

export async function POST(request) {
  // Проверка авторизации
  const authError = checkAdminAuth(request);
  if (authError) return authError;

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

