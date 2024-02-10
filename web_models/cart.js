const db = require("../utils/database");
const config = require("../config");
const baseurl = config.base_url;

module.exports = {
  get_all_category: async () => {
    return db.query("select * from Categories ");
  },
  fetchCartByUserId: async (userId) => {
    const sql = `
        SELECT 
            Product.productName AS categoryProduct,
            Categories.categoryName,
            Cart.id AS CartId,
            Cart.cartQuantity,
            Cart.cartPrice,
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
        JOIN Cart ON Products_Details.id = Cart.productDetailsId
        WHERE Cart.userId = ?;  -- Add this WHERE clause to filter by product ID
    `;
    return (result = await db.query(sql, [userId]));
  },
  fetchCartById: async (id) => {
    return db.query(" select * from cart where id= ?", [id]);
  },

  updateCartById: async (data, CartId) => {
    const query = "UPDATE Cart SET cart_quantity=?, cart_price=?  WHERE id=?";
    const result = await db.query(query, [
      data.cart_quantity,
      data.cart_price,

      CartId,
    ]);
    return result;
  },

  fetchUserBy_Id: async (id) => {
    return db.query(`select * from users where id= '${id}'`, [id]);
  },

  deleteCartByuserId: async (user_id) => {
    return db.query(`delete  from Cart where user_id='${user_id}' `);
  },

  getCartByProductIdAndUserId: async (productDetailsId, userId) => {
    return db.query(`select * FROM cart WHERE productDetailsId = "${productDetailsId}" AND userId = "${userId}";
   `);
  },

  deleteCartByProductIdAndUserId: async (productDetailsId, userId) => {
    return db.query(`delete FROM cart WHERE productDetailsId = "${productDetailsId}" AND userId = "${userId}";
    `);
  },

  // kaif starts hereeee

  createCart: async (cartData) => {
    return db.query("INSERT INTO Cart SET ?", [cartData]);
  },

  checkBuyerExistence: async (buyer_id) => {
    return db.query(`select * FROM tbl_buyer WHERE id = '${buyer_id}';
   `);
  },

  checkProductExistence: async (product_id) => {
    return db.query(`select * FROM product WHERE id = '${product_id}';
   `);
  },

  fetchBuyerBy_Id: async (id) => {
    return db.query(`select * from tbl_buyer where id= '${id}'`, [id]);
  },

  getCartByProductIdAndBuyerId: async (product_id, buyer_id) => {
    return db.query(`select * FROM cart WHERE product_id = "${product_id}" AND buyer_id = "${buyer_id}";
   `);
  },


  updateCartCount: async (product_id, buyer_id) => {
    return db.query(`update cart set cart_quantity = cart_quantity +1 WHERE product_id = "${product_id}" AND buyer_id = "${buyer_id}";
   `);
  },


  deleteCartByProductIdAndBuyerId: async (product_id, buyer_id) => {
    return db.query(`delete FROM cart WHERE product_id = "${product_id}" AND buyer_id = "${buyer_id}";
    `);
  },

  get__cart: async () => {
    return db.query("SELECT * FROM cart ORDER BY id DESC LIMIT 1; ");
  },

  getCartByIdd: async (userID) => {
    return db.query(`SELECT * FROM cart WHERE buyer_id='${userID}'`);
  },

  //   getCartByIddd: async (userID) => {
  //     try {
  //       const sql = `
  //       SELECT
  //   cart.id AS cart_id,
  //   cart.product_id,
  //   cart.buyer_id,
  //   cart.cart_quantity,
  //   cart.createdAt,
  //   cart.updatedAt,

  //   product.location,
  //   product.price_sale_lend_price,
  //   product.product_replacement_price,
  //   product.product_rental_period,
  //   product.product_description,
  //   CONCAT('${baseurl}/productImage/', product_images.product_image) AS product_image,
  //   COALESCE(GROUP_CONCAT(product_colors.product_color), '') AS product_color,
  //   COALESCE(GROUP_CONCAT(product_brands.product_brand), '') AS product_brand,
  //   COALESCE(GROUP_CONCAT(product_styles.style_top), '') AS style_top,
  //   COALESCE(GROUP_CONCAT(product_styles.style_bottom), '') AS style_bo,
  //   COALESCE(GROUP_CONCAT(product_size.size_top), '') AS size_top,
  //   COALESCE(GROUP_CONCAT(product_size.size_bottom), '') AS size_bottom,
  //   COALESCE(GROUP_CONCAT(product_billing.billing_type), '') AS billing_type,
  //   COALESCE(GROUP_CONCAT(product_billing.billing_level), '') AS billing_level,
  //   COALESCE(GROUP_CONCAT(product_billing.billing_condition), '') AS billing_condition,
  //   COALESCE(GROUP_CONCAT(product_category.product_category), '') AS product_category,
  //   COALESCE(GROUP_CONCAT(product_padding.product_padding), '') AS product_padding
  // FROM cart
  //   JOIN product ON cart.product_id = product.id
  //   LEFT JOIN product_images ON product.id = product_images.product_id
  //   LEFT JOIN product_colors ON product.id = product_colors.product_id
  //   LEFT JOIN product_brands ON product.id = product_brands.product_id
  //   LEFT JOIN product_styles ON product.id = product_styles.product_id
  //   LEFT JOIN product_size ON product.id = product_size.product_id
  //   LEFT JOIN product_billing ON product.id = product_billing.product_id
  //   LEFT JOIN product_category ON product.id = product_category.product_id
  //   LEFT JOIN product_padding ON product.id = product_padding.product_id
  // WHERE cart.buyer_id = ?
  // GROUP BY cart.product_id;
  // `;

  //       const result = await db.query(sql, [userID]);

  //       return result;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },

  getCartById: async (userID) => {
    try {
      const sql = `
    SELECT
cart.id AS cart_id,
cart.product_id,
cart.buyer_id,
cart.cart_quantity,

product.id,
product.location,
product.price_sale_lend_price,
product.product_replacement_price,
product.product_rental_period,
product.product_buy_rent,
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
FROM cart
JOIN product ON cart.product_id = product.id
LEFT JOIN product_images ON product.id = product_images.product_id

LEFT JOIN product_colors ON product.id = product_colors.product_id
LEFT JOIN product_brands ON product.id = product_brands.product_id
LEFT JOIN product_styles ON product.id = product_styles.product_id
LEFT JOIN product_size ON product.id = product_size.product_id
LEFT JOIN product_billing ON product.id = product_billing.product_id
LEFT JOIN product_category ON product.id = product_category.product_id
LEFT JOIN product_padding ON product.id = product_padding.product_id
WHERE cart.buyer_id = ?
GROUP BY cart.product_id;
`;

      const result = await db.query(sql, [userID]);

      return result;
    } catch (error) {
      throw error;
    }
  },

  fetchCartByBuyerId: async (buyer_id) => {
    try {
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
          JOIN product_images ON product.id = product_images.product_id
          JOIN product_colors ON product.id = product_colors.product_id
          JOIN Cart ON product.id = Cart.product_id
        WHERE Cart.buyer_id = ?;  -- Add this WHERE clause to filter by product ID
      `;

      const result = await db.query(sql, [buyer_id]);

      return result;
    } catch (error) {
      throw error;
    }
  },
  // fetchCartByBuyerId: async (buyer_id) => {
  //   try {
  //     let sql = `
  //     product.id as product_id,
  //     product.product_brand,
  //     product.product_category,
  //     product.size_top,
  //     product.size_bottom,
  //     product.style_top,
  //     product.style_bottom,
  //     product.billing_type,
  //     product.billing_level,
  //     product.billing_condition,
  //     product.product_padding,
  //     product.location,
  //     product.price_sale_lend_price,
  //     product.product_replacement_price,
  //     product.product_rental_period,
  //     product.product_description,
  //     CONCAT('http://192.168.1.27:4001/productImage/', product_images.product_image) as product_image,
  //     product_colors.product_color,
  //     Cart.cart_quantity,
  //     Cart.cart_price
  //   FROM product
  //     JOIN product_images ON product.id = product_images.product_id
  //     JOIN product_colors ON product.id = product_colors.product_id
  //     JOIN Cart ON product.id = Cart.product_id
  //   WHERE Cart.buyer_id = ?;
  //       `;

  //     const result = await db.query(sql, [buyer_id]);

  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  getProductById: async (id) => {
    return db.query(`select *  from product where id='${id}' `);
  },

  deleteCartById: async (id) => {
    return db.query(`delete  from Cart where id='${id}' `);
  },

  get_cart_id: async (CartId) => {
    return db.query(`SELECT * FROM cart where id='${CartId}' `);
  },
  fetchProductById: async (product_id) => {
    return db.query(`select *  from product where id='${product_id}' `);
  },

  insert_wishlist: async (data) => {
    return db.query("INSERT INTO product_wishlist SET ?", [data]);
  },

  // get_wishlist: async () => {
  //   return db.query(
  //     "SELECT * FROM product_wishlist ORDER BY id DESC LIMIT 1; "
  //   );
  // },

  get_wishlist: async () => {
    return db.query(`
      SELECT pw.* 
      FROM product_wishlist pw
      JOIN product p ON pw.product_id = p.id
      WHERE p.wishlist_like = 1
      ORDER BY pw.id DESC
      LIMIT 1
    `);
  },

  getWishlistById: async (userID) => {
    try {
      const sql = `
        SELECT
        product_wishlist.id AS product_wishlist_id,
        product_wishlist.product_id,
        product_wishlist.buyer_id,

    product.location,
    product.price_sale_lend_price,
    product.product_replacement_price,
    product.product_rental_period,
    product.product_description,
    product.product_buy_rent,
    product.wishlist_like,
    CONCAT('${baseurl}/productImage/', product_images.product_image) AS product_image,
    COALESCE(GROUP_CONCAT(DISTINCT product_colors.product_color), '') AS product_color,
    COALESCE(GROUP_CONCAT(DISTINCT product_brands.product_brand), '') AS product_brand,
    COALESCE(GROUP_CONCAT(DISTINCT product_styles.style_top), '') AS style_top,
    COALESCE(GROUP_CONCAT(DISTINCT product_styles.style_bottom), '') AS style_bottom,
    COALESCE(GROUP_CONCAT(DISTINCT product_size.size_top), '') AS size_top,
    COALESCE(GROUP_CONCAT(DISTINCT product_size.size_bottom), '') AS size_bottom,
    COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_type), '') AS billing_type,
    COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_level), '') AS billing_level,
    COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_condition), '') AS billing_condition,
    COALESCE(GROUP_CONCAT(DISTINCT product_category.product_category), '') AS product_category,
    COALESCE(GROUP_CONCAT(DISTINCT product_padding.product_padding), '') AS product_padding
   FROM product_wishlist
   JOIN product ON product_wishlist.product_id = product.id

   LEFT JOIN cart on product.id = cart.product_id
    LEFT JOIN product_images ON product.id = product_images.product_id
    LEFT JOIN product_colors ON product.id = product_colors.product_id
    LEFT JOIN product_brands ON product.id = product_brands.product_id
    LEFT JOIN product_styles ON product.id = product_styles.product_id
    LEFT JOIN product_size ON product.id = product_size.product_id
    LEFT JOIN product_billing ON product.id = product_billing.product_id
    LEFT JOIN product_category ON product.id = product_category.product_id
    LEFT JOIN product_padding ON product.id = product_padding.product_id
      WHERE product_wishlist.buyer_id = ?
      GROUP BY product_wishlist.product_id;
  `;

      const result = await db.query(sql, [userID]);

      return result;
    } catch (error) {
      throw error;
    }
  },

  check_product_in_wishlist: async (buyer_id, product_id) => {
    return db.query(`
    SELECT *
    FROM product_wishlist
    WHERE buyer_id = '${buyer_id}' AND product_id = '${product_id}'
  `);
  },

  remove_from_wishlist: async (buyer_id, product_id) => {
    return db.query(`
    DELETE FROM product_wishlist
    WHERE buyer_id='${buyer_id}' and product_id = '${product_id}' 
  `);
  },

  updateWishListLike: async (product_id) => {
    return db.query(
      `UPDATE product SET wishlist_like=1   WHERE id='${product_id}'`
    );
  },

  removeWishListLikeCount: async (product_id) => {
    return db.query(
      `UPDATE product SET wishlist_like=0   WHERE id='${product_id}'`
    );
  },

  // no needed code for this projectgit
  add_text: async (data) => {
    return db.query("INSERT INTO text_message SET ?", [data]);
  },

  fetch_text: async (user_id) => {
    return db.query(`select *  from text_message where user_id='${user_id}' `);
  },

  delete_text: async (user_id) => {
    return db.query(`delete from text_message where user_id='${user_id}' `);
  },
};
