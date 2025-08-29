# 🚀 Деплой BiomorphX на Beget

## 📋 Пошаговая инструкция

### 1. Подготовка проекта
```bash
# Сборка проекта
npm run build

# Проверка локально
npm start
```

### 2. Настройка Beget

#### 2.1 Покупка хостинга
- Зайдите на [beget.com](https://beget.com)
- Выберите тариф "Бизнес" или "Старт" (с поддержкой Node.js)
- Зарегистрируйте домен или подключите существующий

#### 2.2 Настройка Node.js
1. Войдите в панель управления Beget
2. Перейдите в раздел "Node.js"
3. Создайте новое приложение:
   - **Имя**: biomorphx
   - **Версия Node.js**: 18.x или выше
   - **Порт**: 3000 (или автоматически)
   - **Домен**: ваш домен

### 3. Загрузка файлов

#### 3.1 Через FTP
1. Подключитесь к серверу через FTP
2. Загрузите все файлы проекта в корневую папку
3. Убедитесь, что файлы загружены:
   - `package.json`
   - `server.js`
   - `.htaccess`
   - Папка `src/`
   - Папка `public/`

#### 3.2 Через Git (рекомендуется)
```bash
# На сервере
git clone https://github.com/your-username/biomorphx.git
cd biomorphx
npm install
npm run build
```

### 4. Установка зависимостей
```bash
# На сервере
npm install --production
```

### 5. Запуск приложения
```bash
# В панели Beget или через SSH
npm start
```

### 6. Настройка домена
1. В панели Beget перейдите в "Домены"
2. Настройте DNS записи
3. Подключите SSL сертификат (рекомендуется)

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env` на сервере:
```env
NODE_ENV=production
PORT=3000
```

### Настройка PM2 (опционально)
```bash
npm install -g pm2
pm2 start server.js --name biomorphx
pm2 startup
pm2 save
```

## 📁 Структура файлов на сервере
```
/
├── package.json
├── server.js
├── .htaccess
├── .env
├── src/
├── public/
├── node_modules/
└── .next/
```

## 🚨 Возможные проблемы

### 1. Ошибка "Module not found"
```bash
npm install
npm run build
```

### 2. Порт занят
Проверьте настройки порта в панели Beget

### 3. Ошибки прав доступа
```bash
chmod 755 -R /path/to/project
```

## 📞 Поддержка
- Beget поддержка: support@beget.com
- Документация: https://beget.com/ru/help

## 🔄 Обновление сайта
```bash
git pull
npm install
npm run build
pm2 restart biomorphx
```

