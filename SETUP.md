# Инструкция по установке LeafSide Mobile

## Шаг 1: Установка зависимостей

```bash
cd LeafSide.Mobile
npm install
```

## Шаг 2: Установка Expo CLI (опционально, можно использовать npx)

### Глобальная установка (рекомендуется):
```bash
npm install -g @expo/cli
```

### Или используйте npx (без глобальной установки):
```bash
npx expo start
```

## Шаг 3: Настройка переменных окружения

Скопируйте файл `.env` из примера:
```bash
# Windows PowerShell
Copy-Item env.example .env

# Linux/Mac
cp env.example .env
```

Отредактируйте `.env` и укажите URL вашего бэкенда:
- Для Android эмулятора: `http://10.0.2.2:5233`
- Для iOS симулятора: `http://127.0.0.1:5233`
- Для реального устройства: `http://YOUR_IP:5233` (замените YOUR_IP на IP вашего компьютера)

## Шаг 4: Запуск приложения

### Запуск Expo сервера:
```bash
npm start
# или
npx expo start
```

### Запуск на платформах:

**Android:**
```bash
npm run android
# или
npx expo run:android
```

**iOS (только на Mac):**
```bash
npm run ios
# или
npx expo run:ios
```

**Web:**
```bash
npm run web
# или
npx expo start --web
```

## Проверка установки

Проверьте, что все установлено правильно:

```bash
# Проверка версии Node.js (должна быть >= 18)
node --version

# Проверка версии npm
npm --version

# Проверка Expo CLI
npx expo --version

# Проверка зависимостей
npm list --depth=0
```

## Возможные проблемы

### Ошибка "expo: command not found"
Используйте `npx expo` вместо `expo`:
```bash
npx expo start
```

### Ошибка при установке зависимостей
Попробуйте очистить кэш и переустановить:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с подключением к бэкенду
- Убедитесь, что бэкенд запущен на указанном порту
- Проверьте настройки файрвола
- Для реального устройства убедитесь, что телефон и компьютер в одной сети

## Дополнительные инструменты

### Expo Go (для быстрого тестирования)
Установите приложение Expo Go на ваш телефон:
- [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [iOS](https://apps.apple.com/app/expo-go/id982107779)

Затем отсканируйте QR-код из терминала после запуска `npm start`.

