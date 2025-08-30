import { NextResponse } from 'next/server';
import { getDbPool, initSchema } from '../../../lib/db';
import { sendContactEmail } from '../../../lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Валидация данных
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Пожалуйста, заполните все обязательные поля' }, { status: 400 });
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Пожалуйста, введите корректный email' }, { status: 400 });
    }

    await initSchema();

    const pool = getDbPool();
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();

      // Сохраняем письмо в базу данных
      const [result] = await conn.query(
        `INSERT INTO contact_emails (name, email, phone, message)
         VALUES (?, ?, ?, ?)`,
        [name, email, phone || null, message]
      );

      await conn.commit();

      // Отправляем уведомление на email администратора
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_FROM) {
        const html = `
          <h2>Новое сообщение с сайта</h2>
          <p><strong>От:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Телефон:</strong> ${phone || 'Не указан'}</p>
          <h3>Сообщение:</h3>
          <p>${message}</p>
        `;

        await sendContactEmail({
          to: process.env.CONTACT_EMAIL_TO || process.env.ORDER_EMAIL_TO || email,
          subject: `Новое сообщение с сайта от ${name}`,
          html,
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.' 
      });

    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
    return NextResponse.json({ 
      error: 'Произошла ошибка при отправке сообщения. Попробуйте позже.' 
    }, { status: 500 });
  }
}

