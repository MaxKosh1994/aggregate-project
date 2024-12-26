// Импортируем библиотеку `morgan`, которая используется для логирования HTTP-запросов в Express.
const morgan = require('morgan');

// Импортируем библиотеку `express`, которая является основой для нашего веб-сервера.
const express = require('express');

// Импортируем библиотеку `cors`, которая позволяет включать поддержку Cross-Origin Resource Sharing.
// Это используется для обеспечения взаимодействия API и фронтенд-приложений, работающих на разных доменах.
const cors = require('cors');

// Импортируем `cookie-parser`, который используется для обработки cookie в запросах клиента.
const cookieParser = require('cookie-parser');

// Импортируем библиотеку `path`, которая используется для работы с файловой системой и путями.
const path = require('path');

// Импортируем middleware, которое удаляет определённые заголовки HTTP (может быть нужно для повышения безопасности).
const removeHTTPHeader = require('../middleware/removeHeader');

// Утилита для записи логов в файл, которая будет использоваться для архивации логов.
const { writeLogsToFile } = require('../utils/fileLogger');

// Импортируем методы для настройки morgan (регистрацию пользовательских токенов и кастомный формат логов).
const { registerMorganTokens, customMorganFormat } = require('./morganConfig');

// Логический буфер для временного хранения логов и задачи для его обработки.
const { addLogToBuffer, startTask } = require('../utils/logBufferUtils');

// Импортируем middleware для ограничения количества запросов от одного клиента (реализация rate limiter).
const requestLimiter = require('../utils/requestLimiter');

// Получаем переменную окружения `CLIENT_URL`, которая указывает на URL фронтенд-приложения.
const { CLIENT_URL } = process.env;

// Конфигурируем CORS (междоменные запросы). Указываем:
// - `origin`: только те запросы, которые приходят с CLIENT_URL, дозволены (например, `http://localhost:3000`).
// - `credentials`: разрешаем передачу и управление cookie в кросс-доменных запросах.
const corsConfig = {
  origin: [CLIENT_URL],
  credentials: true,
};

// Основная функция конфигурации сервера, которая принимает экземпляр приложения Express (`app`) как аргумент.
const serverConfig = (app) => {
  /* Middleware и настройки приложения */

  // Парсинг URL-кодированных данных из тела запроса (например, форм-данных).
  // Устанавливаем `extended: true`, чтобы использовать расширенный синтаксис парсинга.
  app.use(express.urlencoded({ extended: true }));

  // Парсинг JSON-данных в теле запроса. Это необходимо для работы с API, принимающими JSON.
  app.use(express.json());

  // Подключаем middleware `cookie-parser` для обработки cookie, которые приходят от клиента.
  app.use(cookieParser());

  // Подключение конфигурации CORS.
  app.use(cors(corsConfig));

  // Удаляем определённые заголовки HTTP. Это часто используется для повышения безопасности сервера.
  app.use(removeHTTPHeader);

  // Делаем папку "public" статичной, чтобы сервер мог обслуживать файлы, такие как изображения, стили и скрипты.
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Ограничиваем количество запросов к API от одного клиента через middleware `requestLimiter`.
  // Это предотвращает злоупотребление API, например, DDoS-атаками.
  app.use('/api/', requestLimiter);

  /* Логирование запросов */

  // Регистрируем кастомные токены morgan. Это включает, например, токен `colored-status`, который добавляет цветовое выделение статусов.
  registerMorganTokens();

  // Подключаем morgan для логирования запросов.
  // Здесь используем кастомный формат `customMorganFormat` и настраиваем вывод логов через `stream`.
  app.use(
    morgan(customMorganFormat, {
      stream: {
        write: (log) => {
          // Пишем лог в консоль (например, для разработки).
          console.log(log.trim());

          // Сохраняем лог во временный буфер. Логи из буфера затем будут записаны в файл.
          addLogToBuffer(log.trim());
        },
      },
    })
  );

  /* Планировщик для обработки логов */

  // `startTask` запускает задачу по расписанию для записи логов в файл каждые 10 секунд.
  // Здесь используется формат Cron: `*/10 * * * * *` — это значит "каждые 10 секунд".
  startTask('*/10 * * * * *', writeLogsToFile);
};

// Экспортируем функцию конфигурации, чтобы она могла быть использована в основной точке входа сервера.
module.exports = serverConfig;
