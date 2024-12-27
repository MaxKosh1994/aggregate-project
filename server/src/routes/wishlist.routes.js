const router = require('express').Router();
const WishlistController = require('../controllers/Wishlist.controller');
const upload = require('../middleware/upload');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  //* Метод GET - получение всех вишлистов.
  .get('/', verifyAccessToken, WishlistController.getAll)

  //* Метод GET - получение конкретного вишлиста по ID.
  .get('/:id', verifyAccessToken, WishlistController.getById)

  //* Метод POST - создание нового вишлиста.
  .post(
    '/',
    verifyAccessToken,
    upload.single('image'),
    WishlistController.create
  )

  //* Метод PUT - обновление существующего вишлиста.
  .put(
    '/:id',
    verifyAccessToken,
    upload.single('image'),
    WishlistController.update
  )

  //* Метод DELETE - удаление конкретного вишлиста.
  .delete('/:id', verifyAccessToken, WishlistController.delete)

  //* Метод POST - приглашение другого пользователя в вишлист по ID.
  .post(
    '/invite:id',
    verifyAccessToken,
    WishlistController.inviteUserToWishlist
  )

  //* Метод POST - исключение пользователя из общего вишлиста.
  .post(
    '/kick-out:id',
    verifyAccessToken,
    WishlistController.kickOutUserFromWishlist
  );

module.exports = router;
