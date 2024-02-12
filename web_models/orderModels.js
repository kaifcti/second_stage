const { raw } = require("mysql");
const db = require("../utils/database");
const config = require("../config");

const baseurl = config.base_url;

module.exports = {
  fetchBuyerBy_Id: async (id) => {
    return db.query(`select * from tbl_buyer where id= '${id}'`, [id]);
  },
  insert_into_order_shipping: async (data) => {
    return db.query("INSERT INTO order_shipping_details SET ?", [data]);
  },

  get_order_shipping: async () => {
    return db.query(
      "SELECT * FROM order_shipping_details ORDER BY id DESC LIMIT 1; "
    );
  },

  fetchShipping_by_id: async (buyer_id) => {
    return db.query(
      `SELECT * FROM order_shipping_details where buyer_id='${buyer_id}' `
    );
  },

  check_order: async (userId) => {
    return db.query(`SELECT * FROM order_checkout where buyer_id='${userId}' `);
  },

  insert_checkOut: async (checkOutData) => {
    return db.query("INSERT INTO order_checkout SET ?", [checkOutData]);
  },

  updateCartT: async (ids, userID) => {
    return db.query(
      `update cart set order_id = 1 where id='${ids}' and buyer_id='${userID}'`
    );
  },
  updatePaymentStatus: async (cart_id, userID) => {
    return db.query(
      `update order_checkout set payment_status =1 where cart_id='${cart_id}' AND buyer_id='${userID}'`
    );
  },
  updateCartPaymentStatus: async (cart_id, userID) => {
    return db.query(
      `update cart set payment_status =1 where cart_id='${cart_id}' AND buyer_id='${userID}'`
    );
  },

  checkBuyerExistence: async (buyer_id) => {
    return db.query(`select * FROM tbl_buyer WHERE id = '${buyer_id}';
   `);
  },

  get_checkOut: async (checkOutId) => {
    return db.query(`SELECT * FROM order_checkout  where id = '${checkOutId}'`);
  },

  //   getChekOutById: async (userID) => {
  //     try {
  //       const sql = `
  //       SELECT
  //       order_checkout.order_number,
  //       order_checkout.shipping,
  //       order_checkout.vat,
  //       order_checkout.total,
  //       order_checkout.order_date,
  //       order_checkout.payment_method,
  //       order_checkout.payment_status,
  //       cart.id AS cart_id,
  //       cart.buyer_id,
  //       cart.cart_quantity,
  //       cart.cart_price,
  //       product.id AS product_id,
  //       GROUP_CONCAT(product_brands.product_brand) AS product_brands
  //   FROM
  //       cart
  //   JOIN
  //       order_checkout ON cart.order_id = order_checkout.id
  //   JOIN
  //       product ON cart.product_id = product.id
  //   JOIN
  //       product_brands ON product.id = product_brands.product_id
  //   WHERE
  //       order_checkout.buyer_id = ?
  //   GROUP BY
  //       cart.id;

  // `;

  //       const result = await db.query(sql, [userID]);

  //       return result;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },

  //   getChekOutById: async (userID) => {
  //     try {
  //       const sql = `
  //     SELECT

  //     cart.id AS cart_id,
  //     cart.buyer_id,
  //     cart.cart_quantity,
  //     cart.cart_price,
  //     cart.free_shipping,
  //     product.id AS product_id,
  //     product.product_buy_rent,
  //     product.location,
  //     product.price_sale_lend_price,
  //     product.product_description,
  //     product_brands.product_brand

  // FROM
  //     cart
  //     JOIN
  //     product ON cart.product_id = product.id

  //     JOIN
  //         product_brands ON product.id = product_brands.product_id
  //     WHERE
  //      cart.buyer_id = ?;

  //     `;

  //       const result = await db.query(sql, [userID]);

  //       return result;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },

  getChekOutById: async (userID) => {
    try {
      const sql = `
      SELECT
      cart.cart_id AS cart_id,
      cart.buyer_id,
      cart.cart_quantity,
      cart.cart_price,
      cart.free_shipping,
      product.id AS product_id,
      product.product_buy_rent,
      product.location,
      product.price_sale_lend_price,
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
    
  FROM
      cart
      JOIN product ON cart.product_id = product.id
      LEFT JOIN product_images ON product.id = product_images.product_id
      LEFT JOIN product_colors ON product.id = product_colors.product_id
      LEFT JOIN product_brands ON product.id = product_brands.product_id
      LEFT JOIN product_styles ON product.id = product_styles.product_id
      LEFT JOIN product_size ON product.id = product_size.product_id
      LEFT JOIN product_billing ON product.id = product_billing.product_id
      LEFT JOIN product_category ON product.id = product_category.product_id
      LEFT JOIN product_padding ON product.id = product_padding.product_id
    
  WHERE
      cart.buyer_id = ?
  
  GROUP BY
      cart.id, product.id;
  
  
  `;

      const result = await db.query(sql, [userID]);

      return result;
    } catch (error) {
      throw error;
    }
  },

  getCartDetails_by_id: async (buyer_id) => {
    return db.query(`select * from cart where buyer_id ='${buyer_id}' `);
  },

  fetchOrderById: async (userID) => {
    try {
      const sql = `
      SELECT
      order_checkout.order_number,
      order_checkout.order_date,
      order_checkout.payment_method,
      order_checkout.payment_status,
      cart.cart_id AS cart_id,
      cart.buyer_id,
      cart.cart_quantity,
      cart.cart_price,
      cart.free_shipping,
      product.id AS product_id,
      product.product_buy_rent,
      product.location,
      product.price_sale_lend_price,
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
  FROM
      cart
  INNER JOIN
      order_checkout ON cart.buyer_id = order_checkout.buyer_id
  LEFT JOIN 
      product ON cart.product_id = product.id
  LEFT JOIN 
      product_images ON product.id = product_images.product_id
  LEFT JOIN 
      product_colors ON product.id = product_colors.product_id
  LEFT JOIN 
      product_brands ON product.id = product_brands.product_id
  LEFT JOIN 
      product_styles ON product.id = product_styles.product_id
  LEFT JOIN 
      product_size ON product.id = product_size.product_id
  LEFT JOIN 
      product_billing ON product.id = product_billing.product_id
  LEFT JOIN 
      product_category ON product.id = product_category.product_id
  LEFT JOIN 
      product_padding ON product.id = product_padding.product_id
  WHERE
      cart.buyer_id = ?
  GROUP BY
      cart.id, product.id;
  
      `;

      const result = await db.query(sql, [userID]);

      return result;
    } catch (error) {
      throw error;
    }
  },


  fetchOrderListById: async (userID) => {
    try {
      const sql = `
      SELECT
      order_checkout.order_number,
      order_checkout.order_date,
      order_checkout.payment_status,
      cart.cart_id AS cart_id,
      cart.buyer_id,
      cart.cart_quantity,
      cart.cart_price,
      cart.free_shipping,
      product.id AS product_id,
      product.product_buy_rent,
      product.location,
      product.price_sale_lend_price,
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
  FROM
      cart
  INNER JOIN
      order_checkout ON cart.buyer_id = order_checkout.buyer_id
  LEFT JOIN 
      product ON cart.product_id = product.id
  LEFT JOIN 
      product_images ON product.id = product_images.product_id
  LEFT JOIN 
      product_colors ON product.id = product_colors.product_id
  LEFT JOIN 
      product_brands ON product.id = product_brands.product_id
  LEFT JOIN 
      product_styles ON product.id = product_styles.product_id
  LEFT JOIN 
      product_size ON product.id = product_size.product_id
  LEFT JOIN 
      product_billing ON product.id = product_billing.product_id
  LEFT JOIN 
      product_category ON product.id = product_category.product_id
  LEFT JOIN 
      product_padding ON product.id = product_padding.product_id
  WHERE
      cart.buyer_id = ?
  GROUP BY
      cart.id, product.id;
  
      `;

      const result = await db.query(sql, [userID]);

      return result;
    } catch (error) {
      throw error;
    }
  },
};
