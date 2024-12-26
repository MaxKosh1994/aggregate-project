// Импортируем модуль multer — это библиотека для обработки загружаемых файлов в Node.js.
// Она используется для загрузки файлов на сервер (например, изображений).
const multer = require('multer');

// Подключаем встроенный модуль path из Node.js для работы с путями к файлам (например, объединения директорий).
const path = require('path');

/**
 * Функция для определения пути, куда будет загружен файл.
 * Путь выбирается на основе URL-адреса (baseUrl) запроса.
 * @param {Object} req - Объект запроса (request), из него извлекается `baseUrl` для проверки маршрута.
 * @returns {string} - Абсолютный путь, куда должен быть сохранён файл.
 */
const getUploadPath = (req) => {
  // Если URL включает 'wishlists', определяем директорию для файлов фона корзины желаний (wishlists).
  if (req.baseUrl.includes('wishlists')) {
    return path.join(__dirname, '../public/images/wishlistsBackgrounds');
  }

  // Если URL включает 'wishlistItem', указываем директорию для файлов товаров корзины желаний.
  if (req.baseUrl.includes('wishlistItem')) {
    return path.join(__dirname, '../public/images/wishlistItem');
  }

  // Если URL включает 'auth', загружаемый файл будет помещён в папку с аватарками.
  if (req.baseUrl.includes('auth')) {
    return path.join(__dirname, '../public/images/avatars');
  }

  // Если ни один из условий не выполнен, по умолчанию файлы будут сохраняться в общей папке.
  return path.join(__dirname, '../public/images');
};

// Настройка хранилища для обработки файлов с использованием multer.
const storage = multer.diskStorage({
  /**
   * Определяет, в какую папку будет сохранён загружаемый файл.
   * @param {Object} req - Объект запроса.
   * @param {Object} file - Объект файла, который загружается (содержит информацию о файле).
   * @param {Function} cb - Callback-функция для передачи пути.
   */
  destination: (req, file, cb) => {
    const uploadPath = getUploadPath(req); // Вызываем функцию для получения пути к папке.
    cb(null, uploadPath); // Передаём путь в callback `null` (ошибок нет).
  },
  /**
   * Генерирует уникальное имя для файла перед сохранением.
   * @param {Object} req - Объект запроса.
   * @param {Object} file - Объект файла (информация о загружаемом файле).
   * @param {Function} cb - Callback-функция для передачи имени файла.
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Уникальная временная метка.
    // Формируем имя файла: поле формы (fieldname), уникальная часть и расширение (например, .jpg, .png).
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Фильтруем файлы по разрешённому типу (например, только изображения).
const fileFilter = (req, file, cb) => {
  // Указываем список разрешённых типов (MIME-типы изображений).
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  // Если тип файла не входит в список, возвращаем ошибку.
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Unsupported file type'), false); // Отклоняем файл.
  }
  cb(null, true); // Разрешаем загрузку файла.
};

// Конфигурируем multer с настройками: хранилище, фильтрация файлов и ограничение на размер файла.
const upload = multer({
  storage, // Указываем настроенное хранилище (storage).
  fileFilter, // Передаём фильтр для проверки типов файлов.
  limits: { fileSize: 1024 * 1024 }, // Устанавливаем ограничение на размер: 1 MB.
});

// Экспортируем объект upload, чтобы его использовать как middleware в маршрутах Express.
module.exports = upload;
