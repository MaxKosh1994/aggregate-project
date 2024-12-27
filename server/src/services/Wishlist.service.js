// Импортируем необходимые константы и модели для работы с базой данных.
// `WISHLIST_INCLUDES` - это список связанных таблиц для объединения с моделью Wishlist.
// `Wishlist` - основная модель для управления вишлистами.
// `WishlistUser` - модель для связи пользователей с вишлистами (например, для управления участниками вишлиста).
const { Op } = require('sequelize');
const { WISHLIST_INCLUDES } = require('../consts/modelsFields');
const { Wishlist, WishlistUser } = require('../db/models');

// Определяем класс WishlistService, содержащий методы для работы с вишлистами.
// Данный класс реализует полный функционал для создания, изменения, удаления, работы с участниками и получения данных о вишлистах.
class WishlistService {
  //* Получить все вишлисты
  /**
   * Метод для получения всех созданных вишлистов.
   * @returns {Promise<Array>} - Возвращает массив всех вишлистов с их связанными данными.
   */
  static async getAll(userId) {
    // Используем метод findAll для получения всех записей из таблицы Wishlist.
    // Параметр include берёт связанные данные (указанные в WISHLIST_INCLUDES).
    return await Wishlist.findAll({
      where: {
        [Op.or]: [
          { ownerId: userId }, // Пользователь владелец
          {
            '$invitedUsers.id$': userId, // Пользователь приглашён
          },
        ],
      },
      include: WISHLIST_INCLUDES.map((include) => {
        // Если загружаются связанные элементы "wishlistItems", добавляем сортировку.
        if (include.as === 'wishlistItems') {
          return {
            ...include,
            separate: true, // Используем раздельную загрузку, чтобы корректно применить сортировку.
            order: [['maxPrice', 'DESC']], // Сортируем элементы вишлиста по убыванию максимальной цены.
          };
        }
        return include; // Возвращаем остальные связи без изменений.
      }),
    });
  }

  //* Найти вишлист по ID
  /**
   * Метод для поиска вишлиста по его уникальному идентификатору.
   * @param {number} id - Уникальный идентификатор вишлиста.
   * @returns {Promise<object|null>} - Возвращает объект вишлиста или null, если не найден.
   */
  static async getById(id) {
    // Ищем запись в таблице Wishlist с указанным id.
    // Включаем связанные данные, применяя такие же модификации инклудов, как и в методе getAll.
    return await Wishlist.findOne({
      where: { id },
      include: WISHLIST_INCLUDES.map((include) => {
        if (include.as === 'wishlistItems') {
          return {
            ...include,
            separate: true,
            order: [['maxPrice', 'DESC']],
          };
        }
        return include;
      }),
    });
  }

  //* Создать новый вишлист
  /**
   * Метод для создания нового вишлиста.
   * @param {object} data - Данные для создания вишлиста (например, название, картинка и т.д.).
   * @returns {Promise<object>} - Возвращает объект созданного вишлиста.
   */
  static async create(data) {
    // Создаём новый вишлист с использованием метода create.
    const newWishlist = await Wishlist.create(data);
    // После создания возвращаем полный объект уже с включёнными связанными данными.
    return await this.getById(newWishlist.id);
  }

  //* Обновить вишлист
  /**
   * Метод для обновления данных существующего вишлиста.
   * @param {number} id - Уникальный идентификатор вишлиста.
   * @param {object} data - Объект с данными для обновления (например, новое название).
   * @returns {Promise<object|null>} - Возвращает обновлённый объект вишлиста или null, если вишлист не найден.
   */
  static async update(id, data) {
    // Получаем вишлист по ID, чтобы убедиться, что он существует.
    const wishlist = await this.getById(id);

    if (wishlist) {
      // Обновляем только переданные поля, чтобы минимизировать ненужные изменения.
      if (data.title) {
        wishlist.title = data.title;
      }
      if (data.backgroundPictureSrc) {
        wishlist.backgroundPictureSrc = data.backgroundPictureSrc;
      }

      // Сохраняем изменения в базе данных.
      await wishlist.save();
    }

    // Возвращаем обновлённый объект или null, если вишлист не был найден.
    return wishlist;
  }

  //* Удалить вишлист по ID
  /**
   * Метод для удаления существующего вишлиста.
   * @param {number} id - Уникальный идентификатор вишлиста.
   * @returns {Promise<object|null>} - Возвращает удалённый объект вишлиста или null, если он не найден.
   */
  static async delete(id) {
    // Ищем вишлист по ID.
    const wishlist = await this.getById(id);
    if (wishlist) {
      // Удаляем найденный объект.
      await wishlist.destroy();
    }
    return wishlist; // Возвращаем удалённый объект или null.
  }

  //* Пригласить пользователя в вишлист
  /**
   * Метод для добавления пользователя в вишлист.
   * @param {object} data - Данные о приглашении (например, ID вишлиста и ID пользователя).
   * @returns {Promise<object>} - Возвращает обновлённый объект вишлиста с учётом нового участника.
   */
  static async inviteUser(data) {
    // Создаём новую запись в таблице WishlistUser, чтобы связать пользователя с вишлистом.
    const newInviteEntry = WishlistUser.create(data);

    if (newInviteEntry) {
      // Если запись создана успешно, возвращаем обновлённый объект вишлиста.
      return await this.getById(data.wishlistId);
    }
  }

  //* Выгнать пользователя из вишлиста
  /**
   * Метод для удаления пользователя из вишлиста.
   * @param {object} data - Объект с информацией о вишлисте и пользователе (wishlistId и userId).
   * @returns {Promise<object>} - Возвращает обновлённый объект вишлиста после удаления пользователя.
   */
  static async kickOutUser(data) {
    // Удаляем запись в таблице WishlistUser, которая связывает пользователя и вишлист.
    const deletedInviteEntry = WishlistUser.destroy({ where: data });

    if (deletedInviteEntry) {
      // Если удаление прошло успешно, возвращаем обновлённый объект вишлиста.
      return await this.getById(data.wishlistId);
    }
  }
}

// Экспортируем класс WishlistService для использования в других модулях (например, в контроллерах).
module.exports = WishlistService;
