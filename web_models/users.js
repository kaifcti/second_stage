const db = require("../utils/database");
const config = require("../config");

const baseurl = config.base_url;

module.exports = {
  registerUser: async (user) => {
    console.log(user);
    return db.query("insert into users set ?", [user]);
  },

  register_buyer: async (user) => {
    console.log(user);
    return db.query("insert into tbl_buyer set ?", [user]);
  },

  register_seller: async (user) => {
    console.log(user);
    return db.query("insert into tbl_seller set ?", [user]);
  },

  fetchUserByEmail: async (email) => {
    return db.query("select * from users where email = ?", [email]);
  },

  fetchBuyerByEmail: async (email) => {
    return db.query("select * from tbl_buyer where email = ?", [email]);
  },

  fetchSellerByEmail: async (email) => {
    return db.query("select * from tbl_seller where email = ?", [email]);
  },

  fetchUserByActToken: async (act_token) => {
    return db.query("select * from users where act_token = ?", [act_token]);
  },

  fetchBuyerByActToken: async (act_token) => {
    return db.query("select * from tbl_buyer where act_token = ?", [act_token]);
  },

  updateUserByActToken: async (token, act_token, id) => {
    return db.query(
      `Update users set verify_user=1,  act_token = ? where id = ?`,
      [act_token, id]
    );
  },

  updateBuyerByActToken: async (token, act_token, id) => {
    return db.query(
      `Update tbl_buyer set verify_user=1,  act_token = ? where id = ?`,
      [act_token, id]
    );
  },

  fetchUserByToken: async (token) => {
    return db.query("select * from users where act_token = ?", [token]);
  },

  updatePassword: async (password, id) => {
    return db.query("UPDATE users SET password = ? WHERE id = ?", [
      password,
      id,
    ]);
  },

  updateBuyerPassword: async (password, id) => {
    return db.query(
      "UPDATE tbl_buyer SET  act_token='', password = ? WHERE id = ?",
      [password, id]
    );
  },

  fetchUserById: async (id) => {
    return db.query(" select * from users where id= ?", [id]);
  },

  fetchBuyerById: async (id) => {
    return db.query(" select * from tbl_buyer where id= ?", [id]);
  },
  fetchBuyerByIddd: async (act_token) => {
    return db.query(" select * from tbl_buyer where act_token= ?", [act_token]);
  },

  updateUserById: async (user, user_id) => {
    const query =
      "UPDATE users SET user_Name=?, DOB=?, Profile_images=? WHERE id=?";
    const result = await db.query(query, [
      user.user_Name,
      user.DOB,
      user.Profile_images,
      user_id,
    ]);
    return result;
  },

  updateBuyerById: async (user, user_id) => {
    const query = `UPDATE tbl_buyer SET buyer_name=?, user_name=?,phone_number=?,license_state=?,license_number=?, profile_image=? WHERE id=?`;
    const result = await db.query(query, [
      user.buyer_name,
      user.user_name,
      user.phone_number,
      user.license_state,
      user.license_number,
      user.profile_image,

      user_id,
    ]);
    return result;
  },

  fetchTokenOfUser: async (token) => {
    return db.query("select * from users where token=?", [token]);
  },

  get_all_users: async () => {
    return db.query("select * from users ORDER BY `id` DESC");
  },
  delete_user: async (user_id) => {
    return db.query(`delete  from users where id='${user_id}' `);
  },

  phone_no_check: async (phone_number) => {
    return db.query(
      `select * from  users  where phone_number='${phone_number}'`
    );
  },
  verifyUser: async (user_id) => {
    return db.query(`update users SET verify_user = "1" where id='${user_id}'`);
  },

  user_name_Check: async (username) => {
    return db.query(`select * from users where user_Name='${username}'`);
  },

  buyer_name_Check: async (username) => {
    return db.query(`select * from tbl_buyer where user_Name='${username}'`);
  },

  seller_name_Check: async (username) => {
    return db.query(`select * from tbl_seller where user_Name='${username}'`);
  },

  phone_Check: async (phone) => {
    return db.query(`SELECT * FROM users WHERE phone = ?`, [phone]);
  },

  buyer_phone_Check: async (phone_number) => {
    return db.query(`SELECT * FROM tbl_buyer WHERE phone_number = ?`, [
      phone_number,
    ]);
  },

  seller_phone_Check: async (phone_number) => {
    return db.query(`SELECT * FROM tbl_seller WHERE phone_number = ?`, [
      phone_number,
    ]);
  },

  update_user: async (user) => {
    return db.query(
      `update users set name = '${user.name}' , 
    user_name ='${user.user_name}',
    email ='${user.email}',password ='${user.password}', 
    dob ='${user.dob}', profile_images ='${user.profile_images}',
    act_token ='${user.act_token}'
    where phone ='${user.phone}'`,
      [user]
    );
  },

  update_user_buyer: async (user) => {
    return db.query(
      `update tbl_buyer set buyer_name = '${user.buyer_name}' , 
    user_name ='${user.user_name}',
    email ='${user.email}',password ='${user.password}', 
    dob ='${user.dob}', profile_image ='${user.profile_image}',
    act_token ='${user.act_token}'
    where phone_number ='${user.phone_number}'`,
      [user]
    );
  },

  update_user_seller: async (user) => {
    return db.query(
      `update tbl_seller set seller_name = '${user.seller_name}' , 
    user_name ='${user.user_name}',
    email ='${user.email}',password ='${user.password}', 
    license_number ='${user.license_number}', license_state ='${user.license_state}',
    profile_image ='${user.profile_image}'
    where phone_number ='${user.phone_number}'`,
      [user]
    );
  },
};
