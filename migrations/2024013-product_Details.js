module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable('Products_Details', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        sizeId:{
          type: Sequelize.INTEGER
        },
        StyleId:{
          type: Sequelize.INTEGER
        },
        productId:{
          type: Sequelize.INTEGER
         },
         productType:{
          type: Sequelize.BOOLEAN,
          allowNull: false, // Set allowNull to true or false based on your requirement
          defaultValue: true, 
         },
        productName: {
          type: Sequelize.STRING
        },
        location:{
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        price: {
          type: Sequelize.DECIMAL(10, 2) // Assuming a decimal for the price with 2 decimal places
        },
        leasePrice:{
          type: Sequelize.DECIMAL(10, 2) // Assuming a decimal for the price with 2 decimal places
        },
      
        color: {
          type: Sequelize.STRING
        },
        size: {
          type: Sequelize.STRING
        },
        stockQuantity: {
          type: Sequelize.INTEGER
        },
        productImage: {
          type: Sequelize.STRING
        },
        sku: {
          type: Sequelize.STRING
        },
        brand: {
          type: Sequelize.STRING
        },
        blingLevel:{
          type: Sequelize.STRING
        },
        blingType:{
          type: Sequelize.STRING
        },
        condition:{
          type: Sequelize.STRING
        },
        padding:{
          type: Sequelize.STRING
        },
        discount:{
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
    down: (queryInterface) => queryInterface.dropTable('Products_Details')
  };
  