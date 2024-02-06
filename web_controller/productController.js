const Joi = require("joi");
const config = require("../config");
const {
  createProductDetails,
  createProduct,

  fetchProductById,
  updateProductById,
  deleteProductById,

  get_Product_Details,
  fetchProductDetailsById,
  updateProductDetailsById,

  getAllProductById,
  insert_product_images,
  get_product_images,

  update_product,
  delete_product_images,
  insert__into_product,
  get_product_by_id,
  get_product_by_category,
  insert_product_color,
  get_product_color,
  delete_product_colors,
  getAllProduct,
  get__products,
  getAllProduct_images,
  getAllProduct_colors,
  getAllProduct_filter,
  getAllProduct_by_id,

  fetchBuyerBy_Id,
  insert_product_images_bulk,
  getAllProduct_by_category,
  fetch_product_categories,

  getAllProduct_brands,
  fetchProductCategories,
  fetchProductBrand,
  fetchProductBuyRent,
  fetchProductRentalPeriod,
  fetchProductStyleTop,
  fetchProductStyleBottom,
  fetchProductSizeTop,
  fetchProductSizeBottom,
  fetchProductBillingType,
  fetchProductBillingLevel,
  fetchProductBillingCondition,
  fetchProductPadding,
  fetchProductSizeStandard,
  fetchProductColor,
  fetchProductLocation,

  insert_product_brand,
  insert_product_billing,
  insert_product_category,
  insert_product_size,
  insert_product_style,
  insert_product_padding,

  get_product_brandd,
  get_product_style,
  get_product_size,
  get_product_billing,

  get_product_padding,

  fetch_product_brand,
  fetch_product_style,
  fetch_product_size,
  fetch_product_billing,
  fetch_product_id,
  fetch_product_padding,

  getAllProductByIdd,
} = require("../web_models/productModels");

const baseurl = config.base_url;

//************Example of get_product_details function start***********

// Function to get product details including images and colors

async function get_product_details_by_id(product_id) {
  const product = await get_product_by_id(product_id);
  const product_images = await get_product_images(product_id);
  const product_colors = await get_product_color(product_id);
  const product_brands = await get_product_brandd(product_id);
  const product_styles = await get_product_style(product_id);
  const product_size = await get_product_size(product_id);
  const product_billing = await get_product_billing(product_id);

  const product_padding = await get_product_padding(product_id);

  return {
    product,
    product_images,
    product_colors,
    product_brands,
    product_styles,
    product_size,
    product_billing,

    product_padding,
  };
}

// const get_product_details = async () => {
//   const productDetails = await getAllProduct();
//   const productImages = await getAllProduct_images();
//   const productColors = await getAllProduct_colors();
//   const product_brands = await fetch_product_brand();
//   const product_styles = await fetch_product_style();
//   const product_size = await fetch_product_size();
//   const product_billing = await fetch_product_billing();
//   const product_id = await fetch_product_id();
//   const product_padding = await fetch_product_padding();

//   // Combine product details, images, and colors
//   const combinedDetails = {
//     productDetails,
//     productImages,
//     productColors,
//     product_brands,
//     product_styles,
//     product_size,
//     product_billing,
//     product_id,
//     product_padding,
//   };

//   return combinedDetails;
// };

