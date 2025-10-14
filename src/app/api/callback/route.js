import { NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/email';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';
import { sanitizeHtml } from '../../../lib/auth';

export async function POST(request) {
  // Rate limiting: макс 15 обратных звонков в час с одного IP
  const ip = getClientIp(request);
  const limitCheck = checkRateLimit(`callback:${ip}`, {
    maxRequests: 15,
    windowMs: 60 * 60 * 1000, // 1 час
    message: 'Слишком много запросов на обратный звонок. Пожалуйста, попробуйте позже или позвоните нам напрямую.'
  });

  if (!limitCheck.allowed) {
    return NextResponse.json(
      { 
        error: limitCheck.message,
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
    const { name, phone } = await request.json();

    // Валидация данных
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      );
    }

    // Отправка email
    const emailData = {
      to: 'vladskaromnyy@gmail.com',
      subject: 'Новая заявка на звонок - BioMorphX',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CB5AE; margin-bottom: 20px;">Новая заявка на звонок</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Данные клиента:</h3>
            <p><strong>Имя:</strong> ${sanitizeHtml(name)}</p>
            <p><strong>Телефон:</strong> ${sanitizeHtml(phone)}</p>
            <p><strong>Дата заявки:</strong> ${new Date().toLocaleString('ru-RU')}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1976d2;">
              <strong>Действие:</strong> Пожалуйста, свяжитесь с клиентом в ближайшее время.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Это автоматическое уведомление с сайта BioMorphX
          </p>
        </div>
      `
    };

    await sendEmail(emailData);

    return NextResponse.json(
      { message: 'Заявка успешно отправлена' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Ошибка при обработке заявки на звонок:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
