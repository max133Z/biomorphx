#!/bin/bash

# 🚀 Автоматический скрипт установки BiomorphX на VPS
# Использование: bash install.sh

set -e

echo "🔥 Установка BiomorphX на VPS"
echo "⚠️  ВНИМАНИЕ: Этот скрипт установит все необходимые компоненты"
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка root прав
if [[ $EUID -eq 0 ]]; then
   log_error "Этот скрипт не должен запускаться от root пользователя"
   exit 1
fi

# Запрос подтверждения
read -p "Продолжить установку? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Установка отменена"
    exit 1
fi

# Запрос домена
read -p "Введите ваш домен (например: example.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    log_error "Домен не может быть пустым"
    exit 1
fi

# Запрос паролей
read -s -p "Введите пароль для MySQL пользователя: " MYSQL_PASSWORD
echo
read -s -p "Введите пароль для админ панели: " ADMIN_PASSWORD
echo
read -s -p "Введите пароль для root MySQL: " MYSQL_ROOT_PASSWORD
echo

log_info "Начинаем установку..."

# Шаг 1: Обновление системы
log_info "Обновление системы..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common

# Шаг 2: Установка Node.js
log_info "Установка Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка версии Node.js
NODE_VERSION=$(node --version)
log_info "Node.js установлен: $NODE_VERSION"

# Шаг 3: Установка MySQL
log_info "Установка MySQL..."
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Настройка MySQL
log_info "Настройка MySQL..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS biomorphx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'biomorphx_user'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"
sudo mysql -e "GRANT ALL PRIVILEGES ON biomorphx.* TO 'biomorphx_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Шаг 4: Установка Nginx
log_info "Установка Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Шаг 5: Настройка файрвола
log_info "Настройка файрвола..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Шаг 6: Создание пользователя для приложения
log_info "Создание пользователя biomorphx..."
sudo adduser --disabled-password --gecos "" biomorphx
sudo usermod -aG sudo biomorphx

# Шаг 7: Клонирование и настройка приложения
log_info "Клонирование проекта..."
sudo -u biomorphx git clone https://github.com/max133Z/biomorphx.git /home/biomorphx/biomorphx
cd /home/biomorphx/biomorphx

# Установка зависимостей
log_info "Установка зависимостей..."
sudo -u biomorphx npm install

# Создание .env файла
log_info "Создание конфигурации..."
sudo -u biomorphx cp env.example .env

# Обновление .env файла
sudo -u biomorphx tee .env > /dev/null <<EOF
# Database
DATABASE_URL=mysql://biomorphx_user:$MYSQL_PASSWORD@localhost:3306/biomorphx

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
ADMIN_PASS=$ADMIN_PASSWORD
EOF

# Сборка приложения
log_info "Сборка приложения..."
sudo -u biomorphx npm run build

# Шаг 8: Установка PM2
log_info "Установка PM2..."
sudo npm install -g pm2

# Создание конфигурации PM2
sudo -u biomorphx tee ecosystem.config.js > /dev/null <<EOF
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
EOF

# Запуск приложения
log_info "Запуск приложения..."
sudo -u biomorphx pm2 start ecosystem.config.js
sudo -u biomorphx pm2 save
sudo -u biomorphx pm2 startup

# Шаг 9: Настройка Nginx
log_info "Настройка Nginx..."
sudo tee /etc/nginx/sites-available/biomorphx > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

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
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

# Активация конфигурации
sudo ln -sf /etc/nginx/sites-available/biomorphx /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Шаг 10: Инициализация базы данных
log_info "Инициализация базы данных..."
sudo -u biomorphx tee init-db.js > /dev/null <<EOF
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
EOF

sudo -u biomorphx node init-db.js

# Шаг 11: Создание скрипта бэкапа
log_info "Создание скрипта бэкапа..."
sudo -u biomorphx tee backup.sh > /dev/null <<EOF
#!/bin/bash

BACKUP_DIR="/home/biomorphx/backups"
DATE=\$(date +%Y%m%d_%H%M%S)