const fetchProduct = async () => {
  const product_categories = await fetchProductCategories();
  const product_brand = await fetchProductBrand();
  const productBuy_rent = await fetchProductBuyRent();
  const product_rental_period = await fetchProductRentalPeriod();
  const styleTop = await fetchProductStyleTop();
  const styleBottom = await fetchProductStyleBottom();
  const sizeTop = await fetchProductSizeTop();
  const sizeBottom = await fetchProductSizeBottom();
  const sizeStandard = await fetchProductSizeStandard();
  const productColor = await fetchProductColor();
  const billingType = await fetchProductBillingType();
  const billingLevel = await fetchProductBillingLevel();
  const billingCondition = await fetchProductBillingCondition();
  const padding = await fetchProductPadding();
  const location = await fetchProductLocation();

  // Transform array of objects into array of unique strings
  const transformArray = (array) =>
    Array.from(new Set(array.map((item) => item[Object.keys(item)[0]])));

  // Combine product details, images, and colors
  const combinedDetails = {
    product_categories: transformArray(product_categories),
    product_brand: transformArray(product_brand),
    productBuy_rent: transformArray(productBuy_rent),
    product_rental_period: transformArray(product_rental_period),
    styleTop: transformArray(styleTop),
    styleBottom: transformArray(styleBottom),
    sizeTop: transformArray(sizeTop),
    sizeBottom: transformArray(sizeBottom),
    sizeStandard: transformArray(sizeStandard),
    productColor: transformArray(productColor),
    billingType: transformArray(billingType),
    billingLevel: transformArray(billingLevel),
    billingCondition: transformArray(billingCondition),
    padding: transformArray(padding),
    location: transformArray(location),
  };

  return combinedDetails;
};

//********end Example of get_product_details function end**********

//***********product api kaif start here******************

