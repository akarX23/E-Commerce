const { auth } = require("../Middlewares/auth");
const Cart = require("../Models/cart");
const Product = require("../Models/product");

module.exports = function (app) {
  ///POST///

  app.post("/api/cart/add-item", auth, (req, res) => {
    Cart.find({ _id: req.user._id }, (err, carts) => {
      let cart = carts[0];
      if (err || !cart) return res.status(400).json({ success: false, err });

      cart.addItem(
        req.body.id,
        req.body.quantity ? req.body.quantity : 1,
        req.body.price,
        (err, cart) => {
          if (err || !cart)
            return res.status(400).json({ success: false, err });
          return res.status(200).json({ success: true, items: cart.products });
        }
      );
    });
  });

  app.post("/api/cart/changeQuantity", auth, (req, res) => {
    Cart.find({ _id: req.user._id }, (err, carts) => {
      let cart = carts[0];
      if (err || !cart) return res.status(400).json({ success: false, err });
      let newQuantity = req.body.quantity;
      let productId = req.body.id;
      let price = req.body.price;

      cart.changeQuantity(productId, newQuantity, price, (err, cart) => {
        if (err || !cart) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, items: cart.products });
      });
    });
  });

  ///GET///

  app.get("/api/cart/items", auth, (req, res) => {
    let id = req.user._id;
    Cart.find({ _id: id }, (err, carts) => {
      let cart = carts[0];
      if (err || !cart) return res.status(200).json({ list: false, err });

      return res.status(200).json({ list: true, items: cart.products });
    });
  });

  ///DELETE///

  app.delete("/api/cart/delete-item", auth, (req, res) => {
    Cart.find({ _id: req.user.id }, (err, carts) => {
      let cart = carts[0];
      if (err || !cart) return res.status(400).json({ success: false, err });
      let origLen = cart.products.length;
      cart.products = cart.products.filter((item) => {
        return item.product._id.toString().localeCompare(req.query.id) !== 0;
      });
      if (cart.products.length === origLen)
        return res.status(200).json({ success: false });
      cart.save((err, cart) => {
        if (err || !cart) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, items: cart.products });
      });
    });
  });
};
