# 🚀 MVP настройка Medusa с SQLite

## 📋 Пошаговая инструкция

### 1. Подготовка проекта

```bash
# Создаем папку для backend
mkdir medusa-backend
cd medusa-backend

# Инициализируем Medusa с SQLite
npx create-medusa-app@latest

# Выбираем:
# ✅ Backend only
# ✅ SQLite (вместо PostgreSQL)
# ✅ Redis (опционально, для кэширования)
```

### 2. Настройка переменных окружения

```bash
# Создаем .env файл
nano .env
```

```env
# База данных SQLite
DATABASE_URL=file:./data.db

# JWT секрет (сгенерируйте случайную строку)
JWT_SECRET=biomorphx-super-secret-jwt-key-2024

# Cookie секрет (сгенерируйте случайную строку)
COOKIE_SECRET=biomorphx-super-secret-cookie-key-2024

# Режим работы
NODE_ENV=development

# Платежи (добавим позже)
# STRIPE_API_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Доставка (добавим позже)
# SHIPPO_API_KEY=shippo_test_...
```

### 3. Запуск Medusa Backend

```bash
# Установка зависимостей
npm install

# Миграции базы данных
npx medusa migrations run

# Запуск в режиме разработки
npm run dev

# Или в продакшене
npm run start
```

### 4. Проверка работы

```bash
# Проверяем, что сервер запустился
curl http://localhost:9000/health

# Должен вернуть: {"status":"ok"}
```

### 5. Настройка на VDS

#### 5.1 Подключение к серверу
```bash
ssh username@your-server-ip
```

#### 5.2 Установка необходимого ПО
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Установка PM2
sudo npm install -g pm2
```

#### 5.3 Настройка Medusa Backend
```bash
# Создание папки
mkdir -p /home/username/medusa-backend
cd /home/username/medusa-backend

# Инициализация Medusa
npx create-medusa-app@latest

# Настройка .env для продакшена
nano .env
```

```env
DATABASE_URL=file:./data.db
JWT_SECRET=biomorphx-super-secret-jwt-key-2024
COOKIE_SECRET=biomorphx-super-secret-cookie-key-2024
NODE_ENV=production
```

#### 5.4 Запуск через PM2
```bash
# Установка зависимостей
npm install

# Миграции
npx medusa migrations run

# Запуск через PM2
pm2 start npm --name "medusa-backend" -- start

# Сохранение конфигурации
pm2 save

# Настройка автозапуска
pm2 startup
```

### 6. Настройка Nginx

#### 6.1 Конфигурация для backend
```bash
sudo nano /etc/nginx/sites-available/biomorphx-backend
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
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
```

#### 6.2 Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/biomorphx-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Настройка SSL

```bash
# Получение SSL сертификата
sudo certbot --nginx -d api.yourdomain.com

# Автоматическое обновление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 8. Настройка Frontend

#### 8.1 Обновление переменных окружения
```bash
# В папке biomorphx-frontend
nano .env
```

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourdomain.com
NODE_ENV=production
```

#### 8.2 Запуск Frontend
```bash
npm install
npm run build
pm2 start server.js --name "biomorphx-frontend"
pm2 save
```

### 9. Миграция товаров

```bash
# В папке frontend
node scripts/migrate-products.js
```

### 10. Проверка работы

#### 10.1 Проверка backend
```bash
curl https://api.yourdomain.com/health
```

#### 10.2 Проверка frontend
```bash
curl https://yourdomain.com
```

## 🔧 Полезные команды

### Мониторинг
```bash
# Статус PM2
pm2 status

# Логи backend
pm2 logs medusa-backend

# Логи frontend
pm2 logs biomorphx-frontend

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
```

### Резервное копирование SQLite
```bash
# Создание бэкапа
cp /home/username/medusa-backend/data.db /home/username/backups/data-$(date +%Y%m%d).db

# Автоматический бэкап (добавить в crontab)
0 2 * * * cp /home/username/medusa-backend/data.db /home/username/backups/data-$(date +\%Y\%m\%d).db
```

### Обновление
```bash
# Backend
cd /home/username/medusa-backend
git pull
npm install
pm2 restart medusa-backend

# Frontend
cd /home/username/biomorphx-frontend
git pull
npm install
npm run build
pm2 restart biomorphx-frontend
```

## 💰 Стоимость MVP

- **VDS**: ~500-800 руб/мес (минимальный тариф)
- **Домен**: ~500-1000 руб/год
- **SSL**: Бесплатно
- **База данных**: Бесплатно (SQLite)
- **Итого**: ~1000-1500 руб/мес

## 🎯 Результат

После настройки у вас будет:
- ✅ **Backend API**: https://api.yourdomain.com
- ✅ **Frontend**: https://yourdomain.com
- ✅ **Полноценный e-commerce** с корзиной и заказами
- ✅ **Готовность к платежам** (нужно добавить Stripe)
- ✅ **Готовность к доставке** (нужно добавить СДЭК)

## 🚀 Следующие шаги

1. **Добавить платежи** (Stripe)
2. **Добавить доставку** (СДЭК)
3. **Настроить аналитику**
4. **Добавить промокоды**
5. **Настроить уведомления**

