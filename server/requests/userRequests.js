const User = require("../Models/user");
const { auth } = require("../Middlewares/auth");
const Product = require("../Models/product");
module.exports = function (app) {
  ///POST REQUESTS///

  app.post("/api/user/register", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err)
        return res.status(200).json({
          success: false,
          errorMessage: "Something went wrong. Please try again",
        });
      if (user)
        return res.status(200).json({
          success: false,
          errorMessage: "User already exists!",
        });
      else {
        const user = new User(req.body);

        user.generateAuthToken((err, user) => {
          if (err)
            return res.status(200).json({
              success: false,
              errorMessage: "Something went wrong. Please try again",
              err,
            });

          return res.status(200).json({
            success: true,
            user,
          });
        });
      }
    });
  });

  app.post("/api/user/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user)
        return res.status(200).json({
          isAuth: false,
          errorMessage: "Auth failed, email not found!",
        });
      user.comparePasswords(req.body.password, (err, isMatch) => {
        if (err) return res.status(400).send(err);
        if (!isMatch)
          return res
            .status(200)
            .json({ isAuth: false, errorMessage: "Password does not match!" });
        user.generateAuthToken((err, user) => {
          if (err) return res.status(400).send(err);

          res.cookie("auth", user.token);
          if (user.role === 1)
            return res
              .status(200)
              .json({ isAuth: true, adminLogIn: true, user });
          else if (user.role === 0)
            return res
              .status(200)
              .json({ isAuth: true, adminLogIn: false, user });
          else
            return res
              .status(200)
              .json({ isAuth: false, errorMessage: "Invalid User" });
        });
      });
    });
  });

  ///GET REQUESTS///

  app.get("/api/auth", auth, (req, res) => {
    res.status(200).json({
      id: req.user._id,
      isAuth: true,
      role: req.user.role,
      email: req.user.email,
    });
  });

  app.get("/api/user/logout", auth, (req, res) => {
    req.user.deleteToken((err, user) => {
      if (err)
        res.status(200).json({
          success: false,
          errorMessage: "Could not logout. Please try again.",
        });
      res.cookie("auth", null);
      res.status(200).json({ success: true, user });
    });
  });

  app.get("/api/user/profile", auth, (req, res) => {
    const id = req.user._id;

    User.findById(id, (err, user) => {
      if (err) return res.status(200).json({ found: false, err });
      return res.status(200).json({ found: true, user });
    });
  });

  app.get("/api/user/user-list", (req, res) => {
    User.find({ role: 0 }, (err, users) => {
      if (err) return res.status(200).json({ found: false, err });
      if (users.length === 0)
        return res
          .status(200)
          .json({ list: false, errorMessage: "No Users to display" });
      return res.status(200).json({ found: true, users });
    });
  });

  app.get("/api/user/admin-list", (req, res) => {
    User.find({ role: 1 }, (err, users) => {
      if (err) return res.status(200).json({ found: false, err });
      if (users.length === 0)
        return res
          .status(200)
          .json({ list: false, errorMessage: "No Users to display" });
      return res.status(200).json({ found: true, users });
    });
  });

  ///UPDATE///

  app.post("/api/user/update", auth, (req, res) => {
    User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true },
      (err, doc) => {
        if (err) return res.status(400).json({ update: false, err });
        if (!doc)
          return res.json({ update: false, errorMessage: "User not found" });
      }
    );
  });

  ///DELETE///

  app.delete("/api/user/delete", auth, (req, res) => {
    let id = req.query.id;

    if (
      req.user.role === 1 ||
      req.user._id.toString().localeCompare(id) === 0
    ) {
      User.findById(id, (err, user) => {
        if (err || !user) return res.status(400).json({ delete: false, err });

        user.deleteUser((err) => {
          if (err) return res.status(400).json({ delete: false, err });
          return res.status(200).json({ delete: true });
        });
      });
    }
  });
};
