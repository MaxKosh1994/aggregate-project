// Импортируем модель `Link` из базы данных, чтобы работать с таблицей ссылок.
const { Link } = require('../db/models');

// Объявляем класс `LinkService`, который содержит методы для управления ссылками.
// Методы этого класса позволяют добавлять, удалять и в дальнейшем можно расширять функционал для работы с ссылками.
class LinkService {
  /**
   * Метод для создания нескольких ссылок, связанных с конкретным элементом вишлиста.
   * @param {Array} links - Массив строк, каждая строка представляет ссылку (URL).
   * @param {number} wishlistItemId - Идентификатор элемента вишлиста, с которым должны быть связаны ссылки.
   * @returns {Promise<Array>} Возвращает массив новых записей ссылок, созданных в базе данных.
   */
  static async createLinks(links, wishlistItemId) {
    // Преобразуем массив строк (ссылок) в массив объектов, каждый из которых содержит поле `src` (URL ссылки)
    // и поле `wishlistItemId` для указания связи с конкретным элементом вишлиста.
    const linkObjects = links.map((src) => ({
      src,
      wishlistItemId,
    }));

    // Используем метод `bulkCreate` для массового создания записей в таблице `Link`.
    // Опция `validate: true` гарантирует, что записи будут проверены на соответствие модели перед добавлением.
    const newLinks = await Link.bulkCreate(linkObjects, { validate: true });

    // Возвращаем массив созданных ссылок.
    return newLinks;
  }

  /**
   * Метод для удаления ссылок по их идентификаторам (ID).
   * @param {Array} linkIds - Массив идентификаторов ссылок, которые нужно удалить.
   * @returns {Promise<number>} Возвращает количество удаленных ссылок.
   */
  static async deleteLinks(linkIds) {
    // Используем метод `destroy` для массового удаления записей из таблицы `Link`.
    // Указываем условие `where`, чтобы удалить записи, идентификатор которых (`id`) совпадает с любым из массива `linkIds`.
    return await Link.destroy({
      where: {
        id: linkIds, // Указываем условие для удаления: только записи с `id`, входящими в массив `linkIds`.
      },
    });
  }
}

// Экспортируем класс `LinkService`, чтобы его методы могли быть использованы в других модулях (например, в роутерах или контроллерах).
module.exports = LinkService;
