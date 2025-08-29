# 🛒 Интеграция Medusa с BiomorphX

## 🎯 Что получим с Medusa

### ✅ **Полный e-commerce функционал:**
- **Управление товарами** (категории, варианты, цены)
- **Корзина и оформление заказов**
- **Система платежей** (Stripe, PayPal, Сбербанк)
- **Управление заказами** и статусами
- **Система скидок** и промокодов
- **Интеграция с доставкой** (СДЭК, Почта России)
- **Аналитика продаж** и отчеты
- **Мультиязычность** и валюты

## 🚀 Пошаговая настройка

### 1. Установка Medusa Backend

```bash
# Создаем папку для Medusa
mkdir medusa-backend
cd medusa-backend

# Инициализируем проект
npx create-medusa-app@latest

# Выбираем:
# - Backend only
# - PostgreSQL (рекомендуется)
# - Redis (для кэширования)
```

### 2. Настройка базы данных

```bash
# Установка PostgreSQL
# Для Windows: https://www.postgresql.org/download/windows/
# Для Linux: sudo apt-get install postgresql

# Создание базы данных
createdb biomorphx-medusa

# Настройка переменных окружения
cp .env.example .env
```

### 3. Конфигурация .env

```env
# База данных
DATABASE_URL=postgres://username:password@localhost:5432/biomorphx-medusa

# Redis
REDIS_URL=redis://localhost:6379

# JWT секрет
JWT_SECRET=your-super-secret-jwt-key

# Cookie секрет
COOKIE_SECRET=your-super-secret-cookie-key

# Платежи (Stripe)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Доставка
SHIPPO_API_KEY=shippo_test_...
```

### 4. Запуск Medusa Backend

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

### 5. Интеграция с Next.js Frontend

```bash
# В папке biomorphx устанавливаем Medusa SDK
npm install @medusajs/medusa-js
```

### 6. Создание Medusa клиента

```javascript
// src/lib/medusa.js
import Medusa from "@medusajs/medusa-js"

const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3
})

export default medusaClient
```

### 7. Обновление ProductCard для работы с Medusa

```javascript
// src/components/ProductCard.js
import { useCart } from "medusa-react"

const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  
  const handleAddToCart = () => {
    addItem({
      variantId: product.variants[0].id,
      quantity: 1
    })
  }
  
  return (
    // ... существующий код
  )
}
```

## 📦 Миграция существующих товаров

### 1. Создание скрипта миграции

```javascript
// scripts/migrate-products.js
import medusaClient from "../src/lib/medusa.js"

const existingProducts = [
  // Ваши существующие товары из data/products.js
]

async function migrateProducts() {
  for (const product of existingProducts) {
    try {
      await medusaClient.admin.products.create({
        title: product.name,
        description: product.longDescription,
        handle: product.id,
        status: "published",
        variants: [{
          title: "Default",
          prices: [{
            amount: product.price * 100, // Medusa использует копейки
            currency_code: "rub"
          }],
          inventory_quantity: 100,
          manage_inventory: true
        }],
        images: [{
          url: product.image
        }],
        options: [{
          title: "Размер",
          values: ["300 мг", "400 мг"]
        }]
      })
      console.log(`✅ Товар ${product.name} создан`)
    } catch (error) {
      console.error(`❌ Ошибка создания ${product.name}:`, error)
    }
  }
}

migrateProducts()
```

## 🔧 Настройка платежей

### 1. Stripe (основной провайдер)

```bash
# Установка Stripe плагина
npm install medusa-payment-stripe

# Настройка в medusa-config.js
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

### 2. Российские платежные системы

```bash
# Сбербанк
npm install medusa-payment-sberbank

# ЮMoney
npm install medusa-payment-yoomoney
```

## 🚚 Настройка доставки

### 1. СДЭК

```bash
npm install medusa-shipping-cdek
```

### 2. Почта России

```bash
npm install medusa-shipping-russian-post
```

## 📊 Админ панель

### 1. Установка Medusa Admin

```bash
npx create-medusa-app@latest --admin-only
```

### 2. Или использование существующей админки

```javascript
// src/app/admin/medusa/page.js
import { MedusaProvider } from "medusa-react"
import medusaClient from "../../../lib/medusa"

export default function AdminPage() {
  return (
    <MedusaProvider
      baseUrl={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}
      queryClientProviderProps={{ client: queryClient }}
    >
      {/* Ваша админ панель */}
    </MedusaProvider>
  )
}
```

## 🚀 Деплой на Beget

### 1. Обновленная структура проекта

```
biomorphx/
├── frontend/          # Next.js приложение
├── backend/           # Medusa backend
├── admin/             # Medusa admin (опционально)
└── docker-compose.yml # Для локальной разработки
```

### 2. Docker Compose для разработки

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: biomorphx-medusa
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  medusa:
    build: ./backend
    ports:
      - "9000:9000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/biomorphx-medusa
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

## 💰 Стоимость и ресурсы

### **Medusa Backend:**
- **CPU**: 1-2 ядра
- **RAM**: 2-4 GB
- **Storage**: 20-50 GB
- **База данных**: PostgreSQL
- **Кэш**: Redis

### **Дополнительные сервисы:**
- **Stripe**: 2.9% + 30 копеек за транзакцию
- **СДЭК**: от 200 рублей за доставку
- **SSL сертификат**: бесплатно (Let's Encrypt)

## 🎯 Преимущества Medusa

### ✅ **Полный контроль:**
- Весь код у вас
- Нет ежемесячных платежей
- Кастомизация любой части

### ✅ **Масштабируемость:**
- API-first архитектура
- Микросервисы
- Облачная готовность

### ✅ **Российская локализация:**
- Поддержка российских платежных систем
- Интеграция с российскими службами доставки
- Мультиязычность

## 🚀 Следующие шаги

1. **Установите Medusa Backend**
2. **Настройте базу данных**
3. **Интегрируйте с Next.js**
4. **Мигрируйте товары**
5. **Настройте платежи и доставку**
6. **Протестируйте полный цикл покупки**

Хотите начать с установки Medusa Backend?

