//required packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/config").get(process.env.NODE_ENV);
const cors = require("cors");

//IMPLEMENTATIONS
mongoose.Promise = global.Promise;
const app = express();

//MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static("client/build"));

//CONNECTION TO DATABASE
mongoose.connect(
  "mongodb+srv://akarX:ritik@e-commerce.ucyuc.mongodb.net/E-Commerce?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) console.log("Error in DB connection : " + err);
    else console.log("MongoDB Connection succeeded");
  }
);

//REQUESTS
require("./requests/userRequests")(app);
require("./requests/productRequests")(app);
require("./requests/cartRequests")(app);
require("./requests/orderHistoryRequests")(app);
require("./requests/paymentRazorPay")(app);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
});

const port = process.env.PORT || 5000;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log("Server Running on port: " + port);
});
