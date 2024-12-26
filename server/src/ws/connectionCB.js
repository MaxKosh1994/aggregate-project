//* Flux — это архитектурный паттерн, разработанный Facebook для построения клиентских веб-приложений с однонаправленной передачей данных. Flux используется для управления состоянием приложения и потоком данных, что помогает лучше структурировать код и упростить его сопровождение.

//? 1. Actions (действия):
//? 2. Dispatcher (диспетчер):
//? 3. Stores (сторы):
//? 4. Views (представления):

//* #### Поток данных в Flux:

//? 1. Создание действия: Пользователь инициирует действие, например, добавление новой задачи в список.
//? 2. Отправка действия диспетчеру: Диспетчер получает действие и передает его всем зарегистрированным сторам.
//? 3. Обновление сторов: Каждый стор, получив действие, может обновить своё состояние на основе типа действия.
//? 4. Обновление представлений: После обновления состояния стор уведомляет представления, которые перерисовываются с новыми данными.

//? Создаем некий store (хранилище) для хранения подключений WebSocket и соответствующих пользователях
const map = new Map();

//* Функция обратного вызова для управления соединениями WebSocket
const connectionCb = (socket, request, userFromJWT) => {
  //? Добавляем в store текущее соединение и информацию о пользователе
  map.set(userFromJWT.id, { ws: socket, user: userFromJWT });

  //* Отправляем обновленный список пользователей всем подключенным клиентам
  map.forEach(({ ws }) => {
    ws.send(
      JSON.stringify({
        type: 'SET_USERS_FROM_SERVER',
        payload: [...map.values()].map(({ user }) => user),
      })
    );
  });

  //! Обработка ошибок на текущем сокете
  socket.on('error', (err) => {
    console.log(err);
  });

  socket.on('close', () => {
    map.delete(userFromJWT.id); //! Удаляем пользователя из карты при закрытии сокета

    //* Отправляем обновленный список пользователей всем оставшимся клиентам
    map.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: 'SET_USERS_FROM_SERVER',
          payload: [...map.values()].map(({ user }) => user),
        })
      );
    });
  });
};

module.exports = connectionCb;
