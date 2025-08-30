import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';

export async function GET() {
  try {
    const pool = getDbPool();
    
    // Получаем все письма
    const [emails] = await pool.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        message,
        created_at
      FROM contact_emails
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Ошибка получения писем:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

