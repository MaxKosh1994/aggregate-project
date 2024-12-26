// Импортируем необходимые константы и модель для работы с элементами вишлиста.
// `WISHLIST_ITEM_INCLUDES` - список связанных данных для включения (например, описание или другая информация об элементе).
// `WishlistItem` - модель, представляющая конкретный элемент вишлиста.
const { WISHLIST_ITEM_INCLUDES } = require('../consts/modelsFields');
const { WishlistItem } = require('../db/models');

// Определяем класс WishlistItemService, который содержит методы для работы с элементами вишлиста.
// Этот класс предоставляет функционал для управления отдельными элементами вишлиста:
// их создания, получения, обновления и удаления.
class WishlistItemService {
  //* Найти запись из вишлиста по ID
  /**
   * Метод для поиска элемента вишлиста по его уникальному идентификатору.
   * @param {number} id - Уникальный идентификатор элемента вишлиста.
   * @returns {Promise<object|null>} - Возвращает объект элемента вишлиста или null, если не найден.
   */
  static async getById(id) {
    // Используем метод `findOne` для поиска записи элемента по его ID.
    // Также включаем связанные данные, используемые в `WISHLIST_ITEM_INCLUDES`.
    return await WishlistItem.findOne({
      where: { id },
      include: WISHLIST_ITEM_INCLUDES,
    });
  }

  //* Создать новый элемент вишлиста
  /**
   * Метод для создания нового элемента вишлиста.
   * @param {object} data - Объект с данными для создания элемента (например, название, цена, приоритет и т.д.).
   * @returns {Promise<object>} - Возвращает объект созданного элемента вишлиста.
   */
  static async create(data) {
    // Создаём новую запись в таблице WishlistItem с переданными данными.
    const newWishlistItem = await WishlistItem.create(data);
    // Получаем и возвращаем полную информацию о созданном элементе (с включёнными данными).
    return await this.getById(newWishlistItem.id);
  }

  //* Обновить элемент вишлиста по ID
  /**
   * Метод для обновления информации об элементе вишлиста.
   * @param {number} id - Уникальный идентификатор элемента вишлиста.
   * @param {object} data - Объект с данными для обновления (например, новое название, новая цена и т.д.).
   * @returns {Promise<object|null>} - Возвращает обновлённый объект элемента или null, если элемент не найден.
   */
  static async update(id, data) {
    // Ищем элемент по указанному ID.
    const wishlistItem = await this.getById(id);

    if (wishlistItem) {
      // Проверяем наличие каждого из переданных данных и применяем их только в случае валидности.
      if (data.title) {
        wishlistItem.title = data.title; // Обновляем название элемента.
      }
      if (data.description) {
        wishlistItem.description = data.description; // Обновляем описание элемента.
      }
      if (data.maxPrice) {
        wishlistItem.maxPrice = data.maxPrice; // Обновляем максимальную цену.
      }
      if (data.minPrice) {
        wishlistItem.minPrice = data.minPrice; // Обновляем минимальную цену.
      }
      if (data.priority) {
        wishlistItem.priority = data.priority; // Обновляем приоритет элемента.
      }

      // Сохраняем изменения в базе данных.
      await wishlistItem.save();
    }

    // Возвращаем обновлённый элемент или null, если он не был найден.
    return wishlistItem;
  }

  //* Удалить элемент вишлиста по ID
  /**
   * Метод для удаления элемента вишлиста.
   * @param {number} id - Уникальный идентификатор элемента вишлиста.
   * @returns {Promise<object|null>} - Возвращает удалённый объект элемента или null, если элемент не найден.
   */
  static async delete(id) {
    // Ищем элемент по указанному ID.
    const wishlistItem = await this.getById(id);

    if (wishlistItem) {
      // Если элемент найден, удаляем его из базы данных.
      await wishlistItem.destroy();
    }

    // Возвращаем удалённый элемент или null, если его не существовало.
    return wishlistItem;
  }
}

// Экспортируем класс WishlistItemService, чтобы он мог быть использован в других модулях (например, в контроллерах или API).
module.exports = WishlistItemService;
