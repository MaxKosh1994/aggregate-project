'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Изменяем тип данных поля description на TEXT
    await queryInterface.changeColumn('WishlistItems', 'description', {
      type: Sequelize.TEXT,
    });
  },
  async down(queryInterface, Sequelize) {
    // Возвращаем тип данных поля description обратно на STRING
    await queryInterface.changeColumn('WishlistItems', 'description', {
      type: Sequelize.STRING,
    });
  },
};
