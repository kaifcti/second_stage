module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_Name: {
        type: Sequelize.STRING,
      },

      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      DOB:{
        type: Sequelize.STRING,
      },
      Profile_images:{
        type: Sequelize.STRING
      },

      act_token: {
        type: Sequelize.STRING,
      },

      verify_user: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Set default value to false
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
  down: (queryInterface) => queryInterface.dropTable("Users"),
};
