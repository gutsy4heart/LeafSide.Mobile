# Тестирование подключения к бэкенду

## Быстрая проверка

### 1. Проверка доступности бэкенда

```powershell
# Проверка health endpoint
Invoke-WebRequest -Uri http://localhost:5233/api/health -Method GET

# Проверка списка книг (публичный endpoint)
Invoke-WebRequest -Uri http://localhost:5233/api/books -Method GET
```

### 2. Проверка из мобильного приложения

После запуска приложения (`npm start`), проверьте в логах:
- Успешные запросы к API
- Отсутствие ошибок CORS
- Корректные ответы от сервера

## Таблица соответствия endpoints

| Мобильное приложение | Бэкенд | Метод | Авторизация |
|---------------------|--------|-------|-------------|
| `/api/account/login` | `/api/Account/login` | POST | Нет |
| `/api/account/register` | `/api/Account/register` | POST | Нет |
| `/api/account/profile` | `/api/Account/profile` | GET/PUT | Да |
| `/api/account/refresh` | `/api/Account/refresh` | POST | Нет |
| `/api/books` | `/api/Books` | GET | Нет |
| `/api/books/{id}` | `/api/Books/{id}` | GET | Нет |
| `/api/cart` | `/api/Cart` | GET/DELETE | Да |
| `/api/cart/items` | `/api/Cart/items` | POST | Да |
| `/api/cart/items/{id}` | `/api/Cart/items/{id}` | DELETE | Да |
| `/api/orders` | `/api/orders` | GET/POST | Да |
| `/api/user/stats` | `/api/UserStats/stats` | GET | Да |

**Примечание**: ASP.NET Core маршруты не чувствительны к регистру, поэтому `/api/account` и `/api/Account` работают одинаково.

