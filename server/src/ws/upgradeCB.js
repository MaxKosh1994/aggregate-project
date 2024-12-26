const cookieParser = require('cookie-parser'); //? Подключаем библиотеку для парсинга cookies из входящих запросов
const { WebSocketServer } = require('ws'); //? Подключаем библиотеку для работы с WebSocket
const jwt = require('jsonwebtoken'); //? Подключаем библиотеку для работы с JWT (JSON Web Tokens)

require('dotenv').config(); //? Загружаем переменные окружения из файла .env

//* Создаем новый экземпляр WebSocket-сервера
//?   - clientTracking: false отключает отслеживание клиентов
//?   - noServer: true позволяет использовать сервер, который управляется вручную
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

//? Функция обратного вызова, которая будет использоваться для обновления протокола
const upgradeCb = (request, socket, head) => {
  socket.on('error', (err) => console.log(err)); //! Обработка ошибок на сокете

  //! Используем cookieParser для обработки cookies в запросе
  cookieParser()(request, {}, () => {
    try {
      const { refreshToken } = request.cookies; //? Извлекаем токен refresh из cookies

      const { user } = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN
      ); //? Верифицируем токен с использованием секретного ключа, если токен действителен, извлекаем объект пользователя (user)

      //! Убираем обработчик ошибок, теперь он не нужен, поскольку токен действителен
      socket.removeListener('error', () => {});

      //* Обрабатываем обновление WebSocket-соединения
      wss.handleUpgrade(request, socket, head, (ws) => {
        //? Эмитируем событие 'connection' и передаем подключению (ws), запрос (request) и пользователя (user)
        wss.emit('connection', ws, request, user);
      });
    } catch (error) {
      //! В случае ошибки (например, если токен недействителен), логируем ошибку
      console.log('ERRRRR:', error);

      //! Отправляем ответ 401 Unauthorized клиенту и закрываем сокет
      socket.write('HTTP/1.1 401 Unathorized\r\n\r\n');
      socket.destroy();
    }
  });
};

module.exports = { upgradeCb, wss };
