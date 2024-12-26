class UserValidator {
  /**
   * Метод для валидации данных пользователя при регистрации.
   * @param {object} data - Объект данных пользователя, который необходимо проверить.
   * @param {string} data.firstName - Имя пользователя (обязательное поле).
   * @param {string} data.lastName - Фамилия пользователя (обязательное поле).
   * @param {string} data.email - Email пользователя (обязательное поле).
   * @param {string} data.password - Пароль пользователя (обязательное поле, должно соответствовать требованиям).
   * @returns {object} - Объект, содержащий результат валидации.
   * @returns {boolean} isValid - Флаг, указывающий на валидность данных.
   * @returns {string|null} error - Сообщение об ошибке валидации, если имеется, иначе null.
   */
  static validateSignUp(data) {
    const { firstName, lastName, email, password } = data; // Используем деструктуризацию для удобного извлечения данных из объекта.

    //! Проверка обязательного поля firstName, которое должно быть строкой и не может быть пустым.
    if (
      !firstName ||
      typeof firstName !== 'string' ||
      firstName.trim() === ''
    ) {
      return {
        isValid: false,
        error: 'Имя - обязательное поле для регистрации.', // Если firstName некорректно, возвращаем ошибку.
      };
    }

    //! Проверка обязательного поля lastName, аналогично проверке firstName.
    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
      return {
        isValid: false,
        error: 'Фамилия - обязательное поле для регистрации.',
      };
    }

    //! Проверка корректности email.
    if (
      !email ||
      typeof email !== 'string' ||
      email.trim() === '' ||
      !this.validateEmail(email) // Используем вспомогательный метод validateEmail.
    ) {
      return {
        isValid: false,
        error: 'Email обязателен и должен быть валидным.',
      };
    }

    //! Проверка корректности пароля.
    if (
      !password ||
      typeof password !== 'string' ||
      password.trim() === '' ||
      !this.validatePassword(password) // Используем вспомогательный метод validatePassword.
    ) {
      return {
        isValid: false,
        error:
          'Пароль обязателен, должен быть непустой строкой, содержать не менее 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один специальный символ.',
      };
    }

    //* Если все поля валидны, возвращаем успешный результат проверки.
    return {
      isValid: true,
      error: null,
    };
  }

  /**
   * Метод для валидации данных для входа в систему.
   * @param {object} data - Объект данных для входа.
   * @param {string} data.email - Email пользователя.
   * @param {string} data.password - Пароль пользователя.
   * @returns {object} - Объект, содержащий результат валидации.
   * @returns {boolean} isValid - Флаг валидности данных.
   * @returns {string|null} error - Сообщение об ошибке при некорректных данных.
   */
  static validateSignIn(data) {
    const { email, password } = data; // Деструктурируем объект для удобства работы с полями.

    //! Проверяем валидность email аналогичным образом, как в методе регистрации.
    if (
      !email ||
      typeof email !== 'string' ||
      email.trim() === '' ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: 'Email обязателен и должен быть валидным.',
      };
    }

    //! Проверяем валидность пароля, который не должен быть пустым.
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return {
        isValid: false,
        error: 'Пароль не должен быть пустой строкой',
      };
    }

    //* Если оба поля валидны, возвращаем успешный результат.
    return {
      isValid: true,
      error: null,
    };
  }

  /**
   * Метод для проверки корректности email (форматирование).
   * @param {string} email - Email для проверки.
   * @returns {boolean} - Возвращает true, если email валиден, иначе false.
   */
  static validateEmail(email) {
    // Регулярное выражение для проверки соответствия email стандартным правилам.
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Применяем регулярное выражение для проверки email.
    return emailPattern.test(email);
  }

  /**
   * Метод для проверки безопасности пароля.
   * @param {string} password - Пароль для проверки.
   * @returns {boolean} - Возвращает true, если пароль удовлетворяет требованиям, иначе false.
   */
  static validatePassword(password) {
    // Определяем требования к паролю через несколько регулярных выражений.
    const hasUpperCase = /[A-Z]/; // Проверка наличия хотя бы одной заглавной буквы.
    const hasLowerCase = /[a-z]/; // Проверка наличия хотя бы одной строчной буквы.
    const hasNumbers = /\d/; // Проверка наличия хотя бы одной цифры.
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/; // Проверка наличия хотя бы одного спецсимвола.
    const isValidLength = password.length >= 8; // Проверка, что длина пароля не менее 8 символов.

    // Если хотя бы одно из условий не выполняется, возвращаем false.
    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false;
    }

    // Возвращаем true, если все условия выполнены.
    return true;
  }
}

module.exports = UserValidator; // Экспортируем наш класс, чтобы его можно было использовать в других модулях.
