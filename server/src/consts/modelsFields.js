// Импортируем необходимые модели из базы данных.
// Эти модели представляют таблицы базы данных: User (пользователи), WishlistItem (элементы списков желаний),
// Link (ссылки на товары), Image (изображения товаров) и Comment (комментарии).
const { User, WishlistItem, Link, Image, Comment } = require('../db/models');

// Определяем, какие поля из модели User нужно включать в запросы и возвращать в ответ.
// Это позволяет ограничить количество данных, чтобы не передавать лишнюю информацию.
// Например: идентификатор пользователя, email, имя, фамилия и аватар.
const USER_FIELDS = ['id', 'email', 'firstName', 'lastName', 'avatarSrc'];

// Для моделей Link и Image задаём поля, которые должны возвращаться.
// В данном случае это только `src` - ссылка на файл (например, изображение или ссылка на сайт).
const LINK_IMAGE_FIELDS = ['src'];

// Указываем, какие поля нужно выбирать для модели Comment.
// Здесь только текст комментария.
const COMMENT_FIELDS = ['text'];

// Определяем поля, которые будут включены для модели WishlistItem (элемент списка желаний).
// Это основные свойства элемента: идентификатор, заголовок, описание, максимальная и минимальная цена,
// автор элемента, а также приоритет элемента.
const WISHLIST_ITEM_FIELDS = [
  'id',
  'title',
  'description',
  'maxPrice',
  'minPrice',
  'authorId',
  'priority',
];

// Настраиваем связанные модели, которые будут включены в запрос, если обращаемся к элементу списка желаний (WishlistItem).
// Указываем, что нужно включать:
// - модель Link под alias'ом 'links', где берутся поля из LINK_IMAGE_FIELDS,
// - модель Image под alias'ом 'images', где берутся также только поля из LINK_IMAGE_FIELDS,
// - модель Comment под alias'ом 'comments', включая дополнительные данные о авторе комментария (модель User).
const WISHLIST_ITEM_INCLUDES = [
  {
    model: Link,
    as: 'links',
    attributes: LINK_IMAGE_FIELDS, // Возвращаем только поле `src`,
  },
  {
    model: Image,
    as: 'images',
    attributes: LINK_IMAGE_FIELDS, // Возвращаем только поле `src`,
  },
  {
    model: Comment,
    as: 'comments',
    attributes: COMMENT_FIELDS, // Указываем вернуть только текст комментария,
    include: {
      model: User, // Включаем дополнительную информацию о пользователе (авторе комментария),
      attributes: USER_FIELDS, // Берём только поля из USER_FIELDS.
      as: 'author', // Указываем alias, чтобы вернуться к автору комментария.
    },
  },
];

// Настраиваем связанные сущности, которые нужно включать при запросе данных о списках желаний (Wishlist).
// Указываем:
// - модель User как 'owner' (владелец списка),
// - модель User как 'invitedUsers' (приглашённые пользователи), с пустыми атрибутами в промежуточной таблице (через `through`),
// - модель WishlistItem как 'wishlistItems' (элементы списка желаний), включая связанные сущности, описанные ранее в WISHLIST_ITEM_INCLUDES.
const WISHLIST_INCLUDES = [
  {
    model: User,
    as: 'owner', // Владелец списка.
    attributes: USER_FIELDS, // Возвращаем только определённые поля владельца из USER_FIELDS,
  },
  {
    model: User,
    as: 'invitedUsers', // Список приглашённых пользователей.
    attributes: USER_FIELDS, // Ограничиваем возвращаемые поля для пользователей.
    through: {
      attributes: [], // Отключаем вывод данных из промежуточной таблицы.
    },
  },
  {
    model: WishlistItem,
    as: 'wishlistItems', // Элементы списка желаний.
    attributes: WISHLIST_ITEM_FIELDS, // Возвращаем только определённые поля элемента списка желаний.
    include: WISHLIST_ITEM_INCLUDES, // Также включаем все связанные сущности на уровне элемента (links, images, comments).
  },
];

// Экспортируем параметры (списки полей и настройки связей), чтобы их можно было использовать в других частях приложения.
// Это позволяет оставить всю связанную логику по настройке запросов в одном модуле для удобства.
module.exports = {
  WISHLIST_INCLUDES, // Настройки для запроса списков желаний (Wishlist).
  USER_FIELDS, // Поля, выбираемые из модели User.
  WISHLIST_ITEM_FIELDS, // Поля для модели WishlistItem.
  LINK_IMAGE_FIELDS, // Поля для моделей Link и Image.
  COMMENT_FIELDS, // Поля для модели Comment.
  WISHLIST_ITEM_INCLUDES, // Настройки для связей модели WishlistItem.
};
