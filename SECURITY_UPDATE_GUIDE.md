# 🔄 Инструкция по обновлению безопасности на сервере

## 📋 Что было изменено

### ✅ Новые файлы
- `src/lib/auth.js` - утилиты для авторизации и санитизации
- `src/lib/rate-limit.js` - ограничение запросов (rate limiting)
- `SECURITY.md` - полная документация по безопасности
- `SECURITY_UPDATE_GUIDE.md` - эта инструкция

### ✅ Измененные файлы
- `src/app/admin/page.js` - убрана клиентская проверка пароля
- `src/app/api/admin/orders/route.js` - добавлена авторизация
- `src/app/api/admin/emails/route.js` - добавлена авторизация
- `src/app/api/admin/update-order-status/route.js` - добавлена авторизация
- `src/app/api/admin/delete-order/route.js` - добавлена авторизация
- `src/app/api/admin/send-email/route.js` - добавлена авторизация + санитизация
- `src/app/api/orders/route.js` - добавлен rate limiting + санитизация
- `src/app/api/contact/route.js` - добавлен rate limiting + санитизация
- `src/app/api/callback/route.js` - добавлен rate limiting + санитизация
- `next.config.js` - добавлены Security Headers

---

## 🚀 Пошаговая инструкция по обновлению

### Шаг 1: Подключение к серверу

```bash
ssh root@83.222.25.221
# или
ssh ваш_пользователь@83.222.25.221
```

### Шаг 2: Переход в директорию проекта

```bash
cd /var/www/biomorphx
# или
cd /путь/к/вашему/проекту
```

### Шаг 3: Создание резервной копии

```bash
# Создать backup текущей версии
sudo cp -r /var/www/biomorphx /var/www/biomorphx_backup_$(date +%Y%m%d)

# Backup базы данных
mysqldump -u ваш_пользователь -p biomorphx > ~/biomorphx_backup_$(date +%Y%m%d).sql
```

### Шаг 4: Остановка приложения

```bash
# Если используется PM2
pm2 stop biomorphx

# Или systemd
sudo systemctl stop biomorphx
```

### Шаг 5: Обновление кода с GitHub

```bash
# Сохранить локальные изменения (если есть)
git stash

# Получить последние изменения
git pull origin main

# Или если есть конфликты:
git fetch origin
git reset --hard origin/main
```

### Шаг 6: Проверка .env файла

**⚠️ ВАЖНО:** Убедитесь, что в `.env` установлен СИЛЬНЫЙ пароль админа!

```bash
nano .env
```

**Проверьте/добавьте:**

```env
# База данных
DB_HOST=localhost
DB_USER=biomorphx_user
DB_PASSWORD=ваш_пароль_бд
DB_NAME=biomorphx

# SMTP
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ваш_email@yandex.ru
SMTP_PASS=ваш_пароль_приложения
SMTP_FROM=ваш_email@yandex.ru
ORDER_EMAIL_TO=vladskaromnyy@gmail.com
CONTACT_EMAIL_TO=vladskaromnyy@gmail.com

# Админ-панель (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
ADMIN_USER=admin
ADMIN_PASS=СложныйПароль123!@#XyZ

# Production
NODE_ENV=production
```

**Сохраните:** `Ctrl + O`, `Enter`, `Ctrl + X`

### Шаг 7: Установка зависимостей

```bash
npm install
```

### Шаг 8: Сборка проекта

```bash
npm run build
```

**Ожидаемый вывод:**
```
✓ Compiled successfully
...
Route (app)                              Size     First Load JS
...
```

### Шаг 9: Запуск приложения

```bash
# Если используется PM2
pm2 start biomorphx
pm2 save

# Или systemd
sudo systemctl start biomorphx
```

### Шаг 10: Проверка статуса

```bash
# PM2
pm2 status
pm2 logs biomorphx --lines 50

# systemd
sudo systemctl status biomorphx
sudo journalctl -u biomorphx -f
```

---

## ✅ Проверка работоспособности

### 1. Проверка сайта

```bash
curl -I https://biomorphx.ru
```

**Должно быть:** `HTTP/1.1 200 OK` или `HTTP/2 200`

### 2. Проверка Security Headers

```bash
curl -I https://biomorphx.ru | grep -E "(Strict-Transport|X-Frame|X-Content|X-XSS|Content-Security)"
```

**Должны присутствовать:**
```
strict-transport-security: max-age=31536000; includeSubDomains
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
content-security-policy: default-src 'self'; ...
```

### 3. Проверка защиты админ-панели

**Без авторизации (должен запросить логин/пароль):**
```bash
curl -I https://biomorphx.ru/admin
```

**С авторизацией (замените на ваш пароль):**
```bash
curl -u admin:ВАШ_ПАРОЛЬ https://biomorphx.ru/api/admin/orders
```

### 4. Проверка Rate Limiting

**Отправить 6 запросов на создание заказа (лимит: 5 в час):**

