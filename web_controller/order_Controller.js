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

    const { shipping, vat, total } = req.body;

    const checkOutData = {
      buyer_id: userId,
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


