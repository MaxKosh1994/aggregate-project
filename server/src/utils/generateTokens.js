// Подключаем модуль dotenv для работы с переменными окружения,
// чтобы получить секретные ключи и другие конфигурации из .env файла.
require('dotenv').config();

// Импортируем библиотеку jsonwebtoken (jwt) для работы с JWT-токенами.
// JWT (JSON Web Token) — это стандарт для создания безопасных токенов, которые используются для авторизации.
const jwt = require('jsonwebtoken');

// Импортируем файл конфигурации jwtConfig, где, например, могут быть временные настройки для токенов.
const jwtConfig = require('../config/jwtConfig');

// Извлекаем секретные ключи для создания JWT-токенов из переменных окружения (файл .env).
const { SECRET_ACCESS_TOKEN, SECRET_REFRESH_TOKEN } = process.env;

/**
 * Функция для генерации JWT токенов (access и refresh).
 * @param {object} payload - Данные, которые будут "вшиты" в токен. Обычно это идентификатор пользователя или роли.
 * @returns {object} - Возвращает объект с двумя токенами.
 * @returns {string} accessToken - Токен доступа, зашитый с SECRET_ACCESS_TOKEN.
 * @returns {string} refreshToken - Токен для обновления доступа, защищённый SECRET_REFRESH_TOKEN.
 */
const generateTokens = (payload) => ({
  // Генерация accessToken (токен доступа):
  // - `jwt.sign()` формирует токен, основываясь на переданных данных (payload), секретном ключе и конфигурации.
  accessToken: jwt.sign(payload, SECRET_ACCESS_TOKEN, jwtConfig.access),

  // Генерация refreshToken (токен обновления):
  // - Этот токен позволяет обновлять доступной сессии без необходимости повторной авторизации.
  refreshToken: jwt.sign(payload, SECRET_REFRESH_TOKEN, jwtConfig.refresh),
});

// Экспортируем функцию generateTokens для использования в других модулях.
// Это позволяет генерировать access и refresh токены там, где это потребуется (например, в логике авторизации).
module.exports = generateTokens;
