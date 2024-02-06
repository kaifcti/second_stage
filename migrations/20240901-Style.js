module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable('Style', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        top: {
          type: Sequelize.STRING, // Using JSON type for array storage
        },

        bottom: {
          type: Sequelize.STRING
        },
       angelsThemeWear:{
        type: Sequelize.STRING
       },
       shoes:{
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
    down: (queryInterface) => queryInterface.dropTable('Style')
  };
  