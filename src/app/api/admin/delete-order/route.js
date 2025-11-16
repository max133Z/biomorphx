import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';
import { checkAdminAuth } from '../../../../lib/auth';

export async function DELETE(request) {
  // Проверка авторизации
  const authError = checkAdminAuth(request);
  if (authError) return authError;

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

