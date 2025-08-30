# 🚀 Полное руководство по развертыванию BiomorphX на VPS

## 📋 Требования к системе
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- Минимум 2GB RAM
- 20GB свободного места
- Node.js 18+
- MySQL 8.0+
- Nginx

---

## 🔧 Шаг 1: Подготовка сервера

### Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common
```

### Настройка часового пояса
```bash
sudo timedatectl set-timezone Europe/Moscow
```

---

## 🐍 Шаг 2: Установка Node.js 18+

### Для Ubuntu/Debian:
```bash
# Добавление репозитория NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Установка Node.js
sudo apt install -y nodejs

# Проверка версии
node --version
npm --version
```

### Для CentOS/RHEL:
```bash
# Добавление репозитория NodeSource
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

# Установка Node.js
sudo yum install -y nodejs

# Проверка версии
node --version
npm --version
```

---

## 🗄️ Шаг 3: Установка и настройка MySQL

### Установка MySQL
```bash
# Ubuntu/Debian
sudo apt install -y mysql-server

# CentOS/RHEL
sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

### Настройка безопасности MySQL
```bash
sudo mysql_secure_installation
```

### Создание базы данных и пользователя
```bash
sudo mysql -u root -p
```

```sql
-- Создание базы данных
CREATE DATABASE biomorphx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создание пользователя
CREATE USER 'biomorphx_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Предоставление прав
GRANT ALL PRIVILEGES ON biomorphx.* TO 'biomorphx_user'@'localhost';
FLUSH PRIVILEGES;

-- Выход
EXIT;
```

---

## 🌐 Шаг 4: Установка и настройка Nginx

### Установка Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Настройка файрвола
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 📁 Шаг 5: Развертывание приложения

### Создание пользователя для приложения
```bash
sudo adduser --disabled-password --gecos "" biomorphx
sudo usermod -aG sudo biomorphx
```

### Клонирование проекта
```bash
sudo su - biomorphx
cd /home/biomorphx
git clone https://github.com/max133Z/biomorphx.git
cd biomorphx
```

### Установка зависимостей
```bash
npm install
```

### Создание файла окружения
```bash
cp env.example .env
nano .env
```

**Содержимое .env файла:**
```env
# Database
DATABASE_URL=mysql://biomorphx_user:strong_password_here@localhost:3306/biomorphx

# SMTP (настройте под вашу почту)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="BiomorphX <noreply@biomorphx.com>"

# Order
ORDER_EMAIL_TO=your_email@gmail.com

# Production
NODE_ENV=production

# Admin
ADMIN_USER=admin
ADMIN_PASS=very_strong_admin_password
```

### Сборка приложения
```bash
npm run build
```

---

## 🔄 Шаг 6: Настройка PM2 для управления процессом

### Установка PM2
```bash
sudo npm install -g pm2
```

### Создание конфигурации PM2
```bash
nano ecosystem.config.js
```

**Содержимое ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'biomorphx',
    script: 'npm',
    args: 'start',
    cwd: '/home/biomorphx/biomorphx',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_file: '.env'
  }]
};
```

### Запуск приложения через PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## ⚙️ Шаг 7: Настройка Nginx как reverse proxy

### Создание конфигурации Nginx
```bash
sudo nano /etc/nginx/sites-available/biomorphx
```

**Содержимое конфигурации:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Логи
    access_log /var/log/nginx/biomorphx_access.log;
    error_log /var/log/nginx/biomorphx_error.log;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Статические файлы
    location /_next/static/ {
        alias /home/biomorphx/biomorphx/.next/static/;
        expires 365d;
        access_log off;
    }

    location /public/ {
        alias /home/biomorphx/biomorphx/public/;
        expires 30d;
        access_log off;
    }

    # API и приложение
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
        proxy_read_timeout 86400;
    }
}
```

