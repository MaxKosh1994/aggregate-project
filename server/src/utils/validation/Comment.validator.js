class CommentValidator {
  /**
   * Метод для проверки валидности текста комментария (text).
   * @param {string} text - Текст комментария, переданный для проверки.
   * @returns {object} - Объект, содержащий результат валидации.
   * @returns {boolean} isValid - Флаг валидности текста (true - текст валиден, false - не валиден).
   * @returns {string|null} error - Сообщение об ошибке при некорректности текста или значение null, если ошибок нет.
   */
  static validate(text) {
    //! Проверка валидности поля text
    if (!text || typeof text !== 'string' || text.trim() === '') {
      /**
       * Проверка состоит из трех этапов:
       * 1. `!text` — Убеждаемся, что текст комментария не является пустым, null или undefined.
       * 2. `typeof text !== 'string'` — Проверяем, что переданный текст является строкой.
       * 3. `text.trim() === ''` — Убеждаемся, что строка не является пустой после удаления лишних пробелов.
       */
      return {
        isValid: false, // Устанавливаем флаг, что текст не валиден.
        error: 'Текст комментария не должен быть пустой строкой.', // Сообщаем, что текст обязателен.
      };
    }

    //* Если все проверки пройдены
    return {
      isValid: true, // Переданный текст валиден.
      error: null, // Нет ошибок, поэтому возвращаем null для error.
    };
  }
}

module.exports = CommentValidator; // Экспортируем класс для использования в других частях приложения.