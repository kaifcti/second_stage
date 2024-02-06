const Joi = require("joi");
const config = require("../config");
const jwt = require("jsonwebtoken");

const {
  insert_into_order_shipping,
  get_order_shipping,
  fetchBuyerBy_Id,
  insert_checkOut,
  checkBuyerExistence,
  get_checkOut,
  getChekOutById,
} = require("../web_models/orderModels");

const baseurl = config.base_url;

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
      order_notes: Joi.string().required(),
    });

    const commonValidationResult = commonSchema.validate({
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

exports.order_checkout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token_1 = authHeader;
    const token = token_1.replace("Bearer ", "");
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

    const { product_id, cart_id, shipping, vat, total } = req.body;

    const checkOutData = {
      buyer_id: userId,
      product_id,
      cart_id,
      shipping,
      vat,
      total,
    };

    const addCheckOut = await insert_checkOut(checkOutData);

    // Retrieve the updated cart
    const getCheckout = await get_checkOut();

    return res.status(200).json({
      success: true,
      message: "Insert to checkout successfully!",
      data: getCheckout,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};



exports.get_checkout = async (req, res) => {
  try {
    const userID = req?.user;

    const allProduct = await getChekOutById(userID);

    if (allProduct && allProduct.length > 0) {
      const updatedCombinedCart = allProduct.map((item) => {
        return {
          order_checkout: {
            // Include other order_checkout fields as needed
            id: item.id,
            shipping: item.shipping,
            vat: item.vat,
            total: item.total,
          },

          cart: {
            cart_id: item.id,
            buyer_id: item.buyer_id,
            cart_quantity: item.cart_quantity,
            cart_price: item.cart_price,
            total: item.cart_quantity * item.cart_price,
          },

          product_brands: {
            product_id: item.product_id,
            brand: item.product_brands,
          },
        };
      });

      return res.json({
        message: "All product details",
        status: 200,
        success: true,
        checkout_details: updatedCombinedCart,
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

exports.gettt_checkoutttt = async (req, res) => {
  try {
    const userID = req?.user;

    if (!userID) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing in the request",
        status: 400,
      });
    }

    const allProduct = await getChekOutById(userID);

    if (allProduct && allProduct.length > 0) {
      const updatedCombinedCart = allProduct.map((item) => {
        if (item.cart) {
          const subtotal = item.cart.cart_quantity * item.cart.cart_price;
          const vatAmount = (subtotal * 16) / 100;
          const total = subtotal + vatAmount;

          return {
            order_checkout: {
              id: item.id,
              shipping: item.order_checkout.shipping,
              vat: item.order_checkout.vat,
              total: total.toFixed(2),
            },
            cart: {
              id: item.cart.id,
              buyer_id: item.cart.buyer_id,
              cart_quantity: item.cart.cart_quantity,
              cart_price: item.cart.cart_price,
              total: subtotal,
            },
            product_brands: { brand: item.product_brands.brand },
          };
        } else {
          return null;
        }
      }).filter((item) => item !== null);

      if (updatedCombinedCart.length > 0) {
        return res.json({
          message: "All product details",
          status: 200,
          success: true,
          cart: updatedCombinedCart,
        });
      } else {
        return res.json({
          message: "No products found for the user",
          status: 404,
          success: false,
        });
      }
    } else {
      return res.json({
        message: "No data found",
        status: 404,
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

