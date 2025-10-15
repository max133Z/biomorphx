import { NextResponse } from 'next/server';
import { getDbPool, initSchema } from '../../../lib/db';
import { sendContactEmail } from '../../../lib/email';
import { sanitizeHtml, isValidEmail, isValidPhone, limitLength } from '../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

export async function POST(request) {
  // Rate limiting: макс 15 сообщений в час с одного IP
  const ip = getClientIp(request);
  const limitCheck = checkRateLimit(`contact:${ip}`, {
    maxRequests: 15,
    windowMs: 60 * 60 * 1000, // 1 час
    message: 'Вы отправили много сообщений. Пожалуйста, попробуйте позже или позвоните нам.'
  });

  if (!limitCheck.allowed) {
    const retryMinutes = Math.ceil((limitCheck.resetTime - Date.now()) / 1000 / 60);
    return NextResponse.json(
      { 
        error: '⏱️ Превышен лимит запросов',
        message: `Вы отправили много сообщений за последний час. Пожалуйста, подождите ${retryMinutes} мин. или позвоните нам.`,
        contact: {
          phone: '+7 999 041 37 55',
          text: 'Мы с радостью ответим на ваши вопросы по телефону'
        },
        retryAfter: Math.ceil((limitCheck.resetTime - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limitCheck.resetTime - Date.now()) / 1000))
        }
      }
    );
  }
  

  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Валидация данных
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Пожалуйста, заполните все обязательные поля' }, { status: 400 });
    }

    // Валидация email
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Пожалуйста, введите корректный email' }, { status: 400 });
    }

    // Валидация телефона
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Неверный формат телефона' }, { status: 400 });
    }

    // Ограничение длины
    const safeName = limitLength(name, 255);
    const safeEmail = limitLength(email, 255);
    const safePhone = limitLength(phone, 64);
    const safeMessage = limitLength(message, 5000);

    await initSchema();

    const pool = getDbPool();
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();

      // Сохраняем письмо в базу данных (уже санитизированные данные)
      const [result] = await conn.query(
        `INSERT INTO contact_emails (name, email, phone, message)
         VALUES (?, ?, ?, ?)`,
        [safeName, safeEmail, safePhone || null, safeMessage]
      );

      await conn.commit();

      // Отправляем уведомление на email администратора
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_FROM) {
        const html = `
          <h2>Новое сообщение с сайта</h2>
          <p><strong>От:</strong> ${sanitizeHtml(safeName)}</p>
          <p><strong>Email:</strong> ${sanitizeHtml(safeEmail)}</p>
          <p><strong>Телефон:</strong> ${sanitizeHtml(safePhone || 'Не указан')}</p>
          <h3>Сообщение:</h3>
          <p>${sanitizeHtml(safeMessage)}</p>
        `;

        const emailRecipients = process.env.CONTACT_EMAIL_TO || process.env.ORDER_EMAIL_TO || email;
        await sendContactEmail({
          to: emailRecipients,
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


