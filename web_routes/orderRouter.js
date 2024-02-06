const express = require("express");
const orderController = require("../web_controller/order_Controller");
const auth = require("../middleware/auth");
const router = express.Router();

// *******order code for router kaif start****

router.post("/add_shipping_details", auth, orderController.order_shipping_details);
router.post("/add_checkout",auth,orderController.order_checkout)

module.exports = router;
