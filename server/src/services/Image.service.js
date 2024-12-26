// Импортируем модель `Image` из базы данных.
// Эта модель используется для взаимодействия с таблицей изображений.
const { Image } = require('../db/models');

// Создаем класс `ImageService` для работы с изображениями.
// Все методы в этом классе статические, поэтому их можно использовать без создания экземпляра класса.
class ImageService {
  /**
   * Метод для создания нескольких записей изображений в базе данных одновременно.
   * @param {Array} images - Массив объектов, где каждый объект представляет данные для создания изображения.
   * @returns {Promise<Array>} Возвращает массив созданных записей.
   */
  static async createImages(images) {
    // Используем метод `bulkCreate` из Sequelize, который позволяет массово добавлять записи.
    // Опция `validate: true` гарантирует, что все записи будут проверены перед добавлением.
    return await Image.bulkCreate(images, { validate: true });
  }

  /**
   * Метод для удаления изображения по его ID.
   * @param {number} imageId - Уникальный идентификатор изображения, которое нужно удалить.
   * @returns {Promise<void>} Ничего не возвращает.
   */
  static async deleteById(imageId) {
    // Используем метод `findByPk`, чтобы найти изображение по его первичному ключу (id).
    const image = await Image.findByPk(imageId);

    // Если изображение существует, вызываем метод `destroy` для его удаления.
    if (image) {
      await image.destroy();
    }
  }

  /**
   * Метод для удаления изображения по его URL (src).
   * @param {string} imageSrc - URL (или путь) изображения, которое нужно удалить.
   * @returns {Promise<void>} Ничего не возвращает.
   */
  static async deleteBySrc(imageSrc) {
    // Используем метод `findOne` для поиска записи, где поле `src` соответствует переданному значению.
    const image = await Image.findOne({ where: { src: imageSrc } });

    // Если изображение найдено, удаляем его, вызвав `destroy`.
    if (image) {
      await image.destroy();
    }
  }

  /**
   * Метод для получения всех изображений, связанных с конкретным элементом списка желаний.
   * @param {number} wishlistItemId - Уникальный идентификатор элемента вишлиста.
   * @returns {Promise<Array>} Возвращает массив изображений с их `id` и `src`.
   */
  static async getByWishlistItemId(wishlistItemId) {
    // Используем метод `findAll` для получения всех записей, где поле `wishlistItemId` совпадает с переданным значением.
    // Поле `attributes` ограничивает выборку, чтобы возвращать только `id` и `src` (без лишней информации).
    return await Image.findAll({
      where: { wishlistItemId },
      attributes: ['id', 'src'],
    });
  }
}

// Экспортируем класс `ImageService`, чтобы его методы могли быть использованы в других модулях (например, в контроллерах).
module.exports = ImageService;
