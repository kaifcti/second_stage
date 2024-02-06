const db = require("../utils/database");


module.exports={
  createCategory: async (category) => {
       
        return db.query("INSERT INTO Categories SET ?", [category]);
      },
      get_all_category: async () => {
        return db.query("select * from Categories ");
      },
      fetchCategoryById: async (id) => {
        return db.query(" select * from Categories where id= ?", [id]);
      },

      updateCategoryById: async (data, categoryId) => {
        const query = "UPDATE Categories SET categoryName=?, categoryImage=? WHERE id=?";
        const result = await db.query(query, [data.categoryName, data.categoryImage, categoryId]);
        return result;
    },
  deleteCategoryById: async (categoryId) => {
      return db.query(`delete  from Categories where id='${categoryId}' `);
    },
    
    }