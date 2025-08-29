#!/bin/bash

# 🚀 Скрипт настройки MVP BiomorphX с SQLite
# Использование: bash setup-mvp.sh

echo "🚀 Настройка MVP BiomorphX с SQLite..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверка, что скрипт запущен от root или с sudo
if [ "$EUID" -ne 0 ]; then
    print_error "Этот скрипт должен быть запущен с правами sudo"
    exit 1
fi

# Обновление системы
print_status "Обновление системы..."
apt update && apt upgrade -y

# Установка Node.js 18
print_status "Установка Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Проверка версии Node.js
NODE_VERSION=$(node --version)
print_status "Node.js установлен: $NODE_VERSION"

# Установка Nginx
print_status "Установка Nginx..."
apt install -y nginx certbot python3-certbot-nginx

# Установка PM2
print_status "Установка PM2..."
npm install -g pm2

# Создание пользователя для приложения
print_status "Создание пользователя biomorphx..."
useradd -m -s /bin/bash biomorphx
usermod -aG sudo biomorphx

# Создание директорий
print_status "Создание директорий..."
mkdir -p /home/biomorphx/medusa-backend
mkdir -p /home/biomorphx/biomorphx-frontend
mkdir -p /home/biomorphx/backups

# Установка прав
chown -R biomorphx:biomorphx /home/biomorphx

print_status "Базовая настройка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Переключитесь на пользователя biomorphx:"
echo "   su - biomorphx"
echo ""
echo "2. Настройте Medusa Backend:"
echo "   cd /home/biomorphx/medusa-backend"
echo "   npx create-medusa-app@latest"
echo "   # Выберите: Backend only, SQLite"
echo ""
echo "3. Настройте .env файл:"
echo "   nano .env"
echo "   # Добавьте:"
echo "   DATABASE_URL=file:./data.db"
echo "   JWT_SECRET=your-secret-key"
echo "   COOKIE_SECRET=your-cookie-secret"
echo "   NODE_ENV=production"
echo ""
echo "4. Запустите Medusa:"
echo "   npm install"
echo "   npx medusa migrations run"
echo "   pm2 start npm --name 'medusa-backend' -- start"
echo ""
echo "5. Настройте Nginx (как root):"
echo "   nano /etc/nginx/sites-available/biomorphx-backend"
echo ""
echo "6. Получите SSL сертификат:"
echo "   certbot --nginx -d api.yourdomain.com"
echo ""
print_status "Установка завершена!"

