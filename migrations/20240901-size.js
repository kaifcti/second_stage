// 20240103000000-create-categories.js
module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable('Size', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        sizeTop: {
          type: Sequelize.STRING,
        
        },
        sizeBottom: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
      }),
    down: (queryInterface) => queryInterface.dropTable('Size')
  };
  