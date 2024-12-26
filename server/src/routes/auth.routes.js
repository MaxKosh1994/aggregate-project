const router = require('express').Router();
const UserController = require('../controllers/User.controller');
const upload = require('../middleware/upload');
const verifyRefreshToken = require('../middleware/verifyRefreshToken');

router
  //* Метод POST - проверка email на существование с помощью стороннего api
  .post('/check-email', UserController.checkEmailExistence)

  //* Метод GET - получение всех юзеров
  .get('/users', UserController.getAll)

  //* Метод GET - получение новой пары токенов на основе данных из res.locals
  .get('/refreshTokens', verifyRefreshToken, UserController.refreshTokens)

  //* Метод POST - регистрация
  .post('/signUp', upload.single('image'), UserController.signUp)

  //* Метод POST - аутентификация
  .post('/signIn', UserController.signIn)

  //* Метод GET - выход
  .get('/signOut', UserController.signOut);

module.exports = router;
