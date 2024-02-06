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

  insert_checkOut: async (checkOutData) => {
    return db.query("INSERT INTO order_checkout SET ?", [checkOutData]);
  },

  checkBuyerExistence: async (buyer_id) => {
    return db.query(`select * FROM tbl_buyer WHERE id = '${buyer_id}';
   `);
  },

  get_checkOut: async () => {
    return db.query("SELECT * FROM order_checkout ORDER BY id DESC LIMIT 1; ");
  },

  getChekOutById: async (userID) => {
    try {
      const sql = `
      SELECT
    order_checkout.*,
    product.*,
    cart.*,
    CONCAT(product_brands.product_brand) AS product_brands
FROM
    order_checkout
JOIN
    product ON order_checkout.product_id = product.id
LEFT JOIN
    cart ON order_checkout.cart_id = cart.id
LEFT JOIN
    product_brands ON product.id = product_brands.product_id
WHERE
    order_checkout.buyer_id = ?;

  
`;

      const result = await db.query(sql, [userID]);

      return result;
    } catch (error) {
      throw error;
    }
  },

  
};
