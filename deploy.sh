#!/bin/bash

# BioMorphX Auto Deploy Script
# Использование: ./deploy.sh

set -e

echo "🚀 Начинаем деплой BioMorphX..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверяем, что мы в корневой директории проекта
if [ ! -f "package.json" ]; then
    log_error "package.json не найден. Убедитесь, что вы находитесь в корневой директории проекта."
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    log_warning ".env файл не найден. Копируем из env.example..."
    cp env.example .env
    log_warning "Пожалуйста, отредактируйте .env файл с вашими настройками!"
fi

# Останавливаем PM2 процесс если он запущен
if pm2 list | grep -q "biomorphx"; then
    log_info "Останавливаем существующий PM2 процесс..."
    pm2 stop biomorphx
    pm2 delete biomorphx
fi

# Устанавливаем зависимости
log_info "Устанавливаем зависимости..."
npm install

# Проверяем наличие базы данных
log_info "Проверяем подключение к базе данных..."
if ! node -e "
const mysql = require('mysql2/promise');
async function test() {
    try {
        const pool = mysql.createPool(process.env.DATABASE_URL);
        await pool.query('SELECT 1');
        console.log('Database connection OK');
        process.exit(0);
    } catch (e) {
        console.error('Database connection failed:', e.message);
        process.exit(1);
    }
}
test();
" 2>/dev/null; then
    log_error "Не удалось подключиться к базе данных. Проверьте настройки в .env файле."
    exit 1
fi

# Выполняем миграцию базы данных
log_info "Выполняем миграцию базы данных..."
if [ -f "migrate-db.js" ]; then
    node migrate-db.js
    if [ $? -eq 0 ]; then
        log_success "Миграция базы данных выполнена успешно"
    else
        log_error "Ошибка миграции базы данных"
        exit 1
    fi
else
    log_warning "Файл migrate-db.js не найден, пропускаем миграцию"
fi

# Собираем приложение
log_info "Собираем приложение..."
npm run build

# Запускаем с PM2
log_info "Запускаем приложение с PM2..."
pm2 start npm --name "biomorphx" -- start

# Сохраняем PM2 конфигурацию
pm2 save

# Проверяем статус
if pm2 list | grep -q "biomorphx.*online"; then
    log_success "Приложение успешно запущено!"
    log_info "Статус PM2:"
    pm2 list
else
    log_error "Ошибка запуска приложения. Проверьте логи:"
    pm2 logs biomorphx --lines 20
    exit 1
fi

# Проверяем доступность приложения
log_info "Проверяем доступность приложения..."
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_success "Приложение доступно на http://localhost:3000"
else
    log_warning "Приложение не отвечает на localhost:3000. Проверьте логи PM2."
fi

log_success "Деплой завершен! 🎉"
log_info "Для просмотра логов используйте: pm2 logs biomorphx"
log_info "Для перезапуска: pm2 restart biomorphx"
log_info "Для остановки: pm2 stop biomorphx"
