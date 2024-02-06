const { raw } = require("mysql");
const db = require("../utils/database");
const config = require("../config");

const baseurl = config.base_url;

module.exports = {
  createProductDetails: async (productDetails) => {
    console.log(productDetails);
    return db.query("INSERT INTO Products_Details SET ?", [productDetails]);
  },

  createProduct: async (product) => {
    console.log(product);
    return db.query("INSERT INTO Product SET ?", [product]);
  },
  // getAllProducttttt: async () => {
  //   try {
  //     const sql = `
  //           SELECT
  //               Product.productName AS categoryProduct,
  //               Categories.categoryName,
  //               Categories.categoryImage,
  //               Products_Details.productName,
  //               Products_Details.productType,
  //               Products_Details.location,
  //               Products_Details.description,
  //               Products_Details.price,
  //               Products_Details.color,
  //               Products_Details.size,
  //               Products_Details.stockQuantity,
  //               Products_Details.discount,
  //               Products_Details.productImage,
  //               Products_Details.sku,
  //               Products_Details.brand,
  //               Products_Details.blingLevel,
  //               Products_Details.condition,
  //               Products_Details.padding,
  //               Products_Details.blingType,
  //               Size.sizeTop,
  //               Size.sizeBottom,
  //               Style.top AS styleTop,
  //               Style.bottom AS styleBottom,
  //               Style.angelsThemeWear,
  //               Style.shoes

  //           FROM Products_Details
  //           JOIN Product ON Products_Details.productId = Product.id
  //           JOIN Categories ON Product.categoryId = Categories.id
  //           JOIN Size ON Products_Details.sizeId = Size.id
  //           JOIN Style ON Products_Details.styleId = Style.id;
  //       `;
  //     return (result = await db.query(sql));
  //   } catch (error) {
  //     console.error("Error in getAllProduct:", error);
  //     throw error; // Rethrow the error for the calling function to handle
  //   }
  // },

  fetchProductById: async (id) => {
    return db.query(" select * from Product where id= ?", [id]);
  },
  fetchProductDetailsById: async (id) => {
    return db.query(" select * from Products_Details where id= ?", [id]);
  },

  updateProductById: async (data, id) => {
    const query = "UPDATE Product SET productName=?, categoryId=? WHERE id=?";
    const result = await db.query(query, [
      data.productName,
      data.categoryId,
      id,
    ]);
    return result;
  },
  updateProductDetailsById: async (data, id) => {
    try {
      const query = `
        UPDATE Products_Details 
        SET 
          productName=?, 
          description=?, 
          price=?, 
          color=?, 
          size=?, 
          stockQuantity=?, 
          productImage=?, 
          sku=?, 
          brand=?, 
          productId=?, 
          discount=?, 
          blingType=?, 
          blingLevel=?, 
          \`condition\`=?,  -- Use backticks to escape the reserved keyword
          padding=? 
        WHERE id=?
      `;
      const result = await db.query(query, [
        data.productName,
        data.description,
        data.price,
        data.color,
        data.size,
        data.stockQuantity,
        data.productImage,
        data.sku,
        data.brand,
        data.productId,
        data.discount,
        data.blingType,
        data.blingLevel,
        data.condition,
        data.padding,
        id,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteProductById: async (id) => {
    return db.query(`delete  from Product where id='${id}' `);
  },
  getAllProductById: async (productId) => {
    try {
      const sql = `
            SELECT 
                Product.productName AS categoryProduct,
                Categories.categoryName,
                Categories.categoryImage,
                Products_Details.productName,
                Products_Details.productType,
                Products_Details.location,
                Products_Details.description,
                Products_Details.price,
                Products_Details.color, 
                Products_Details.size,
                Products_Details.stockQuantity,
                Products_Details.discount,
                Products_Details.productImage,
                Products_Details.sku,
                Products_Details.brand,
                Products_Details.blingLevel,
                Products_Details.condition,
                Products_Details.padding,
                Products_Details.blingType,
                Size.sizeTop,
                Size.sizeBottom,
                Style.top AS styleTop,
                Style.bottom AS styleBottom,
                Style.angelsThemeWear,
                Style.shoes
            FROM Products_Details
            JOIN Product ON Products_Details.productId = Product.id
            JOIN Categories ON Product.categoryId = Categories.id
            JOIN Size ON Products_Details.sizeId = Size.id
            JOIN Style ON Products_Details.styleId = Style.id
            WHERE Product.id = ?;  -- Add this WHERE clause to filter by product ID
        `;
      return (result = await db.query(sql, [productId]));
    } catch (error) {
      console.error("Error in getAllProductById:", error);
      throw error; // Rethrow the error for the calling function to handle
    }
  },

  //***********Kaif start here******************

  fetchBuyerBy_Id: async (id) => {
    return db.query(`select * from tbl_buyer where id= '${id}'`, [id]);
  },

  getAllProducttt: async () => {
    return db.query("select * from product  ");
  },

  // getAllProduct: async () => {
  //   try {
  //     const sql = `
  //     SELECT

  //     product.id,
  //     product.location,
  //     product.price_sale_lend_price,
  //     product.product_replacement_price,
  //     product.product_rental_period,
  //     product.product_description,
  //     CONCAT('${baseurl}/productImage/', product_images.product_image) AS product_image,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_colors.product_color), '') AS product_color,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_brands.product_brand), '') AS product_brand,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_styles.style_top), '') AS style_top,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_styles.style_bottom), '') AS style_bottom,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_size.size_top), '') AS size_top,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_size.size_bottom), '') AS size_bottom,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_type), '') AS billing_type,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_level), '') AS billing_level,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_condition), '') AS billing_condition,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_category.product_category), '') AS product_category,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_padding.product_padding), '') AS product_padding
  //    FROM product

  //    LEFT JOIN cart on product.id = cart.product_id
  //     LEFT JOIN product_images ON product.id = product_images.product_id
  //     LEFT JOIN product_colors ON product.id = product_colors.product_id
  //     LEFT JOIN product_brands ON product.id = product_brands.product_id
  //     LEFT JOIN product_styles ON product.id = product_styles.product_id
  //     LEFT JOIN product_size ON product.id = product_size.product_id
  //     LEFT JOIN product_billing ON product.id = product_billing.product_id
  //     LEFT JOIN product_category ON product.id = product_category.product_id
  //     LEFT JOIN product_padding ON product.id = product_padding.product_id

  //   `;

  //     return (result = await db.query(sql));
  //   } catch (error) {
  //     console.error("Error in getAllProduct:", error);
  //     throw error; // Rethrow the error for the calling function to handle
  //   }
  // },

  getAllProduct: async () => {
    try {
      const sql = `
      SELECT
        product.id,
        product.location,
        product.product_buy_rent,
        product.price_sale_lend_price,
        product.product_replacement_price,
        product.product_rental_period,
        product.product_description,
        product.wishlist_like,
        CONCAT('${baseurl}/productImage/', product_images.product_image) AS product_image,
        CONCAT(product_colors.product_color) AS product_colors,
        CONCAT(product_brands.product_brand) AS product_brands,
        CONCAT(product_styles.style_top) AS style_top,
        CONCAT(product_styles.style_bottom) AS style_bottom,
        CONCAT(product_size.size_top) AS size_top,
        CONCAT(product_size.size_bottom) AS size_bottom,
        CONCAT(product_billing.billing_type) AS billing_type,
        CONCAT(product_billing.billing_level) AS billing_level,
        CONCAT(product_billing.billing_condition) AS billing_condition,
        CONCAT(product_category.product_category) AS product_category,
        CONCAT(product_padding.product_padding) AS product_padding
      FROM product
      LEFT JOIN product_images ON product.id = product_images.product_id
      LEFT JOIN product_colors ON product.id = product_colors.product_id
      LEFT JOIN product_brands ON product.id = product_brands.product_id
      LEFT JOIN product_styles ON product.id = product_styles.product_id
      LEFT JOIN product_size ON product.id = product_size.product_id
      LEFT JOIN product_billing ON product.id = product_billing.product_id
      LEFT JOIN product_category ON product.id = product_category.product_id
      LEFT JOIN product_padding ON product.id = product_padding.product_id;
    `;

      return (result = await db.query(sql));
    } catch (error) {
      console.error("Error in getAllProduct:", error);
      throw error; // Rethrow the error for the calling function to handle
    }
  },

  get__products: async () => {
    return db.query("SELECT * FROM product ORDER BY id DESC LIMIT 1; ");
  },

  getAllProduct_images: async () => {
    return db.query("select * from product_images ");
  },

  getAllProduct_colors: async () => {
    return db.query("select * from product_colors ");
  },

  insert__into_product: async (data) => {
    return db.query("INSERT INTO product SET ?", [data]);
  },

  insert_product_images: async (data) => {
    return db.query(`insert into product_images set ?`, [data]);
  },

  insert_product_images_bulk: async (product_id, data) => {
    return db.query(
      `INSERT INTO product_images (product_id, product_image) VALUES (?, ?)`,
      [product_id, data]
    );
  },

  get_product_imagesss: async (product_id) => {
    return db.query(
      `SELECT * FROM product_images  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_images: async (product_id) => {
    // Execute the query
    const result = await db.query(
      `SELECT * FROM product_images WHERE product_id = ${product_id}`,
      [product_id]
    );

    // Process the results to prepend base URL
    const productImagesWithBaseUrl = result.map((image) => ({
      ...image,
      product_image: `${baseurl}/productImage/${image.product_image}`,
    }));

    return productImagesWithBaseUrl;
  },
  get_product_by_id: async (product_id) => {
    return db.query(`SELECT * FROM product WHERE id = ?`, [product_id]);
  },

  update_product: async (product_id, updatedData) => {
    return db.query(`UPDATE product SET ? WHERE id = ?`, [
      updatedData,
      product_id,
    ]);
  },

  delete_product_images: async (product_id) => {
    return db.query(`DELETE FROM product_images WHERE product_id = ?`, [
      product_id,
    ]);
  },

  get_Product_Details: async () => {
    return db.query("select * from product  ");
  },

  get_product_by_id: async (product_id) => {
    return db.query(`select * from product where id=?`, [product_id]);
  },

  get_product_by_category: async (product_category) => {
    return db.query(`select * from product where product_category=?`, [
      product_category,
    ]);
  },

  insert_product_color: async (data) => {
    return db.query(`insert into product_colors set ?`, [data]);
  },

  get_product_color: async (product_id) => {
    return db.query(
      `SELECT * FROM product_colors  where product_id = ${product_id}`,
      [product_id]
    );
  },

  // Example of delete_product_colors
  delete_product_colors: async (product_id) => {
    return db.query(`DELETE FROM product_colors WHERE product_id = ?`, [
      product_id,
    ]);
  },

  getAllProduct_by_categoryyyy: async (product_category) => {
    try {
      const params = [product_category];
      let sql = `
        SELECT
         product.id,
          product.product_brand,
          product.product_category,
          product.size_top,
          product.size_bottom,
          product.style_top,
          product.style_bottom,
          product.billing_type,
          product.billing_level,
          product.billing_condition,
          product.product_padding,
          product.location,
          product.price_sale_lend_price,
          product.product_replacement_price,
          product.product_rental_period,
          product.product_description,
          CONCAT('${baseurl}/productImage/', product_images.product_image) as product_image,
          product_colors.product_color
         
        FROM product
          LEFT JOIN product_images ON product.id = product_images.product_id
          LEFT JOIN product_colors ON product.id = product_colors.product_id
          
        WHERE product.product_category = ?
      `;

      // Execute the query
      const result = await db.query(sql, params);

      return result;
    } catch (error) {
      console.error("Error in getAllProduct_filter:", error);
      throw error;
    }
  },
  // getAllProduct_filter: async (
  //   product_brand,
  //   product_category,
  //   size_top,
  //   size_bottom,
  //   style_top,
  //   style_bottom,
  //   billing_type,
  //   billing_level,
  //   billing_condition,
  //   product_padding,
  //   location,
  //   price_sale_lend_price,
  //   product_replacement_price,
  //   product_rental_period,
  //   product_description
  // ) => {
  //   let where = ' WHERE 1 = 1'; // Default condition

  //   if (product_brand !== undefined && product_brand !== "") {
  //     where += ` AND product_brand = '${product_brand}'`;
  //   }
  //   if (product_category !== undefined && product_category !== "") {
  //     where += ` AND product_category = '${product_category}'`;
  //   }
  //   if (size_top !== undefined && size_top !== "") {
  //     where += ` AND size_top = '${size_top}'`;
  //   }
  //   if (size_bottom !== undefined && size_bottom !== "") {
  //     where += ` AND size_bottom = '${size_bottom}'`;
  //   }
  //   if (style_top !== undefined && style_top !== "") {
  //     where += ` AND style_top = '${style_top}'`;
  //   }
  //   if (style_bottom !== undefined && style_bottom !== "") {
  //     where += ` AND style_bottom = '${style_bottom}'`;
  //   }
  //   if (billing_type !== undefined && billing_type !== "") {
  //     where += `AND billing_type = '${billing_type}'`;
  //   }
  //   if (billing_level !== undefined && billing_level !== "") {
  //     where += ` AND billing_level = '${billing_level}'`;
  //   }
  //   if (billing_condition !== undefined && billing_condition !== "") {
  //     where += ` AND billing_condition = '${billing_condition}'`;
  //   }
  //   if (product_padding !== undefined && product_padding !== "") {
  //     where += ` AND product_padding = '${product_padding}'`;
  //   }
  //   if (location !== undefined && location !== "") {
  //     where += ` AND location = '${location}'`;
  //   }
  //   if (price_sale_lend_price !== undefined && price_sale_lend_price !== "") {
  //     where += ` AND price_sale_lend_price = '${price_sale_lend_price}'`;
  //   }
  //   if (product_replacement_price !== undefined && product_replacement_price !== "") {
  //     where += ` AND product_replacement_price = '${product_replacement_price}'`;
  //   }
  //   if (product_rental_period !== undefined && product_rental_period !== "") {
  //     where += ` AND product_rental_period = '${product_rental_period}'`;
  //   }
  //   if (product_description !== undefined && product_description !== "") {
  //     where += ` AND product_description LIKE '%${product_description}%'`;
  //   }

  //   const query = `SELECT * FROM product ${where} ORDER BY id DESC`;

  //   return db.query(query);
  // },

  checkNUllUnd: (data) => {
    return data === undefined || data === null ? 0 : data;
  },
  // getAllProduct_filter: async (
  //   product_brand,
  //   product_category,
  //   size_top,
  //   size_bottom,
  //   style_top,
  //   style_bottom,
  //   billing_type,
  //   billing_level,
  //   billing_condition,
  //   product_padding,
  //   location,
  //   price_sale_lend_price,
  //   product_replacement_price,
  //   product_rental_period,
  //   product_description
  // ) => {
  //   let where = ""; // Default condition

  //   where = ` where product_brand = '${product_brand}'  `;
  //   if (product_category !== undefined && product_category !== "") {
  //     where += ` AND product_category = '${product_category}'`;
  //   }
  //   if (size_top !== undefined && size_top !== "") {
  //     where += ` AND size_top = '${size_top}'`;
  //   }
  //   if (size_bottom !== undefined && size_bottom !== "") {
  //     where += ` AND size_bottom = '${size_bottom}'`;
  //   }
  //   if (style_top !== undefined && style_top !== "") {
  //     where += `AND style_top = '${style_top}' `;
  //   }
  //   if (style_bottom !== undefined && style_bottom !== "") {
  //     where += ` AND style_bottom = '${style_bottom}'`;
  //   }
  //   if (billing_type !== undefined && billing_type !== "") {
  //     where += ` AND billing_type = '${billing_type}'`;
  //   }
  //   if (billing_level !== undefined && billing_level !== "") {
  //     where += `AND billing_level = '${billing_level}'`;
  //   }
  //   if (billing_condition !== undefined && billing_condition !== "") {
  //     where += ` AND billing_condition = '${billing_condition}'`;
  //   }
  //   if (product_padding !== undefined && product_padding !== "") {
  //     where += ` AND product_padding = '${product_padding}'`;
  //   }
  //   if (location !== undefined && location !== "") {
  //     where += ` AND location = '${location}'`;
  //   }
  //   if (price_sale_lend_price !== undefined && price_sale_lend_price !== "") {
  //     where += ` AND price_sale_lend_price = '${price_sale_lend_price}'`;
  //   }
  //   if (
  //     product_replacement_price !== undefined &&
  //     product_replacement_price !== ""
  //   ) {
  //     where += ` AND product_replacement_price = '${product_replacement_price}'`;
  //   }
  //   if (product_rental_period !== undefined && product_rental_period !== "") {
  //     where += ` AND product_rental_period = '${product_rental_period}'`;
  //   }
  //   if (product_description !== undefined && product_description !== "") {
  //     where += ` AND product_description LIKE '%${product_description}%'`;
  //   }

  //   // const query = `SELECT * FROM product ${where} ORDER BY id DESC`;
  //   const query = `
  //   SELECT
  //     product.id,
  //     product.seller_id,
  //     product.product_brand,
  //     product.product_category,
  //     product.size_top,
  //     product.size_bottom,
  //     product.size_standard,
  //     product.style_top,
  //     product.style_bottom,
  //     product.billing_type,
  //     product.billing_level,
  //     product.billing_condition,
  //     product.product_buy_rent,
  //     product.product_padding,
  //     product.location,
  //     product.price_sale_lend_price,
  //     product.product_replacement_price,
  //     product.product_rental_period,
  //     product.product_description,
  //     product.created_at,
  //     product.updated_at,

  //     GROUP_CONCAT(DISTINCT product_colors.product_color) AS product_colors,
  //     GROUP_CONCAT(DISTINCT product_images.product_image) AS product_images
  //   FROM
  //     product
  //   LEFT JOIN
  //     product_colors ON product.id = product_colors.product_id
  //   LEFT JOIN
  //     product_images ON product.id = product_images.product_id
  //   ${where}
  //   GROUP BY
  //     product.id
  //   ORDER BY
  //     product.id DESC`;

  //   console.log("Constructed Query:", query);
  //   return db.query(query);
  // },

  insert_product_brand: async (data) => {
    return db.query(`insert into product_brands set ?`, [data]);
  },

  getAllProduct_brands: async () => {
    return db.query("select * from product_brands ");
  },

  // All categories code here

  fetchProductCategories: async () => {
    return db.query("select product_category from product_category");
  },

  fetchProductBrand: async () => {
    return db.query("select product_brand from product_brands");
  },

  fetchProductBuyRent: async () => {
    return db.query("select product_buy_rent from product");
  },

  fetchProductSizeStandard: async () => {
    return db.query("select size_standard from product");
  },

  fetchProductLocation: async () => {
    return db.query("select location from product");
  },

  fetchProductColor: async () => {
    return db.query("select product_color from product_colors");
  },

  fetchProductRentalPeriod: async () => {
    return db.query("select product_rental_period from product");
  },

  fetchProductStyleTop: async () => {
    return db.query("select style_top from product_styles");
  },

  fetchProductStyleBottom: async () => {
    return db.query("select style_bottom from product_styles");
  },

  fetchProductSizeTop: async () => {
    return db.query("select size_top from product_size");
  },
  fetchProductSizeBottom: async () => {
    return db.query("select size_bottom from product_size");
  },
  fetchProductBillingType: async () => {
    return db.query("select billing_type from product_billing");
  },
  fetchProductBillingLevel: async () => {
    return db.query("select billing_level from product_billing");
  },
  fetchProductBillingCondition: async () => {
    return db.query("select billing_condition from product_billing");
  },
  fetchProductPadding: async () => {
    return db.query("select product_padding from product_padding");
  },

  // 01 feb code starts new

  insert_product_brand: async (data) => {
    return db.query(`insert into product_brands set ?`, [data]);
  },

  insert_product_billing: async (data) => {
    return db.query(`insert into product_billing set ?`, [data]);
  },

  insert_product_category: async (data) => {
    return db.query(`insert into product_category set ?`, [data]);
  },

  insert_product_size: async (data) => {
    return db.query(`insert into product_size set ?`, [data]);
  },

  insert_product_style: async (data) => {
    return db.query(`insert into product_styles set ?`, [data]);
  },

  insert_product_padding: async (data) => {
    return db.query(`insert into product_padding set ?`, [data]);
  },

  get_product_brandd: async (product_id) => {
    return db.query(
      `SELECT * FROM product_brands  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_style: async (product_id) => {
    return db.query(
      `SELECT * FROM product_styles  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_size: async (product_id) => {
    return db.query(
      `SELECT * FROM product_size  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_billing: async (product_id) => {
    return db.query(
      `SELECT * FROM product_billing  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_category: async (product_id) => {
    return db.query(
      `SELECT * FROM product_category  where product_id = ${product_id}`,
      [product_id]
    );
  },
  get_product_padding: async (product_id) => {
    return db.query(
      `SELECT * FROM product_padding  where product_id = ${product_id}`,
      [product_id]
    );
  },

  // fetch all product

  fetch_product_brand: async () => {
    return db.query(`SELECT * FROM product_brands  `);
  },
  fetch_product_style: async () => {
    return db.query(`SELECT * FROM product_styles  `);
  },
  fetch_product_size: async () => {
    return db.query(`SELECT * FROM product_size  `);
  },
  fetch_product_billing: async () => {
    return db.query(`SELECT * FROM product_billing `);
  },

  fetch_product_category: async () => {
    return db.query(`SELECT * FROM product_category  `);
  },

  fetch_product_padding: async () => {
    return db.query(`SELECT * FROM product_padding  `);
  },

  getAllProductByIdd: async (productId) => {
    try {
      const sql = `
        SELECT 
          product_category.product_category,
          product.size_standard,
          product.product_buy_rent,
          product.location,
          product.price_sale_lend_price,
          product.product_replacement_price,
          product.product_rental_period,
          product.product_description,
          product_size.size_top,
          product_size.size_bottom,
          product_styles.style_top,
          product_styles.style_bottom,
          product_brands.product_brand,
          product_billing.billing_type,
          product_billing.billing_level,
          product_billing.billing_condition,
          product_padding.product_padding,
          CONCAT('${baseurl}/productImage/', product_images.product_image) as product_image,
          product_colors.product_color
          
        FROM Product
        
        LEFT JOIN product_size ON Product.id = product_size.product_id
        LEFT JOIN product_styles ON Product.id = product_styles.product_id
        LEFT JOIN product_brands ON Product.id = product_brands.product_id
        LEFT JOIN product_billing ON Product.id = product_billing.product_id
        LEFT JOIN product_padding ON Product.id = product_padding.product_id
        LEFT JOIN product_category ON Product.id = product_category.product_id
        LEFT JOIN product_images ON product.id = product_images.product_id
          LEFT JOIN product_colors ON product.id = product_colors.product_id
        WHERE Product.id = ?;
      `;
      return (result = await db.query(sql, [productId]));
    } catch (error) {
      console.error("Error in getAllProductById:", error);
      throw error; // Rethrow the error for the calling function to handle
    }
  },

  // fetch product ends here

  getAllProduct_filter: async (
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
  ) => {
    let where = ""; // Default condition

    where = ` WHERE pb.product_brand = '${product_brand}'`;
    if (product_category !== undefined && product_category !== "") {
      where += ` AND pc.product_category = '${product_category}'`;
    }
    if (size_top !== undefined && size_top !== "") {
      where += ` AND ps.size_top = '${size_top}'`;
    }
    if (size_bottom !== undefined && size_bottom !== "") {
      where += ` AND ps.size_bottom = '${size_bottom}'`;
    }
    if (style_top !== undefined && style_top !== "") {
      where += ` AND pst.style_top = '${style_top}'`;
    }
    if (style_bottom !== undefined && style_bottom !== "") {
      where += ` AND pst.style_bottom = '${style_bottom}'`;
    }
    if (billing_type !== undefined && billing_type !== "") {
      where += ` AND pbi.billing_type = '${billing_type}'`;
    }
    if (billing_level !== undefined && billing_level !== "") {
      where += ` AND pbi.billing_level = '${billing_level}'`;
    }
    if (billing_condition !== undefined && billing_condition !== "") {
      where += ` AND pbi.billing_condition = '${billing_condition}'`;
    }
    if (product_padding !== undefined && product_padding !== "") {
      where += ` AND pp.product_padding = '${product_padding}'`;
    }
    if (location !== undefined && location !== "") {
      where += ` AND p.location = '${location}'`;
    }
    if (price_sale_lend_price !== undefined && price_sale_lend_price !== "") {
      where += ` AND p.price_sale_lend_price = '${price_sale_lend_price}'`;
    }
    if (
      product_replacement_price !== undefined &&
      product_replacement_price !== ""
    ) {
      where += ` AND p.product_replacement_price = '${product_replacement_price}'`;
    }
    if (product_rental_period !== undefined && product_rental_period !== "") {
      where += ` AND p.product_rental_period = '${product_rental_period}'`;
    }
    if (product_description !== undefined && product_description !== "") {
      where += ` AND p.product_description LIKE '%${product_description}%'`;
    }

    const query = `
      SELECT 
        p.id,
        p.seller_id,
        pb.product_brand,
        pc.product_category,
        ps.size_top,
        ps.size_bottom,
        p.size_standard,
        pst.style_top,
        pst.style_bottom,
        pbi.billing_type,
        pbi.billing_level,
        pbi.billing_condition,
        p.product_buy_rent,
        pp.product_padding,
        p.location,
        p.price_sale_lend_price,
        p.product_replacement_price,
        p.product_rental_period,
        p.product_description,
        p.created_at,
        p.updated_at,
        GROUP_CONCAT(DISTINCT pcn.product_color) AS product_colors,
        GROUP_CONCAT(DISTINCT pi.product_image) AS product_images
      FROM 
        product p
      LEFT JOIN 
        product_brands pb ON p.id = pb.product_id
      LEFT JOIN 
        product_category pc ON p.id = pc.product_id
      LEFT JOIN 
        product_size ps ON p.id = ps.product_id
      LEFT JOIN 
        product_styles pst ON p.id = pst.product_id
      LEFT JOIN 
        product_billing pbi ON p.id = pbi.product_id
      LEFT JOIN 
        product_padding pp ON p.id = pp.product_id
      LEFT JOIN 
        product_colors pcn ON p.id = pcn.product_id
      LEFT JOIN 
        product_images pi ON p.id = pi.product_id
      ${where}
      GROUP BY 
        p.id
      ORDER BY 
        p.id DESC
    `;

    console.log("Constructed Query:", query);
    return db.query(query);
  },

  getAllProduct_by_category: async (productCategory) => {
    try {
      const params = [productCategory];
      const sql = `
        SELECT 
        p.id,
        
          pc.product_category,
          p.size_standard,
          p.product_buy_rent,
          p.location,
          p.price_sale_lend_price,
          p.product_replacement_price,
          p.product_rental_period,
          p.product_description,
          p.wishlist_like,
          ps.size_top,
          ps.size_bottom,
          pst.style_top,
          pst.style_bottom,
          pb.product_brand,
          pbi.billing_type,
          pbi.billing_level,
          pbi.billing_condition,
          pp.product_padding,
          CONCAT('${baseurl}/productImage/', pi.product_image) as product_image,
          pcn.product_color
        FROM Product p
          LEFT JOIN product_size ps ON p.id = ps.product_id
          LEFT JOIN product_styles pst ON p.id = pst.product_id
          LEFT JOIN product_brands pb ON p.id = pb.product_id
          LEFT JOIN product_billing pbi ON p.id = pbi.product_id
          LEFT JOIN product_padding pp ON p.id = pp.product_id
          LEFT JOIN product_category pc ON p.id = pc.product_id
          LEFT JOIN product_images pi ON p.id = pi.product_id
          LEFT JOIN product_colors pcn ON p.id = pcn.product_id
        WHERE pc.product_category = ?;
      `;

      // Execute the query
      const result = await db.query(sql, params);

      return result;
    } catch (error) {
      console.error("Error in getAllProductByCategory:", error);
      throw error;
    }
  },

  getAllProduct_by_id: async (product_id) => {
    try {
      const params = [product_id];
      const sql = `
        SELECT 
        p.id,
          pc.product_category,
          p.size_standard,
          p.product_buy_rent,
          p.location,
          p.price_sale_lend_price,
          p.product_replacement_price,
          p.product_rental_period,
         
          p.product_description,
          p.wishlist_like,
          ps.size_top,
          ps.size_bottom,
          pst.style_top,
          pst.style_bottom,
          pb.product_brand,
          pbi.billing_type,
          pbi.billing_level,
          pbi.billing_condition,
          pp.product_padding,
          CONCAT('${baseurl}/productImage/', pi.product_image) as product_image,
          pcn.product_color
        FROM Product p
          LEFT JOIN product_size ps ON p.id = ps.product_id
          LEFT JOIN product_styles pst ON p.id = pst.product_id
          LEFT JOIN product_brands pb ON p.id = pb.product_id
          LEFT JOIN product_billing pbi ON p.id = pbi.product_id
          LEFT JOIN product_padding pp ON p.id = pp.product_id
          LEFT JOIN product_category pc ON p.id = pc.product_id
          LEFT JOIN product_images pi ON p.id = pi.product_id
          LEFT JOIN product_colors pcn ON p.id = pcn.product_id
        WHERE p.id = ?;
      `;

      // Execute the query
      const result = await db.query(sql, params);

      return result;
    } catch (error) {
      console.error("Error in getAllProductByCategory:", error);
      throw error;
    }
  },
};
