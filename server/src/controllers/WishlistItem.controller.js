const WishlistItemService = require('../services/WishlistItem.service');
const isValidId = require('../utils/validation/isValidId');
const WishlistItemValidator = require('../utils/validation/WishlistItem.validator');
const formatResponse = require('../utils/formatResponse');
const LinkService = require('../services/Link.service');
const ImageService = require('../services/Image.service');
const path = require('path');

class WishlistItemController {
  //-- Метод для создания нового элемента списка желаний
  static async create(req, res) {
    // Извлечение данных из тела запроса
    const {
      title, // название элемента
      description, // описание элемента
      maxPrice, // максимальная цена элемента
      minPrice, // минимальная цена элемента
      links, // ссылки, связанные с элементом
      wishlistId, // ID списка желаний, куда добавляется элемент
      priority, // приоритет элемента
    } = req.body;

    console.log('description++++++++++++=', description);

    //* Получение пользователя из res.locals
    // res.locals содержит данные, добавленные промежуточными обработчиками
    const { user } = res.locals;

    //! Валидация входных данных (обработка негативного кейса)
    const { isValid, error } = WishlistItemValidator.validate({
      title,
      description,
      maxPrice: Number(maxPrice),
      minPrice: Number(minPrice),
      links,
      priority,
    });

    // Проверяем либо валидность ID списка желаний, либо валидность данных в целом
    if (!isValid || !isValidId(wishlistId)) {
      return res.status(400).json(formatResponse(400, error, null, error)); // Ответ с 400 статусом и сообщением об ошибке
    }

    try {
      //? Логика работы с базой данных вынесена в сервис (WishlistItemService)

      // Создание нового элемента в списке желаний с переданными данными
      const newWishlistItem = await WishlistItemService.create({
        title,
        description,
        maxPrice: Number(maxPrice),
        minPrice: Number(minPrice),
        links,
        wishlistId: Number(wishlistId),
        authorId: user.id, // указание автора (текущего пользователя)
        priority,
      });

      //! Проверка: удалось ли создать новый элемент (обработка негативного кейса)
      if (!newWishlistItem) {
        return res
          .status(400)
          .json(formatResponse(400, `Не удалось создать новую запись.`));
      }

      // Сохранение ссылок, связанных с элементом
      await LinkService.createLinks(links, newWishlistItem.id);

      const files = req.files; // Получаем переданные файлы (например, изображения)

      //! Проверка наличия файлов (негативный кейс, если файлы не были переданы)
      if (!files || files.length === 0) {
        return res.status(400).json(
          formatResponse(
            400,
            'Image files is required for wishlist item creation' // Изображения обязательны для создания
          )
        );
      }

      // Форматирование пути сохранения файлов
      const images = files.map((file) => ({
        src: path.join('wishlistItem', file.filename), // путь к файлам
        wishlistItemId: newWishlistItem.id, // связь с элементом
      }));

      // Сохранение изображений через ImageService
      await ImageService.createImages(images);

      // Получение полной информации о только что созданном элементе
      const wishListItemToSend = await WishlistItemService.getById(
        newWishlistItem.id
      );

      //* Успех: отправка ответа с данными созданного элемента
      res
        .status(201)
        .json(
          formatResponse(201, 'Запись успешно создана', wishListItemToSend)
        );
    } catch ({ message }) {
      console.error(message); // Логирование ошибки
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message)); // Общий ответ на ошибку сервера
    }
  }

  //-- Метод для обновления элемента в списке желаний
  static async update(req, res) {
    // Извлекаем ID элемента из параметров запроса
    const { id } = req.params;

    // Извлекаем обновляемые свойства из тела запроса
    const {
      title, // новое название элемента
      description, // новое описание элемента
      maxPrice, // обновленная максимальная цена
      minPrice, // обновленная минимальная цена
      linksToAdd, // ссылки, которые нужно добавить к элементу
      linksToRemove, // ссылки, которые нужно удалить из элемента
      priority, // обновленный приоритет элемента
    } = req.body;

    // Извлекаем текущего пользователя из `res.locals`
    // Это может быть промежуточный обработчик аутентификации, который добавил данные пользователя
    const { user } = res.locals;

    //! Проверяем валидность переданного ID
    // Если ID невалиден, сразу возвращаем клиенту ошибку
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(formatResponse(400, 'Невалидные данные по ID.'));
    }

    // Проверяем валидность других данных с помощью валидатора
    const { isValid, error } = WishlistItemValidator.validate({
      title,
      description,
      maxPrice,
      minPrice,
      priority,
    });

    // Если данные некорректны, возвращаем ошибку клиенту
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {
      // Получаем элемент списка желаний из базы данных по его ID
      const wishlistItem = await WishlistItemService.getById(+id);

      //! Проверяем, существует ли элемент
      // Если элемент не найден, возвращаем 404 (не найдено)
      if (!wishlistItem) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Запись не найдена.`,
              null,
              'Запись не найдена.'
            )
          );
      }

      //! Проверяем, является ли текущий пользователь автором элемента
      // Если пользователь не автор, возвращаем ошибку 403 (нет прав доступа)
      if (wishlistItem.authorId !== user.id) {
        return res
          .status(403)
          .json(
            formatResponse(
              403,
              'У вас нет прав на изменение этой записи.',
              null,
              'У вас нет прав на изменение этой записи.'
            )
          );
      }

      //* Обновляем информацию об элементе в базе данных
      let updatedWishlistItem = await WishlistItemService.update(id, {
        title,
        description,
        maxPrice,
        minPrice,
        priority,
      });

      //! Работа с добавляемыми ссылками
      // Проверяем валидность новых ссылок для добавления
      const { isValid: isValidLinksToAdd, error: errorValidationLinksToAdd } =
        WishlistItemValidator.validate({
          links: linksToAdd,
        });

      // Если ссылки невалидны, возвращаем ошибку клиенту
      if (!isValidLinksToAdd) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              errorValidationLinksToAdd,
              null,
              errorValidationLinksToAdd
            )
          );
      }

      // Добавляем новые ссылки, передавая их в сервис
      await LinkService.createLinks(linksToAdd, id);

      //! Работа с удаляемыми ссылками
      // Проверяем ссылки, которые клиент хочет удалить
      const {
        isValid: isValidLinksToRemove,
        error: errorValidationLinksToRemove,
      } = WishlistItemValidator.validate({
        links: linksToRemove,
      });

      // Если ссылки для удаления невалидны, возвращаем ошибку клиенту
      if (!isValidLinksToRemove) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              errorValidationLinksToRemove,
              null,
              errorValidationLinksToRemove
            )
          );
      }

      // Удаляем ненужные ссылки с помощью сервиса
      await LinkService.deleteLinks(linksToRemove);

      //! Работа с файлами (изображениями)
      // Извлекаем переданные файлы из запроса
      const files = req.files;

      //! Проверка на наличие файлов
      // Если файлы не переданы, возвращаем ошибку клиенту
      if (!files || files.length === 0) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Картинки обязательны для изменения записи')
          );
      }

      // Получаем текущие (существующие) изображения элемента в базе данных
      const existingImages = await ImageService.getByWishlistItemId(id);

      // Извлекаем пути текущих изображений
      const existingImagePaths = existingImages.map((img) => img.src);

      // Создаем массив с новыми изображениями для сохранения в базу данных
      const newImages = files.map((file) => ({
        src: path.join('wishlistItem', file.path), // путь к новому изображению
        wishlistItemId: updatedWishlistItem.id, // связываем изображение с элементом
      }));

      // Сохраняем новые изображения в базе данных
      await ImageService.createImages(newImages);

      // Извлекаем пути новых изображений, которые только что были добавлены
      const receivedImagePaths = newImages.map((img) => img.src);

      //! Определяем, какие изображения нужно удалить
      // Удаляем те пути изображений, которых больше нет среди новых
      const imagesToDelete = existingImagePaths.filter(
        (path) => !receivedImagePaths.includes(path)
      );

      // Удаляем ненужные изображения из базы данных и хранилища
      for (const imgPath of imagesToDelete) {
        await ImageService.deleteBySrc(imgPath);
      }

      //* Финальный шаг: извлекаем обновленные данные элемента из базы данных
      updatedWishlistItem = await WishlistItemService.getById(id);

      //* Возвращаем успешный ответ клиенту с данными обновленного элемента
      res
        .status(200)
        .json(
          formatResponse(200, 'Запись успешно обновлена', updatedWishlistItem)
        );
    } catch ({ message }) {
      // Логируем ошибку и возвращаем клиенту общую ошибку сервера
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  //-- Метод для удаления элемента из базы данных
  static async delete(req, res) {
    // Извлекаем ID элемента из параметров запроса
    const { id } = req.params;

    // Получаем текущего пользователя из res.locals
    // (пользователь извлекается в промежуточном обработчике аутентификации)
    const { user } = res.locals;

    //! Проверка на валидность переданного ID
    // Если ID некорректен (например, не является числом), возвращаем ошибку 400 (Bad Request)
    if (!isValidId(id)) {
      return res.status(400).json(
        formatResponse(
          400, // HTTP статус-код
          'Невалидный ID записи.', // Сообщение об ошибке
          null, // Данные ответа (null в данном случае)
          'Невалидный ID записи.' // Уточнение причины ошибки
        )
      );
    }

    try {
      //* Попытка найти запись в базе данных по ID
      const wishlistItem = await WishlistItemService.getById(+id);

      //! Проверка, существует ли элемент в системе
      // Если элемент не найден, возвращаем ошибку 404 (Not Found)
      if (!wishlistItem) {
        return res.status(404).json(
          formatResponse(
            404, // HTTP статус код
            `Запись не найдена.`, // Сообщение об ошибке
            null, // Данные ответа (null)
            `Запись не найдена.` // Техническая информация о проблеме
          )
        );
      }

      //! Проверка прав пользователя на удаление
      // Проверяем, является ли текущий пользователь автором записи
      // Если нет, возвращается ошибка 403 (Forbidden)
      if (wishlistItem.authorId !== user.id) {
        return res.status(403).json(
          formatResponse(
            403, // HTTP статус код
            'У вас нет прав на удаление этой записи.', // Сообщение для пользователя
            null, // Данные ответа (null)
            'У вас нет прав на удаление этой записи.' // Техническое пояснение
          )
        );
      }

      //* Удаляем запись из базы данных
      // Если проверка прав и существования элемента успешно пройдены, вызываем метод удаления
      const deletedWishlistItem = await WishlistItemService.delete(+id);

      //* Возвращаем клиенту успешный ответ
      return res
        .status(200) // HTTP статус код 200 означает успешное выполнение запроса
        .json(
          formatResponse(
            200, // HTTP статус код
            'Запись успешно удалена.', // Сообщение для пользователя
            deletedWishlistItem // Данные удаленной записи
          )
        );
    } catch (error) {
      // Логируем ошибку для отладки на стороне сервера
      console.error(error.message);

      // Возвращаем пользователю ошибку 500 (Internal Server Error)
      res.status(500).json(
        formatResponse(
          500, // HTTP статус код
          'Внутренняя ошибка сервера', // Сообщение об ошибке
          null, // Данные ответа (null)
          error.message // Техническое описание ошибки
        )
      );
    }
  }
}

module.exports = WishlistItemController;
