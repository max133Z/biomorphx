// Утилита для проверки авторизации админа
import { NextResponse } from 'next/server';

export function checkAdminAuth(request) {
  const auth = request.headers.get('authorization');
  
  if (!auth || !auth.startsWith('Basic ')) {
    return NextResponse.json({ 
      error: 'Требуется авторизация' 
    }, { 
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' }
    });
  }

  try {
    const [, encoded] = auth.split(' ');
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(':');

    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

    if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
      return NextResponse.json({ 
        error: 'Неверные учетные данные' 
      }, { status: 401 });
    }

    // Авторизация успешна
    return null;
  } catch (error) {
    return NextResponse.json({ 
      error: 'Ошибка авторизации' 
    }, { status: 401 });
  }
}

// Санитизация HTML для предотвращения XSS
export function sanitizeHtml(text) {
  if (!text) return '';
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Валидация email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Валидация телефона
export function isValidPhone(phone) {
  if (!phone) return true; // Phone опционален
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 20;
}

// Ограничение длины строки
export function limitLength(str, maxLength = 500) {
  if (!str) return '';
  return String(str).substring(0, maxLength);
}

