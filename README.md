# BioMorphX - E-commerce Platform

Платформа электронной коммерции для продажи аминокислот и пищевых добавок.

## 🚀 Особенности

- **Современный дизайн** с градиентами и анимациями
- **Адаптивная верстка** для всех устройств
- **Корзина покупок** с сохранением в localStorage
- **Система заказов** с защитой от дублирования
- **Админ панель** для управления заказами и письмами
- **Email уведомления** о новых заказах
- **Форма обратной связи** с валидацией
- **SEO оптимизация** и быстрая загрузка

## 📋 Технологии

- **Frontend**: Next.js 14, React 18, CSS3
- **Backend**: Next.js API Routes
- **База данных**: MySQL
- **Email**: Nodemailer
- **Стили**: CSS Grid, Flexbox, CSS Variables
- **Иконки**: Font Awesome

## 🛠️ Установка

### Локальная разработка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/max133Z/biomorphx.git
cd biomorphx
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp env.example .env
```

Отредактируйте `.env` файл:
```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/biomorphx

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="BiomorphX <noreply@biomorphx.com>"

# Order
ORDER_EMAIL_TO=admin@biomorphx.com

# Dev
NODE_ENV=development

# Admin
ADMIN_USER=admin
ADMIN_PASS=strong_password_here
```

4. **Настройте базу данных**
```bash
# Создайте базу данных MySQL
mysql -u root -p
CREATE DATABASE biomorphx;
```

5. **Запустите сервер разработки**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🚀 Деплой на VPS

### Подготовка сервера

1. **Обновите систему**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Установите Node.js 18+**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Установите MySQL**
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

4. **Установите PM2**
```bash
sudo npm install -g pm2
```

5. **Установите Nginx**
```bash
sudo apt install nginx -y
```

### Настройка базы данных

1. **Создайте базу данных**
```bash
sudo mysql -u root -p
CREATE DATABASE biomorphx;
CREATE USER 'biomorphx'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON biomorphx.* TO 'biomorphx'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Деплой приложения

1. **Клонируйте проект**
```bash
cd /var/www
sudo git clone https://github.com/max133Z/biomorphx.git
sudo chown -R $USER:$USER biomorphx
cd biomorphx
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp env.example .env
nano .env
```

4. **Соберите приложение**
```bash
npm run build
```

5. **Запустите с PM2**
```bash
pm2 start npm --name "biomorphx" -- start
pm2 save
pm2 startup
```

### Настройка Nginx

1. **Создайте конфигурацию**
```bash
sudo nano /etc/nginx/sites-available/biomorphx
```

2. **Добавьте конфигурацию**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
    }
}
```

3. **Активируйте сайт**
```bash
sudo ln -s /etc/nginx/sites-available/biomorphx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Настройте SSL (опционально)**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Админ панель

Доступ к админ панели: `https://your-domain.com/admin`

**Логин по умолчанию:**
- Пользователь: `admin`
- Пароль: `rtGBYU174@#`

**Функции админ панели:**
- Просмотр и управление заказами
- Изменение статусов заказов
- Удаление заказов
- Просмотр писем с сайта
- Отправка email уведомлений
- Статистика продаж

## 📧 Email настройки

Для работы email уведомлений настройте SMTP:

**Gmail:**
- SMTP_HOST: smtp.gmail.com
- SMTP_PORT: 587
- SMTP_USER: ваш_email@gmail.com
- SMTP_PASS: пароль приложения (не обычный пароль)

**Другие провайдеры:**
- Yandex: smtp.yandex.ru:587
- Mail.ru: smtp.mail.ru:587

## 🔒 Безопасность

- Защита от дублирования заказов
- Валидация всех форм
- Безопасное хранение паролей
- Защита от SQL инъекций
- HTTPS обязателен для продакшена

## 📱 Адаптивность

Сайт полностью адаптивен для:
- 📱 Мобильные устройства (320px+)
- 📱 Планшеты (768px+)
- 💻 Десктопы (1024px+)

## 🚀 Производительность

- Оптимизированные изображения
- Ленивая загрузка компонентов
- Минификация CSS/JS
- Кэширование статических ресурсов
- CDN для шрифтов и иконок

## 📞 Поддержка

- **Email**: support@biomorphx.com
- **Telegram**: @biomorphx_support
- **WhatsApp**: +7 (999) 041-37-55

## 📄 Лицензия

© 2024 BioMorphX. Все права защищены.

---

**Разработано с ❤️ для здоровья и красоты**
