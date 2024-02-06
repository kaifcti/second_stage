const express = require("express");
const web_cartController = require("../web_controller/cart_Controller");
const auth = require("../middleware/auth");
const router = express.Router();
// add cart functionality
router.post("/add_cart", auth, web_cartController.addTocart);
router.get("/getCartData", auth, web_cartController.getCartByUserId);
router.post("/upDateCartData/:id", auth, web_cartController.editCart);
router.delete("/deleteCartData/:id", auth, web_cartController.deleteCart);

// wishlist functionality

router.post("/add_wishlist",auth,web_cartController.add_product_wishlist);
router.post("/get_wishlist",auth,  web_cartController.get_wishlist_by_id);
router.delete("/remove_wishlist",auth,web_cartController.remove__wishlist)



// no needed code for this project
router.post("/add_text", web_cartController.add_text);
router.get("/fetch_text", web_cartController.get_text);
router.delete("/delete_text", web_cartController.delete_text);

module.exports = router;
