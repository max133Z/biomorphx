# 🚀 Быстрый запуск MVP BiomorphX

## ⚡ Экспресс-настройка за 30 минут

### 1. Подготовка VDS

#### 1.1 Минимальные требования:
- **CPU**: 1 ядро
- **RAM**: 2 GB
- **Storage**: 20 GB SSD
- **OS**: Ubuntu 24.04
- **Стоимость**: ~500-800 руб/мес

#### 1.2 Подключение к серверу:
```bash
ssh root@your-server-ip
```

### 2. Автоматическая настройка

#### 2.1 Скачивание и запуск скрипта:
```bash
# Скачиваем скрипт
wget https://raw.githubusercontent.com/your-repo/setup-mvp.sh

# Делаем исполняемым
chmod +x setup-mvp.sh

# Запускаем
sudo bash setup-mvp.sh
```

#### 2.2 Или ручная настройка:
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка Nginx и PM2
sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 3. Настройка Medusa Backend

#### 3.1 Создание пользователя:
```bash
sudo useradd -m -s /bin/bash biomorphx
sudo usermod -aG sudo biomorphx
sudo su - biomorphx
```

#### 3.2 Инициализация Medusa:
```bash
cd /home/biomorphx
mkdir medusa-backend
cd medusa-backend

# Создание Medusa с SQLite
npx create-medusa-app@latest

# Выбираем:
# ✅ Backend only
# ✅ SQLite
# ✅ Redis (опционально)
```

#### 3.3 Настройка .env:
```bash
nano .env
```

```env
DATABASE_URL=file:./data.db
JWT_SECRET=biomorphx-super-secret-jwt-key-2024
COOKIE_SECRET=biomorphx-super-secret-cookie-key-2024
NODE_ENV=production
```

#### 3.4 Запуск Medusa:
```bash
npm install
npx medusa migrations run
pm2 start npm --name "medusa-backend" -- start
pm2 save
```

### 4. Настройка Nginx

#### 4.1 Конфигурация backend:
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
    }
}
```

#### 4.2 Активация:
```bash
sudo ln -s /etc/nginx/sites-available/biomorphx-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Настройка Frontend

#### 5.1 Загрузка файлов:
```bash
cd /home/biomorphx
git clone https://github.com/your-username/biomorphx.git biomorphx-frontend
cd biomorphx-frontend
```

#### 5.2 Настройка .env:
```bash
nano .env
```

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NODE_ENV=production
```

#### 5.3 Сборка и запуск:
```bash
npm install
npm run build
pm2 start server.js --name "biomorphx-frontend"
pm2 save
```

### 6. Миграция товаров

#### 6.1 Запуск миграции:
```bash
cd /home/biomorphx/biomorphx-frontend
node scripts/migrate-products-sqlite.js
```

### 7. Настройка SSL

#### 7.1 Получение сертификатов:
```bash
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d yourdomain.com
```

#### 7.2 Автообновление:
```bash
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 8. Проверка работы

#### 8.1 Проверка backend:
```bash
curl https://api.yourdomain.com/health
# Должен вернуть: {"status":"ok"}
```

#### 8.2 Проверка frontend:
```bash
curl https://yourdomain.com
# Должен вернуть HTML страницу
```

#### 8.3 Проверка PM2:
```bash
pm2 status
pm2 logs
```

## 🔧 Полезные команды

### Мониторинг:
```bash
# Статус сервисов
pm2 status
sudo systemctl status nginx

# Логи
pm2 logs
sudo tail -f /var/log/nginx/access.log
```

### Резервное копирование:
```bash
# Бэкап SQLite
cp /home/biomorphx/medusa-backend/data.db /home/biomorphx/backups/data-$(date +%Y%m%d).db

# Автоматический бэкап
echo "0 2 * * * cp /home/biomorphx/medusa-backend/data.db /home/biomorphx/backups/data-\$(date +\%Y\%m\%d).db" | sudo crontab -
```

### Обновление:
```bash
# Backend
cd /home/biomorphx/medusa-backend
git pull
npm install
pm2 restart medusa-backend

# Frontend
cd /home/biomorphx/biomorphx-frontend
git pull
npm install
npm run build
pm2 restart biomorphx-frontend
```

## 💰 Стоимость MVP

- **VDS**: ~500-800 руб/мес
- **Домен**: ~500-1000 руб/год
- **SSL**: Бесплатно
- **База данных**: Бесплатно (SQLite)
- **Итого**: ~1000-1500 руб/мес

## 🎯 Результат

После настройки у вас будет:
- ✅ **Backend API**: https://api.yourdomain.com
- ✅ **Frontend**: https://yourdomain.com
- ✅ **11 товаров** в каталоге
- ✅ **Корзина и заказы** работают
- ✅ **Готовность к платежам** (нужно добавить Stripe)

## 🚀 Следующие шаги

1. **Добавить платежи** (Stripe)
2. **Добавить доставку** (СДЭК)
3. **Настроить аналитику**
4. **Добавить промокоды**
5. **Настроить уведомления**

## 🆘 Поддержка

Если что-то не работает:
1. Проверьте логи: `pm2 logs`
2. Проверьте статус: `pm2 status`
3. Проверьте Nginx: `sudo systemctl status nginx`
4. Проверьте подключение: `curl localhost:9000/health`

**Удачи с запуском! 🚀**

