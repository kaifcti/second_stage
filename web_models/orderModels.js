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

  insert_checkOut: async (checkOutData) => {
    return db.query("INSERT INTO order_checkout SET ?", [checkOutData]);
  },

  updateCartT: async (checkOutId, ids, userID) => {
    return db.query(
      `update cart set order_id ='${checkOutId}' where id='${ids}' and buyer_id='${userID}'`
    );
  },
  updatePaymentStatus: async (userID) => {
    return db.query(
      `update order_checkout set payment_status =1 where buyer_id='${userID}'`
    );
  },

  checkBuyerExistence: async (buyer_id) => {
    return db.query(`select * FROM tbl_buyer WHERE id = '${buyer_id}';
   `);
  },

  get_checkOut: async () => {
    return db.query("SELECT * FROM order_checkout ORDER BY id DESC LIMIT 1; ");
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

  getChekOutById: async (userID) => {
    try {
      const sql = `
      SELECT
      order_checkout.id AS order_id,
      order_checkout.order_number,
      order_checkout.shipping,
      order_checkout.vat,
      order_checkout.total,
      order_checkout.order_date,
      order_checkout.payment_method,
      order_checkout.payment_status,
      COUNT(cart.id) AS total_cart_items,
      cart.id AS cart_id,
      cart.buyer_id,
      cart.cart_quantity,
      cart.cart_price,
      product.id AS product_id,
      product_brands.product_brand
  FROM
      cart
  JOIN
      order_checkout ON cart.order_id = order_checkout.id
  JOIN
      product ON cart.product_id = product.id
  JOIN
      product_brands ON product.id = product_brands.product_id
  WHERE
      order_checkout.buyer_id = ?
  GROUP BY
      order_checkout.id, cart.id;
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

  // getChekOutById: async (userID) => {
  //   try {
  //     const sql = `
  //       SELECT
  //         order_checkout.shipping,
  //         order_checkout.vat,
  //         order_checkout.total,
  //         cart.id AS cart_id,
  //         cart.buyer_id,
  //         cart.cart_quantity,
  //         cart.cart_price,
  //         product.id AS product_id,
  //         product.price_sale_lend_price AS product_price,
  //         product_brands.product_brand AS brand
  //       FROM
  //         cart
  //       INNER JOIN
  //         order_checkout ON cart.buyer_id = order_checkout.buyer_id
  //       INNER JOIN
  //         product ON cart.product_id = product.id
  //       LEFT JOIN
  //         product_brands ON product.id = product_brands.product_id
  //       WHERE
  //         cart.buyer_id = ?
  //       GROUP BY
  //         cart.id, product.id;
  //     `;

  //     const result = await db.query(sql, [userID]);

  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};
