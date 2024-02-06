const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {
  createCart,
  fetchCartByUserId,
  fetchCartById,
  updateCartById,
  deleteCartById,
  fetchUserBy_Id,
  deleteCartByuserId,
  getCartByProductIdAndUserId,
  deleteCartByProductIdAndUserId,
  fetchBuyerBy_Id,
  getCartByProductIdAndBuyerId,
  deleteCartByProductIdAndBuyerId,
  checkBuyerExistence,
  checkProductExistence,
  get_cart_id,
  fetchCartByBuyerId,
  getProductById,
  getCartById,
  fetchProductById,

  get__cart,
  insert_wishlist,
  get_wishlist,
  getWishlistById,
  check_product_in_wishlist,
  remove_from_wishlist,
  updateWishListLike,
  removeWishListLike,
  add_text,
  fetch_text,
  delete_text,
} = require("../web_models/cart");

// exports.addTocart = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token_1 = authHeader;
//     const token = token_1.replace("Bearer ", "");
//     const decoded = jwt.decode(token);
//     const userId = decoded.data.id;

//     const userData = await fetchBuyerBy_Id(userId);

//     if (userData.length == 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const { product_id, cart_quantity, cart_price, buyer_id } = req.body;

//     // Check if buyer and product exist
//     const buyerExists = await checkBuyerExistence(buyer_id);
//     const productExists = await checkProductExistence(product_id);

//     if (buyerExists.length == 0 || productExists.length == 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Buyer or product not found",
//       });
//     }

//     const existingitem = await getCartByProductIdAndBuyerId(
//       product_id,
//       buyer_id
//     );

//     if (existingitem.length !== 0) {
//       if (cart_quantity === 0) {
//         // If cart_quantity is 0, remove the item from the cart
//         await deleteCartByProductIdAndBuyerId(product_id, buyer_id);
//         return res.status(200).json({
//           success: true,
//           message: "Item removed from the cart successfully",
//         });
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: "Item already in the cart",
//         });
//       }
//     } else {
//       //  add it to the cart
//       const cartData = {
//         product_id,
//         cart_quantity,
//         buyer_id,
//         cart_price: cart_price * cart_quantity,
//       };

//       const addCart = await createCart(cartData);
//       const getCart = await get__cart();

//       return res.status(200).json({
//         success: true,
//         message: "Item added to the cart successfully",
//         data: getCart,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "An internal server error occurred. Please try again later.",
//       error: error.message,
//     });
//   }
// };

