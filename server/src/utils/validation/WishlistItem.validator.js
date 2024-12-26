class WishlistItemValidator {
  /**
   * Основной метод для проверки валидности данных элемента списка пожеланий.
   * @param {object} data - Данные элемента, которые необходимо валидировать.
   * @param {string} data.title - Название элемента, обязательное поле.
   * @param {string} data.description - Описание элемента, обязательное поле.
   * @param {number} data.maxPrice - Максимальная цена, обязательное поле, должно быть положительным числом.
   * @param {number} data.minPrice - Минимальная цена, обязательное поле, должно быть положительным числом.
   * @param {Array<string>} data.links - Ссылки на элемент (например, магазины), обязательное поле, массив URL-строк.
   * @param {string} data.priority - Приоритет элемента, одно из установленных значений (например, "очень нужно").
   * @returns {object} - Объект, содержащий результат валидации.
   * @returns {boolean} isValid - Флаг валидности данных.
   * @returns {string|null} error - Сообщение об ошибке, если данные невалидны, иначе null.
   */
  static validate(data) {
    const { title, description, maxPrice, minPrice, links, priority } = data; // Деструктурируем переданный объект для удобства работы с полями.

    //! Проверка валидности поля title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      // Если title отсутствует, не является строкой или является пустым
      return {
        isValid: false,
        error: 'Название является обязательным и должно быть непустой строкой.', // Сообщаем о проблеме пользователю
      };
    }

    //! Проверка валидности поля description
    if (
      !description ||
      typeof description !== 'string' ||
      description.trim() === ''
    ) {
      // Если description отсутствует, не соответствует типу или пусто
      return {
        isValid: false,
        error: 'Описание является обязательным и должно быть непустой строкой.',
      };
    }

    //! Проверка валидности поля maxPrice
    if (!maxPrice || typeof maxPrice !== 'number' || maxPrice < 0) {
      return {
        isValid: false,
        error:
          'MaxPrice является обязательным полем и должен быть положительным числом.',
      };
    }

    //! Проверка валидности поля minPrice
    if (!minPrice || typeof minPrice !== 'number' || minPrice < 0) {
      return {
        isValid: false,
        error:
          'MinPrice является обязательным полем и должен быть положительным числом.',
      };
    }

    //! Проверка валидности поля links
    if (!Array.isArray(links) || links.length === 0) {
      // Если поле links не массив или пустой
      return {
        isValid: false,
        error:
          'Links является обязательным и должен содержать хотя бы один элемент в виде строки ссылки.',
      };
    }

    // Проходим по каждому элементу массива links, чтобы проверить его валидность.
    for (const link of links) {
      if (typeof link !== 'string' || !WishlistItemValidator.isURL(link)) {
        // Если элемент не строка или не валидный URL
        return {
          isValid: false,
          error:
            'Каждая ссылка в массиве ссылок должна быть строкой, содержащей действительно существующий URL.',
        };
      }
    }

    //! Проверка валидности поля priority
    const validPriorities = [
      'не особо нужно',
      'было бы славно',
      'очень нужно',
      'душу продать',
    ]; // Список допустимых значений для приоритета

    if (
      !priority || // Если поле отсутствует
      typeof priority !== 'string' || // Если это не строка
      !validPriorities.includes(priority) // Если значение не входит в список разрешенных опций
    ) {
      return {
        isValid: false,
        error: `Поле "priority" является обязательным и должно быть одним из следующих значений: ${validPriorities.join(
          ', '
        )}.`,
      };
    }

    //* Если все проверки успешно пройдены, возвращаем индикатор валидности.
    return {
      isValid: true,
      error: null,
    };
  }

  /**
   * Проверяет, является ли строка допустимой ссылкой (URL).
   * @param {string} str - Строка для проверки.
   * @returns {boolean} - true, если строка является допустимым URL, иначе false.
   */
  static isURL(str) {
    // Регулярное выражение для проверки URL. Оно учитывает как http, так и https протокол.
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w\d-./?=%&]*)?$/i;

    // Метод тестирует строку на соответствие регулярному выражению.
    return urlRegex.test(str); // Вернет true, если строка является URL.
  }
}

module.exports = WishlistItemValidator; // Экспортируем класс, чтобы его можно было использовать в других модулях.
