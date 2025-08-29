# 🚀 Деплой BiomorphX + Medusa на Beget

## 🎯 Полная e-commerce система

Теперь ваш сайт будет иметь полноценную систему электронной коммерции с:
- ✅ Управлением товарами через Medusa
- ✅ Корзиной и оформлением заказов
- ✅ Системой платежей (Stripe, Сбербанк)
- ✅ Управлением заказами
- ✅ Системой скидок и промокодов
- ✅ Интеграцией с доставкой

## 📋 Пошаговая инструкция

### 1. Подготовка проекта

```bash
# Убедитесь, что все зависимости установлены
npm install

# Соберите проект
npm run build
```

### 2. Настройка Beget

#### 2.1 Покупка хостинга
- **Тариф**: "Бизнес" (рекомендуется для Node.js + PostgreSQL)
- **Домен**: зарегистрируйте или подключите существующий

#### 2.2 Настройка Node.js
1. В панели Beget → "Node.js"
2. Создайте приложение:
   - **Имя**: `biomorphx-frontend`
   - **Версия Node.js**: `18.x`
   - **Порт**: `3000`

#### 2.3 Настройка PostgreSQL
1. В панели Beget → "Базы данных"
2. Создайте PostgreSQL базу:
   - **Имя**: `biomorphx_medusa`
   - **Пользователь**: `biomorphx_user`
   - **Пароль**: создайте надежный пароль

### 3. Настройка Medusa Backend

#### 3.1 Создание отдельного приложения для Medusa
```bash
# В панели Beget создайте второе Node.js приложение
# Имя: biomorphx-backend
# Порт: 9000
```

#### 3.2 Установка Medusa Backend
```bash
# Подключитесь к серверу через SSH
ssh username@your-server.com

# Создайте папку для backend
mkdir medusa-backend
cd medusa-backend

# Инициализируйте Medusa
npx create-medusa-app@latest

# Выберите:
# - Backend only
# - PostgreSQL
# - Redis (если доступен)
```

#### 3.3 Настройка переменных окружения
```bash
# Создайте .env файл
nano .env
```

```env
# База данных
DATABASE_URL=postgres://biomorphx_user:your_password@localhost:5432/biomorphx_medusa

# Redis (если доступен)
REDIS_URL=redis://localhost:6379

# JWT секрет
JWT_SECRET=your-super-secret-jwt-key-here

# Cookie секрет
COOKIE_SECRET=your-super-secret-cookie-key-here

# Платежи (Stripe)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Доставка
SHIPPO_API_KEY=shippo_test_...
```

#### 3.4 Запуск Medusa Backend
```bash
# Установка зависимостей
npm install

# Миграции базы данных
npx medusa migrations run

# Запуск в продакшене
npm run start
```

### 4. Настройка Frontend (Next.js)

#### 4.1 Загрузка файлов
```bash
# Загрузите все файлы frontend в папку biomorphx-frontend
# Включая:
# - package.json
# - src/
# - public/
# - next.config.js
# - server.js
```

#### 4.2 Настройка переменных окружения
```bash
# Создайте .env файл в папке frontend
nano .env
```

```env
# Medusa Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# В продакшене используйте ваш домен
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourdomain.com
```

#### 4.3 Установка зависимостей и сборка
```bash
npm install
npm run build
npm start
```

### 5. Миграция товаров

#### 5.1 Запуск скрипта миграции
```bash
# В папке frontend
node scripts/migrate-products.js
```

### 6. Настройка домена и SSL

#### 6.1 Настройка DNS
1. В панели Beget → "Домены"
2. Настройте DNS записи:
   - `yourdomain.com` → frontend (порт 3000)
   - `api.yourdomain.com` → backend (порт 9000)

#### 6.2 SSL сертификаты
1. Подключите SSL для основного домена
2. Подключите SSL для API поддомена

### 7. Настройка платежей

#### 7.1 Stripe
```bash
# В папке medusa-backend
npm install medusa-payment-stripe

# Настройте в medusa-config.js
const plugins = [
  {
    resolve: "medusa-payment-stripe",
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
]
```

#### 7.2 Российские платежные системы
```bash
# Сбербанк
npm install medusa-payment-sberbank

# ЮMoney
npm install medusa-payment-yoomoney
```

### 8. Настройка доставки

```bash
# СДЭК
npm install medusa-shipping-cdek

# Почта России
npm install medusa-shipping-russian-post
```

## 🔧 Конфигурация PM2

### Frontend
```bash
# В папке frontend
pm2 start server.js --name biomorphx-frontend
pm2 save
```

### Backend
```bash
# В папке medusa-backend
pm2 start npm --name biomorphx-backend -- start
pm2 save
```

## 📁 Финальная структура на сервере

```
/home/username/
├── biomorphx-frontend/     # Next.js приложение
│   ├── package.json
│   ├── server.js
│   ├── src/
│   ├── public/
│   └── .env
├── medusa-backend/         # Medusa backend
│   ├── package.json
│   ├── medusa-config.js
│   ├── src/
│   └── .env
└── logs/                   # Логи приложений
```

## 🚨 Возможные проблемы

### 1. Ошибка подключения к Medusa
- Проверьте URL в `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
- Убедитесь, что Medusa backend запущен
- Проверьте настройки CORS в medusa-config.js

### 2. Ошибки базы данных
```bash
# Проверьте подключение к PostgreSQL
psql -h localhost -U biomorphx_user -d biomorphx_medusa

# Запустите миграции заново
npx medusa migrations run
```

### 3. Проблемы с платежами
- Проверьте API ключи Stripe
- Убедитесь, что webhook настроен правильно
- Проверьте логи в панели Stripe

## 🔄 Обновление системы

### Frontend
```bash
cd biomorphx-frontend
git pull
npm install
npm run build
pm2 restart biomorphx-frontend
```

### Backend
```bash
cd medusa-backend
git pull
npm install
pm2 restart biomorphx-backend
```

## 📊 Мониторинг

### Проверка статуса
```bash
pm2 status
pm2 logs biomorphx-frontend
pm2 logs biomorphx-backend
```

### Проверка базы данных
```bash
psql -h localhost -U biomorphx_user -d biomorphx_medusa -c "SELECT COUNT(*) FROM product;"
```

## 🎯 Результат

После успешного деплоя у вас будет:

- **Frontend**: `https://yourdomain.com` (Next.js)
- **Backend API**: `https://api.yourdomain.com` (Medusa)
- **Админ панель**: `https://yourdomain.com/admin` (Medusa Admin)

## 💰 Стоимость

### **Beget "Бизнес":**
- **Хостинг**: ~500-800 руб/мес
- **PostgreSQL**: включен в тариф
- **SSL**: бесплатно

### **Дополнительные сервисы:**
- **Stripe**: 2.9% + 30 копеек за транзакцию
- **СДЭК**: от 200 рублей за доставку

## 🎉 Готово!

Ваш полноценный e-commerce сайт BiomorphX с Medusa успешно размещен и готов к работе!

