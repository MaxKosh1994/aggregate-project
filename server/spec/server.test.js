/* eslint-disable no-undef */
//-- Подключаем необходимые зависимости для тестирования
const request = require('supertest'); //? Библиотека для выполнения HTTP-запросов на наше приложение
const { app, server } = require('../app'); //? Импортируем сервер и приложение, которые будут тестироваться
const { stopAllTasks } = require('../src/utils/logBufferUtils'); //? Утилита для остановки задач (например, планировщиков - cron)

//-- Основная группа тестов
describe('API Server Tests', () => {
  //* Хук, который выполняется после завершения всех тестов
  afterAll((done) => {
    server.close(done); //! Закрываем сервер после тестов, чтобы не оставлять открытые порты
    stopAllTasks(); //! Останавливаем все фоновые задачи, чтобы избежать утечек ресурсов
  });

  //* Тест для проверки документации Swagger по доступу через маршрут /api-docs
  describe('GET /api-docs', () => {
    it('should return the Swagger documentation page', async () => {
      const response = await request(app).get('/api-docs'); //? Отправляем GET-запрос на маршрут /api-docs
      expect(response.statusCode).toBe(301); //? Проверяем, что сервер возвращает статус 301 (перенаправление)
      expect(response.headers['content-type']).toContain('text/html'); //? Убеждаемся, что контент имеет тип HTML
    });
  });

  //* Тест для проверки обработки маршрутов, которых не существует
  describe('404 Handling', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(app).get('/non-existent-route'); //? Отправляем запрос на несуществующий маршрут
      expect(response.statusCode).toBe(404); //? Ожидаем, что сервер вернёт статус 404
      expect(response.body.message).toBe('Not found'); //? Убеждаемся, что тело ответа содержит сообщение "Not found"
    });
  });

  //* Тесты для маршрута /api/auth/signIn (авторизация пользователей с помощью POST)
  describe('POST /api/auth/signIn', () => {
    //? Тест, когда пользователь вводит корректные данные для входа
    it('should authenticate user with valid credentials', async () => {
      const payload = {
        email: 'Winona.Moore@hotmail.com', //? Корректный email пользователя
        password: 'Qwerty123@', //? Корректный пароль пользователя
      };

      const response = await request(app)
        .post('/api/auth/signIn') //? Отправляем POST-запрос на маршрут авторизации
        .send(payload); //? Передаём объект с данными в запрос

      expect(response.body.statusCode).toBe(200); //? Ожидаем успешный статус-код 200 в теле ответа
      expect(response.body).toHaveProperty('message', 'Вы успешно вошли.'); //? Проверяем текст сообщения
      expect(response.body.data.user).toHaveProperty('id'); //? Проверяем, что в ответе есть идентификатор пользователя
    });

    //* Тест, когда пользователь вводит некорректные данные
    it('should reject user with invalid credentials', async () => {
      const payload = {
        email: 'wrong-user@example.com', //? Неверный email, не зарегистрированный в базе данных
        password: 'WrongPassword456', //? Неверный пароль
      };

      const response = await request(app)
        .post('/api/auth/signIn') //? Отправляем POST-запрос на маршрут авторизации
        .send(payload); //? Передаём объект с данными в запрос

      expect(response.statusCode).toBe(404); //? Ожидаем, что статус-код будет 404, так как пользователь не найден
      expect(response.body.message).toBe(
        'Пользователь с таким email не найден.' //? Проверяем, что вернулось правильное сообщение об ошибке
      );
    });
  });
});
