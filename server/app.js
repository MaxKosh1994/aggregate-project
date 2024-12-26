// Подключаем переменные окружения из файла .env, чтобы их можно было использовать в проекте.
// Это важно для хранения конфиденциальных данных — таких как ключи API, пароли и т.д.
require('dotenv').config();

//* Импортируем встроенную библиотеку http Node.js для работы с сервером.
// Она используется здесь для запуска сервера с поддержкой WebSocket.
const http = require('http');

// Импорт Swagger UI для отображения API-документации через веб-интерфейс.
const swaggerUi = require('swagger-ui-express');

// Импортируем библиотеку для парсинга YAML-файлов, в частности для Swagger-документации.
const YAML = require('yamljs');

//* Импортируем библиотеку Express для работы с маршрутизацией и созданием HTTP-сервера.
const express = require('express');

// Импортируем библиотеку Prometheus для сбора метрик и мониторинга сервера.
const client = require('prom-client');

// Импортируем модуль конфигурации сервера.
const serverConfig = require('./src/config/serverConfig');

// Импортируем главный маршрут проекта (все API маршруты) из index.routes.
const indexRouter = require('./src/routes/index.routes');

// FIX - Импортируем middleware-колбэк `upgradeCb` для обработки WebSocket-соединений
// и экземпляр WebSocket-сервера `wss`.
const { upgradeCb, wss } = require('./src/ws/upgradeCB');

// FIX - Импортируем колбэк для обработки событий при установке WebSocket-соединения.
const connectionCb = require('./src/ws/connectionCB');

// Импортируем утилиту для форматирования стандартного ответа приложения.
const formatResponse = require('./src/utils/formatResponse');

//* Создаем экземпляр Express приложения, чтобы определить поведение серверного приложения.
const app = express();

//* Прогоняем приложение через специальный модуль конфигурации (например, добавляем middleware).
serverConfig(app);

// Загружаем описание API из Swagger-документации (формат YAML).
const swaggerDocument = YAML.load('./swagger.yaml');

//* Включаем сбор стандартных метрик Prometheus с помощью библиотеки prom-client.
// Это необходимо для мониторинга состояния системы, производительности и других данных.
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

//* Настраиваем маршрут для документации Swagger (доступно на `/api-docs`).
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Устанавливаем порт для запуска сервера. Используем переменную окружения PORT, если она задана.
// Если переменная не указана, сервер будет по умолчанию использовать порт 3000.
const PORT = process.env.PORT || 3000;

//* Подключение маршрутов приложения: все маршруты определены в indexRouter и
// будут доступны под префиксом "/api".
app.use('/api', indexRouter);

// Определяем дополнительный маршрут `/metrics`.
// При запросе на этот маршрут сервер возвращает собранные метрики в формате,
// совместимом с Prometheus.
app.get('/metrics', async (req, res) => {
  // Устанавливаем тип контента для ответа
  res.set('Content-Type', client.register.contentType);
  // Отправляем собранные метрики клиенту
  res.end(await client.register.metrics());
});

//! Обрабатываем все запросы на маршруты, которых не существует.
// Это позволяет не возвращать стандартный ответ Express, а сообщать клиентам,
// что запрашиваемый ресурс отсутствует.
app.use('*', (req, res) => {
  res
    .status(404) // Устанавливаем HTTP-статус 404 (Not Found)
    .json(formatResponse(404, 'Not found', null, 'Resource not found'));
});

// FIX - Создаем HTTP-сервер с помощью встроенной библиотеки http.
// Здесь используется приложение Express (`app`) в качестве обработчика запросов.
const server = http.createServer(app);

// FIX - Настраиваем сервер для обработки WebSocket-соединений.
// Используем событие `upgrade`, чтобы "переключить" соединение на WebSocket.
server.on('upgrade', upgradeCb);

// FIX - Настраиваем сервер WebSocket для обработки соединений.
// При успешном установлении соединения вызывается callback (connectionCb),
// где можно обрабатывать события данного соединения.
wss.on('connection', connectionCb);

//* Запускаем сервер с прослушиванием указного порта.
// Когда сервер успешно стартует, выводим сообщение с номером порта в консоль.
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Экспортируем приложение (Express) и сам сервер (HTTP) для дальнейшего использования
// в других модулях, например, для тестирования.
module.exports = { app, server };
