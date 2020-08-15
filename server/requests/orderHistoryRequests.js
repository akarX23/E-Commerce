const OrderHistory = require("../Models/orderHistory");
const Cart = require("../Models/cart");
const { auth } = require("../Middlewares/auth");

module.exports = function (app) {
  ///POST///

  app.post("/api/orderHistory/add", auth, (req, res) => {
    OrderHistory.findOne({ ownerId: req.user._id }, (err, order) => {
      if (err || !order)
        return res.status(400).json({ historyAdded: false, err });

      Cart.findOne({ _id: req.user._id }, (err, cart) => {
        if (err || !cart || cart.products.length === 0)
          return res.status(400).json({ historyAdded: false, err });

        order.entries.unshift({ items: cart.products });

        cart.update({ products: [] }, (err, cart) => {
          if (err || !cart)
            return res.status(400).json({ historyAdded: false, err });

          order.save((err, order) => {
            if (err || !order)
              return res.status(400).json({ historyAdded: false, err });
            return res.status(200).json({ historyAdded: true, order });
          });
        });
      });
    });

    ///GET///

    app.get("/api/orderHistory/history", (req, res) => {
      let id = req.query.id;
      OrderHistory.findOne({ ownerId: id }, (err, order) => {
        if (err || !order)
          return res.status(400).json({ orderHistory: false, err });
        res.status(200).json({ orderHistory: true, history: order.entries });
      });
    });
  });
};
