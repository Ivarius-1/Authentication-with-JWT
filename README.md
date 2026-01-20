# Аутентификация с JWT

Простое приложение для регистрации и авторизации пользователей с использованием JWT токенов.

## Технологии

### Backend:
- **Express.js** - веб-фреймворк для Node.js
- **Prisma** - ORM для работы с базой данных
- **bcrypt** - хеширование паролей
- **jsonwebtoken (JWT)** - создание и проверка токенов
- **dotenv** - управление переменными окружения

### Frontend:
- Vanilla JavaScript
- HTML/CSS
- LocalStorage для хранения токенов

## 🚀 Установка и запуск

### 1. Клонируйте репозиторий
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Установите зависимости
```bash
npm install
```

### 3. Настройте переменные окружения
Создайте файл `.env` в корне проекта:
```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES="1h"
PORT=3000
```

### 4. Настройте базу данных
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Запустите сервер
```bash
npm start
```

Сервер запустится на `http://localhost:3000`

## 📁 Структура проекта

```
project/
├── controllers/
│   ├── authenticationController.js  # Логика входа/выхода
│   └── regestrationController.js    # Логика регистрации
├── middleware/
│   └── index.js                      # JWT middleware
├── routes/
│   └── routes.js                     # Маршруты API
├── prisma/
│   └── schema.prisma                 # Схема базы данных
├── public/
│   ├── index.html                    # Главная страница
│   └── app.js                        # Frontend логика
├── .env                              # Переменные окружения
└── server.js                         # Точка входа
```

## 🔌 API Endpoints

### Публичные (без токена):
- **POST** `/app/regUser` - Регистрация нового пользователя
  ```json
  {
    "login": "username",
    "password": "password123"
  }
  ```

- **POST** `/app/authUser` - Вход в систему (получение токена)
  ```json
  {
    "login": "username",
    "password": "password123"
  }
  ```
  **Ответ:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "status": true,
    "message": "Успешный вход",
    "user": {
      "login": "username",
      "online": true
    }
  }
  ```

### Защищённые (требуют токен):
- **POST** `/app/logoutUser` - Выход из системы
  ```
  Headers: Authorization: Bearer <token>
  Body: { "login": "username" }
  ```

- **GET** `/app/allUsers` - Получить всех пользователей (опционально)

## 🔒 Как работает аутентификация

1. **Регистрация**: Пароль хешируется с помощью bcrypt и сохраняется в БД
2. **Вход**: Сервер проверяет пароль и создаёт JWT токен
3. **Токен**: Клиент сохраняет токен в `localStorage`
4. **Защищённые запросы**: Токен отправляется в заголовке `Authorization: Bearer <token>`
5. **Middleware**: Проверяет валидность токена перед доступом к защищённым роутам
6. **Выход**: Токен удаляется из `localStorage`

## 🧪 Тестирование

### Регистрация пользователя:
```bash
curl -X POST http://localhost:3000/app/regUser \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"test123"}'
```

### Вход:
```bash
curl -X POST http://localhost:3000/app/authUser \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"test123"}'
```

### Выход (с токеном):
```bash
curl -X POST http://localhost:3000/app/logoutUser \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"login":"testuser"}'
```

## 📝 Примечания

- Токены имеют срок действия (по умолчанию 1 час)
- Пароли хешируются перед сохранением в БД
- JWT_SECRET должен быть сложным и секретным
- Для production используйте HTTPS

## 🐛 Отладка

В проекте добавлено подробное логирование:
- `🔐 [LOGIN]` - события входа
- `🚪 [LOGOUT]` - события выхода  
- `🔒 [MIDDLEWARE]` - проверка токенов
- `✅` - успешные операции
- `❌` - ошибки

Проверяйте консоль браузера и терминал сервера для отслеживания токенов.

## 📄 Лицензия

MIT