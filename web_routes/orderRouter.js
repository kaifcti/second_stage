const express = require("express");
const orderController = require("../web_controller/order_Controller");
const auth = require("../middleware/auth");
const router = express.Router();

// *******order code for router kaif start****

router.post(
  "/add_shipping_details",
  auth,
  orderController.order_shipping_details
);
router.get(
  "/fetch_shipping_details",
  auth,
  orderController.get_shipping_details
);

router.post("/add_checkout", auth, orderController.order_checkout);
router.get("/fetch_checkout", auth, orderController.get_checkout);
router.get("/fetch_order", auth, orderController.fetch_order);
router.get("/order_list", auth, orderController.order_list);

module.exports = router;
