import { NextResponse } from 'next/server';
import { getDbPool, initSchema } from '../../../lib/db';

export async function GET() {
  try {
    await initSchema();
    const pool = getDbPool();
    
    // Проверяем подключение
    const [result] = await pool.query('SELECT 1 as test');
    
    // Проверяем количество заказов
    const [ordersResult] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const ordersCount = ordersResult[0].count;
    
    // Проверяем последние заказы
    const [recentOrders] = await pool.query(`
      SELECT id, customer_email, customer_name, total_price, status, created_at 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    // Проверяем структуру таблицы orders
    const [columns] = await pool.query('DESCRIBE orders');
    
    return NextResponse.json({ 
      success: true,
      databaseConnected: true,
      ordersCount,
      recentOrders,
      tableStructure: columns,
      message: 'База данных работает нормально'
    });
  } catch (error) {
    console.error('Ошибка проверки базы данных:', error);
    return NextResponse.json({ 
      success: false,
      databaseConnected: false,
      error: error.message,
      message: 'Проблема с подключением к базе данных'
    }, { status: 500 });
  }
}
