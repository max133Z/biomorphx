// Simple in-memory rate limiting
// Для production рекомендуется использовать Redis

const rateLimit = new Map();

// Очистка старых записей каждые 60 секунд
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.resetTime > 0) {
      rateLimit.delete(key);
    }
  }
}, 60000);

export function checkRateLimit(identifier, options = {}) {
  const {
    maxRequests = 10,        // Максимум запросов
    windowMs = 60000,        // Временное окно (1 минута)
    message = 'Слишком много запросов. Пожалуйста, попробуйте позже.'
  } = options;

  const now = Date.now();
  const record = rateLimit.get(identifier);

  if (!record) {
    // Первый запрос от этого идентификатора
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
      firstRequest: now
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (now > record.resetTime) {
    // Окно истекло, сбрасываем счётчик
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
      firstRequest: now
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    // Лимит превышен
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      message
    };
  }

  // Увеличиваем счётчик
  record.count++;
  rateLimit.set(identifier, record);
  
  return {
    allowed: true,
    remaining: maxRequests - record.count
  };
}

// Получение IP адреса клиента
export function getClientIp(request) {
  // Проверяем различные заголовки для получения реального IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  // Fallback
  return 'unknown';
}

// Middleware для проверки rate limit
export function withRateLimit(handler, options = {}) {
  return async (request, ...args) => {
    const ip = getClientIp(request);
    const identifier = `${ip}:${request.nextUrl.pathname}`;
    
    const limitCheck = checkRateLimit(identifier, options);
    
    if (!limitCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: limitCheck.message,
          retryAfter: Math.ceil((limitCheck.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((limitCheck.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(options.maxRequests || 10),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(limitCheck.resetTime)
          }
        }
      );
    }

    // Запрос разрешён, добавляем заголовки rate limit
    const response = await handler(request, ...args);
    
    if (response instanceof Response) {
      response.headers.set('X-RateLimit-Limit', String(options.maxRequests || 10));
      response.headers.set('X-RateLimit-Remaining', String(limitCheck.remaining));
    }
    
    return response;
  };
}