```bash
for i in {1..6}; do
  echo "=== Request $i ==="
  curl -X POST https://biomorphx.ru/api/orders \
    -H "Content-Type: application/json" \
    -d '{
      "customer": {
        "firstName": "Test",
        "email": "test@test.com",
        "phone": "1234567890",
        "address": "Test",
        "deliveryMethod": "cdek",
        "paymentMethod": "card"
      },
      "items": [],
      "total": 0
    }' \
    -w "\nStatus: %{http_code}\n\n"
done
```

**Ожидаемый результат:**
- Запросы 1-5: статус `200` или `400` (валидация)
- Запрос 6: статус `429` (Too Many Requests)

---

## 🔒 Настройка HTTPS (если еще не настроено)

### Установка Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Получение SSL-сертификата

```bash
sudo certbot --nginx -d biomorphx.ru -d www.biomorphx.ru
```

**Следуйте инструкциям:**
1. Введите email для уведомлений
2. Согласитесь с Terms of Service (Y)
3. Выберите опцию редиректа HTTP -> HTTPS (2)

### Автообновление сертификата

```bash
# Тест обновления
sudo certbot renew --dry-run

# Настроить автообновление (cron)
sudo crontab -e

# Добавить строку:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

### Проверка SSL

Откройте в браузере: https://www.ssllabs.com/ssltest/analyze.html?d=biomorphx.ru

**Цель:** Рейтинг A или A+

---

## 🛠️ Устранение проблем

### Проблема 1: Ошибка при `git pull`

```bash
# Если есть локальные изменения
git stash
git pull origin main
git stash pop

# Или принудительно:
git fetch origin
git reset --hard origin/main
```

### Проблема 2: Ошибка "Cannot find module"

```bash
# Удалить node_modules и переустановить
rm -rf node_modules package-lock.json
npm install
```

### Проблема 3: Порт 3000 занят

```bash
# Найти процесс
sudo lsof -i :3000

# Убить процесс
sudo kill -9 PID

# Или использовать другой порт
PORT=3001 npm start
```

### Проблема 4: Приложение не запускается

```bash
# Проверить логи PM2
pm2 logs biomorphx --err

# Проверить .env файл
cat .env

# Проверить права доступа
ls -la
sudo chown -R $USER:$USER .
```

### Проблема 5: "Permission denied" при npm install

```bash
# Исправить права на node_modules
sudo chown -R $USER:$USER node_modules
sudo chown -R $USER:$USER package-lock.json
```

---

## 📊 Мониторинг после обновления

### Проверить логи приложения

```bash
pm2 logs biomorphx --lines 100
```

**Искать:**
- ❌ Ошибки подключения к БД
- ❌ Ошибки при запуске
- ✅ Успешный запуск на порту 3000

### Проверить логи Nginx

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Проверить использование ресурсов

```bash
pm2 monit
# или
htop
```

---

## 🔐 Важные напоминания

1. **⚠️ ОБЯЗАТЕЛЬНО смените пароль админа в `.env`**
   - Минимум 12 символов
   - Включает буквы, цифры, спецсимволы
   - Пример: `Zm9@kL3$pR7&nQ2!`

2. **⚠️ Сайт ДОЛЖЕН работать по HTTPS**
   - Basic Auth небезопасен без HTTPS
   - Данные клиентов передаются открыто без HTTPS

3. **⚠️ Регулярно обновляйте зависимости**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

4. **⚠️ Делайте резервные копии**
   ```bash
   # Настройте ежедневный backup БД
   sudo crontab -e
   
   # Добавьте:
   0 3 * * * mysqldump -u user -ppassword biomorphx > /backup/db_$(date +\%Y\%m\%d).sql
   ```

---

## 📞 Помощь

Если что-то пошло не так:

1. **Проверьте логи:** `pm2 logs biomorphx`
2. **Откатитесь к backup:** `sudo cp -r /var/www/biomorphx_backup_ДАТА /var/www/biomorphx`
3. **Восстановите БД:** `mysql -u user -p biomorphx < ~/biomorphx_backup_ДАТА.sql`
4. **Обратитесь за помощью:** vladskaromnyy@gmail.com

---

## ✅ Чек-лист успешного обновления

- [ ] Создан backup кода и БД
- [ ] Код обновлен с GitHub (`git pull`)
- [ ] Установлены зависимости (`npm install`)
- [ ] Проверен `.env` файл (особенно `ADMIN_PASS`)
- [ ] Выполнена сборка (`npm run build`)
- [ ] Приложение запущено (`pm2 start`)
- [ ] Сайт открывается в браузере
- [ ] Админ-панель запрашивает пароль
- [ ] Админ-панель открывается после ввода пароля
- [ ] Security Headers присутствуют (проверка `curl -I`)
- [ ] Rate Limiting работает (тест)
- [ ] HTTPS настроен (зеленый замок в браузере)
- [ ] SSL рейтинг A/A+ (ssllabs.com)

---

**Готово! 🎉 Ваш сайт теперь защищен!**

Дата обновления: 14 октября 2025

