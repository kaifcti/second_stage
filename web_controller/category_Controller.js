const Joi = require("joi");
const {createCategory, get_all_category, fetchCategoryById, updateCategoryById, deleteCategoryById}= require("../web_models/category")
exports.

addCategory = async (req, res) => {
console.log(req.file)
    try {
       const categoryData={
        categoryName:req?.body?.categoryName,
      categoryImage:req?.file?.filename,
       
       }
      // Validate the input using Joi
      const schema = Joi.object({
        categoryName: Joi.string().empty().required(),
      
        categoryImage: Joi.required(),
      
      }); 
      const result = schema.validate({
        ...req.body,  // Include text data
        categoryImage: req.file,  // Include file data
      });
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
          message: result.error.details[0].message,
          error: message,
          missingParams: result.error.details[0].message,
          status: 400,
          success: false,
        });
      }
      if (!req.file) {
        return res.status(400).send({ message: 'You must select a file.' });
      }
      const data = await createCategory(categoryData);
      res.json({
        success: true,
        message: "category added successfully.",
        status: 200,
        data: data, 
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        message: "An internal server error occurred. Please try again later.",
        status: 500,
        error: error,
      });
    }
  };
 
  exports.getAllCategory = async (req, res) => {
    try {
      const all_category = await get_all_category();
      if (all_category != 0) {
        return res.json({
          message: "all category ",
          status: 200,
          success: true,
          all_category: all_category,
        });
      } else {
        return res.json({
          message: "No data found ",
          status: 200,
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "Internal server error",
        status: 500,
        error: error,
      });
    }
  };  
  exports.getCategoryById = async (req, res) => {
    try {
      const id=req.params.id
      const all_category = await fetchCategoryById(id);
      if (all_category != 0) {
        return res.json({
          message: "all category ",
          status: 200,
          success: true,
          category: all_category,
        });
      } else {
        return res.json({
          message: "No data found ",
          status: 200,
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "Internal server error",
        status: 500,
        error: error,
      });
    }
  }; 
  exports.editCategory = async (req, res) => {
    try {
      const Data={
        categoryName:req.body.categoryName,
      categoryImage:req?.file?.filename,
        
       }
      // Validate the input using Joi
      const schema = Joi.object({
        categoryName: Joi.string().empty().required(),
        categoryImage: Joi.required(),
      
      }); 
      const result = schema.validate({
        ...req.body,  // Include text data
        categoryImage: req.file,  // Include file data
      });
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
          message: result.error.details[0].message,
          error: message,
          missingParams: result.error.details[0].message,
          status: 200,
          success: true,
        });

      }
      if (!req.file) {
        return res.status(400).send({ message: 'You must select a file.' });
      } else {
        const categoryId = req.params.id;
  
       
        const categoryData = await fetchCategoryById(categoryId);
  
        if (categoryData.length !== 0) {
          const result = await updateCategoryById(Data, categoryId);
  
          if (result.affectedRows) {
            const categoryData = await fetchCategoryById(categoryId);
  
            return res.json({
              message: " category details updated successfully!"
              ,
              status: 200,
              success: true,
              user_info: categoryData[0],
            });
          } else {
            return res.json({
              message: "update category failed ",
              status: 200,
              success: false,
            });
          }
        } else {
          return res.json({
            messgae: "data not found",
            status: 200,
            success: false,
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Internal server error",
        error: err,
        status: 500,
      });
    }
  }; 
  exports.deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
  
      const data = await deleteCategoryById(categoryId);
      if (data.length !== 0) {
        return res.json({
          status: 200,
          success: true,
          message:"category deleted successfully!",
          user_info: data,
        });
      } else {
        return res.json({
          status: 400,
          success: false,
          message: "Category  Not Found",
          user_info: [],
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "Internal server error",
        status: 500,
        error: error,
      });
    }
  };