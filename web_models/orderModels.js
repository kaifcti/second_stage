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

};