exports.addTocart = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token_1 = authHeader;
    const token = token_1.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userId = decoded.data.id;

    const userData = await fetchBuyerBy_Id(userId);
    console.log("userData==>>>", userData);

    if (userData.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const { product_id,cart_quantity } = req.body;
    console.log("product_id ==>>>", product_id);

    // Check if buyer and product exist
    const buyerExists = await checkBuyerExistence(userId);
    console.log("buyerExists==>>>", buyerExists);
    const productExists = await checkProductExistence(product_id);
    console.log("productExists==>>>", productExists);

    if (buyerExists.length === 0 || productExists.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Buyer or product not found",
      });
    }

    // Check if the item is already present in the cart
    const existingitem = await getCartByProductIdAndBuyerId(product_id, userId);

    if (existingitem.length !== 0) {
      return res.status(200).json({
        success: false,
        message: "Item already in the cart",
      });
    }

    // Fetch product details by product ID
    const productDetails = await checkProductExistence(product_id);

    if (!productDetails || isNaN(productDetails[0].price_sale_lend_price)) {
      return res.status(200).json({
        success: false,
        message: "Invalid product details or price",
      });
    }

    // Assuming cart_price is the price per item in the cart
    const cart_price = parseFloat(productDetails[0].price_sale_lend_price);
    console.log("cart_price==>>>", cart_price);

    if (isNaN(cart_price)) {
      return res.status(200).json({
        success: false,
        message: "Invalid price",
      });
    }

    // Add the item to the cart
    const cartData = {
      product_id,
      buyer_id: userId,
      cart_price,
      cart_quantity
      
    };

    const addCart = await createCart(cartData);

    // Retrieve the updated cart
    const getCart = await get__cart();

    return res.status(200).json({
      success: true,
      message: "Item added to the cart successfully",
      data: getCart,
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

// exports.getCartByUserIddd = async (req, res) => {
//   try {
//     const userID = req?.user;

//     const wishListDetails = await getCartById(userID);

//     if (wishListDetails && wishListDetails.length > 0) {
//       const updatedCombinedCart = wishListDetails.map((item) => {
//         const {
//           product_image,
//           product_color,
//           product_brand,
//           style_top,
//           style_bottom,
//           size_top,
//           size_bottom,
//           billing_type,
//           billing_level,
//           billing_condition,
//           product_category,
//           product_padding,
//           ...rest
//         } = item;

//         return {
//           ...rest,
//           cart_price: item.price_sale_lend_price * item.cart_quantity,
//           product_images: [product_image],
//           product_colors: product_color.split(",").map((color) => color.trim()),
//           product_brands: [product_brand],
//           product_styles: [style_top, style_bottom],
//           product_size: [size_top, size_bottom],
//           product_billing: [billing_type, billing_level, billing_condition],
//           product_category: [product_category],
//           product_padding: [product_padding],
//         };
//       });

//       return res.json({
//         message: "All cart items",
//         status: 200,
//         success: true,
//         cart: updatedCombinedCart,
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
//     return res.json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error.message || "Unknown error",
//     });
//   }
// };

exports.getCartByUserId = async (req, res) => {
  try {
    const userID = req?.user;

    const allProduct = await getCartById(userID);

    if (allProduct && allProduct.length > 0) {
      const productMap = {};

      // Group items by ID
      allProduct.forEach((item) => {
        if (!productMap[item.id]) {
          productMap[item.id] = {
            ...item,
            product_images: [item.product_image],
          };
        } else {
          productMap[item.id].product_images.push(item.product_image);
        }
      });

      // Convert the map values to an array
      const updatedCombinedCart = Object.values(productMap).map((item) => {
        const {
          product_image,
          product_colors,
          product_brands,
          style_top,
          style_bottom,
          size_top,
          size_bottom,
          billing_type,
          billing_level,
          billing_condition,
          product_category,
          product_padding,
          ...rest
        } = item;

        return {
          ...rest,
          cart_price: item.price_sale_lend_price * item.cart_quantity,
          product_images: item.product_images,
          product_colors: product_colors
            .split(",")
            .map((color) => color.trim()),
          product_brands: [product_brands],
          product_styles: [
            { style_top: style_top, style_bottom: style_bottom },
          ],
          product_size: [{ size_top: size_top, size_bottom: size_bottom }],
          product_billing: [
            {
              billing_type: billing_type,
              billing_level: billing_level,
              billing_condition: billing_condition,
            },
          ],
          product_category: [product_category],
          product_padding: [product_padding],
        };
      });

      return res.json({
        message: "All product details",
        status: 200,
        success: true,
        cart: updatedCombinedCart,
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
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.editCart = async (req, res) => {
  try {
    const buyer_id = req.user;

    const inputData = {
      product_id: req?.body?.product_id,
      cart_quantity: req?.body?.cart_quantity,
      // buyer_id: buyer_id, // No need to include buyer_id, as it's already available in req.user
    };

    const schema = Joi.object({
      product_id: Joi.number().required(),
      cart_quantity: Joi.number().required(),
    });

    const validationResult = schema.validate(inputData);

    if (validationResult.error) {
      const errorMessage = validationResult.error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation error",
        error: errorMessage,
      });
    }

    const cartId = req.params.id;
    const cartData = await fetchCartById(cartId);

    if (cartData.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Cart data not found",
      });
    }

    const existingitem = await getCartByProductIdAndBuyerId(
      inputData.product_id,
      buyer_id
    );

    if (existingitem.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Item not found in the cart",
      });
    }

    // Fetch product details by product ID
    const productDetails = await checkProductExistence(inputData.product_id);

    if (!productDetails || isNaN(productDetails[0].price_sale_lend_price)) {
      return res.status(404).json({
        success: false,
        message: "Invalid product details or price",
      });
    }

    // Assuming cart_price is the price per item in the cart
    const cart_price = parseFloat(productDetails[0].price_sale_lend_price);

    if (isNaN(cart_price) || isNaN(inputData.cart_quantity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart quantity or price",
      });
    }

    // Update cart price based on quantity
    const updatedCartPrice = cart_price * inputData.cart_quantity;

    const updateResult = await updateCartById(
      {
        cart_price: updatedCartPrice,
        cart_quantity: inputData.cart_quantity,
      },
      cartId
    );

    if (updateResult.affectedRows) {
      const finalUpdatedCartData = await fetchCartById(cartId);

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Cart details updated successfully!",
        user_info: finalUpdatedCartData[0],
      });
    } else {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Failed to update cart",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const CartId = req.params.id;

    // Check if the cart exists before attempting to delete
    const existingCart = await get_cart_id(CartId);
    if (!existingCart || existingCart.length === 0) {
      return res.json({
        status: 400,
        success: false,
        message: "Cart Not Found. It may have already been deleted.",
      });
    }

    // Delete the cart
    const data = await deleteCartById(CartId);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "Cart deleted successfully!",
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "Failed to delete cart",
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

// wishlist functionality

exports.add_product_wishlist = async (req, res) => {
  try {
    const buyer_id = req.user;
    const { product_id } = req.body;

    const isProductInWishlist = await check_product_in_wishlist(
      buyer_id,
      product_id
    );

    let result;

    if (isProductInWishlist.length > 0) {
      // Product is already in the wishlist, so remove it
      result = await remove_from_wishlist(product_id);
      result = await removeWishListLike(product_id);
      return res.json({
        success: true,
        message: "Item removed successfully to wishlist.",
      });
    } else {
      const data = {
        buyer_id,
        product_id,
      };

      result = await insert_wishlist(data);
      result = await updateWishListLike(product_id);
    }

    const getWishList = await get_wishlist();

    if (getWishList.length !== 0) {
      return res.json({
        success: true,
        status: 200,
        message: "Item added successfully to wishlist.",
        data: getWishList,
      });
    } else {
      return res.json({
        success: false,
        status: 200,
        message: "Operation failed!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};


exports.get_wishlist_by_id = async (req, res) => {
  try {
    const buyer_id = req.user;

    const wishListDetails = await getWishlistById(buyer_id);

    if (wishListDetails && wishListDetails.length > 0) {
      const updatedCombinedCart = wishListDetails.map((item) => {
        const {
          product_image,
          product_color,
          product_brand,
          style_top,
          style_bottom,
          size_top,
          size_bottom,
          billing_type,
          billing_level,
          billing_condition,
          product_category,
          product_padding,
          ...rest
        } = item;

        return {
          ...rest,

          product_images: [product_image],
          product_colors: product_color.split(",").map((color) => color.trim()),
          product_brands: [product_brand],
          product_styles: [style_top, style_bottom],
          product_size: [size_top, size_bottom],
          product_billing: [billing_type, billing_level, billing_condition],
          product_category: [product_category],
          product_padding: [product_padding],
        };
      });

      return res.json({
        message: "All wishlist items",
        status: 200,
        success: true,
        wishlist: updatedCombinedCart,
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
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.remove__wishlist = async (req, res) => {
  try {
    const buyer_id = req.user;

    deleteWishList = await remove_from_wishlist(buyer_id);

    if (deleteWishList) {
      return res.json({
        success: true,
        status: 200,
        message: "Wishlist deleted successfully!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

//  not needed in this project code
exports.add_text = async (req, res) => {
  try {
    const { user_id, text } = req.body;

    const commonSchema = Joi.object({
      user_id: Joi.number().required(),
      text: Joi.string().required(),
    });

    const commonValidationResult = commonSchema.validate({
      user_id,
      text,
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
        user_id,
        text,
      };

      const result = await add_text(data);
      if (result !== 0) {
        return res.json({
          success: true,
          status: 200,
          message: "successfully added text",
        });
      } else {
        return res.json({
          success: false,
          status: 400,
          message: "failed to added text",
        });
      }
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

exports.get_text = async (req, res) => {
  try {
    const { user_id } = req.body;

    const commonSchema = Joi.object({
      user_id: Joi.number().required(),
    });

    const commonValidationResult = commonSchema.validate({
      user_id,
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
      const fetch_texts = await fetch_text(user_id);

      if (fetch_texts !== 0) {
        return res.json({
          success: true,
          status: 200,
          message: "text fetch successsfully!",
          data: fetch_texts,
        });
      } else {
        return res.json({
          success: false,
          status: 400,
          message: "failed to fetch text",
        });
      }
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

exports.delete_text = async (req, res) => {
  try {
    const { user_id } = req.body;

    const commonSchema = Joi.object({
      user_id: Joi.number().required(),
    });

    const commonValidationResult = commonSchema.validate({
      user_id,
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
      const deleteText = await delete_text(user_id);

      if (deleteText) {
        return res.json({
          success: true,
          status: 200,
          message: "text deleted successsfully!",
        });
      } else {
        return res.json({
          success: false,
          status: 400,
          message: "failed to delete text",
        });
      }
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
