module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable("Cart", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        productDetailsId: {
          type: Sequelize.INTEGER,
        },
  
        userId: {
          type: Sequelize.INTEGER,
        },
        cartQuantity: {
          type: Sequelize.INTEGER,
        },
       cartPrice:{
          type: Sequelize.INTEGER,
        },
      
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Set default value to current timestamp
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ), // Set default value to current timestamp and update on every update
        },
      }),
    down: (queryInterface) => queryInterface.dropTable("Cart"),
  };
  