# API Endpoints - Справочник для мобильного приложения

## Базовый URL
По умолчанию: `http://10.0.2.2:5233` (Android эмулятор)
Настраивается через `.env` файл: `EXPO_PUBLIC_API_URL`

## Аутентификация

### Регистрация
```
POST /api/Account/register
Body: { email, password, firstName, lastName, phoneNumber, countryCode, gender }
Response: 200 OK (без тела)
```

### Вход
```
POST /api/Account/login
Body: { email, password }
Response: { token: string }
```

### Получить профиль
```
GET /api/Account/profile
Headers: Authorization: Bearer {token}
Response: { id, email, firstName, lastName, phoneNumber, countryCode, gender, createdAt }
```

### Обновить профиль
```
PUT /api/Account/profile
Headers: Authorization: Bearer {token}
Body: { firstName?, lastName?, phoneNumber?, countryCode?, gender? }
Response: { id, email, firstName, lastName, phoneNumber, countryCode, gender, createdAt }
```

### Обновить токен
```
POST /api/Account/refresh
Body: { token: string }
Response: { token: string }
```

## Книги (публичные endpoints)

### Список всех книг
```
GET /api/Books
Response: Book[]
```

### Детали книги
```
GET /api/Books/{id}
Response: Book
```

## Корзина (требует авторизации)

### Получить корзину
```
GET /api/Cart
Headers: Authorization: Bearer {token}
Response: { id, items: CartItem[] }
```

### Добавить/обновить товар
```
POST /api/Cart/items
Headers: Authorization: Bearer {token}
Body: { bookId: string, quantity: number }
Response: { id, items: CartItem[] }
```

### Удалить товар
```
DELETE /api/Cart/items/{bookId}
Headers: Authorization: Bearer {token}
Response: 204 No Content
```

### Очистить корзину
```
DELETE /api/Cart
Headers: Authorization: Bearer {token}
Response: 204 No Content
```

## Заказы (требует авторизации)

### Создать заказ
```
POST /api/orders
Headers: Authorization: Bearer {token}
Body: {
  items: [{ bookId, quantity }],
  totalAmount: number,
  shippingAddress: string,
  customerName: string,
  customerEmail: string,
  customerPhone?: string,
  notes?: string
}
Response: Order
```

### Список заказов пользователя
```
GET /api/orders
Headers: Authorization: Bearer {token}
Response: Order[]
```

## Статистика пользователя

### Получить статистику
```
GET /api/UserStats/stats
Headers: Authorization: Bearer {token}
Response: {
  totalOrders: number,
  totalBooksPurchased: number,
  itemsInCart: number,
  favoritesCount: number
}
```

## Коды ошибок

- `200 OK` - успешный запрос
- `201 Created` - ресурс создан
- `204 No Content` - успешное удаление
- `400 Bad Request` - неверный запрос
- `401 Unauthorized` - требуется авторизация
- `403 Forbidden` - нет доступа
- `404 Not Found` - ресурс не найден
- `500 Internal Server Error` - ошибка сервера

## Формат токена

Все защищенные endpoints требуют заголовок:
```
Authorization: Bearer {jwt_token}
```

Токен получается при входе (`/api/Account/login`) и действителен 60 минут.