### Активация конфигурации
```bash
sudo ln -s /etc/nginx/sites-available/biomorphx /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Шаг 8: Настройка SSL (HTTPS)

### Установка Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Получение SSL сертификата
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Автоматическое обновление сертификата
```bash
sudo crontab -e
# Добавить строку:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🗄️ Шаг 9: Инициализация базы данных

### Создание скрипта инициализации
```bash
nano init-db.js
```

**Содержимое init-db.js:**
```javascript
import { initSchema } from './src/lib/db.js';

async function initDatabase() {
  try {
    await initSchema();
    console.log('✅ База данных инициализирована успешно!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error);
    process.exit(1);
  }
}

initDatabase();
```

### Запуск инициализации
```bash
node init-db.js
```

---

## 🔧 Шаг 10: Настройка бэкапов

### Создание скрипта бэкапа
```bash
nano backup.sh
```

**Содержимое backup.sh:**
```bash
#!/bin/bash

BACKUP_DIR="/home/biomorphx/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Создание директории для бэкапов
mkdir -p $BACKUP_DIR

# Бэкап базы данных
mysqldump -u biomorphx_user -p'strong_password_here' biomorphx > $BACKUP_DIR/db_backup_$DATE.sql

# Бэкап файлов приложения
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /home/biomorphx/biomorphx

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Бэкап создан: $DATE"
```

### Настройка автоматических бэкапов
```bash
chmod +x backup.sh
crontab -e
# Добавить строку для ежедневного бэкапа в 2:00:
# 0 2 * * * /home/biomorphx/backup.sh
```

---

## 📊 Шаг 11: Мониторинг и логи

### Настройка логирования
```bash
# Создание директории для логов
sudo mkdir -p /var/log/biomorphx
sudo chown biomorphx:biomorphx /var/log/biomorphx

# Настройка ротации логов
sudo nano /etc/logrotate.d/biomorphx
```

**Содержимое logrotate:**
```
/var/log/biomorphx/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 biomorphx biomorphx
}
```

### Мониторинг через PM2
```bash
pm2 monit
pm2 logs biomorphx
```

---

## ✅ Шаг 12: Проверка работоспособности

### Проверка сервисов
```bash
# Статус PM2
pm2 status

# Статус Nginx
sudo systemctl status nginx

# Статус MySQL
sudo systemctl status mysql

# Проверка портов
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000
```

### Тестирование приложения
```bash
# Проверка API
curl http://localhost:3000/api/products

# Проверка через домен
curl https://your-domain.com
```

---

## 🚨 Шаг 13: Безопасность

### Настройка файрвола
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Обновление системы
```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📝 Шаг 14: Документация и поддержка

### Создание файла с информацией о развертывании
```bash
nano DEPLOYMENT_INFO.md
```

**Содержимое:**
```markdown
# Информация о развертывании BiomorphX

## Доступы:
- **Домен:** https://your-domain.com
- **Админ панель:** https://your-domain.com/admin
- **Админ логин:** admin
- **Админ пароль:** very_strong_admin_password

## База данных:
- **Хост:** localhost
- **База:** biomorphx
- **Пользователь:** biomorphx_user
- **Пароль:** strong_password_here

## Файлы:
- **Приложение:** /home/biomorphx/biomorphx
- **Логи:** /var/log/biomorphx
- **Бэкапы:** /home/biomorphx/backups

## Команды управления:
- **Перезапуск приложения:** pm2 restart biomorphx
- **Просмотр логов:** pm2 logs biomorphx
- **Мониторинг:** pm2 monit
- **Бэкап:** ./backup.sh
```

---

## 🎉 Готово!

Ваш проект BiomorphX успешно развернут на VPS!

### Основные URL:
- **Главная страница:** https://your-domain.com
- **Админ панель:** https://your-domain.com/admin
- **API:** https://your-domain.com/api

### Полезные команды:
```bash
# Перезапуск приложения
pm2 restart biomorphx

# Просмотр логов
pm2 logs biomorphx

# Обновление приложения
cd /home/biomorphx/biomorphx
git pull
npm install
npm run build
pm2 restart biomorphx
```
