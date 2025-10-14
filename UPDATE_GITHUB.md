# 📤 Инструкция по обновлению GitHub

## 🎯 Вариант 1: Через терминал (если Git установлен)

### Шаг 1: Откройте новый терминал PowerShell
Нажмите **Win + X** → выберите **"Windows PowerShell"** или **"Terminal"**

### Шаг 2: Скопируйте и выполните команды по очереди:

```powershell
# Переход в папку проекта
cd "C:\Users\maksim.kazantsev\Desktop\biomorphx upgrade"

# Проверка Git
git --version

# Настройка Git (только при первом запуске)
git config --global user.name "max133Z"
git config --global user.email "ваш_email@example.com"

# Проверка измененных файлов
git status

# Добавление всех изменений
git add .

# Создание коммита
git commit -m "Обновление проекта: мобильная адаптация, email, статьи, оптимизация"

# Отправка на GitHub
git push origin main
```

### Если попросит авторизацию:
- **Username**: ваш логин GitHub
- **Password**: используйте **Personal Access Token** (не обычный пароль!)
- Создать токен: https://github.com/settings/tokens (выберите "repo" при создании)

---

## 🖥️ Вариант 2: GitHub Desktop (САМЫЙ ПРОСТОЙ!)

### Шаг 1: Скачайте и установите
https://desktop.github.com/

### Шаг 2: Откройте GitHub Desktop
- Войдите в свой аккаунт GitHub
- Нажмите **File → Add local repository**
- Выберите папку: `C:\Users\maksim.kazantsev\Desktop\biomorphx upgrade`

### Шаг 3: Сделайте коммит
В левой панели увидите все изменения:
- В поле внизу напишите:
  ```
  Обновление проекта
  
  - Мобильная адаптация (лого по центру)
  - Email улучшения (комментарий, способ оплаты, индекс)
  - Новая страница /articles
  - Оптимизация (удалено 34 файла)
  ```
- Нажмите **"Commit to main"**

### Шаг 4: Отправьте на GitHub
- Нажмите **"Push origin"** вверху
- Готово! ✅

---

## 📱 Вариант 3: Через веб-интерфейс GitHub

### Если Git не работает:

1. Откройте https://github.com/max133Z/biomorphx
2. Нажмите **"Add file" → "Upload files"**
3. Перетащите измененные файлы:
   - `src/app/checkout/page.js`
   - `src/app/api/orders/route.js`
   - `src/lib/db.js`
   - `src/components/Header.js`
   - `src/components/Footer.js`
   - `src/app/page.js`
   - `src/app/styles/responsive/mobile.css`
   - `src/app/articles/page.js` (новый файл)
   - `src/app/styles/pages/articles-list.css` (новый файл)
4. В поле "Commit changes" напишите:
   ```
   Обновление проекта
   ```
5. Нажмите **"Commit changes"**

---

## 📋 Список всех изменений

### ✅ Новые файлы:
- `src/app/articles/page.js` - страница списка статей
- `src/app/styles/pages/articles-list.css` - стили для страницы статей

### ✏️ Измененные файлы:
- `src/app/checkout/page.js` - валидация адресов, передача комментария и способа оплаты
- `src/app/api/orders/route.js` - улучшенный email с индексом отдельно
- `src/lib/db.js` - добавлено поле `notes` в схему БД
- `src/components/Header.js` - убрана ссылка "Статьи"
- `src/components/Footer.js` - убрана ссылка "Статьи"
- `src/app/page.js` - добавлена кнопка "Все статьи"
- `src/app/styles/responsive/mobile.css` - лого по центру на мобильных

### ❌ Удаленные файлы (34 шт.):
- 20 файлов документации (ARTICLE_MOBILE_FIX.md, EMAIL_FIELDS_VERIFICATION.md и др.)
- 3 тестовых файла (fix-database.js, server-db-fix.js, test-db.js)
- 4 миграционных скрипта
- 3 тестовые страницы/API
- 4 пустые директории

---

## 🎉 После успешного обновления

Проверьте на GitHub:
- https://github.com/max133Z/biomorphx

Вы должны увидеть новый коммит с вашими изменениями!

---

## 💡 Рекомендация

**Используйте GitHub Desktop** - это самый простой способ!
- Не нужно знать команды Git
- Визуальный интерфейс
- Автоматическая синхронизация
- Легко отменять изменения

Скачать: https://desktop.github.com/

