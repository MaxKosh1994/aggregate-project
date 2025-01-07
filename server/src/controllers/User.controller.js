const bcrypt = require('bcrypt');
const axios = require('axios');
const UserService = require('../services/User.service');
const formatResponse = require('../utils/formatResponse');
const UserValidator = require('../utils/validation/User.validator');
const cookiesConfig = require('../config/cookiesConfig');
const generateTokens = require('../utils/generateTokens');

class UserController {
  //-- Метод для проверки email на существование.
  static async checkEmailExistence(req, res) {
    const { email } = req.body; //? Извлекаем значение email из тела запроса.

    // Проверяем, указан ли email, и проходит ли он валидацию с помощью UserValidator.
    if (!email || !UserValidator.validateEmail(email)) {
      // Если email не был передан или его формат некорректен:
      return res
        .status(400) // Возвращаем HTTP-статус 400 (Ошибка клиента).
        .json(
          formatResponse(
            400, // Статус ответа.
            'Email обязателен для проверки и должен быть корректным.', // Сообщение для клиента.
            null, // Нет данных (поскольку это ошибка).
            'Email обязателен для проверки и должен быть корректным.' // Техническая информация о причине ошибки.
          )
        );
    }

    try {
      // Получаем API-ключ для сервиса верификации email из переменных окружения.
      const apiKey = process.env.CHECK_EMAIL_API_KEY;

      // Отправляем GET-запрос к API сервиса Hunter.io, передавая email и apiKey в URL.
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`
      );

      // Извлекаем данные из ответа сервиса.
      const { data } = response;

      console.log(data);

      // Проверяем результат верификации email, выполняя проверку наличия данных и их статуса.
      if (data.data && data.data.result === 'undeliverable') {
        // Если сервис сообщает, что email недоставляемый, возвращаем ответ со статусом 200 (успешный запрос) и false в `exists`.
        return res.status(200).json(
          formatResponse(
            200, // Статус ответа, т. к. даже ошибка "email не существует" — это валидная операция.
            'Email не существует', // Сообщение для клиента.
            { exists: false }, // Возвращаем данные, указывая, что email отсутствует.
            'Email не существует' // Техническая информация.
          )
        );
      }

      // Если email существует (result === 'deliverable'), возвращаем данные с `exists: true`.
      return res.status(200).json(
        formatResponse(
          200, // Статус ответа.
          'Email найден', // Сообщение для клиента.
          {
            exists:
              data.data.result === 'deliverable' ||
              data.data.result === 'risky', // Если результат "deliverable" или "risky", значит email существует.
          },
          'Email найден' // Техническая информация.
        )
      );
    } catch ({ message }) {
      // Обработка ошибок при работе метода:
      // Например, может быть проблема с API-токеном, сетью или самим сервисом Hunter.io.
      res
        .status(500) // Возвращаем статус 500: внутренняя ошибка сервера.
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  //-- Метод для обновления токенов доступа и обновления.
  static async refreshTokens(req, res) {
    try {
      //? Извлекаем информацию о пользователе из локальных переменных ответа
      const { user } = res.locals;

      //? Генерируем новые токены доступа и обновления для текущего пользователя
      const { accessToken, refreshToken } = generateTokens({ user });

      //? Отправляем клиенту ответ с новыми токенами и устанавливаем новый refresh токен в куки
      //* Устанавливаем статус ответа 200 (Успешно)
      //* Устанавливаем новую куку для refresh токена
      //* // Возвращаем информацию о пользователе и токен
      res.status(200).cookie('refreshToken', refreshToken, cookiesConfig).json(
        formatResponse(200, 'Токены успешно созданы.', {
          user,
          accessToken,
        })
      );
    } catch ({ message }) {
      //! Обрабатываем возможные ошибки, которые могут возникнуть в блоке try
      console.error(message);

      //! Отправляем ответ с ошибкой
      //! Устанавливаем статус 500 (Внутренняя ошибка сервера)
      //! Формируем ответ с сообщением об ошибке
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  //--Метод для регистрации нового пользователя.
  static async signUp(req, res) {
    //? Извлекаем email, имя пользователя и пароль из тела запроса.
    // В теле запроса клиент передаёт `email`, `password`, `firstName`, `lastName`.
    const { email, password, firstName, lastName } = req.body;

    //! Валидируем данные, используя валидатор.
    // Проверяем, существуют ли нужные поля и соответствуют ли данные правилам (например, формат email, длина пароля, обязательные поля: имя/фамилия).
    const { isValid, error } = UserValidator.validateSignUp({
      email,
      firstName,
      lastName,
      password,
    });

    //! Если данные не прошли валидацию, отправляем клиенту сообщение об ошибке 400.
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    //* Приводим email к нижнему регистру.
    // Это помогает избежать ошибок, связанных с регистром, например "USER@GMAIL.COM" и "user@gmail.com" будут одинаковыми.
    const normalizedEmail = email.toLowerCase();

    try {
      //? Проверяем, существует ли уже пользователь с таким email.
      // В базе данных ищем пользователя с тем же email через сервис (метод `UserService.getByEmail`).
      const userFound = await UserService.getByEmail(normalizedEmail);

      //! Если пользователь найден, отправляем сообщение об ошибке.
      // Регистрация дублирующего пользователя недопустима, поэтому возвращаем ошибку 400.
      if (userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с таким email уже существует',
              null,
              'Пользователь с таким email уже существует'
            )
          );
      }

      //! Проверка наличия файла.
      // Проверяем, загрузил ли пользователь аватар (доступ через `req.file`).
      if (!req.file) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Avatar file is required for user registration')
          );
      }

      //* Хэшируем пароль перед сохранением.
      // Мы не можем хранить пароли в открытом виде. Метод `bcrypt.hash` превращает пароль в безопасный хэш с использованием алгоритма шифрования.
      const hashedPassword = await bcrypt.hash(password, 10);
      // "10" — это количество "раундов соли", задача которых - усложнить процесс расшифровки.

      // Формируем путь к расположению аватара на сервере.
      const avatarSrc = `avatars/${req.file.filename}`;

      //* Создаем нового пользователя в базе данных.
      // Передаём нормализованный email, зашифрованный пароль, имя, фамилию и путь к аватару.
      const newUser = await UserService.create({
        email: normalizedEmail,
        firstName,
        lastName,
        password: hashedPassword,
        avatarSrc,
      });

      //* Преобразуем объект нового пользователя в обычный объект.
      // Сохраняем объект пользователя в базу, но перед отправкой клиенту удаляем свойство `password` (из соображений безопасности).
      const plainUser = newUser.get({ plain: true });
      delete plainUser.password; //! Удаляем пароль перед отправкой клиенту.

      //* Отправляем ответ с успешным входом и данными пользователя, а также устанавливаем куки с refresh-токеном.
      // Генерируем два токена: accessToken и refreshToken.
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      // Устанавливаем refreshToken в куки.
      res
        .status(201) // HTTP статус 201, который обозначает успешное создание ресурса (пользователя в данном случае).
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(201, 'Вы успешно зарегистрированы.', {
            user: plainUser, // Данные пользователя (без пароля).
            accessToken, // Access токен, который клиент будет использовать для авторизации.
          })
        );
    } catch ({ message }) {
      // Обработка ошибок на уровне сервера.
      console.error(message); // Логируем сообщение об ошибке на стороне сервера.
      res
        .status(500) // Возвращаем статус 500 ("Внутренняя ошибка сервера").
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  //-- Метод для входа пользователя.
  static async signIn(req, res) {
    //? Извлекаем email и пароль из тела запроса.
    // В теле запроса клиент отправляет свои учетные данные: email и password.
    const { email, password } = req.body;

    //? Валидируем данные для входа.
    // Проверяем переданные данные (например, корректность email и что поля не пустые).
    const { isValid, error } = UserValidator.validateSignIn({
      email,
      password,
    });

    //! Если данные не прошли валидацию, отправляем сообщение об ошибке.
    // Если проверка на валидность (например, структуру email) не прошла, то возвращаем код 400 (Bad Request).
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    //* Приводим email к нижнему регистру.
    // Это делается, чтобы вход работал независимо от регистра символов в email (например, "USER@GMAIL.COM" = "user@gmail.com").
    const normalizedEmail = email.toLowerCase();

    try {
      //* Ищем пользователя в базе данных по email.
      // Обращаемся в базу данных, чтобы найти пользователя с введённым email.
      const user = await UserService.getByEmail(normalizedEmail);

      //! Если пользователь не найден, отправляем сообщение об ошибке.
      // Если в базе данных не найден пользователь c переданным email, возвращаем ошибку 404 (Not Found).
      if (!user) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              'Пользователь с таким email не найден.',
              null,
              'Пользователь с таким email не найден.'
            )
          );
      }

      //* Сравниваем введенный пароль с хэшированным паролем пользователя.
      // Метод `bcrypt.compare` позволяет проверить, соответствует ли введённый пароль уже хэшированному паролю, сохранённому в базе.
      const isPasswordValid = await bcrypt.compare(password, user.password);

      //! Если пароли не совпадают, отправляем сообщение об ошибке.
      // Если введённый пароль неверный, возвращаем ошибку 401 (Unauthorized).
      if (!isPasswordValid) {
        return res
          .status(401)
          .json(
            formatResponse(401, 'Неверный пароль.', null, 'Неверный пароль.')
          );
      }

      //* Преобразуем объект пользователя в обычный объект.
      // Преобразуем данные пользователя в формат "plain", чтобы исключить из ответа лишние поля (например, технические).
      const plainUser = user.get({ plain: true });

      //! Удаляем пароль перед отправкой клиенту.
      // В целях безопасности пароль не передаётся в ответе, даже в зашифрованном виде.
      delete plainUser.password;

      //* Отправляем ответ с успешным входом, данными пользователя и выставляем куку.
      // Если email и пароль валидны, генерируем два токена: access-токен и refresh-токен.
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      // Сохраняем refresh-токен в куки, чтобы использовать его для обновления access-токена без необходимости повторного входа.
      res
        .status(200) // HTTP-код 200 (OK) для успешного завершения операции.
        .cookie('refreshToken', refreshToken, cookiesConfig) // Устанавливаем refresh-токен в куки.
        .json(
          formatResponse(200, 'Вы успешно вошли.', {
            user: plainUser, // Передаём клиента информацию о пользователе без пароля.
            accessToken, // Отправляем access-токен в теле ответа для авторизации.
          })
        );
    } catch ({ message }) {
      // Ошибка, которая возникает непосредственно при выполнении кода (например, проблемы с базой данных или сервером).
      console.error(message); // Логируем сообщение об ошибке на сервере для отладки.
      res.status(500).json(
        formatResponse(500, 'Внутренняя ошибка сервера', null, message) // Возвращаем клиенту описание ошибки.
      );
    }
  }

  //-- Метод для выхода пользователя.
  static async signOut(req, res) {
    try {
      //* Чистим куку refreshToken и отправляем ответ об успешном выходе пользователя.
      // Метод `clearCookie` удаляет refresh-токен из куков на стороне клиента.
      // Это необходимо, чтобы токен не мог быть повторно использован для обновления сессии.
      res
        .clearCookie('refreshToken')
        .json(formatResponse(200, 'Вы успешно вышли.'));
      // После успешного удаления токена формируем ответ с статусом 200 и сообщением об успешном выходе.
    } catch ({ message }) {
      //! Если произошла ошибка на сервере, обрабатываем и логируем её.
      console.error(message); // Логируем подробности ошибки, чтобы обнаружить проблему.
      res
        .status(500) // Отправляем код ошибки 500 (Internal Server Error).
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
      // Сообщаем клиенту, что произошла ошибка, и возвращаем описание проблемы.
    }
  }

  //-- Метод поиска всех пользователей.
  static async getAll(req, res) {
    try {
      //* Получаем всех пользователей из базы данных.
      // Обращаемся к сервису `UserService`, который отвечает за работу с пользователями.
      const users = await UserService.getAll();
      // Метод `getAll` возвращает массив объектов с данными о пользователях.

      //! Если в базе нет пользователей, отправляем ответ с пустым массивом.
      if (users.length === 0) {
        // Если список пользователей пуст, это значит, что никого нет в системе.
        // Возвращается код 404 (Not Found) и сообщение об отсутствии пользователей.
        return res.status(404).json(
          formatResponse(
            404,
            'Пользователи не найдены в системе.', // Сообщение для клиента.
            [], // Пустой массив как ответ.
            'Пользователи не найдены в системе.' // Детали ошибки для внутреннего использования.
          )
        );
      }

      //* Если пользователи найдены, возвращаем их список с кодом 200.
      res
        .status(200) // HTTP-код успешного выполнения запроса.
        .json(formatResponse(200, 'success', users));
      // Отправляем список пользователей в ответе.
    } catch ({ message }) {
      //! Логируем ошибку и отправляем ошибку 500 при сбое на сервере.
      console.error(message); // Логируем проблему на сервере для отладки.
      res
        .status(500) // Возвращаем код 500 в случае ошибки.
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
      // Форматируем ответ для клиента с описанием ошибки.
    }
  }
}

module.exports = UserController;
