const config = require("../config/config").get(process.env.NODE_ENV);
const Razorpay = require("razorpay");
const axios = require("axios");

const instance = new Razorpay({
  key_id: config.RAZOR_PAY_KEY_ID,
  key_secret: config.RAZOR_PAY_KEY_SECRET,
});

module.exports = function (app) {
  app.get("/api/order", (req, res) => {
    try {
      const options = {
        amount: parseFloat(req.query.amount) * 100,
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 0,
        // 1 for automatic capture // 0 for manual capture
      };
      instance.orders.create(options, async function (err, order) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Something Went Wrong",
            err,
          });
        }
        return res.status(200).json({ success: true, order });
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong",
        err,
      });
    }
  });

  app.post("/api/capture", async (req, res) => {
    try {
      const response = await axios
        .post(
          `https://${config.RAZOR_PAY_KEY_ID}:${config.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.body.paymentId}/capture`,
          { amount: req.body.amount * 100, currency: "INR" }
        )
        .then((response) => response.data);
      return res.status(200).json({
        success: true,
        status: response,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Something Went Wrong",
      });
    }
  });
};
