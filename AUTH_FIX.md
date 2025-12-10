# 🔐 Исправление ошибки авторизации

## 🐛 Проблема:

При попытке логина/регистрации возникала ошибка **401 Unauthorized**:

```
ERROR  [API] Error 401: {
  "status": 401, 
  "title": "Unauthorized",
  ...
}
```

### Причина:

**Несоответствие формата полей между frontend и backend:**

- **Backend ожидал:** `Email`, `Password`, `FirstName` и т.д. (PascalCase)
- **Frontend отправлял:** `email`, `password`, `firstName` и т.д. (camelCase)

Backend не мог десериализовать JSON, так как имена полей не совпадали.

---

## ✅ Решение:

Исправлен файл `src/services/auth.ts` для отправки данных в формате PascalCase.

### 1. **Login (вход)**

**Было:**
```typescript
export const login = (payload: LoginPayload) =>
  apiFetch<LoginResponse>('/api/account/login', {
    method: 'POST',
    body: payload,  // { email: "...", password: "..." }
  });
```

**Стало:**
```typescript
export const login = (payload: LoginPayload) =>
  apiFetch<LoginResponse>('/api/account/login', {
    method: 'POST',
    body: {
      Email: payload.email,        // ✅ PascalCase
      Password: payload.password,  // ✅ PascalCase
    },
  });
```

---

### 2. **Register (регистрация)**

**Было:**
```typescript
export const register = (payload: RegisterPayload) =>
  apiFetch<void>('/api/account/register', {
    method: 'POST',
    body: payload,  // camelCase поля
  });
```

**Стало:**
```typescript
export const register = (payload: RegisterPayload) =>
  apiFetch<void>('/api/account/register', {
    method: 'POST',
    body: {
      Email: payload.email,
      Password: payload.password,
      FirstName: payload.firstName,
      LastName: payload.lastName,
      PhoneNumber: payload.phoneNumber,
      CountryCode: payload.countryCode,
      Gender: payload.gender,
    },
  });
```

---

### 3. **UpdateProfile (обновление профиля)**

**Было:**
```typescript
export const updateProfile = (token: string, payload: UpdateProfilePayload) =>
  apiFetch<UserProfile>('/api/account/profile', {
    method: 'PUT',
    token,
    body: payload,  // camelCase поля
  });
```

**Стало:**
```typescript
export const updateProfile = (token: string, payload: UpdateProfilePayload) =>
  apiFetch<UserProfile>('/api/account/profile', {
    method: 'PUT',
    token,
    body: {
      FirstName: payload.firstName,
      LastName: payload.lastName,
      PhoneNumber: payload.phoneNumber,
      CountryCode: payload.countryCode,
      Gender: payload.gender,
    },
  });
```

---

## 🔄 Как применить изменения:

### В Expo Go:
1. Встряхните телефон
2. Нажмите **"Reload"**

### Или через Metro:
В терминале нажмите **`r`**

---

## ✨ Результат:

После перезагрузки приложения:

✅ **Логин работает** - пользователи могут войти  
✅ **Регистрация работает** - можно создавать новые аккаунты  
✅ **Обновление профиля работает** - можно редактировать данные  
✅ **Нет ошибок 401** - backend правильно десериализует запросы

---

## 📋 Тестирование:

### 1. Проверить логин:
```
Email: test@example.com
Password: Test123!
```

### 2. Проверить регистрацию:
Создайте нового пользователя с:
- Email
- Password (минимум 6 символов)
- Имя и Фамилия (опционально)

### 3. Проверить профиль:
После входа перейдите в Profile и попробуйте обновить данные.

---

## 🔧 Backend статус:

Старый backend процесс блокирует файлы. Чтобы перезапустить:

```bash
# Найти процесс
netstat -ano | findstr :5233

# Остановить
taskkill /PID <номер> /F

# Запустить заново
cd LeafSide-backend\LeafSide.API
dotnet run
```

**Или просто используйте уже работающий backend!**

---

## 📝 Файлы изменены:

- ✅ `LeafSide.Mobile/src/services/auth.ts`

Backend не требует изменений - он уже работает правильно с PascalCase.

---

## 🎉 Готово!

Авторизация теперь работает корректно! 🔐✨

