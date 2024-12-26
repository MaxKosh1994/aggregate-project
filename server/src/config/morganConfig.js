// Импортируем библиотеку `morgan`. Это middleware, которое используется в Express.js
// для логирования HTTP-запросов. Она позволяет отображать информацию о запросах и ответах сервера.
const morgan = require('morgan');

// Импортируем функцию `colorizeStatus` из утилит, которая отвечает за покраску статусов ответов
// (например, 200 — зелёный, 404 — жёлтый, 500 — красный). Это делается для удобства чтения логов.
const { colorizeStatus } = require('../utils/colorUtils');

/**
 * Эта функция регистрирует кастомный токен для morgan.
 * Токен называется `colored-status` и позволяет заменить стандартный HTTP-статус
 * цветным вариантом (например, окрашивать статус 200 в зелёный, а 500 — в красный).
 * @returns {void}
 */
const registerMorganTokens = () => {
  // `morgan.token` создаёт новый токен для логирования.
  // Это пользовательский токен (custom token), который мы назвали 'colored-status'.
  // Он возвращает результат вызова функции `colorizeStatus`, которая принимает код ответа (`statusCode`).
  morgan.token('colored-status', (req, res) => {
    return colorizeStatus(res.statusCode); // Обработка и окраска HTTP-статуса.
  });
};

// Настраиваем форматирование для логов.
// Здесь используются встроенные токены morgan и созданный ранее `colored-status`.
// Формат логов выглядит как: HTTP-метод : URL : статус с цветом : время ответа сервера - размер ответа.
const customMorganFormat =
  ':method :url :colored-status :response-time ms - :res[content-length]';

// Экспортируем функции для использования в других модулях приложения.
// - `registerMorganTokens` позволяет добавить наш кастомный токен в систему morgan.
// - `customMorganFormat` задаёт кастомный формат логирования.
module.exports = { registerMorganTokens, customMorganFormat };
