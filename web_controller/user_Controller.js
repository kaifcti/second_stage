const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const localStorage = require("localStorage");
const fs = require("fs");
require("moment-timezone");
const config = require("../config");
const baseurl = config.base_url;
const baseUrl_profile_image = config.base_url_profile_image;

const {
  registerUser,
  get_all_users,
  updatePassword,
  fetchUserByEmail,
  fetchUserByActToken,
  updateUserByActToken,
  fetchUserById,
  updateUserById,
  user_name_Check,
  delete_user,
  phone_Check,
  update_user,
  register_buyer,
  fetchBuyerByEmail,
  buyer_name_Check,
  buyer_phone_Check,
  update_user_buyer,
  register_seller,
  fetchSellerByEmail,
  seller_name_Check,
  seller_phone_Check,
  update_user_seller,
  fetchBuyerByActToken,
  updateBuyerByActToken,
  fetchBuyerById,
  updateBuyerPassword,
  updateBuyerById,
  fetchBuyerByIddd,
} = require("../web_models/users");
const { userInfo } = require("os");

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const saltRounds = 10;

//send mail verification
async function sendVerificationEmail(email, verificationLink) {
  try {
    // Load HTML template
    const templatePath = path.join(__dirname, "view", "verify.html");
    const htmlTemplate = await fs.promises.readFile(templatePath, "utf-8");

    // Replace placeholder in HTML template with the actual verification link
    const emailHtml = htmlTemplate.replace(
      "{{verificationLink}}",
      verificationLink
    );

    // Configure email options
    const mailOptions = {
      from: "second_stage.0901@gmail.com",
      to: email,
      subject: "Email Verification",
      html: emailHtml,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Check if the email was sent successfully
    if (info.accepted.length > 0) {
      console.log(`Email sent successfully to ${email}`);
    } else {
      console.error(`Failed to send email to ${email}`);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}
//forget password mail send
async function sendVerificationEmailForgetPassword(email, token) {
  try {
    console.log("token===>>", token);
    const id = token;

    const mailOptions = {
      // from: "mousam.ctinfotech@gmail.com",
      from: "second_stage.0901@gmail.com",
      to: email,
      subject: "Forget Password",
      template: "forget_template",
      context: {
        href_url: `${baseurl}/web/verifyPassword/buyer/${id}`,
        msg: `Please click below link to change password.`,
      },
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Check if the email was sent successfully
    if (info.accepted.length > 0) {
      console.log(`Email sent successfully to ${email}`);
    } else {
      console.error(`Failed to send email to ${email}`);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

function generateToken() {
  var length = 6,
    charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: "mousam.ctinfotech@gmail.com",
    pass: "bngvppezjpsmmdys",
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname + "/view/"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname + "/view/"),
};

transporter.use("compile", hbs(handlebarOptions));

var dateValidation = (value, helpers) => {
  const dateFormats = ["YYYY-MM-DD", "DD/MM/YYYY"];

  for (const format of dateFormats) {
    const parsedDate = require("moment")(value, format, true);
    if (parsedDate.isValid()) {
      return value; // Validation passed, return the original value
    }
  }

  return helpers.error("any.invalid"); // Validation failed
};

// buyer start from here

// exports.signUp_buyer = async (req, res) => {
//   try {
//     const {
//       buyer_name,
//       email,
//       phone_number,
//       user_name,
//       license_state,
//       license_number,
//     } = req.body;

//     var act_token = generateRandomString(8);
//     console.log("act_token ==>>", act_token);

//     const schema = Joi.object({
//       buyer_name: Joi.string().required().messages({
//         "any.required": "buyer_name is required",
//         "string.base": "buyer_name must be a string",
//       }),

//       email: Joi.string().email().required().messages({
//         "any.required": "Email is required",
//         "string.email": "Email must be a valid email address",
//       }),
//       phone_number: Joi.string()
//         .pattern(new RegExp("^[0-9]{10}$"))
//         .required()
//         .messages({
//           "any.required": "Phone number is required",
//           "string.pattern.base":
//             "Phone number must be a 10-digit numeric value",
//         }),
//       user_name: Joi.string().required().messages({
//         "any.required": "user_name is required",
//       }),

//       license_state: Joi.string().required().messages({
//         "any.required": "license_state is required",
//         "string.base": "license_state must be a string",
//       }),
//       license_number: Joi.string().required().messages({
//         "any.required": "license_number is required",
//         "string.base": "license_number must be a string",
//       }),
//     });

//     const result = schema.validate(req.body);

//     if (result.error) {
//       const message = result.error.details.map((i) => i.message).join(",");
//       return res.json({
//         message: result.error.details[0].message,
//         error: message,
//         missingParams: result.error.details[0].message,
//         status: 400,
//         success: false,
//       });
//     } else {
//       var data = await fetchBuyerByEmail(email);

//       if (data.length !== 0 && data[0].verify_user == 1) {
//         return res.json({
//           success: false,
//           message:
//             "Email address already registered. Please use a different email. ",
//           status: 400,
//         });
//       } else {
//         let phone_check = await buyer_phone_Check(phone_number);
//         console.log("check phone number>>>", phone_check);
//         if (phone_check.length != 0 && phone_check[0].verify_user == 1) {
//           return res.json({
//             success: false,
//             message:
//               "Phone Number already registered. Please use a different Phone Number.",
//             status: 400,
//           });
//         } else {
//           var user = {
//             buyer_name: buyer_name,
//             email: email,
//             phone_number: phone_number,
//             user_name: user_name,
//             license_state: license_state,
//             license_number: license_number,
//             act_token: act_token,
//           };
//           if (data.length != 0 && data[0].verify_user == 0) {
//             const create_user = await update_user_buyer(user);
//             const verificationLink = `${baseurl}/web/verifyBuyer/${act_token}`;
//             await sendVerificationEmail(email, verificationLink);
//             res.json({
//               success: true,
//               message: "User details updated successfully! ",
//               status: 200,
//               data_1: data,
//             });
//           } else {
//             const create_user = await register_buyer(user);
//             const verificationLink = `${baseurl}/web/verifyBuyer/${act_token}`;
//             await sendVerificationEmail(email, verificationLink);
//             res.json({
//               success: true,
//               message:
//                 "Sign up successful! Welcome to our application,please check your register mail for verification",
//               status: 200,
//               data_1: data,
//             });
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "An internal server error occurred. Please try again later.",
//       status: 500,
//       error: error,
//     });
//   }
// };

exports.signUp_buyer = async (req, res) => {
  try {
    const {
      buyer_name,
      email,
      phone_number,
      user_name,
      license_state,
      license_number,
    } = req.body;

    var act_token = generateRandomString(8);
    console.log("act_token ==>>", act_token);

    const schema = Joi.object({
      buyer_name: Joi.string().required().messages({
        "any.required": "buyer_name is required",
        "string.base": "buyer_name must be a string",
      }),

      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
      }),
      phone_number: Joi.string()
        .pattern(new RegExp("^[0-9]{10}$"))
        .required()
        .messages({
          "any.required": "Phone number is required",
          "string.pattern.base":
            "Phone number must be a 10-digit numeric value",
        }),
      user_name: Joi.string().required().messages({
        "any.required": "user_name is required",
      }),

      license_state: Joi.string().required().messages({
        "any.required": "license_state is required",
        "string.base": "license_state must be a string",
      }),
      license_number: Joi.string().required().messages({
        "any.required": "license_number is required",
        "string.base": "license_number must be a string",
      }),
    });

    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      var user = {
        buyer_name: buyer_name,
        email: email,
        phone_number: phone_number,
        user_name: user_name,
        license_state: license_state,
        license_number: license_number,
        act_token: act_token,
      };

      const create_user = await register_buyer(user);

      await sendVerificationEmailForgetPassword(email, act_token);

      res.json({
        success: true,
        message:
          "Sign up successful! Please check your email to set your password.",
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.verifyPasswordBuyer = async (req, res) => {
  try {
    const id = req.params.token;

    console.log("id==>>", id);

    if (!id) {
      return res.status(400).send("Invalid link");
    } else {
      const result = await fetchBuyerByIddd(id);

      const token = result[0]?.id;

      if (result.length !== 0) {
        localStorage.setItem("vertoken", token);

        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "",
        });
      } else {
        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "This User is not Registered",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.send(`<div class="container">
          <p>404 Error, Page Not Found</p>
          </div> `);
  }
};

exports.loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = generateToken();
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().empty().required()],
        //   fcm_token: [Joi.string().empty().required()],
        password: Joi.string().min(6).max(15).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 6 value required",
          "string.max": "maximum 15 values allowed",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchBuyerByEmail(email);

      if (data.length !== 0) {
        if (data[0]?.act_token === "") {
          if (email === data[0].email) {
            const match = bcrypt.compareSync(password, data[0]?.password);

            if (match) {
              const toke = jwt.sign(
                {
                  data: {
                    id: data[0].id,
                  },
                },
                "SecretKey"
                // { expiresIn: "1d" }
              );
              // console.log(toke);
              bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(token, salt, async function (err, hash) {
                  if (err) throw err;
                  //  const results = await updateToken(hash, fcm_token, email);
                  const data_1 = await fetchUserByEmail(email);

                  return res.json({
                    status: 200,
                    success: true,
                    message: "Buyer Login successful!",
                    token: toke,
                    user_id: data[0].id,
                    user_name: data[0].buyer_name,
                    // user_info: data_1,
                  });
                });
              });
            } else {
              return res.json({
                success: false,
                message: "Invalid password.",
                status: 400,
              });
            }
          } else {
            return res.json({
              message: "Account not found. Please check your details",
              status: 400,
              success: false,
            });
          }
        } else {
          return res.json({
            message: "Login failed. Please verify your account and try again",
            status: 400,
            success: false,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Account not found. Please check your details.",
          status: 400,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.verifyBuyer = async (req, res) => {
  try {
    const { token, act_token } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        token: Joi.string().empty().required().messages({
          "string.required": "token is required",
        }),
        act_token: Joi.string().empty().required().messages({
          "string.required": "act_token is required",
        }),
      })
    );
    const result = schema.validate({ token, act_token });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchBuyerByActToken(act_token);
      if (data.length !== 0) {
        let datas = {
          act_token: "",
          status: true,
        };

        const result = await updateBuyerByActToken(
          token,
          datas.act_token,
          data[0]?.id
        );
        return res.json({
          success: true,
          message: "Email verified successfully! You can now log in.",
          status: 200,
        });
      } else {
        return res.json({
          success: false,
          message: "Error verifying email.",
          status: 400,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.verifyBuyerEmail = async (req, res) => {
  try {
    const act_token = req.params.id;

    const token = generateToken();
    if (!act_token) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchBuyerByActToken(act_token);
      console.log("veri buyer data ==>>", data);

      if (data.length !== 0) {
        let datas = {
          act_token: "",
          status: true,
        };
        const hash = await bcrypt.hash(token, saltRounds);
        const result = await updateBuyerByActToken(
          hash,
          datas.act_token,
          data[0]?.id
        );

        if (result.affectedRows) {
          res.sendFile(__dirname + "/view/verify.html");
        } else {
          res.sendFile(__dirname + "/view/notverify.html");
        }
      } else {
        res.sendFile(__dirname + "/view/notverify.html");
      }
    }
  } catch (error) {
    console.log(error);
    res.send(`<div class="container">
        <p>404 Error, Page Not Found</p>
        </div> `);
  }
};

exports.resetPassword_buyer = async (req, res) => {
  try {
    const { password, confirm_password } = req.body;
    const token = localStorage.getItem("vertoken");

    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(6).max(16).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
        confirm_password: Joi.string().min(6).max(16).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
      })
    );
    const result = schema.validate({ password, confirm_password });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      res.render(path.join(__dirname + "/view/", "forgetPassword.ejs"), {
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        msg: message,
      });
    } else {
      if (password == confirm_password) {
        const data = await fetchBuyerById(token);
        console.log("data 600 --->>>", data);

        if (data.length !== 0) {
          // const update_show_password = await updatePassword_1(password, token);
          const hash = await bcrypt.hash(password, saltRounds);
          const result2 = await updateBuyerPassword(hash, token);

          if (result2) {
            res.sendFile(path.join(__dirname + "/view/message.html"), {
              msg: "",
            });
          } else {
            res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
              msg: "Internal Error Occured, Please contact Support.",
            });
          }
        } else {
          return res.json({
            message: "User not found please sign-up first",
            success: false,
            status: 400,
          });
        }
      } else {
        console.log("------------------------------------");
        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "Password and Confirm Password do not match",
        });
      }
    }
  } catch (error) {
    console.log(error);

    res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
      msg: "Internal server error",
    });
  }
};

