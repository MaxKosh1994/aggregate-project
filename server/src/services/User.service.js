// Импортируем необходимые константы и модель пользователя для работы с базой данных.
// `USER_FIELDS` - это список полей модели User, которые отображаются при поиске пользователей.
const { USER_FIELDS } = require('../consts/modelsFields');
const { User } = require('../db/models');

// Объявляем класс `UserService`, содержащий методы для управления данными пользователей.
// Данный класс реализует логику работы с моделью User, включая создание, поиск и получение всех пользователей.
class UserService {
  /**
   * Метод для создания нового пользователя в базе данных.
   * @param {object} data - Объект, содержащий данные пользователя (например: имя, email, пароль и т.д.).
   * @returns {Promise<object>} - Возвращает созданный объект пользователя.
   *
   * Пример использования:
   * const newUser = await UserService.create({ name: 'John', email: 'john@example.com' });
   */
  static async create(data) {
    // Используем метод `create` модели `User`, чтобы добавить новую запись в таблицу пользователей.
    // Sequelize автоматически добавит созданного пользователя в базу данных.
    return await User.create(data);
  }

  /**
   * Метод для получения пользователя по его email.
   * @param {string} email - Email пользователя, по которому нужно искать запись.
   * @returns {Promise<object|null>} - Возвращает объект пользователя, если найден, или `null`, если пользователя с таким email не существует.
   *
   * Пример использования:
   * const user = await UserService.getByEmail('john@example.com');
   */
  static async getByEmail(email) {
    // Используем метод `findOne` модели `User` для поиска первого пользователя,
    // чей email совпадает с переданным значением.
    return await User.findOne({ where: { email } });
  }

  /**
   * Метод для получения пользователя по его уникальному идентификатору (id).
   * @param {number} id - Уникальный идентификатор пользователя.
   * @returns {Promise<object|null>} - Возвращает объект пользователя, если найден, или `null`, если пользователя с таким id не существует.
   *
   * Пример использования:
   * const user = await UserService.getById(1);
   */
  static async getById(id) {
    // Используем метод `findByPk` модели `User` для поиска пользователя по первичному ключу (id).
    return await User.findByPk(id);
  }

  /**
   * Метод для получения всех пользователей из базы данных.
   * @returns {Promise<Array<object>>} - Возвращает массив объектов пользователей.
   *
   * Пример использования:
   * const users = await UserService.getAll();
   */
  static async getAll() {
    // Используем метод `findAll` модели `User`, чтобы получить всех пользователей.
    // Поле `attributes` ограничивает возвращаемые данные только теми, которые находятся в `USER_FIELDS`.
    // Это позволяет не передавать лишнюю информацию (например, пароли) из базы данных.
    return await User.findAll({ attributes: USER_FIELDS });
  }
}

// Экспортируем класс `UserService` для использования в других модулях приложения.
// Например, можно использовать его в контроллерах для работы с запросами.
module.exports = UserService;
