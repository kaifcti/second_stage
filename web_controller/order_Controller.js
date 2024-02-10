const Joi = require("joi");
const config = require("../config");
const jwt = require("jsonwebtoken");

const {
  insert_into_order_shipping,
  get_order_shipping,
  fetchShipping_by_id,
  fetchBuyerBy_Id,
  insert_checkOut,
  checkBuyerExistence,
  get_checkOut,
  getChekOutById,
  getCartDetails_by_id,
  updateCartT,
  updatePaymentStatus,
} = require("../web_models/orderModels");

const baseurl = config.base_url;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
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

// exports.order_checkout = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token_1 = authHeader;
//     const token = token_1.replace("Bearer ", "");
//     const decoded = jwt.decode(token);
//     const userId = decoded.data.id;

//     const userData = await checkBuyerExistence(userId);
//     console.log("userData==>>>", userData);

//     if (userData.length === 0) {
//       return res.status(200).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const { product_id, cart_id, shipping, vat, total } = req.body;

//     const checkOutData = {
//       buyer_id: userId,
//       product_id,
//       cart_id,
//       shipping,
//       vat,
//       total,
//     };

//     const addCheckOut = await insert_checkOut(checkOutData);

//     // Retrieve the updated cart
//     const getCheckout = await get_checkOut();

//     return res.status(200).json({
//       success: true,
//       message: "Insert to checkout successfully!",
//       data: getCheckout,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "An internal server error occurred. Please try again later.",
//       error: error.message,
//     });
//   }
// };

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

    const { shipping, vat, total, payment_method } = req.body;

    const checkOutData = {
      buyer_id: userId,
      shipping,
      vat,
      total,
      payment_method,
      order_number: order_number,
    };

    const addCheckOut = await insert_checkOut(checkOutData);
    // console.log("addCheckout==>>>", addCheckOut);

    const checkOutId = addCheckOut.insertId;
    console.log("checkOutId==>>", checkOutId);

    if (addCheckOut.affectedRows > 0) {
      for (const itemId of ids) {
        const updateCArt = await updateCartT(checkOutId, itemId, userId);
      }
      const updatePaymentSta = await updatePaymentStatus(userId);
      const getCheckout = await get_checkOut();

      return res.status(200).json({
        success: true,
        message: "Insert to checkout successfully!",
        data: getCheckout,
      });
    } else {
      return res.json({
        success: false,
        status: 200,
        message: "checkout not insert successfully!",
      });
    }

    // let order_comfrim = ids.map((item) =>{

    //   const addCheckOut_ = await insert_checkOut(user_id , item);
    // }

    // Retrieve the updated checkout
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};

// exports.get_checkout = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader.replace("Bearer ", "");
//     const decoded = jwt.decode(token);
//     const userID = decoded.data.id;

//     const allProducts = await getChekOutById(userID);

//     if (allProducts && allProducts.length > 0) {
//       const orderMap = new Map();

//       allProducts.forEach((item) => {
//         const orderId = item.order_id;

//         if (!orderMap.has(orderId)) {
//           orderMap.set(orderId, {
//             order_id:item.id,
//             order_number: item.order_number,
//             shipping: item.shipping,
//             vat: item.vat,
//             total: item.total,
//             order_date: item.order_date,
//             payment_method: item.payment_method,
//             payment_status: item.payment_status,
//             cart_details: [],
//             subtotal: 0,
//           });
//         }

//         const order = orderMap.get(orderId);

//         order.cart_details.push({
//           cart_id: item.cart_id,
//           buyer_id: item.buyer_id,
//           cart_quantity: item.cart_quantity,
//           cart_price: item.cart_price,
//           total: item.cart_quantity * item.cart_price,
//         });

//         order.subtotal += item.cart_quantity * item.cart_price;
//       });

//       const orders = [...orderMap.values()];

//       return res.json({
//         message: "All product details",
//         status: 200,
//         success: true,
//         products: orders,
//       });
//     } else {
//       return res.json({
//         message: "No data found",
//         status: 200,
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error.message || "Unknown error",
//     });
//   }
// };

// exports.get_checkout = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader.replace("Bearer ", "");
//     const decoded = jwt.decode(token);
//     const userID = decoded.data.id;

//     const allProducts = await getChekOutById(userID);

//     if (allProducts && allProducts.length > 0) {
//       const orderMap = new Map();

//       allProducts.forEach((item) => {
//         const orderId = item.order_id;

//         if (!orderMap.has(orderId)) {
//           orderMap.set(orderId, {
//             order_id:orderId,
//             order_number: item.order_number,
//             shipping: item.shipping,
//             vat: item.vat,
//             total: item.total,
//             order_date: item.order_date,
//             payment_method: item.payment_method,
//             payment_status: item.payment_status,
//             cart_details: [],
//             subtotal: 0,
//           });
//         }

//         const order = orderMap.get(orderId);

//         order.cart_details.push({
//           cart_id: item.cart_id,
//           product_id:item.product_id,
//           buyer_id: item.buyer_id,
//           cart_quantity: item.cart_quantity,
//           cart_price: item.cart_price,
//           total: item.cart_quantity * item.cart_price,
//           product_id: item.product_id,
//           product_brand: item.product_brand,
//         });

//         order.subtotal += item.cart_quantity * item.cart_price;
//       });

//       const orders = [...orderMap.values()];

//       return res.json({
//         message: "All product details",
//         status: 200,
//         success: true,
//         products: orders,
//       });
//     } else {
//       return res.json({
//         message: "No data found",
//         status: 200,
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error.message || "Unknown error",
//     });
//   }
// };

exports.get_checkout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userID = decoded.data.id;

    const allProducts = await getChekOutById(userID);

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
            total_count: 0,
          });
        }

        const order = orderMap.get(orderId);

        order.cart_details.push({
          cart_id: item.cart_id,
          buyer_id: item.buyer_id,
          cart_quantity: item.cart_quantity,
          cart_price: item.cart_price,
          total: item.cart_quantity * item.cart_price,
          product_id: item.product_id,
          product_brand: item.product_brand,
          total_cart_items: item.total_cart_items,
        });
        order.total_count += item.total_cart_items;
        order.subtotal += item.cart_quantity * item.cart_price;
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
      const updatedCombinedCart = allProduct
        .map((item) => {
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
        })
        .filter((item) => item !== null);

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