exports.forgotPasswordBuyer = async (req, res) => {
  try {
    const { email } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().empty().required()],
      })
    );
    const result = schema.validate({ email });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchBuyerByEmail(email);
      const user = await data[0];
      if (data.length !== 0) {
        await sendVerificationEmailForgetPassword(email, user.id);

        return res.json({
          success: true,
          message:
            "Password reset link sent successfully. Please check your email",
          status: 400,
        });
      } else {
        return res.json({
          success: false,
          message: "Email address not found. Please enter a valid email",
          status: 400,
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

exports.changePasswordBuyer = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user_id = req.user;

    const schema = Joi.alternatives(
      Joi.object({
        old_password: Joi.string().min(6).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 6 value required",
          "string.max": "maximum 10 values allowed",
        }),
        new_password: Joi.string().min(6).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 6 value required",
          "string.max": "maximum 10 values allowed",
        }),
      })
    );
    const result = schema.validate({ old_password, new_password });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");

      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        msg: message,
      });
      // Now you can use `errorResponse` wherever needed
    } else {
      if (old_password && new_password) {
        console.log(user_id);
        const data = await fetchBuyerById(user_id);

        if (data.length !== 0) {
          // Check if the old password matches the stored hashed password
          const isOldPasswordCorrect = await bcrypt.compare(
            old_password,
            data[0].password
          );

          if (isOldPasswordCorrect) {
            // Old password is correct, proceed to update the password
            if (old_password !== new_password) {
              const hash = await bcrypt.hash(new_password, saltRounds);
              const result2 = await updateBuyerPassword(hash, user_id);

              if (result2) {
                res.json({
                  message: "password change  successful",
                  success: true,
                  status: 200,
                });
              }
            } else {
              // Old password and new password are the same
              res.json({
                message: "Old password and new password cannot be the same.",
                success: false,
                status: 400,
              });
            }
          } else {
            // Old password is incorrect
            res.json({
              message:
                "Incorrect old password. Please provide the correct old password.",
              success: false,
              status: 400,
            });
          }
        } else {
          return res.json({
            message: "User not found. Please sign up first.",
            success: false,
            status: 400,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
    // res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
    //   msg: "Internal server error",
    // });
  }
};

exports.editProfileBuyer = async (req, res) => {
  try {
    const {
      buyer_name,
      user_name,

      phone_number,
      license_state,
      license_number,
    } = req.body;
    var act_token = generateRandomString(8);
    console.log("act_token ==>>", act_token);

    const schema = Joi.object({
      buyer_name: Joi.string().required().messages({
        "any.required": "buyer_name is required",
        "string.base": "buyer_name must be a string",
      }),

      phone_number: Joi.string()
        .pattern(new RegExp("^[0-9]{10}$"))
        .required()
        .messages({
          "any.required": "Phone number is required",
          "string.pattern.base":
            "Phone number must be a 10-digit numeric value",
        }),
      user_name: Joi.string().required().messages({
        "any.required": "user_name is required",
      }),

      license_state: Joi.string().required().messages({
        "any.required": "license_state is required",
        "string.base": "license_state must be a string",
      }),
      license_number: Joi.string().required().messages({
        "any.required": "license_number is required",
        "string.base": "license_number must be a string",
      }),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let filename = "";
      if (req.body.file !== undefined) {
        if (!req.file) {
          return res.status(400).json({
            message:
              "You have provided the 'file' parameter but not attached any file!",
            status: 400,
            success: false,
          });
        }
      } else if (req.file) {
        const file = req.file;
        filename = file.filename;
      }

      let profile_image = filename;
      profile_image = baseUrl_profile_image + profile_image;

      console.log("profile_image 2058 ==>>", profile_image);
      const userData = {
        buyer_name,
        user_name,
        phone_number,
        license_state,
        license_number,
        profile_image,
      };

      // const user_id = req.params.id;
      const user_id = req.user;

      const userInfo = await fetchBuyerById(user_id);
      console.log("++++++++++++++++++++++++++++", userInfo);
      if (userInfo.length !== 0) {
        const result = await updateBuyerById(userData, user_id);

        if (result.affectedRows) {
          const userInfo = await fetchBuyerById(user_id);

          return res.json({
            message: "Profile updated successfully!",
            status: 200,
            success: true,
            user_info: userInfo[0],
          });
        } else {
          return res.json({
            message: "update user failed ",
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

// ====================************===============
// seller start here

exports.signUp_seller = async (req, res) => {
  try {
    const {
      seller_name,
      user_name,
      email,
      phone_number,
      password,
      license_number,
      license_state,
      profile_image,
    } = req.body;
    var act_token = generateRandomString(8);
    console.log("act_token ==>>", act_token);

    const schema = Joi.object({
      seller_name: Joi.string().required().messages({
        "any.required": "seller_name is required",
        "string.base": "seller_name must be a string",
      }),
      user_name: Joi.string().min(3).max(30).required().messages({
        "any.required": "User name is required",
        "string.base": "User name must be a string",
      }),
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
      }),
      phone_number: Joi.string()
        .pattern(new RegExp("^[0-9]{10}$"))
        .required()
        .messages({
          "any.required": "Phone number is required",
          "string.pattern.base":
            "Phone number must be a 10-digit numeric value",
        }),
      password: Joi.string().min(6).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least {#limit} characters",
      }),
      license_number: Joi.number().required().messages({
        "any.required": "License number is required",
      }),

      license_state: Joi.string().required().messages({
        "any.required": "License state is required",
      }),
    });

    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      var data = await fetchSellerByEmail(email);

      let filename = "";
      if (req.body.file !== undefined) {
        if (!req.file) {
          return res.status(400).json({
            message:
              "You have provided the 'file' parameter but not attached any file!",
            status: 400,
            success: false,
          });
        }
      } else if (req.file) {
        const file = req.file;
        filename = file.filename;
      }

      let profile_image = filename;
      console.log("profile_image 2058 ==>>", profile_image);

      if (data.length !== 0 && data[0].verify_user == 1) {
        return res.json({
          success: false,
          message:
            "Email address already registered. Please use a different email. ",
          status: 400,
        });
      } else {
        const user_data = await seller_name_Check(user_name);

        if (user_data.length != 0 && user_data[0].verify_user == 1) {
          return res.json({
            success: false,
            message:
              "User_Name already registered. Please use a different User_Name.",
            status: 400,
          });
        } else {
          let phone_check = await seller_phone_Check(phone_number);
          console.log("check phone number>>>", phone_check);
          if (phone_check.length != 0 && phone_check[0].verify_user == 1) {
            return res.json({
              success: false,
              message:
                "Phone Number already registered. Please use a different Phone Number.",
              status: 400,
            });
          } else {
            const hash = await bcrypt.hash(password, saltRounds);
            var user = {
              seller_name: seller_name,
              user_name: user_name,
              email: email,
              password: hash,
              phone_number: phone_number,
              license_number: license_number,
              license_state: license_state,
              act_token: act_token,

              profile_image: filename ? filename : data[0]?.profile_image,
            };
            if (data.length != 0 && data[0].verify_user == 0) {
              const create_user = await update_user_seller(user);
              const verificationLink = `${baseurl}/web/verifyUser/${act_token}`;
              await sendVerificationEmail(email, verificationLink);
              res.json({
                success: true,
                message: "User details updated successfully! ",
                status: 200,
                data_1: data,
              });
            } else {
              const create_user = await register_seller(user);
              const verificationLink = `${baseurl}/web/verifyUser/${act_token}`;
              await sendVerificationEmail(email, verificationLink);
              res.json({
                success: true,
                message: "Sign up successful! Welcome to our application",
                status: 200,

                data_1: data,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = generateToken();
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().empty().required()],
        //   fcm_token: [Joi.string().empty().required()],
        password: Joi.string().min(8).max(15).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 15 values allowed",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchSellerByEmail(email);

      if (data.length !== 0) {
        if (data[0]?.act_token === "" && data[0]?.verify_user === 1) {
          if (email === data[0].email) {
            const match = bcrypt.compareSync(password, data[0]?.password);

            if (match) {
              const toke = jwt.sign(
                {
                  data: {
                    id: data[0].id,
                  },
                },
                "SecretKey"
                // { expiresIn: "1d" }
              );
              // console.log(toke);
              bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(token, salt, async function (err, hash) {
                  if (err) throw err;
                  //  const results = await updateToken(hash, fcm_token, email);
                  const data_1 = await fetchUserByEmail(email);

                  return res.json({
                    status: 200,
                    success: true,
                    message: "Buyer Login successful!",
                    token: toke,
                    // user_info: data_1,
                  });
                });
              });
            } else {
              return res.json({
                success: false,
                message: "Invalid password.",
                status: 400,
              });
            }
          } else {
            return res.json({
              message: "Account not found. Please check your details",
              status: 400,
              success: false,
            });
          }
        } else {
          return res.json({
            message: "Login failed. Please verify your account and try again",
            status: 400,
            success: false,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Account not found. Please check your details.",
          status: 400,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { token, act_token } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        token: Joi.string().empty().required().messages({
          "string.required": "token is required",
        }),
        act_token: Joi.string().empty().required().messages({
          "string.required": "act_token is required",
        }),
      })
    );
    const result = schema.validate({ token, act_token });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchUserByActToken(act_token);
      if (data.length !== 0) {
        let datas = {
          act_token: "",
          status: true,
        };

        const result = await updateUserByActToken(
          token,
          datas.act_token,
          data[0]?.id
        );
        return res.json({
          success: true,
          message: "Email verified successfully! You can now log in.",
          status: 200,
        });
      } else {
        return res.json({
          success: false,
          message: "Error verifying email.",
          status: 400,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.verifyUserEmail = async (req, res) => {
  try {
    const act_token = req.params.id;

    const token = generateToken();
    if (!act_token) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchUserByActToken(act_token);

      if (data.length !== 0) {
        let datas = {
          act_token: "",
          status: true,
        };
        const hash = await bcrypt.hash(token, saltRounds);
        const result = await updateUserByActToken(
          hash,
          datas.act_token,
          data[0]?.id
        );

        if (result.affectedRows) {
          res.sendFile(__dirname + "/view/verify.html");
        } else {
          res.sendFile(__dirname + "/view/notverify.html");
        }
      } else {
        res.sendFile(__dirname + "/view/notverify.html");
      }
    }
  } catch (error) {
    console.log(error);
    res.send(`<div class="container">
        <p>404 Error, Page Not Found</p>
        </div> `);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = generateToken();
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().empty().required()],
        //   fcm_token: [Joi.string().empty().required()],
        password: Joi.string().min(8).max(15).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 15 values allowed",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchUserByEmail(email);

      if (data.length !== 0) {
        if (data[0]?.act_token === "" && data[0]?.verify_user === 1) {
          if (email === data[0].email) {
            const match = bcrypt.compareSync(password, data[0]?.password);

            if (match) {
              const toke = jwt.sign(
                {
                  data: {
                    id: data[0].id,
                  },
                },
                "SecretKey"
                // { expiresIn: "1d" }
              );
              // console.log(toke);
              bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(token, salt, async function (err, hash) {
                  if (err) throw err;
                  //  const results = await updateToken(hash, fcm_token, email);
                  const data_1 = await fetchUserByEmail(email);

                  return res.json({
                    status: 200,
                    success: true,
                    message: "Login successful!",
                    token: toke,
                    user_info: data_1,
                  });
                });
              });
            } else {
              return res.json({
                success: false,
                message: "Invalid password.",
                status: 400,
              });
            }
          } else {
            return res.json({
              message: "Account not found. Please check your details",
              status: 400,
              success: false,
            });
          }
        } else {
          return res.json({
            message: "Login failed. Please verify your account and try again",
            status: 400,
            success: false,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Account not found. Please check your details.",
          status: 400,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirm_password } = req.body;
    const token = localStorage.getItem("vertoken");

    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(8).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
        confirm_password: Joi.string().min(8).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
      })
    );
    const result = schema.validate({ password, confirm_password });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      res.render(path.join(__dirname + "/view/", "forgetPassword.ejs"), {
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        msg: message,
      });
    } else {
      if (password == confirm_password) {
        const data = await fetchUserById(token);

        if (data.length !== 0) {
          // const update_show_password = await updatePassword_1(password, token);
          const hash = await bcrypt.hash(password, saltRounds);
          const result2 = await updatePassword(hash, token);

          if (result2) {
            res.sendFile(path.join(__dirname + "/view/message.html"), {
              msg: "",
            });
          } else {
            res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
              msg: "Internal Error Occured, Please contact Support.",
            });
          }
        } else {
          return res.json({
            message: "User not found please sign-up first",
            success: false,
            status: 400,
          });
        }
      } else {
        console.log("------------------------------------");
        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "Password and Confirm Password do not match",
        });
      }
    }
  } catch (error) {
    console.log(error);

    res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
      msg: "Internal server error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().empty().required()],
      })
    );
    const result = schema.validate({ email });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchUserByEmail(email);
      const user = await data[0];
      if (data.length !== 0) {
        await sendVerificationEmailForgetPassword(email, user.id);

        return res.json({
          success: true,
          message:
            "Password reset link sent successfully. Please check your email",
          status: 200,
        });
      } else {
        return res.json({
          success: false,
          message: "Email address not found. Please enter a valid email",
          status: 400,
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

exports.verifyPassword = async (req, res) => {
  try {
    const id = req.params.token;

    // console.log(id);

    if (!id) {
      return res.status(400).send("Invalid link");
    } else {
      const result = await fetchUserById(id);

      const token = result[0]?.id;

      if (result.length !== 0) {
        localStorage.setItem("vertoken", token);

        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "",
        });
      } else {
        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "This User is not Registered",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.send(`<div class="container">
          <p>404 Error, Page Not Found</p>
          </div> `);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user_id = req.user;

    const schema = Joi.alternatives(
      Joi.object({
        old_password: Joi.string().min(8).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
        new_password: Joi.string().min(8).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
      })
    );
    const result = schema.validate({ old_password, new_password });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");

      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        msg: message,
      });
      // Now you can use `errorResponse` wherever needed
    } else {
      if (old_password && new_password) {
        console.log(user_id);
        const data = await fetchUserById(user_id);

        if (data.length !== 0) {
          // Check if the old password matches the stored hashed password
          const isOldPasswordCorrect = await bcrypt.compare(
            old_password,
            data[0].password
          );

          if (isOldPasswordCorrect) {
            // Old password is correct, proceed to update the password
            if (old_password !== new_password) {
              const hash = await bcrypt.hash(new_password, saltRounds);
              const result2 = await updatePassword(hash, user_id);

              if (result2) {
                res.json({
                  message: "password change  successful",
                  success: true,
                  status: 200,
                });
              }
            } else {
              // Old password and new password are the same
              res.json({
                message: "Old password and new password cannot be the same.",
                success: false,
                status: 400,
              });
            }
          } else {
            // Old password is incorrect
            res.json({
              message:
                "Incorrect old password. Please provide the correct old password.",
              success: false,
              status: 400,
            });
          }
        } else {
          return res.json({
            message: "User not found. Please sign up first.",
            success: false,
            status: 400,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
    // res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
    //   msg: "Internal server error",
    // });
  }
};

exports.get_all_users = async (req, res) => {
  try {
    const all_users = await get_all_users();
    if (all_users != 0) {
      return res.json({
        message: "all users ",
        status: 200,
        success: true,
        all_users: all_users,
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

exports.myProfile = async (req, res) => {
  try {
    const user_id = req.user;

    const data = await fetchBuyerById(user_id);

    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "User Found Successfully",
        user_info: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "User Not Found",
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

exports.editProfile = async (req, res) => {
  try {
    const userData = {
      user_Name: req.body.user_Name,
      Profile_images: req?.file?.filename,
      DOB: req.body.DOB,
    };
    // Validate the input using Joi
    const schema = Joi.object({
      user_Name: Joi.string().empty().required(),
      DOB: Joi.string().optional(),
      Profile_images: Joi.optional(),
    });
    const result = schema.validate({
      ...req.body, // Include text data
      Profile_images: req.file, // Include file data
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
    if (!req.file) {
      return res.status(400).send({ message: "You must select a file." });
    } else {
      const user_id = req.params.id;

      const user_data = await user_name_Check(userData.user_Name);

      if (user_data.length !== 0 && user_data[0].verify_user == 1) {
        return res.json({
          success: false,
          message:
            "user_Name already registered. Please use a different user_Name.",
          status: 400,
        });
      }
      const userInfo = await fetchUserById(user_id);
      console.log("++++++++++++++++++++++++++++", userInfo);
      if (userInfo.length !== 0 && userInfo[0].verify_user == 1) {
        const result = await updateUserById(userData, user_id);

        if (result.affectedRows) {
          const userInfo = await fetchUserById(user_id);

          return res.json({
            message: "Profile updated successfully!",
            status: 200,
            success: true,
            user_info: userInfo[0],
          });
        } else {
          return res.json({
            message: "update user failed ",
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

exports.getUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    const data = await fetchUserById(user_id);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "User Found successfully!",
        user_info: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "User Not Found",
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

exports.deleteUserById = async (req, res) => {
  try {
    const user_id = req.params.id;

    const data = await delete_user(user_id);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "User deleted successfully!",
        user_info: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "User Not Found",
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
