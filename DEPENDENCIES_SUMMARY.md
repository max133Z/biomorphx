# 📦 Зависимости для развертывания BiomorphX

## 🖥️ Системные требования
- **ОС:** Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **RAM:** Минимум 2GB
- **Диск:** 20GB свободного места
- **Процессор:** 1+ ядро

---

## 🔧 Основные компоненты

### 1. **Node.js 18+**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 2. **MySQL 8.0+**
```bash
# Ubuntu/Debian
sudo apt install -y mysql-server

# CentOS/RHEL
sudo yum install -y mysql-server
```

### 3. **Nginx**
```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

### 4. **PM2 (менеджер процессов)**
```bash
sudo npm install -g pm2
```

---

## 📋 Node.js зависимости (package.json)

### **Основные зависимости:**
- `next: 14.2.5` - React фреймворк
- `react: 18.3.1` - UI библиотека
- `react-dom: 18.3.1` - React DOM
- `mysql2: ^3.14.3` - MySQL драйвер
- `nodemailer: ^6.10.1` - Отправка email
- `@fortawesome/fontawesome-free: ^7.0.0` - Иконки

### **Dev зависимости:**
- `typescript: ^5` - TypeScript
- `eslint: ^8.57.0` - Линтер
- `@types/node: ^20` - Типы Node.js
- `@types/react: ^18` - Типы React
- `@types/react-dom: ^18` - Типы React DOM

---

## 🗄️ База данных

### **Таблицы:**
1. **orders** - Заказы
   - id, external_id, customer_email, customer_name, customer_phone
   - shipping_address, total_price, status, created_at

2. **order_items** - Товары в заказах
   - id, order_id, product_id, title, quantity, unit_price

### **Настройка:**
```sql
CREATE DATABASE biomorphx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'biomorphx_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON biomorphx.* TO 'biomorphx_user'@'localhost';
```

---

## ⚙️ Переменные окружения (.env)

```env
# База данных
DATABASE_URL=mysql://user:password@localhost:3306/biomorphx

# SMTP (почта)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="BiomorphX <noreply@biomorphx.com>"

# Заказы
ORDER_EMAIL_TO=your_email@gmail.com

# Окружение
NODE_ENV=production

# Админ панель
ADMIN_USER=admin
ADMIN_PASS=strong_password
```

---

## 🌐 Веб-сервер (Nginx)

### **Конфигурация:**
- Reverse proxy на порт 3000
- Статические файлы Next.js
- Gzip сжатие
- SSL поддержка

### **Порты:**
- **80** - HTTP
- **443** - HTTPS
- **3000** - Next.js приложение
- **3306** - MySQL

---

## 🔄 Процессы (PM2)

### **Конфигурация:**
```javascript
{
  name: 'biomorphx',
  script: 'npm',
  args: 'start',
  instances: 1,
  autorestart: true,
  max_memory_restart: '1G'
}
```

---

## 📁 Структура файлов

```
/home/biomorphx/
├── biomorphx/           # Приложение
│   ├── .next/          # Сборка Next.js
│   ├── public/         # Статические файлы
│   ├── src/            # Исходный код
│   ├── .env           # Конфигурация
│   └── package.json   # Зависимости
├── backups/           # Бэкапы
└── logs/             # Логи
```

---

## 🚀 Команды развертывания

### **Установка:**
```bash
# 1. Клонирование
git clone https://github.com/max133Z/biomorphx.git

# 2. Установка зависимостей
npm install

# 3. Сборка
npm run build

# 4. Запуск
npm start
```

### **Управление:**
```bash
# PM2
pm2 start ecosystem.config.js
pm2 restart biomorphx
pm2 logs biomorphx

# Nginx
sudo systemctl restart nginx
sudo nginx -t

# MySQL
sudo systemctl restart mysql
```

---

## 🔒 Безопасность

### **Файрвол:**
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### **SSL:**
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 📊 Мониторинг

### **Логи:**
- `/var/log/nginx/` - Nginx логи
- `/var/log/mysql/` - MySQL логи
- `pm2 logs` - Приложение логи

### **Метрики:**
- `pm2 monit` - Мониторинг процессов
- `htop` - Системные ресурсы
- `df -h` - Дисковое пространство

---

## 🔧 Автоматизация

### **Бэкапы:**
```bash
# Ежедневные бэкапы
0 2 * * * /home/biomorphx/backup.sh
```

### **Обновления:**
```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
```

---

## ✅ Чек-лист развертывания

- [ ] Node.js 18+ установлен
- [ ] MySQL настроен и запущен
- [ ] Nginx установлен и настроен
- [ ] PM2 установлен
- [ ] Приложение собрано (`npm run build`)
- [ ] База данных инициализирована
- [ ] .env файл настроен
- [ ] SSL сертификат получен
- [ ] Файрвол настроен
- [ ] Бэкапы настроены
- [ ] Мониторинг настроен
- [ ] Тестирование завершено

---

## 🆘 Устранение проблем

### **Частые ошибки:**
1. **Порт 3000 занят** → `pm2 restart biomorphx`
2. **Ошибки БД** → Проверить DATABASE_URL в .env
3. **SMTP ошибки** → Настроить SMTP в .env
4. **Nginx ошибки** → `sudo nginx -t`

### **Полезные команды:**
```bash
# Проверка статуса
pm2 status
sudo systemctl status nginx mysql

# Просмотр логов
pm2 logs biomorphx
sudo tail -f /var/log/nginx/error.log

# Перезапуск всех сервисов
pm2 restart all
sudo systemctl restart nginx mysql
```
