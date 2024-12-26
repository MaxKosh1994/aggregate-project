const router = require('express').Router();
const CommentController = require('../controllers/Comment.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  //* Метод GET - получение комментария по его ID.
  .get('/:id', CommentController.getById)

  //* Метод POST - создание нового комментария.
  .post('/', verifyAccessToken, CommentController.create)

  //* Метод PUT - обновление существующего комментария.
  .put('/', verifyAccessToken, CommentController.update)

  //* Метод DELETE - удаление комментария.
  .delete('/', verifyAccessToken, CommentController.delete);

module.exports = router;