exports.add_product = async (req, res) => {
  try {
    const {
      size_standard,
      product_buy_rent,
      location,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description,
    } = req.body;

    // Extract product_color separately
    const {
      product_color,
      product_brand,
      product_category,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
    } = req.body;

    // Validate common input using Joi
    const commonSchema = Joi.object({
      size_standard: Joi.string().optional(),

      product_buy_rent: Joi.string().required(),

      location: Joi.string().required(),
      price_sale_lend_price: Joi.number().required(),
      product_replacement_price: Joi.number().required(),
      product_rental_period: Joi.string().required(),
      product_description: Joi.string().required(),
    });

    const commonValidationResult = commonSchema.validate({
      size_standard,

      product_buy_rent,

      location,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description,
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
      // Insert common data into product
      const productData = {
        size_standard,
        product_buy_rent,
        location,
        price_sale_lend_price,
        product_replacement_price,
        product_rental_period,
        product_description,
      };

      const productResult = await insert__into_product(productData);
      const product_id = productResult.insertId; // Get the auto-generated product_id

      // Insert images
      let filename = "";
      if (req.files) {
        const file = req.files;
        console.log("request files==>>>", file);
        var productImage = [];
        for (let i = 0; i < file.length; i++) {
          productImage.push(req.files[i].filename);
        }
      }
      console.log("product_image==>>>", productImage);

      await Promise.all(
        productImage.map(async (item) => {
          let imageData = {
            product_image: item,
            product_id: product_id,
          };

          const insertImageResult = await insert_product_images(imageData);
        })
      );

      // Insert color separately
      const colorData = {
        product_id,
        product_color,
      };

      const insertColorResult = await insert_product_color(colorData);

      const brandData = {
        product_id,
        product_brand,
      };

      const insertBrandResult = await insert_product_brand(brandData);

      const billingData = {
        product_id,
        billing_type,
        billing_level,
        billing_condition,
      };

      const insertBillingResult = await insert_product_billing(billingData);

      const categoryData = {
        product_id,
        product_category,
      };

      const insertCategoryResult = await insert_product_category(categoryData);

      const sizeData = {
        product_id,
        size_top,
        size_bottom,
      };

      const insertSizeResult = await insert_product_size(sizeData);

      const styleData = {
        product_id,
        style_top,
        style_bottom,
      };

      const insertStyleResult = await insert_product_style(styleData);

      const padding = {
        product_id,
        product_padding,
      };

      const insertPaddingResult = await insert_product_padding(padding);

      // Fetch product details including images and colors
      const productDetails = await get_product_details_by_id(product_id);

      return res.json({
        success: true,
        message: "Product added successfully!",
        status: 200,
        data: productDetails,
      });
    }
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

// exports.edit_product = async (req, res) => {
//   try {
//     // Joi validation for req.body
//     const schema = Joi.object({
//       product_id: Joi.number().required(),
//       product_name: Joi.string().empty().required(),
//       product_type: Joi.string().empty().required(),
//       product_price: Joi.number().required(),
//       product_brand: Joi.string().empty().required(),
//       product_id: Joi.string().empty().required(),
//       size_top: Joi.string().optional(),
//       size_bottom: Joi.string().optional(),
//       size_standard: Joi.string().empty().required(),
//       style_top: Joi.string().empty().required(),
//       style_bottom: Joi.string().empty().required(),
//       billing_type: Joi.string().empty().required(),
//       billing_level: Joi.string().empty().required(),
//       billing_condition: Joi.string().empty().required(),
//       product_padding: Joi.string().empty().required(),
//       location: Joi.string().empty().required(),
//       price_sale_lend_price: Joi.number().required(),
//       product_replacement_price: Joi.number().required(),
//       product_rental_period: Joi.string().empty().required(),
//       product_description: Joi.string().empty().required(),
//     });

//     const bodyValidationResult = schema.validate(req.body, {
//       allowUnknown: true,
//     });

//     if (bodyValidationResult.error) {
//       return res.status(400).json({
//         success: false,
//         status: 400,
//         message: bodyValidationResult.error.details[0].message,
//       });
//     }

//     const {
//       product_id,
//       product_name,
//       product_type,
//       product_price,
//       product_brand,
//       product_id,
//       size_top,
//       size_bottom,
//       size_standard,
//       style_top,
//       style_bottom,
//       billing_type,
//       billing_level,
//       billing_condition,
//       product_padding,
//       location,
//       price_sale_lend_price,
//       product_replacement_price,
//       product_rental_period,
//       product_description,
//     } = req.body;
//     const { product_color } = req.body;
//     // Check if the product_id is provided
//     if (!product_id) {
//       return res.status(400).json({
//         success: false,
//         status: 400,
//         message: "Product ID is required for editing.",
//       });
//     }

//     // Check if the product exists
//     const existingProduct = await get_product_by_id(product_id);
//     if (existingProduct.length === 0) {
//       return res.status(404).json({
//         success: false,
//         status: 404,
//         message: "Product not found.",
//       });
//     }

//     // Update product details
//     const updatedData = {
//       product_name,
//       product_type,
//       product_price,
//       product_brand,
//       product_id,
//       size_top,
//       size_bottom,
//       size_standard,
//       style_top,
//       style_bottom,
//       billing_type,
//       billing_level,
//       billing_condition,
//       product_padding,
//       location,
//       price_sale_lend_price,
//       product_replacement_price,
//       product_rental_period,
//       product_description,
//     };

//     // Perform the update query
//     const updateResult = await update_product(product_id, updatedData);

//     // Check if the update was successful
//     if (updateResult) {
//       // If product images are provided, update them
//       if (req.files && req.files.length > 0) {
//         const file = req.files;
//         const productImage = [];

//         for (let i = 0; i < file.length; i++) {
//           productImage.push(req.files[i].filename);
//         }

//         // Delete existing product images
//         await delete_product_images(product_id);

//         // Insert new product images
//         await insert_product_images_bulk(product_id, productImage);
//       }

//       // If product colors are provided, update them
//       if (product_color) {
//         // Delete existing product colors
//         await delete_product_colors(product_id);

//         // Insert new product colors
//         const colorData = {
//           product_id: product_id,
//           product_color: product_color,
//         };
//         await insert_product_color(colorData);
//       }

//       // Get updated product details
//       const updatedProduct = await get_product_by_id(product_id);

//       return res.status(200).json({
//         success: true,
//         status: 200,
//         message: "Product updated successfully.",
//         data: updatedProduct,
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         status: 500,
//         message: "Product update failed.",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error,
//     });
//   }
// };

// exports.getProductDetails = async (req, res) => {
//   try {
//     const get_all_product = await get_product_details();

//     if (!get_all_product) {
//       return res.json({
//         success: false,
//         status: 400,
//         message: "No product found!",
//       });
//     } else {
//       // Extract product details, images, and colors separately
//       const productDetails = get_all_product.productDetails;
//       const productImages = get_all_product.productImages;
//       const productColors = get_all_product.productColors;
//       const productBrands = get_all_product.product_brands;
//       const productStyles = get_all_product.product_styles;
//       const productSize = get_all_product.product_size;
//       const productBilling = get_all_product.product_billing;
//       const productCategory = get_all_product.product_id;
//       const productPadding = get_all_product.product_padding;

//       // Create maps to store additional product details by product ID
//       const productBrandMap = new Map();
//       const productStyleMap = new Map();
//       const productSizeMap = new Map();
//       const productBillingMap = new Map();
//       const productCategoryMap = new Map();
//       const productPaddingMap = new Map();
//       const productImageMap = new Map();
//       const productColorMap = new Map();

//       productImages.forEach((image) => {
//         const product_id = image.product_id;
//         if (!productImageMap.has(product_id)) {
//           productImageMap.set(product_id, []);
//         }
//         productImageMap.get(product_id).push(image.product_image);
//       });

//       productColors.forEach((color) => {
//         const product_id = color.product_id;
//         if (!productColorMap.has(product_id)) {
//           productColorMap.set(product_id, []);
//         }
//         productColorMap.get(product_id).push(color.product_color);
//       });

//       productBrands.forEach((brand) => {
//         const product_id = brand.product_id;
//         if (!productBrandMap.has(product_id)) {
//           productBrandMap.set(product_id, []);
//         }
//         productBrandMap.get(product_id).push(brand.product_brand);
//       });

//       productStyles.forEach((style) => {
//         const product_id = style.product_id;
//         if (!productStyleMap.has(product_id)) {
//           productStyleMap.set(product_id, []);
//         }
//         productStyleMap.get(product_id).push(style.product_style);
//       });

//       productSize.forEach((size) => {
//         const product_id = size.product_id;
//         if (!productSizeMap.has(product_id)) {
//           productSizeMap.set(product_id, []);
//         }
//         productSizeMap.get(product_id).push(size.product_size);
//       });

//       productBilling.forEach((billing) => {
//         const product_id = billing.product_id;
//         if (!productBillingMap.has(product_id)) {
//           productBillingMap.set(product_id, []);
//         }
//         productBillingMap.get(product_id).push({
//           billing_type: billing.billing_type,
//           billing_level: billing.billing_level,
//           billing_condition: billing.billing_condition,
//         });
//       });

//       productCategory.forEach((category) => {
//         const product_id = category.product_id;
//         if (!productCategoryMap.has(product_id)) {
//           productCategoryMap.set(product_id, []);
//         }
//         productCategoryMap.get(product_id).push(category.product_id);
//       });

//       productPadding.forEach((padding) => {
//         const product_id = padding.product_id;
//         if (!productPaddingMap.has(product_id)) {
//           productPaddingMap.set(product_id, []);
//         }
//         productPaddingMap.get(product_id).push(padding.product_padding);
//       });

//       // Combine product details, images, and colors
//       const combinedDetails = productDetails.map((detail) => {
//         const product_id = detail.id;

//         return {
//           ...detail,
//           product_images: (productImageMap.get(product_id) || []).map(
//             (imagePath) => `${baseurl}/productImage/${imagePath}`
//           ),
//           product_colors: productColorMap.get(product_id) || [],
//           product_brands: productBrandMap.get(product_id) || [],
//           product_styles: productStyleMap.get(product_id) || [],
//           product_size: productSizeMap.get(product_id) || [],
//           product_billing: productBillingMap.get(product_id) || [],
//           product_id: productCategoryMap.get(product_id) || [],
//           product_padding: productPaddingMap.get(product_id) || [],
//         };
//       });

//       return res.json({
//         success: true,
//         status: 200,
//         message: "All product fetch successfully!",
//         data: combinedDetails,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error,
//     });
//   }
// };

// exports.get_all_Product = async (req, res) => {
//   try {
//     const allProduct = await getAllProduct();

//     if (allProduct && allProduct.length > 0) {
//       const productMap = {};

//       // Group items by ID
//       allProduct.forEach((item) => {
//         if (!productMap[item.id]) {
//           productMap[item.id] = {
//             ...item,
//             product_images: [item.product_image],
//           };
//         } else {
//           productMap[item.id].product_images.push(item.product_image);
//         }
//       });

//       // Convert the map values to an array
//       const updatedCombinedCart = Object.values(productMap).map((item) => {
//         const {
//           product_category,
//           product_image,
//           product_colors,
//           product_brands,
//           style_top,
//           style_bottom,
//           size_top,
//           size_bottom,
//           billing_type,
//           billing_level,
//           billing_condition,

//           product_padding,
//           ...rest
//         } = item;

//         return {
//           ...rest,
//           // cart_price: item.price_sale_lend_price * item.cart_quantity,
//           product_category: [product_category],
//           product_images: item.product_images,
//           product_colors: product_colors
//             .split(",")
//             .map((color) => color.trim()),
//           product_brands: [product_brands],
//           product_styles: [
//             { style_top: style_top, style_bottom: style_bottom },
//           ],
//           product_size: [{ size_top: size_top, size_bottom: size_bottom }],
//           product_billing: [
//             {
//               billing_type: billing_type,
//               billing_level: billing_level,
//               billing_condition: billing_condition,
//             },
//           ],

//           product_padding: [product_padding],
//         };
//       });

//       return res.json({
//         message: "All product details",
//         status: 200,
//         success: true,
//         products: updatedCombinedCart,
//       });
//     } else {
//       return res.json({
//         message: "No data found",
//         status: 200,
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error,
//     });
//   }
// };


exports.get_all_Product = async (req, res) => {
  try {
    const userId = req.params.userId; 

    const allProduct = await getAllProduct();

    if (allProduct && allProduct.length > 0) {
      const productMap = {};

      // Group items by ID
      allProduct.forEach((item) => {
        if (!productMap[item.id]) {
          productMap[item.id] = {
            ...item,
            product_images: [item.product_image],
           
          };
         } 
        else {
          productMap[item.id].product_images.push(item.product_image);
        }
      });

     
      const updatedCombinedCart = Object.values(productMap).map((item) => {
        const {
          wishlist_like,
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

        // Set wishlist_like based on user ID
        rest.wishlist_like = userId == "guest" ? 0 : (item.wishlist_like ? 1 : 0);

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
        products: updatedCombinedCart,
      });
    } else {
      return res.json({
        message: "No data found",
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






exports.getProductDetails_by_id = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (product_id) {
      // If product_category is provided, fetch details by category
      const categoryDetails = await getAllProduct_by_id(product_id);

      if (!categoryDetails || categoryDetails.length === 0) {
        return res.json({
          success: false,
          status: 400,
          message: `No products found for category: ${product_id}`,
        });
      } else {
        // Group products by ID
        const groupedProducts = {};
        categoryDetails.forEach((detail) => {
          const productId = detail.id;
          if (!groupedProducts[productId]) {
            groupedProducts[productId] = {
              ...detail,
              product_images: [detail.product_image],
            };
          } else {
            groupedProducts[productId].product_images.push(
              detail.product_image
            );
          }
        });

        // Convert the grouped products object into an array
        const combinedDetails = Object.values(groupedProducts);

        return res.json({
          success: true,
          status: 200,
          message: `Products for id ${product_id} fetched successfully!`,
          data: combinedDetails,
        });
      }
    } else {
      return res.json({
        success: false,
        status: 400,
        message: "Product id is required!",
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

exports.getProductDetails_by_Category = async (req, res) => {
  try {
    const { product_category } = req.params;

    if (product_category) {
      // If product_category is provided, fetch details by category
      const categoryDetails = await getAllProduct_by_category(product_category);

      if (!categoryDetails || categoryDetails.length === 0) {
        return res.json({
          success: false,
          status: 400,
          message: `No products found for category: ${product_category}`,
        });
      } else {
        // Group products by ID
        const groupedProducts = {};
        categoryDetails.forEach((detail) => {
          const productId = detail.id;
          if (!groupedProducts[productId]) {
            groupedProducts[productId] = {
              ...detail,
              product_images: [detail.product_image],
            };
          } else {
            groupedProducts[productId].product_images.push(
              detail.product_image
            );
          }
        });

        // Convert the grouped products object into an array
        const combinedDetails = Object.values(groupedProducts);

        return res.json({
          success: true,
          status: 200,
          message: `Products for category ${product_category} fetched successfully!`,
          data: combinedDetails,
        });
      }
    } else {
      return res.json({
        success: false,
        status: 400,
        message: "Product category is required!",
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

// exports.get_all_filter_Product = async (req, res) => {
//   try {
//     const {
//       product_brand,
//       product_id,
//       size_top,
//       size_bottom,
//       style_top,
//       style_bottom,
//       billing_type,
//       billing_level,
//       billing_condition,
//       product_padding,
//       location,
//       price_sale_lend_price,
//       product_replacement_price,
//       product_rental_period,
//       product_description,
//     } = req.body;

//     const filteredProducts = await getAllProduct_filter(
//       product_brand,
//       product_id,
//       size_top,
//       size_bottom,
//       style_top,
//       style_bottom,
//       billing_type,
//       billing_level,
//       billing_condition,
//       product_padding,
//       location,
//       price_sale_lend_price,
//       product_replacement_price,
//       product_rental_period,
//       product_description
//     );

//     if (filteredProducts.length > 0) {
//       return res.json({
//         success: true,
//         message: "Products filtered successfully",
//         status: 200,
//         filteredProducts,
//       });
//     } else {
//       return res.json({
//         success: false,
//         message: "No products found with the specified filters",
//         status: 404,
//       });
//     }
//   } catch (error) {
//     console.error("Error in get_all_products:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error.message,
//     });
//   }
// };

exports.get_all_filter_Product = async (req, res) => {
  try {
    const {
      product_brand,
      product_category,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
      location,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description,
    } = req.body;

    const filteredProducts = await getAllProduct_filter(
      product_brand,
      product_category,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
      location,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description
    );

    const formattedProducts = filteredProducts.map((item) => ({
      id: item.id,
      seller_id: item.seller_id,
      product_brand: item.product_brand,
      product_category: item.product_category,
      size_top: item.size_top,
      size_bottom: item.size_bottom,
      size_standard: item.size_standard,
      style_top: item.style_top,
      style_bottom: item.style_bottom,
      billing_type: item.billing_type,
      billing_level: item.billing_level,
      billing_condition: item.billing_condition,
      product_buy_rent: item.product_buy_rent,
      product_padding: item.product_padding,
      location: item.location,
      price_sale_lend_price: item.price_sale_lend_price,
      product_replacement_price: item.product_replacement_price,
      product_rental_period: item.product_rental_period,
      product_description: item.product_description,
      created_at: item.created_at,
      updated_at: item.updated_at,
      test: item.test,
      product_colors: item.product_colors.split(",").filter(Boolean),
      product_images: item.product_images
        .split(",")
        .map((image) => `${baseurl}/productImage/${image}`)
        .filter(Boolean),
    }));

    if (formattedProducts.length > 0) {
      return res.json({
        success: true,
        message: "Products filtered successfully",
        status: 200,
        filteredProducts: formattedProducts,
      });
    } else {
      return res.json({
        success: false,
        message: "No products found with the specified filters",
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error in get_all_products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

exports.fetchProCategories = async (req, res) => {
  try {
    const result = await fetchProduct();

    if (result) {
      return res.json({
        success: true,
        status: 200,
        message: "All categories fetch successfully!",
        data: result,
      });
    } else {
      return res.json({
        success: false,
        status: 200,
        message: "Categories fetch failed!",
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

//***************product api kaif end here*******************

exports.deleteProductDetails = async (req, res) => {
  try {
    const product_id = req.params.id;

    const data = await deleteProductDetailsById(product_id);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "product deleted successfully!",
        data: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "product  Not Found",
        data: [],
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

exports.getProductDetailsById = async (req, res) => {
  try {
    const prodcutId = req.params.id;
    const allProductDetails = await getAllProductByIdd(prodcutId);
    if (allProductDetails !== 0 && allProductDetails.length > 0) {
      return res.json({
        message: "allProduct ",
        status: 200,
        success: true,
        Product: allProductDetails,
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

//product
exports.get_Product = async (req, res) => {
  try {
    const allProduct = await getProduct();
    if (allProduct !== 0) {
      console.log("==================alll", allProduct);
      return res.json({
        message: "allProduct ",
        status: 200,
        success: true,
        allProduct: allProduct,
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
exports.addProduct = async (req, res) => {
  try {
    const productData = {
      productName: req.body.productName,
      categoryId: req.body.categoryId,
    };

    // Validate the input using Joi
    const schema = Joi.object({
      productName: Joi.string().empty().required(),
      categoryId: Joi.number().required(),
    });

    const result = schema.validate({
      ...req.body, // Include text data
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

    const data = await createProduct(productData);
    return res.json({
      success: true,
      message: "Product added successfully.",
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

exports.editProduct = async (req, res) => {
  try {
    const Data = {
      productName: req.body.productName,
      categoryId: req.body.categoryId,
    };

    // Validate the input using Joi
    const schema = Joi.object({
      productName: Joi.string().empty().required(),
      categoryId: Joi.number().required(),
    });

    const result = schema.validate({
      ...req.body, // Include text data
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
    } else {
      const product_id = req.params.id;

      const productData = await fetchProductById(product_id);

      if (productData.length !== 0) {
        const result = await updateProductById(Data, product_id);

        if (result.affectedRows) {
          const updateData = await fetchProductById(product_id);

          return res.json({
            message: "product details updated successfully!",
            status: 200,
            success: true,
            user_info: updateData[0],
          });
        } else {
          return res.json({
            message: "update product failed ",
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

exports.deleteProduct = async (req, res) => {
  try {
    const product_id = req.params.id;

    const data = await deleteProductById(product_id);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "product deleted successfully!",
        user_info: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "product  Not Found",
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

// exports.get_all_filter_Product = async (req, res) => {
//   try {
//     const data = {
//       productType: req.query.productType ? req.query.productType.trim() : "",
//       brand: req.query.brand ? req.query.brand.trim() : "",
//       sizeTop: req.query.sizeTop ? req.query.sizeTop.trim() : "",
//       sizeBottom: req.query.sizeBottom ? req.query.sizeBottom.trim() : "",
//       styleTop: req.query.styleTop ? req.query.styleTop.trim() : "",
//       styleBottom: req.query.styleBottom ? req.query.styleBottom.trim() : "",
//       angelsThemeWear: req.query.angelsThemeWear
//         ? req.query.angelsThemeWear.trim()
//         : "",
//       shoes: req.query.shoes ? req.query.shoes.trim() : "",
//       blingLevel: req.query.blingLevel ? req.query.blingLevel.trim() : "",
//       condition: req.query.condition ? req.query.condition.trim() : "",
//       padding: req.query.padding ? req.query.padding.trim() : "",
//       blingType: req.query.blingType ? req.query.blingType.trim() : "",
//       location: req.query.location ? req.query.location.trim() : "",
//       priceFrom: req.query.priceFrom ? req.query.priceFrom.trim() : "",
//       priceTo: req.query.priceTo ? req.query.priceTo.trim() : "",
//       color: req.query.color ? req.query.color.trim() : "",
//       size: req.query.size ? req.query.size.trim() : "",
//       leaseFrom: req.query.leaseFrom ? req.query.leaseFrom.trim() : "",
//       leaseTo: req.query.leaseTo ? req.query.leaseTo.trim() : "",
//     };

//     const allProduct = await getAllFilterProduct(data);

//     if (allProduct.length > 0) {
//       return res.json({
//         message: "Products filtered successfully",
//         status: 200,
//         success: true,
//         allProduct: allProduct,
//       });
//     } else {
//       return res.json({
//         message: "No products found with the specified filters",
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
//       error: error,
//     });
//   }
// };

exports.getProductById = async (req, res) => {
  try {
    const product_id = req.params.id;
    const Product = await fetchProductById(product_id);
    if (Product !== 0) {
      return res.json({
        message: "allProduct ",
        status: 200,
        success: true,
        Product: Product,
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
