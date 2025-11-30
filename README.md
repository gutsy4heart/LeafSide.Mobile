# LeafSide Mobile

Мобильное приложение книжного магазина LeafSide, созданное на **React Native (Expo)**. Приложение использует готовый бэкенд `LeafSide-backend` и повторяет визуальный стиль фронтенда Next.js.

## Возможности
- Каталог книг с поиском, подборками и карточками в фирменном неон-дизайне.
- Детальная карточка книги с описанием, ценой и быстрым добавлением в корзину.
- Авторизация и регистрация (JWT) с сохранением токена в `AsyncStorage`.
- Синхронизированная корзина и оформление заказа на API `/api/cart` и `/api/orders`.
- Профиль пользователя с данными аккаунта и историей заказов.
- Лёгкая темing-система, повторяющая цвета LeafSide web.

## Стек
- Expo SDK 52, React Native 0.76, React 18
- React Navigation, React Query, AsyncStorage
- Expo Linear Gradient, Vector Icons

## Структура
```
LeafSide.Mobile/
├── App.tsx                # Точка входа
├── app.config.ts          # Expo конфиг + API URL из EXPO_PUBLIC_API_URL
├── src/
│   ├── navigation/        # Стек + табы
│   ├── screens/           # Home, Catalog, BookDetails, Cart, Auth, Profile
│   ├── components/        # UI блоки (BookCard, SectionHeader, Buttons)
│   ├── services/          # Клиенты LeafSide API (books, auth, cart, orders)
│   ├── providers/         # AuthProvider, CartProvider, QueryProvider
│   ├── hooks/             # useBooks, useBookFilters, useAuth
│   ├── theme/             # Цвета/spacing, повторяющие веб
│   └── utils/             # Форматирование цен, безопасные fetch
└── README.md
```

## Запуск
1. Установите зависимости:
   ```bash
   cd LeafSide.Mobile
   npm install       # или pnpm install / yarn
   ```
2. Скопируйте переменные окружения:
   ```bash
   cp env.example .env  # или PowerShell: copy env.example .env
   ```
   - для iOS-симулятора используйте `http://127.0.0.1:5233`;
   - для реального устройства укажите IP машины с backend.
3. Запустите Expo:
   ```bash
   npm run start
   ```
4. Запускаем приложение:
   - Android эмулятор: `npm run android`
   - iOS симулятор: `npm run ios`

## Связь с backend
Все запросы выполняются к `EXPO_PUBLIC_API_URL`, где должен быть доступен `LeafSide.API` (например `https://localhost:7000`). Авторизация использует endpoints:
- `POST /api/account/login`
- `POST /api/account/register`
- `GET/PUT /api/account/profile`
- `GET/POST/DELETE /api/cart`
- `POST /api/orders`, `GET /api/orders`

## TODO / Roadmap
- Offline-кэш карточек книг.
- Push-уведомления о статусе заказа.
- Экран администратора для управления каталогом.

---
Для адаптации стиля использованы цвета из `LeafSide.Frontend/src/app/globals.css`.

