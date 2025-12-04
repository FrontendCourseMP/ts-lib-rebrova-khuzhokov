# FormValidator

Библиотека для валидации HTML форм на TypeScript с поддержкой различных типов полей и гибкими правилами валидации.

## Возможности

- 🎯 Типобезопасная валидация с поддержкой TypeScript
- 🔗 Fluent API для удобного добавления полей
- 📝 Автоматическое извлечение правил из HTML атрибутов
- 🎨 Автоматическое отображение ошибок валидации
- 🌐 Поддержка различных типов полей (text, email, password, number)
- ⚙️ Гибкая настройка правил валидации
- 💬 Кастомные сообщения об ошибках

## Установка

```bash
npm install
```

## Быстрый старт

### HTML структура

Для работы библиотеки требуется следующая структура HTML:

```html
<form id="myForm">
  <div>
    <label for="input-username">Имя пользователя:</label>
    <input type="text" id="input-username" />
    <span id="error-username" style="display: none; color: red;"></span>
  </div>

  <div>
    <label for="input-email">Email:</label>
    <input type="email" id="input-email" />
    <span id="error-email" style="display: none; color: red;"></span>
  </div>

  <div>
    <label for="input-password">Пароль:</label>
    <input type="password" id="input-password" />
    <span id="error-password" style="display: none; color: red;"></span>
  </div>

  <div>
    <label for="input-age">Возраст:</label>
    <input type="number" id="input-age" />
    <span id="error-age" style="display: none; color: red;"></span>
  </div>

  <button type="submit">Отправить</button>
</form>
```

**Важно:**

- Каждое поле должно иметь `id` в формате `input-{fieldName}`
- Для каждого поля должен быть элемент для отображения ошибок с `id` в формате `error-{fieldName}`

### Использование

```typescript
import { FormValidator } from "./form-validator";

const form = document.querySelector("#myForm") as HTMLFormElement;

const validator = new FormValidator(form)
  .addField("username", "text", { required: true, minLength: 3 })
  .addField("email", "email", {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  .addField("password", "password", { required: true, minLength: 8 })
  .addField("age", "number", { required: true, min: 18, max: 100 });

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validator.validate()) {
    // Форма валидна, можно отправлять данные
    console.log("Форма валидна!");
  } else {
    // Есть ошибки валидации
    console.log("Форма содержит ошибки");
  }
});
```

## API Reference

### `FormValidator`

Основной класс для валидации форм.

#### `constructor(form: HTMLFormElement)`

Создаёт экземпляр валидатора для указанной формы.

**Параметры:**

- `form` - HTML элемент формы для валидации

**Пример:**

```typescript
const form = document.querySelector("#myForm") as HTMLFormElement;
const validator = new FormValidator(form);
```

#### `addField<T>(fieldName: string, type: T, rules?: Rule<T>): this`

Добавляет поле для валидации с указанными правилами.

**Параметры:**

- `fieldName` - Имя поля (должно соответствовать id элемента `input-{fieldName}`)
- `type` - Тип поля: `'text'`, `'email'`, `'password'`, `'number'`
- `rules` - Опциональные правила валидации для поля

**Возвращает:** `this` для поддержки цепочки вызовов

**Пример:**

```typescript
validator
  .addField("username", "text", { required: true, minLength: 3 })
  .addField("email", "email", { required: true });
```

#### `validate(): boolean`

Выполняет валидацию всех добавленных полей формы.

**Возвращает:** `true` если все поля валидны, `false` если есть ошибки

**Пример:**

```typescript
if (validator.validate()) {
  // Все поля валидны
} else {
  // Есть ошибки валидации
}
```

## Правила валидации

### Для строковых полей (text, email, password)

- `required: boolean` - Поле обязательно для заполнения
- `minLength: number` - Минимальная длина строки
- `maxLength: number` - Максимальная длина строки
- `pattern: RegExp` - Регулярное выражение для проверки формата
- `getMessage: () => string` - Функция для получения кастомного сообщения об ошибке

**Пример:**

```typescript
validator.addField("username", "text", {
  required: true,
  minLength: 3,
  maxLength: 20,
  pattern: /^[a-zA-Z0-9_]+$/,
  getMessage: () =>
    "Имя пользователя должно содержать только буквы, цифры и подчёркивание",
});
```

### Для числовых полей (number)

- `required: boolean` - Поле обязательно для заполнения
- `min: number` - Минимальное значение
- `max: number` - Максимальное значение
- `getMessage: () => string` - Функция для получения кастомного сообщения об ошибке

**Пример:**

```typescript
validator.addField("age", "number", {
  required: true,
  min: 18,
  max: 100,
  getMessage: () => "Возраст должен быть от 18 до 100 лет",
});
```

## Извлечение правил из HTML

Библиотека автоматически извлекает правила валидации из HTML атрибутов:

```html
<input
  type="text"
  id="input-username"
  required
  minlength="3"
  maxlength="20"
  pattern="^[a-zA-Z0-9_]+$"
/>
```

Эти правила будут объединены с правилами, переданными в JavaScript:

```typescript
// HTML правила: required, minlength=3, maxlength=20, pattern
// JS правила: minLength=5 (переопределяет HTML minlength)
validator.addField("username", "text", { minLength: 5 });
// Итоговые правила: required, minLength=5, maxLength=20, pattern
```

## Дефолтные сообщения об ошибках

Библиотека предоставляет следующие дефолтные сообщения:

- `required` - "Это поле обязательно"
- `minLength` - "Минимум {n} символов"
- `maxLength` - "Максимум {n} символов"
- `pattern` - "Неверный формат"
- `min` - "Минимальное значение: {n}"
- `max` - "Максимальное значение: {n}"

Вы можете переопределить любое сообщение с помощью функции `getMessage`:

```typescript
validator.addField("email", "email", {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  getMessage: () => "Пожалуйста, введите корректный email адрес",
});
```

## Примеры использования

### Простая форма регистрации

```typescript
const form = document.querySelector("#registrationForm") as HTMLFormElement;

const validator = new FormValidator(form)
  .addField("username", "text", {
    required: true,
    minLength: 3,
    getMessage: () => "Имя пользователя должно быть не менее 3 символов",
  })
  .addField("email", "email", {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    getMessage: () => "Введите корректный email",
  })
  .addField("password", "password", {
    required: true,
    minLength: 8,
    getMessage: () => "Пароль должен быть не менее 8 символов",
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validator.validate()) {
    // Отправка данных на сервер
  }
});
```

### Форма с числовыми полями

```typescript
const form = document.querySelector("#orderForm") as HTMLFormElement;

const validator = new FormValidator(form)
  .addField("quantity", "number", {
    required: true,
    min: 1,
    max: 100,
  })
  .addField("price", "number", {
    required: true,
    min: 0.01,
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validator.validate()) {
    // Обработка заказа
  }
});
```

## Разработка

### Запуск dev-сервера

```bash
npm run dev
```

### Сборка проекта

```bash
npm run build
```

### Запуск тестов

```bash
npm run test
```

### Проверка кода линтером

```bash
npm run lint
```

## Лицензия

MIT
