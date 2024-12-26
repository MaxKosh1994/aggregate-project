'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('WishlistItems', 'priority', {
      type: Sequelize.ENUM(
        'не особо нужно',
        'было бы славно',
        'очень нужно',
        'душу продать'
      ),
      allowNull: false, // Обязательно значение
      defaultValue: 'не особо нужно', // Установим значение по умолчанию
    });
  },

  async down(queryInterface, Sequelize) {
    // Для отмены миграции сначала удаляем колонку
    await queryInterface.removeColumn('WishlistItems', 'priority');
    // Удаляем ENUM-тип из базы данных
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_WishlistItems_priority";'
    );
  },
};
