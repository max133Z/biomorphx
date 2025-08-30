# Инструкции по обновлению BioMorphX на VPS

## 🔄 Быстрое обновление

### 1. Подключитесь к серверу
```bash
ssh user@your-server-ip
```

### 2. Перейдите в директорию проекта
```bash
cd /var/www/biomorphx
```

### 3. Получите последние изменения
```bash
git pull origin main
```

### 4. Установите новые зависимости (если есть)
```bash
npm install
```

### 5. Соберите проект
```bash
npm run build
```

### 6. Перезапустите приложение
```bash
pm2 restart biomorphx
```

### 7. Проверьте статус
```bash
pm2 status
pm2 logs biomorphx --lines 10
```

## 🚀 Автоматический деплой

Если у вас настроен скрипт деплоя:

```bash
cd /var/www/biomorphx
./deploy.sh
```

## 🔧 Проверка работоспособности

### Проверьте доступность сайта
```bash
curl -I http://localhost:3000
```

### Проверьте логи
```bash
pm2 logs biomorphx --lines 50
```

### Проверьте базу данных
```bash
mysql -u biomorphx -p biomorphx -e "SELECT COUNT(*) as orders_count FROM orders;"
```

## 🛠️ Устранение проблем

### Если приложение не запускается:

1. **Проверьте логи PM2:**
```bash
pm2 logs biomorphx
```

2. **Проверьте переменные окружения:**
```bash
cat .env
```

3. **Проверьте подключение к БД:**
```bash
node -e "
const mysql = require('mysql2/promise');
async function test() {
    try {
        const pool = mysql.createPool(process.env.DATABASE_URL);
        await pool.query('SELECT 1');
        console.log('Database OK');
    } catch (e) {
        console.error('Database error:', e.message);
    }
}
test();
"
```

4. **Перезапустите с чистого состояния:**
```bash
pm2 delete biomorphx
pm2 start npm --name "biomorphx" -- start
```

### Если есть проблемы с Nginx:

1. **Проверьте конфигурацию:**
```bash
sudo nginx -t
```

2. **Перезапустите Nginx:**
```bash
sudo systemctl restart nginx
```

3. **Проверьте статус:**
```bash
sudo systemctl status nginx
```

## 📊 Мониторинг

### Полезные команды для мониторинга:

```bash
# Статус PM2
pm2 status

# Использование ресурсов
pm2 monit

# Логи в реальном времени
pm2 logs biomorphx -f

# Статистика процессов
pm2 show biomorphx
```

### Мониторинг системы:

```bash
# Использование CPU и памяти
htop

# Дисковое пространство
df -h

# Логи системы
sudo journalctl -f
```

## 🔒 Безопасность

### Регулярные проверки:

1. **Обновление системы:**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Проверка SSL сертификата:**
```bash
sudo certbot certificates
```

3. **Обновление SSL (если нужно):**
```bash
sudo certbot renew
```

## 📧 Email уведомления

### Проверка SMTP настроек:

```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Error:', error);
    } else {
        console.log('SMTP OK');
    }
});
"
```

## 🗄️ Резервное копирование

### Создание бэкапа базы данных:

```bash
# Создаем бэкап
mysqldump -u biomorphx -p biomorphx > backup_$(date +%Y%m%d_%H%M%S).sql

# Сжимаем
gzip backup_*.sql
```

### Восстановление из бэкапа:

```bash
# Распаковываем
gunzip backup_YYYYMMDD_HHMMSS.sql.gz

# Восстанавливаем
mysql -u biomorphx -p biomorphx < backup_YYYYMMDD_HHMMSS.sql
```

## 📞 Поддержка

При возникновении проблем:

1. **Соберите информацию:**
   - Логи PM2: `pm2 logs biomorphx --lines 100`
   - Статус системы: `pm2 status`
   - Версия Node.js: `node --version`
   - Версия npm: `npm --version`

2. **Обратитесь в поддержку:**
   - Email: support@biomorphx.com
   - Telegram: @biomorphx_support

---

**Последнее обновление:** $(date)

