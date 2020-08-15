const { auth } = require("../Middlewares/auth");
const Cart = require("../Models/cart");
const Product = require("../Models/product");

module.exports = function (app) {
  ///POST///

  app.post("/api/cart/add-item", auth, (req, res) => {
    Cart.findById(req.user._id, (err, cart) => {
      if (err || !cart) return res.status(400).json({ added: false, err });

      Product.findById(req.query.id, (err, product) => {
        if (err || !product) return res.status(400).json({ added: false, err });
        cart.addItem(
          req.query.id,
          product,
          req.body.quantity ? req.body.quantity : 1,
          (err, cart, exceeded) => {
            if (err || !cart)
              return res.status(400).json({ added: false, err });
            return res.status(200).json({ added: true, cart, exceeded });
          }
        );
      });
    });
  });

  ///GET///

  app.get("/api/cart/items", auth, (req, res) => {
    let id = req.user._id;
    Cart.findById(id, (err, cart) => {
      if (err || !cart || cart.products.length === 0)
        return res.status(400).json({ gotItems: false, err });
      return res.status(200).json({ gotItems: true, items: cart.products });
    });
  });

  ///DELETE///

  app.delete("/api/cart/delete-item", auth, (req, res) => {
    Cart.findById(req.user._id, (err, cart) => {
      if (err || !cart) return res.status(400).json({ deleted: false, err });

      Product.findById(req.query.id, (err, product) => {
        if (err || !product)
          return res.status(400).json({ deleted: false, err });
        cart.deleteItem(req.query.id, product, (err, cart) => {
          if (err || !cart)
            return res.status(400).json({ deleted: false, err });
          return res.status(200).json({ deleted: true, cart });
        });
      });
    });
  });

  app.delete("/api/cart/delete-whole-item", auth, (req, res) => {
    Cart.findById(req.user._id, (err, cart) => {
      if (err || !cart) return res.status(400).json({ deleted: false, err });

      let origLen = cart.products.length;
      cart.products = cart.products.filter((item) => {
        return item.product._id === req.query.id;
      });
      if (cart.products.length === origLen)
        return res.status(200).json({ deleted: false });

      cart.save((err, cart) => {
        if (err || !cart) return res.status(400).json({ deleted: false, err });
        return res.status(200).json({ deleted: true, cart });
      });
    });
  });
};
