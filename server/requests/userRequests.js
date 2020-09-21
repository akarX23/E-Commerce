const User = require("../Models/user");
const Token = require("../Models/Token");
const { auth } = require("../Middlewares/auth");
const { sendEmail } = require("../Mail/email");
module.exports = function (app) {
  ///POST REQUESTS///

  app.post("/api/user/register", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err)
        return res.status(200).json({
          isAuth: false,
          success: false,
          errorMessage: "Something went wrong. Please try again",
          err,
        });
      if (user && user.validated === true)
        return res.status(200).json({
          isAuth: false,
          success: false,
          verified: true,
        });
      else if (user && user.validated === false)
        return res.status(200).json({
          isAuth: false,
          success: false,
          verified: false,
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

          user.sendConfirmationEmail(user._id, user.token, (err) => {
            if (err)
              return res.status(200).json({
                isAuth: false,
                success: false,
                err,
              });
          });

          return res.status(200).json({
            isAuth: false,
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
          success: false,
          emailNotFound: true,
          errorMessage: "Auth failed, email not found!",
        });
      if (user.validated === false)
        return res.status(200).json({
          isAuth: false,
          success: false,
          verified: false,
        });
      user.comparePasswords(req.body.password, (err, isMatch) => {
        if (err) return res.status(400).send(err);
        if (!isMatch)
          return res.status(200).json({
            isAuth: false,
            success: false,
            mismatch: true,
            errorMessage: "Password does not match!",
          });
        user.generateAuthToken((err, user) => {
          if (err) return res.status(400).send(err);

          res.cookie("auth", user.token);
          return res.status(200).json({
            isAuth: true,
            id: user._id,
            role: user.role,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
          });
        });
      });
    });
  });

  app.post("/api/user/sendMail", (req, res) => {
    sendEmail("", req.body.email, req.body.name, "test", (err) => {
      if (err) return res.status(400).json({ emailSent: false, err });
      return res.status(200).json({ emailSent: true });
    });
  });

  app.post("/api/user/resendConfirmLink", (req, res) => {
    const email = req.body.email;

    User.findOne({ email: email }, (err, user) => {
      if (err || user === null)
        return res.status(200).json({ linksent: false });

      if (user.validated === true)
        return res.status(200).json({ verified: true });
      user.generateAuthToken((err, user) => {
        if (err) return res.status(200).json({ linksent: false });

        user.sendConfirmationEmail(user._id, user.token, (err) => {
          if (err) return res.status(200).json({ linksent: false });

          return res.status(200).json({
            linksent: true,
          });
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
      name: req.user.name,
      lastname: req.user.lastname,
    });
  });

  app.get("/api/user/logout", auth, (req, res) => {
    req.user.deleteToken((err) => {
      if (err)
        res.status(200).json({
          success: false,
          errorMessage: "Could not logout. Please try again.",
        });
      res.cookie("auth", null);
      res.status(200).json({ isAuth: false });
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

  app.get("/api/user/confirmemail", (req, res) => {
    let token = req.query.token;
    Token.findOne({ token: token }, (err, token) => {
      if (err)
        return res.status(200).json({
          verified: false,
          err,
        });

      User.findByToken(req.query.token, (err, user) => {
        if (err || user === null)
          return res.status(200).json({
            verified: false,
            err,
          });
        else if (user.validated === false && token === null)
          return res.status(200).json({
            verified: false,
            expired: true,
          });
        else if (user.validated === true)
          return res.status(200).json({ verified: true });
        user.confirmEmail((err, user) => {
          if (err || user === null)
            return res.status(200).json({
              verified: false,
              err,
            });
          return res.status(200).json({
            verified: true,
          });
        });
      });
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
