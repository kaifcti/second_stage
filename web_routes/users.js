const express = require("express");
const web_userController = require("../web_controller/user_Controller");
const auth = require("../middleware/auth");
const upload_image = require("../middleware/productImageUpload");

const upload = require("../middleware/ProfileImages.JS");
const router = express.Router();

// buyer route start here
router.post("/signUp/buyer", web_userController.signUp_buyer);

router.post("/login/buyer", web_userController.loginBuyer);
// router.post("/verifyBuyer", web_userController.verifyBuyer);
// router.get("/verifyBuyer/:id", web_userController.verifyBuyerEmail);
router.post("/forgotPassword/buyer", web_userController.forgotPasswordBuyer);
router.post(
  "/changePassword/buyer",
  auth,
  web_userController.changePasswordBuyer
);
router.post("/reset_password/buyer", web_userController.resetPassword_buyer);
router.get(
  "/verifyPassword/buyer/:token",
  web_userController.verifyPasswordBuyer
);

router.post(
  "/editProfile/buyer",auth,
  upload.single("profile_image"),
  web_userController.editProfileBuyer
);


router.get("/myProfile/buyer", auth, web_userController.myProfile);

//***************seller route start here******************
router.post(
  "/signUp/seller",
  upload.single("file"),
  web_userController.signUp_seller
);

router.post("/login/seller", web_userController.loginSeller);

router.post("/verifyUser", web_userController.verifyUser);

router.get("/verifyUser/:id", web_userController.verifyUserEmail);

router.post("/forgotPassword", web_userController.forgotPassword);

// router.get("/verifyPassword/:token", web_userController.verifyPassword);

router.put("/changePassword", auth, web_userController.changePassword);

// router.post("/reset_password", web_userController.resetPassword);

router.get("/get_all_users", auth, web_userController.get_all_users);

router.get("/myProfile", auth, web_userController.myProfile);

router.put(
  "/editProfile/:id",
  auth,
  upload.single("Profile_images"),
  web_userController.editProfile
);

router.get("/get_user_by_id/:id", auth, web_userController.getUserById);

router.delete(
  "/delete_user_by_id/:id",
  auth,
  web_userController.deleteUserById
);

module.exports = router;
