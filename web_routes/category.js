const express = require("express");
const web_categoryController = require("../web_controller/category_Controller");
const auth = require("../middleware/auth");
const   router = express.Router();
 const upload=require("../middleware/product_image")


router.post("/createCategory", upload.single("categoryImage") ,  web_categoryController.addCategory);
router.get("/getCategory", web_categoryController.getAllCategory);
router.get("/getCategoryById/:id", web_categoryController.getCategoryById);
router.put("/updateCategory/:id",  upload.single("categoryImage"),web_categoryController.editCategory)
router.delete("/deleteCategory/:id", web_categoryController.deleteCategory)
//router.post("/createProduct",web_productController.addProduct)
module.exports = router;