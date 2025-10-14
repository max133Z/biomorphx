# 🔐 Безопасность BioMorphX

Полная документация по безопасности проекта и инструкции по защите персональных данных.

---

## 📋 Оглавление

1. [Реализованные меры безопасности](#реализованные-меры-безопасности)
2. [Авторизация админ-панели](#авторизация-админ-панели)
3. [Защита персональных данных](#защита-персональных-данных)
4. [Настройка для продакшена](#настройка-для-продакшена)
5. [Рекомендации по безопасности](#рекомендации-по-безопасности)
6. [Проверка безопасности](#проверка-безопасности)

---

## ✅ Реализованные меры безопасности

### 1. **Авторизация Admin API**
✅ Все `/api/admin/*` endpoints защищены Basic Auth  
✅ Проверка авторизации через `checkAdminAuth()` в каждом endpoint  
✅ Middleware (`middleware.ts`) дополнительно защищает все admin routes  

**Защищённые endpoints:**
- `/api/admin/orders` - получение списка заказов
- `/api/admin/emails` - получение контактных сообщений
- `/api/admin/update-order-status` - изменение статуса заказа
- `/api/admin/delete-order` - удаление заказа
- `/api/admin/send-email` - отправка email

### 2. **Санитизация данных (XSS Protection)**
✅ Все пользовательские данные санитизируются перед использованием в email  
✅ Функция `sanitizeHtml()` в `src/lib/auth.js` экранирует HTML-теги  

**Санитизируемые данные:**
- Имя и фамилия клиента
- Email адрес
- Телефон
- Адрес доставки
- Комментарии к заказу
- Сообщения из контактной формы

### 3. **Rate Limiting**
✅ Ограничение количества запросов с одного IP  
✅ In-memory хранилище для отслеживания (для production рекомендуется Redis)  

**Установленные лимиты:**
- **Заказы** (`/api/orders`): 5 запросов в час с одного IP
- **Контактная форма** (`/api/contact`): 3 сообщения в час
- **Обратный звонок** (`/api/callback`): 3 запроса в час

### 4. **Security Headers**
✅ Настроены в `next.config.js`  

**Установленные заголовки:**
- `Strict-Transport-Security` - принудительный HTTPS
- `X-Frame-Options: SAMEORIGIN` - защита от clickjacking
- `X-Content-Type-Options: nosniff` - защита от MIME-sniffing
- `X-XSS-Protection: 1; mode=block` - встроенная XSS-защита браузера
- `Referrer-Policy: strict-origin-when-cross-origin` - контроль referrer
- `Permissions-Policy` - ограничение доступа к камере/микрофону/геолокации
- `Content-Security-Policy` - защита от внедрения скриптов

### 5. **Валидация данных**
✅ Валидация email, телефона  
✅ Ограничение длины строк  
✅ Проверка обязательных полей  

**Функции валидации в `src/lib/auth.js`:**
- `isValidEmail()` - проверка формата email
- `isValidPhone()` - проверка формата телефона
- `limitLength()` - ограничение длины строк

---

## 🔑 Авторизация админ-панели

### Двухуровневая защита

1. **Middleware** (`middleware.ts`)
   - Проверяет Basic Auth при доступе к `/admin/*`
   - Использует переменные окружения `ADMIN_USER` и `ADMIN_PASS`
   - Первая линия защиты

2. **API Authorization** (каждый endpoint)
   - Дополнительная проверка в каждом `/api/admin/*` endpoint
   - Использует `checkAdminAuth()` из `src/lib/auth.js`
   - Защита от прямых запросов к API

### Настройка учетных данных

**⚠️ ВАЖНО:** Установите надёжные учетные данные в `.env`

```env
# .env
ADMIN_USER=admin
ADMIN_PASS=ВАШ_СИЛЬНЫЙ_ПАРОЛЬ_ЗДЕСЬ
```

**Требования к паролю:**
- Минимум 12 символов
- Включает заглавные и строчные буквы
- Включает цифры
- Включает специальные символы

**Пример сильного пароля:**  
`Zm9@kL3$pR7&nQ2!`

### Как работает авторизация

1. Пользователь открывает `/admin`
2. Браузер запрашивает Basic Auth (всплывающее окно)
3. Пользователь вводит `ADMIN_USER` и `ADMIN_PASS`
4. Middleware проверяет учетные данные
5. Все последующие API-запросы включают Basic Auth header
6. Каждый endpoint дополнительно проверяет авторизацию

---

## 🛡️ Защита персональных данных

### Хранящиеся данные

**База данных MySQL содержит:**

1. **Таблица `orders`** (заказы):
   - ID заказа
   - Email клиента
   - Имя клиента
   - Телефон
   - Адрес доставки
   - Сумма заказа
   - Статус заказа
   - Комментарии

2. **Таблица `order_items`** (товары в заказе):
   - ID заказа
   - Название товара
   - Количество
   - Цена

3. **Таблица `contact_emails`** (контактные сообщения):
   - Имя
   - Email
   - Телефон
   - Сообщение

### Защита базы данных

**✅ Реализовано:**
- Параметризованные SQL-запросы (защита от SQL-injection)
- Connection pooling для оптимизации
- Переменные окружения для credentials

**⚠️ ОБЯЗАТЕЛЬНО для продакшена:**

1. **Сильный пароль MySQL:**
   ```env
   DB_PASSWORD=СложныйПароль123!@#
   ```

2. **Ограничение доступа к БД:**
   - Разрешить подключения только с localhost или IP сервера
   - Отключить remote root доступ
   - Создать отдельного пользователя для приложения

3. **Шифрование на уровне БД:**
   ```sql
   -- Пример для чувствительных данных
   ALTER TABLE orders MODIFY shipping_address VARBINARY(500);
   ```

4. **Резервное копирование:**
   ```bash
   # Автоматический backup раз в день
   0 3 * * * mysqldump -u user -p password biomorphx > /backup/db_$(date +\%Y\%m\%d).sql
   ```

### Соответствие GDPR и 152-ФЗ

**Реализовано:**
- ✅ Минимизация данных (собираются только необходимые)
- ✅ Уведомление о сборе данных (политика конфиденциальности)
- ✅ Защита при передаче (HTTPS обязателен)
- ✅ Контроль доступа (авторизация админ-панели)

**Требуется дополнительно:**
- ⚠️ Согласие на обработку ПД (добавить checkbox на формах)
- ⚠️ Право на удаление (функционал удаления данных по запросу)
- ⚠️ Шифрование базы данных (для критичных данных)
- ⚠️ Журналирование доступа к ПД

---

## 🚀 Настройка для продакшена

### 1. Переменные окружения

**Создайте `.env` файл на сервере:**

```env
# База данных
DB_HOST=localhost
DB_USER=biomorphx_user
DB_PASSWORD=СИЛЬНЫЙ_ПАРОЛЬ_БД
DB_NAME=biomorphx

# SMTP (почта)
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ваш_email@yandex.ru
SMTP_PASS=ваш_пароль_приложения
SMTP_FROM=ваш_email@yandex.ru
ORDER_EMAIL_TO=vladskaromnyy@gmail.com
CONTACT_EMAIL_TO=vladskaromnyy@gmail.com

# Админ-панель
ADMIN_USER=admin
ADMIN_PASS=СИЛЬНЫЙ_ПАРОЛЬ_АДМИНА

# Production
NODE_ENV=production
```

### 2. HTTPS обязателен!

**⚠️ КРИТИЧНО:** Сайт ДОЛЖЕН работать по HTTPS в продакшене!

**Почему:**
- Basic Auth передаёт пароли в base64 (легко декодировать без HTTPS)
- Персональные данные клиентов передаются открытым текстом
- Security headers (HSTS) требуют HTTPS

**Настройка Nginx с SSL:**

```nginx
server {
    listen 443 ssl http2;
    server_name biomorphx.ru www.biomorphx.ru;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Редирект HTTP -> HTTPS
server {
    listen 80;
    server_name biomorphx.ru www.biomorphx.ru;
    return 301 https://$server_name$request_uri;
}
```

**Получение бесплатного SSL (Let's Encrypt):**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d biomorphx.ru -d www.biomorphx.ru
sudo certbot renew --dry-run  # Тест автообновления
```

### 3. Firewall настройки

```bash
# Разрешить только необходимые порты
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP (для редиректа)
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# Ограничить доступ к MySQL
sudo ufw deny 3306/tcp  # Закрыть внешний доступ к MySQL
```

### 4. Рекомендации по серверу

**Обновления безопасности:**
```bash
# Автоматические обновления Ubuntu
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

**Fail2Ban для защиты от брутфорса:**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**Мониторинг логов:**
```bash
# Логи приложения
pm2 logs biomorphx

# Логи Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Логи MySQL
tail -f /var/log/mysql/error.log
```

---

## 💡 Рекомендации по безопасности

### Для текущей реализации

1. **Rate Limiting на Production**
   - ⚠️ Текущая реализация использует in-memory хранилище
   - При перезапуске приложения лимиты сбрасываются
   - **Рекомендация:** Использовать Redis для production

   ```bash
   # Установка Redis
   sudo apt install redis-server
   
   # В package.json добавить:
   npm install ioredis
   ```

2. **Логирование доступа к ПД**
   - Создать лог всех обращений к `/api/admin/*`
   - Хранить: IP, время, endpoint, пользователь
   - Полезно для аудита безопасности

3. **CSRF Protection**
   - Для форм можно добавить CSRF токены
   - Next.js API routes используют SameSite cookies по умолчанию
   - Для дополнительной защиты: библиотека `csurf`

4. **Шифрование чувствительных данных в БД**
   ```javascript
   // Пример шифрования адреса
   const crypto = require('crypto');
   const algorithm = 'aes-256-cbc';
   const key = process.env.ENCRYPTION_KEY;
   
   function encrypt(text) {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
     let encrypted = cipher.update(text);
     encrypted = Buffer.concat([encrypted, cipher.final()]);
     return iv.toString('hex') + ':' + encrypted.toString('hex');
   }
   ```

### Общие рекомендации

- ✅ Регулярно обновляйте зависимости: `npm audit fix`
- ✅ Используйте `npm audit` для проверки уязвимостей
- ✅ Никогда не коммитьте `.env` в Git
- ✅ Используйте strong passwords везде
- ✅ Регулярно проверяйте логи на подозрительную активность
- ✅ Делайте резервные копии БД ежедневно
- ✅ Тестируйте восстановление из backup

---

## 🔍 Проверка безопасности

### 1. Проверка защиты админ-панели

**Тест 1: Доступ без авторизации**
```bash
# Должен вернуть 401 Unauthorized
curl -i https://biomorphx.ru/api/admin/orders
```

**Ожидаемый результат:**
```
HTTP/1.1 401 Unauthorized
{"error":"Требуется авторизация"}
```

**Тест 2: Доступ с неверными учетными данными**
```bash
curl -i -u wronguser:wrongpass https://biomorphx.ru/api/admin/orders
```

**Ожидаемый результат:**
```
HTTP/1.1 401 Unauthorized
{"error":"Неверные учетные данные"}
```

**Тест 3: Доступ с правильными учетными данными**
```bash
curl -i -u admin:ВАШ_ПАРОЛЬ https://biomorphx.ru/api/admin/orders
```

**Ожидаемый результат:**
```
HTTP/1.1 200 OK
{"success":true,"orders":[...]}
```

### 2. Проверка Rate Limiting

**Тест: Превышение лимита на заказы**
```bash
# Отправить 6 запросов подряд (лимит: 5 в час)
for i in {1..6}; do
  curl -X POST https://biomorphx.ru/api/orders \
    -H "Content-Type: application/json" \
    -d '{"test":"data"}'
  echo "Request $i"
done
```

**Ожидаемый результат на 6-м запросе:**
```
HTTP/1.1 429 Too Many Requests
Retry-After: 3600
{"error":"Слишком много заказов. Пожалуйста, попробуйте позже.","retryAfter":3600}
```

### 3. Проверка Security Headers

**Тест: Наличие заголовков безопасности**
```bash
curl -I https://biomorphx.ru
```

**Должны присутствовать:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; ...
```

### 4. Проверка HTTPS

**Онлайн инструменты:**
- [SSL Labs](https://www.ssllabs.com/ssltest/) - тест SSL/TLS конфигурации
- [Security Headers](https://securityheaders.com/) - проверка security headers
- [Mozilla Observatory](https://observatory.mozilla.org/) - комплексный тест безопасности

**Цель:** Рейтинг A или A+ на всех тестах

### 5. Проверка уязвимостей в зависимостях

```bash
# Проверка известных уязвимостей
npm audit

# Автоматическое исправление
npm audit fix

# Проверка устаревших пакетов
npm outdated
```

---

## 📞 Контакты по безопасности

Если вы обнаружили уязвимость в безопасности, пожалуйста, сообщите об этом:

**Email:** vladskaromnyy@gmail.com  
**Telegram:** @biomorphx

**⚠️ Не публикуйте информацию об уязвимостях публично до их исправления!**

---

## 📚 Дополнительные ресурсы

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - основные угрозы безопасности
- [Next.js Security](https://nextjs.org/docs/going-to-production#security) - официальная документация
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [152-ФЗ "О персональных данных"](https://pd.rkn.gov.ru/docs/)

---

**Дата последнего обновления:** 14 октября 2025  
**Версия документа:** 1.0.0

