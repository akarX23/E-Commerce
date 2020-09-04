const Product = require("../Models/product");
const { auth } = require("../Middlewares/auth");

module.exports = function (app) {
  ///POST///

  app.post("/api/product/add", auth, (req, res) => {
    const product = new Product({
      ...req.body,
      owner: {
        _id: req.user._id,
        role: req.user.role,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
      },
    });

    product.save((err, product) => {
      if (err || !product) return res.status(400).json({ err, post: false });
      return res.status(200).json({ post: true, productId: product._id });
    });
  });

  app.post("/api/product/review", auth, (req, res) => {
    let id = req.query.id;
    Product.findById(id, (err, product) => {
      if (err) return res.status(400).json({ reviewAdded: false, err });
      if (!product)
        return res
          .status(400)
          .json({ reviewAdded: false, errorMessage: "Product not found" });

      req.body.id = req.user._id.toString();
      product.addOrUpdateReview(req.body, (err, product) => {
        if (err) return res.status(400).json({ reviewAdded: false, err });
        return res.status(200).json({ reviewAdded: true, product });
      });
    });
  });

  ///GET///

  app.get("/api/product/user-product-list", auth, (req, res) => {
    Product.find({ ownerId: req.user._id }, (err, products) => {
      if (err) return res.status(400).json({ list: false, err });
      if (products.length === 0)
        return res
          .status(200)
          .json({ list: false, errorMessage: "No products to display" });
      return res.status(200).json({ list: true, products });
    });
  });

  app.get("/api/product/product-list", (req, res) => {
    Product.find({}, (err, products) => {
      if (err) return res.status(400).json({ list: false, err });
      if (products.length === 0)
        return res
          .status(200)
          .json({ list: false, errorMessage: "No products to display" });
      return res.status(200).json({ list: true, products });
    });
  });

  app.get("/api/product", (req, res) => {
    let id = req.query.id;

    Product.findById(id, (err, product) => {
      if (err) return res.status(400).json({ found: false, err });
      if (!product)
        return res
          .status(200)
          .json({ found: false, errorMessage: "Product not found" });
      return res.status(200).json({ found: true, product });
    });
  });

  ///UPDATE///

  app.post("/api/product/edit", auth, (req, res) => {
    let id = req.query.id;

    Product.findOneAndUpdate(
      { _id: id, ownerId: req.user._id },
      req.body,
      { new: true },
      (err, product) => {
        if (err) return res.status(400).send(err);
        if (!product)
          return res
            .status(200)
            .json({ edited: false, errorMessage: "Product not found" });
        return res.status(200).json({ edited: true, product });
      }
    );
  });

  ///DELETE

  app.delete("/api/product/delete", auth, (req, res) => {
    let id = req.query.id;
    Product.findById(id, (err, product) => {
      if (err) return res.status(400).send(err);
      if (!product)
        return res
          .status(200)
          .json({ deleted: false, errorMessage: "Product not found" });
      if (
        req.user.role === 1 ||
        req.user._id.toString().localeCompare(product.ownerId) === 0
      ) {
        Product.deleteOne({ _id: id }, (err, product) => {
          if (err) return res.status(400).send(err);
          return res.status(200).json({ delete: true, product });
        });
      } else
        return res
          .status(200)
          .json({ delete: false, errorMessage: "You are not authorised!" });
    });
  });
};
