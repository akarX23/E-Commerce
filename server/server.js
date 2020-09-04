//required packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/config").get(process.env.NODE_ENV);

//IMPLEMENTATIONS
mongoose.Promise = global.Promise;
const app = express();

//CONNECTION TO DATABASE
mongoose.connect(
  config.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) console.log("Error in DB connection : " + err);
    else console.log("MongoDB Connection succeeded");
  }
);

//MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());

//REQUESTS
require("./requests/userRequests")(app);
require("./requests/productRequests")(app);
require("./requests/cartRequests")(app);
require("./requests/orderHistoryRequests")(app);

const port = process.env.PORT || 5000;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log("Server Running on port: " + port);
});
