import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../lib/db';
import { checkAdminAuth } from '../../../../lib/auth';

export async function GET(request) {
  // Проверка авторизации
  const authError = checkAdminAuth(request);
  if (authError) return authError;

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


