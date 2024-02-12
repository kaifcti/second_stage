const Joi = require("joi");
const config = require("../config");
const jwt = require("jsonwebtoken");

const {
  insert_into_order_shipping,
  get_order_shipping,
  fetchShipping_by_id,
  fetchBuyerBy_Id,
  check_order,
  insert_checkOut,
  checkBuyerExistence,
  get_checkOut,
  getChekOutById,
  getCartDetails_by_id,
  updateCartT,
  updatePaymentStatus,
  updateCartPaymentStatus,
  fetchOrderById,
  fetchOrderListById,
} = require("../web_models/orderModels");
const { charLength } = require("random-hash/dist/baseN");

const baseurl = config.base_url;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

function calculatePercentage(number, percentage) {
  if (typeof number !== "number" || typeof percentage !== "number") {
    return "Please provide valid numbers";
  }

  if (percentage < 0 || percentage > 100) {
    return "Percentage should be between 0 and 100";
  }

  return (number * percentage) / 100;
}

exports.order_shipping_details = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token_1 = authHeader;
    const token = token_1.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userId = decoded.data.id;

    const userData = await fetchBuyerBy_Id(userId);

    if (userData.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      first_name,
      last_name,
      company_name,
      country_region,
      street_address,
      town_city,
      postcode_zip,
      province,
      phone,
      mail,
      order_notes,
    } = req.body;

    const commonSchema = Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      company_name: Joi.string().optional(),
      country_region: Joi.string().required(),
      street_address: Joi.string().required(),
      town_city: Joi.string().required(),
      postcode_zip: Joi.number().required(),
      province: Joi.string().required(),
      phone: Joi.number().required(),
      mail: Joi.string().required(),
      order_notes: Joi.string().optional(),
    });

    const commonValidationResult = commonSchema.validate({
      first_name,
      last_name,
      country_region,
      street_address,
      town_city,
      postcode_zip,
      province,
      phone,
      mail,
    });

    if (commonValidationResult.error) {
      const errorMessage = commonValidationResult.error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.json({
        message: commonValidationResult.error.details[0].message,
        error: errorMessage,
        missingParams: commonValidationResult.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = {
        buyer_id: userId,
        first_name,
        last_name,
        company_name,
        country_region,
        street_address,
        town_city,
        postcode_zip,
        province,
        phone,
        mail,
        order_notes,
      };

      const result = await insert_into_order_shipping(data);
      if (result.affectedRows > 0) {
        const getOrderShipping = await get_order_shipping();
        return res.json({
          success: true,
          status: 200,
          message: "Shipping details added successfully!",
          data: getOrderShipping,
        });
      } else {
        return res.json({
          success: false,
          status: 400,
          message: "Shipping details added failed!",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

exports.get_shipping_details = async (req, res) => {
  try {
    const buyer_id = req.user;

    const fetchBuyer = await fetchBuyerBy_Id(buyer_id);
    if (fetchBuyer.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      const fetch_shipping = await fetchShipping_by_id(buyer_id);

      if (fetch_shipping.length !== 0) {
        return res.json({
          success: true,
          status: 200,
          message: `fetch shipping details of buyer_id='${buyer_id}' successful`,
          shipping_details: fetch_shipping,
        });
      } else {
        return res.json({
          success: true,
          status: 400,
          message: `no shipping details found`,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.order_checkout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userId = decoded.data.id;

    const userData = await checkBuyerExistence(userId);
    console.log("userData==>>>", userData);

    if (userData.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    var order_number = generateRandomNumber(4, 6);

    const checkCartDetails = await getCartDetails_by_id(userId);
    console.log("checkCartDetails-->>>", checkCartDetails);

    const ids = checkCartDetails.map((item) => item.id);

    console.log("idss==>>>", ids);

    const { payment_method, cart_id } = req.body;

    const checkOrder = await check_order(userId);

    const checkOutData = {
      buyer_id: userId,
      payment_method,
      order_number: order_number,
      cart_id: cart_id,
    };

    const addCheckOut = await insert_checkOut(checkOutData);
    console.log("addCheckout==>>>", addCheckOut);

    const checkOutId = addCheckOut.insertId;
    // console.log("checkOutId==>>", checkOutId);

    if (addCheckOut.affectedRows > 0) {
      const updatePaymentStatuss = await updatePaymentStatus(cart_id, userId);
      const updateCartPaymentStatuss = await updateCartPaymentStatus(
        cart_id,
        userId
      );

      // const updatePaymentSta = await updatePaymentStatus(userId);
      const getCheckout = await get_checkOut(checkOutId);

      console.log(">>>>>>>>>", getCheckout);

      return res.status(200).json({
        success: true,
        message: "order submit successfully!",
        data: getCheckout,
      });
    } else {
      return res.json({
        success: false,
        status: 200,
        message: "Unable to order!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};

exports.fetch_order = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userID = decoded.data.id;

    const allProducts = await fetchOrderById(userID);
    console.log("allProd==>>", allProducts);

    if (allProducts && allProducts.length > 0) {
      const orderMap = new Map();

      allProducts.forEach((item) => {
        const orderId = item.order_id;

        if (!orderMap.has(orderId)) {
          orderMap.set(orderId, {
            order_id: item.order_id,
            order_number: item.order_number,
            payment_method: item.payment_method,

            order_date: item.order_date,

            cart_details: [],
            subtotal: 0,
            total_count: 0, // Initialize total_count to 0
          });
        }

        const order = orderMap.get(orderId);

        order.cart_details.push({
          cart_id: item.cart_id,
          buyer_id: item.buyer_id,
          product_quantity: item.cart_quantity,
          // cart_price: item.cart_price,
          cart_price: item.cart_quantity * item.cart_price,
          product_id: item.product_id,
          product_brand: item.product_brand,
          product_buy_rent: item.product_buy_rent,
          location: item.location,
          product_description: item.product_description,
          product_image: item.product_image,
          product_colors: item.product_colors,
          size_top: item.size_top,
          size_bottom: item.size_bottom,
          price_sale_lend_price: item.price_sale_lend_price,
          product_brand: item.product_brands,
        });

        order.total_count += 1;

        order.subtotal += item.cart_quantity * item.cart_price;
        order.vat_percentage = "16%";

        order.vat_sub_total =
          calculatePercentage(order.subtotal, 16) + order.subtotal;
        order.shipping = item.free_shipping;
      });

      const orders = [...orderMap.values()];

      return res.json({
        message: "All product details",
        status: 200,
        success: true,
        products: orders,
      });
    } else {
      return res.json({
        message: "No data found",
        status: 200,
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.order_list = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userID = decoded.data.id;

    const allProducts = await fetchOrderById(userID);
    console.log("allProd==>>", allProducts);

    if (allProducts && allProducts.length > 0) {
      const orderMap = new Map();

      allProducts.forEach((item) => {
        const orderId = item.order_id;

        if (!orderMap.has(orderId)) {
          orderMap.set(orderId, {
            order_id: item.order_id,
            order_number: item.order_number,
            payment_method: item.payment_method,
            status: item.payment_status,

            order_date: item.order_date,

            cart_details: [],
            subtotal: 0,
            total_count: 0, // Initialize total_count to 0
          });
        }

        const order = orderMap.get(orderId);

        order.cart_details.push({
          cart_id: item.cart_id,
          buyer_id: item.buyer_id,
          product_quantity: item.cart_quantity,
          // cart_price: item.cart_price,
          cart_price: item.cart_quantity * item.cart_price,
          product_id: item.product_id,
          product_brand: item.product_brand,
          product_buy_rent: item.product_buy_rent,
          location: item.location,
          product_description: item.product_description,
          product_image: item.product_image,
          product_colors: item.product_colors,
          size_top: item.size_top,
          size_bottom: item.size_bottom,
          price_sale_lend_price: item.price_sale_lend_price,
          product_brand: item.product_brands,
        });

        order.total_count += 1;

        order.subtotal += item.cart_quantity * item.cart_price;
        order.vat_percentage = "16%";

        order.vat_sub_total =
          calculatePercentage(order.subtotal, 16) + order.subtotal;
        order.shipping = item.free_shipping;
      });

      const orders = [...orderMap.values()];

      return res.json({
        message: "All product details",
        status: 200,
        success: true,
        products: orders,
      });
    } else {
      return res.json({
        message: "No data found",
        status: 200,
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.get_checkout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userID = decoded.data.id;

    const allProducts = await getChekOutById(userID);
    console.log("allProd==>>", allProducts);

    if (allProducts && allProducts.length > 0) {
      const orderMap = new Map();

      allProducts.forEach((item) => {
        const orderId = item.order_id;

        if (!orderMap.has(orderId)) {
          orderMap.set(orderId, {
            order_id: item.order_id,
            order_number: item.order_number,
            shipping: item.shipping,
            vat: item.vat,
            total: item.total,
            order_date: item.order_date,
            payment_method: item.payment_method,
            payment_status: item.payment_status,
            cart_details: [],
            subtotal: 0,
            total_count: 0, // Initialize total_count to 0
          });
        }

        const order = orderMap.get(orderId);

        order.cart_details.push({
          cart_id: item.cart_id,
          buyer_id: item.buyer_id,
          product_quantity: item.cart_quantity,
          // cart_price: item.cart_price,
          cart_price: item.cart_quantity * item.cart_price,
          product_id: item.product_id,
          product_brand: item.product_brand,
          product_buy_rent: item.product_buy_rent,
          location: item.location,
          product_description: item.product_description,
          product_image: item.product_image,
          product_colors: item.product_colors,
          size_top: item.size_top,
          size_bottom: item.size_bottom,
          price_sale_lend_price: item.price_sale_lend_price,
          product_brand: item.product_brands,
        });

        order.total_count += 1;

        order.subtotal += item.cart_quantity * item.cart_price;
        order.vat_percentage = "16%";

        order.vat_sub_total =
          calculatePercentage(order.subtotal, 16) + order.subtotal;
        order.shipping = item.free_shipping;
      });

      const orders = [...orderMap.values()];

      return res.json({
        message: "All product details",
        status: 200,
        success: true,
        products: orders,
      });
    } else {
      return res.json({
        message: "No data found",
        status: 200,
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};