# Создание директории для бэкапов
mkdir -p \$BACKUP_DIR

# Бэкап базы данных
mysqldump -u biomorphx_user -p'$MYSQL_PASSWORD' biomorphx > \$BACKUP_DIR/db_backup_\$DATE.sql

# Бэкап файлов приложения
tar -czf \$BACKUP_DIR/app_backup_\$DATE.tar.gz /home/biomorphx/biomorphx

# Удаление старых бэкапов (старше 7 дней)
find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Бэкап создан: \$DATE"
EOF

sudo -u biomorphx chmod +x backup.sh

# Шаг 12: Настройка логирования
log_info "Настройка логирования..."
sudo mkdir -p /var/log/biomorphx
sudo chown biomorphx:biomorphx /var/log/biomorphx

sudo tee /etc/logrotate.d/biomorphx > /dev/null <<EOF
/var/log/biomorphx/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 biomorphx biomorphx
}
EOF

# Шаг 13: Создание информации о развертывании
log_info "Создание документации..."
sudo -u biomorphx tee DEPLOYMENT_INFO.md > /dev/null <<EOF
# Информация о развертывании BiomorphX

## Доступы:
- **Домен:** http://$DOMAIN
- **Админ панель:** http://$DOMAIN/admin
- **Админ логин:** admin
- **Админ пароль:** $ADMIN_PASSWORD

## База данных:
- **Хост:** localhost
- **База:** biomorphx
- **Пользователь:** biomorphx_user
- **Пароль:** $MYSQL_PASSWORD

## Файлы:
- **Приложение:** /home/biomorphx/biomorphx
- **Логи:** /var/log/biomorphx
- **Бэкапы:** /home/biomorphx/backups

## Команды управления:
- **Перезапуск приложения:** pm2 restart biomorphx
- **Просмотр логов:** pm2 logs biomorphx
- **Мониторинг:** pm2 monit
- **Бэкап:** ./backup.sh

## Следующие шаги:
1. Настройте SSL сертификат: sudo certbot --nginx -d $DOMAIN
2. Настройте SMTP в файле .env
3. Настройте автоматические бэкапы: crontab -e
EOF

# Шаг 14: Финальная проверка
log_info "Проверка установки..."

# Проверка сервисов
if sudo systemctl is-active --quiet nginx; then
    log_info "✅ Nginx работает"
else
    log_error "❌ Nginx не работает"
fi

if sudo systemctl is-active --quiet mysql; then
    log_info "✅ MySQL работает"
else
    log_error "❌ MySQL не работает"
fi

if sudo -u biomorphx pm2 list | grep -q "biomorphx.*online"; then
    log_info "✅ Приложение запущено"
else
    log_error "❌ Приложение не запущено"
fi

# Проверка портов
if sudo netstat -tlnp | grep -q ":80 "; then
    log_info "✅ Порт 80 открыт"
else
    log_error "❌ Порт 80 не открыт"
fi

if sudo netstat -tlnp | grep -q ":3000 "; then
    log_info "✅ Порт 3000 открыт"
else
    log_error "❌ Порт 3000 не открыт"
fi

echo ""
echo "🎉 УСТАНОВКА ЗАВЕРШЕНА!"
echo ""
echo "📋 Информация о развертывании:"
echo "   Домен: http://$DOMAIN"
echo "   Админ панель: http://$DOMAIN/admin"
echo "   Админ логин: admin"
echo "   Админ пароль: $ADMIN_PASSWORD"
echo ""
echo "📁 Файлы:"
echo "   Приложение: /home/biomorphx/biomorphx"
echo "   Конфигурация: /home/biomorphx/biomorphx/.env"
echo "   Логи: /var/log/biomorphx"
echo ""
echo "🔧 Следующие шаги:"
echo "   1. Настройте SSL: sudo certbot --nginx -d $DOMAIN"
echo "   2. Настройте SMTP в файле .env"
echo "   3. Настройте автоматические бэкапы"
echo ""
echo "📖 Подробная информация: /home/biomorphx/biomorphx/DEPLOYMENT_INFO.md"
