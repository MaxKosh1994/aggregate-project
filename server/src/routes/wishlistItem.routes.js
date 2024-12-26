const router = require('express').Router();
const WishlistItemController = require('../controllers/WishlistItem.controller');
const upload = require('../middleware/upload');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  //* Метод POST - добавление нового элемента в вишлист.
  .post(
    '/',
    verifyAccessToken,
    upload.array('images', 10),
    WishlistItemController.create
  )

  //* Метод PUT - обновление существующего элемента вишлиста.
  .put(
    '/',
    verifyAccessToken,
    upload.array('images', 10),
    WishlistItemController.update
  )

  //* Метод DELETE - удаление элемента из вишлиста.
  .delete('/', verifyAccessToken, WishlistItemController.delete);

module.exports = router;
