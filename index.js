const express = require("express");
const web_user = require("./web_routes/users");
const web_product = require("./web_routes/prodcut");
const web_category = require("./web_routes/category");
const web_cart = require("./web_routes/cart");
const web_order = require("./web_routes/orderRouter");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.json());

// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.static("public"))

// Uncomment the line below if you have an 'uploads' directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/web", web_user);
app.use("/web", web_product);
app.use("/web", web_category);
app.use("/web", web_cart);
app.use("/web", web_order);

app.get("/", (req, res) => {
  res.send({ success: "0", message: "Hello World" });
});

app.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*",
    "http://192.168.1.20:9000",
    {
      reconnect: true,
    }
  );

  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept, X-Custom-Header,Authorization"
  );

  res.setHeader("Content-Type", "text/plain");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  } else {
    return res.send({ success: "0", message: "Hello World" });
  }
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`Node app is running on port ${PORT}`);
});

module.exports = app;
