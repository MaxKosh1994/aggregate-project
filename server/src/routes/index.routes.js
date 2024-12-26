const router = require('express').Router(); //* получаем экземпляр роутинга из библиотеки
const wishlistRoutes = require('./wishlist.routes'); //* подтягиваем набор роутинга по определенному пути
const wishlistItemRoutes = require('./wishlistItem.routes'); //* подтягиваем набор роутинга по определенному пути
const authRoutes = require('./auth.routes'); //* подтягиваем набор роутинга по определенному пути для сущности User
const commentRoutes = require('./comment.routes'); //* подтягиваем набор роутинга по определенному пути

router
  .use('/auth', authRoutes) //* по пути на auth отрабатывает набор из authRoutes
  .use('/wishlists', wishlistRoutes) //* по пути на wishlists отрабатывает набор из wishlistRoutes
  .use('/wishlistItem', wishlistItemRoutes) //* по пути на wishlistItem отрабатывает набор из wishlistItemRoutes
  .use('/comments', commentRoutes); //* по пути на comments отрабатывает набор из commentRoutes

module.exports = router;
