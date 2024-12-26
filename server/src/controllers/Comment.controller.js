const CommentService = require('../services/Comment.service');
const isValidId = require('../utils/validation/isValidId');
const CommentValidator = require('../utils/validation/Comment.validator');
const formatResponse = require('../utils/formatResponse');

class CommentController {
  //-- Метод `getById(req, res)` Отвечает за поиск комментария по переданному ID.
  static async getById(req, res) {
    const { id } = req.params; // Получаем ID из параметров запроса.

    //! Проверка на валидность ID (обработка негативного кейса).
    if (!isValidId(id)) {
      // Проверяем, что ID является положительным целым числом.
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Невалидный ID',
            null,
            'ID должен быть положительным целым числом.'
          )
        );
    }

    try {
      //? Делаем запрос через CommentService для получения комментария по ID.
      const comment = await CommentService.getById(+id);

      //! Если комментарий не найден, информируем об этом клиента.
      if (!comment) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Комментарий с id ${id} не найден`,
              null,
              `Комментарий с id ${id} не найден`
            )
          );
      }

      //* Успешный кейс: возвращаем комментарий.
      res
        .status(200)
        .json(
          formatResponse(200, `Комментарий с id ${id} успешно получен`, comment)
        );
    } catch ({ message }) {
      // Обработка ошибок сервера.
      console.error(message); // Логируем ошибку для разработчиков.
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  //-- Метод `create(req, res)` Позволяет создавать новый комментарий.
  static async create(req, res) {
    const { text, wishlistItemId } = req.body; // Получаем данные комментария из тела запроса.

    //* Получаем юзера из res.locals (ранее сохранённого в middleware).
    const { user } = res.locals;

    //! Проверяем валидность ID связанного объекта (обработка негативного кейса).
    if (!isValidId(wishlistItemId)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'ID записи из списка желаний должен быть положительным целым числом.',
            null,
            'ID записи из списка желаний должен быть положительным целым числом.'
          )
        );
    }

    //! Проверка текста комментария с использованием валидатора.
    const { isValid, error } = CommentValidator.validate(text);
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {
      //? Создаём новый комментарий через CommentService.
      const newComment = await CommentService.create({
        text,
        userId: user.id, // ID текущего пользователя.
        wishlistItemId, // ID записи, к которой относится комментарий.
      });

      //! Если комментарий не удалось создать, возвращаем ошибку.
      if (!newComment) {
        return res
          .status(400)
          .json(formatResponse(400, `Не удалось создать новый комментарий`));
      }

      //* Успешный кейс: возвращаем статус и данные созданного комментария.
      res
        .status(201)
        .json(formatResponse(201, 'Комментарий успешно создан', newComment));
    } catch ({ message }) {
      // Логирование и обработка ошибок сервера.
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  //--  Метод `update(req, res)` Позволяет обновить существующий комментарий.
  static async update(req, res) {
    const { id } = req.params; // ID комментария.
    const { text, wishlistItemId } = req.body; // Данные, которые нужно обновить.
    const { user } = res.locals; // Информация о текущем пользователе.

    //! Проверки на валидность ID комментария и связанной записи.
    if (!isValidId(id) || !isValidId(wishlistItemId)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'ID должен быть положительным целым числом.',
            null
          )
        );
    }

    //! Проверка корректности текста с помощью валидатора.
    const { isValid, error } = CommentValidator.validate(text);
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {
      //* Проверяем, существует ли комментарий.
      const commentToUpdate = await CommentService.getById(+id);

      if (!commentToUpdate) {
        return res
          .status(404)
          .json(formatResponse(404, `Комментарий с ID ${id} не найден.`, null));
      }

      //! Проверяем права на изменение комментария.
      if (commentToUpdate.userId !== user.id) {
        return res
          .status(403)
          .json(formatResponse(403, `Нет прав на изменение комментария.`));
      }

      //? Выполняем обновление комментария через сервис.
      const updatedComment = await CommentService.update(+id, {
        text,
      });

      //* Успешный кейс.
      res
        .status(200)
        .json(
          formatResponse(
            200,
            `Комментарий с ID ${id} успешно изменён.`,
            updatedComment
          )
        );
    } catch ({ message }) {
      // Логирование ошибок.
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
  //-- Метод `delete(req, res)` Удаляет указанный комментарий.
  static async delete(req, res) {
    const { id } = req.params; // Получаем ID комментария.
    const { user } = res.locals; // Получаем текущего пользователя.

    //! Проверка на валидность ID.
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(formatResponse(400, 'Невалидный ID комментария'));
    }

    try {
      //* Проверяем, существует ли комментарий.
      const commentToDelete = await CommentService.getById(+id);

      //! Проверяем права на удаление комментария.
      if (commentToDelete.userId !== user.id) {
        return res
          .status(403)
          .json(
            formatResponse(
              403,
              `Недостаточно прав для удаления комментария с ID ${id}`
            )
          );
      }

      //? Удаляем через сервис.
      const deletedComment = await CommentService.delete(+id);

      //! Если комментарий не найден.
      if (!deletedComment) {
        return res
          .status(404)
          .json(formatResponse(404, `Комментарий с ID ${id} не найден.`));
      }

      //* Успешное удаление.
      res
        .status(200)
        .json(formatResponse(200, `Комментарий с ID ${id} успешно удалён.`));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
}

module.exports = CommentController;
