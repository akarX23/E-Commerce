const User = require("../Models/user");
const Token = require("../Models/yoken");
const Cart = require("../Models/cart");
const OrderHistory = require("../Models/orderHistory");
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
            image: user.imageURL,
            address: [...user.address],
            mobile: user.mobile,
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
      if (err) return res.status(200).json({ linksent: false });
      if (user === null)
        return res.status(200).json({ linksent: false, userFound: false });
      if (user.validated === true)
        return res.status(200).json({ linkVerified: true, linksent: false });
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

  app.post("/api/user/resetPasswordLink", (req, res) => {
    let { email, id } = req.body;

    User.findOne({ email: email }, (err, user) => {
      if (err) return res.status(200).json({ linksent: false });
      if (user === null)
        return res.status(200).json({ linksent: false, userFound: false });
      user.generateAuthToken((err, user) => {
        if (err) return res.status(200).json({ linksent: false });
        if (user._id.toString().localeCompare(id) === 0)
          res.cookie("auth", user.token);

        user.sendPasswordResetLink(user.token, user._id, (err) => {
          if (err) return res.status(200).json({ linksent: false });

          return res.status(200).json({
            linksent: true,
          });
        });
      });
    });
  });

  app.post("/api/user/resetPassword", (req, res) => {
    let { token, id, tokenVerified, password } = req.body;
    console.log(req.body);
    if (tokenVerified === false) {
      Token.findOneAndUpdate(
        { token: token },
        { $unset: { token: 1 } },
        (err, token) => {
          if (err)
            return res.status(200).json({
              reset: false,
              err,
            });
          else if (!token)
            return res.status(200).json({
              reset: false,
              expired: true,
              err,
            });
          User.findById(id, (err, user) => {
            if (err || !user)
              return res.status(200).json({ reset: false, expired: true, err });
            res.cookie("auth", null);
            return res.status(200).json({ reset: false, expired: false });
          });
        }
      );
    } else {
      User.findByToken(token, (err, user) => {
        if (err) return res.status(200).json({ reset: false, err });
        else if (!user) return res.status(200).json({ reset: false });
        console.log(user);

        user.generateAuthToken((err, user) => {
          if (err) return res.status(200).json({ reset: false, err });

          res.cookie("auth", user.token);
          user.password = password;

          user.save((err, user) => {
            if (err) return res.status(200).json({ reset: false, err });
            return res.status(200).json({
              reset: true,
              user: {
                isAuth: true,
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                image: user.imageURL,
                address: [...user.address],
                mobile: user.mobile,
              },
            });
          });
        });
      });
    }
  });

  app.post("/api/admin/addUser", auth, (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err)
        return res.status(200).json({
          success: false,
          err,
        });
      if (user)
        return res.status(200).json({
          success: false,
          found: true,
        });

      const newUser = new User(req.body);

      newUser.save((err, user) => {
        if (err)
          return res.status(200).json({
            userAdded: false,
            err,
          });

        new Cart({ _id: user._id, products: [] }).save((err, doc) => {
          if (err)
            return res.status(200).json({
              success: false,
              err,
            });
        });

        new OrderHistory({ owner: user._id, entries: [] }).save((err, doc) => {
          if (err)
            return res.status(200).json({
              success: false,
              err,
            });
        });

        return res.status(200).json({
          success: true,
          added: true,
          user: {
            _id: user._id,
            role: user.role,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            image: user.imageURL,
            mobile: user.mobile,
          },
        });
      });
    });
  });

  app.post("/api/admin/promoteUser", auth, (req, res) => {
    let id = req.body.id;

    User.findById(id, (err, user) => {
      if (err) return res.status(200).json({ success: false, err });
      user.role = 1;
      user.save((err, user) => {
        if (err)
          return res.status(200).json({
            success: false,
            err,
          });
        user.password = null;
        user.address = null;

        return res.status(200).json({
          success: true,
          promoted: true,
          user: {
            _id: user._id,
            role: user.role,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            image: user.imageURL,
            mobile: user.mobile,
          },
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
      image: req.user.imageURL,
      address: [...req.user.address],
      mobile: req.user.mobile,
    });
  });

  app.get("/api/admin/user-list", auth, (req, res) => {
    User.find({}, "-password -address", (err, users) => {
      if (err) return res.status(400).json({ list: false, err });
      return res.status(200).json({
        list: true,
        users,
      });
    });

    // User.getUserList(req.body, (err, users) => {
    //   if (err) return res.status(400).json({ list: false, err });
    //   return res.status(200).json({
    //     list: true,
    //     users,
    //   });
    // });
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
      return res.status(200).json({
        found: true,
        userProfile: {
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          address: [...user.address],
          mobile: user.mobile,
          image: user.imageURL,
        },
      });
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
    let id = req.query.id;

    Token.findOne({ token: token }, (err, token) => {
      if (err)
        return res.status(200).json({
          verified: false,
          err,
        });

      User.findById(id, (err, user) => {
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
          return res.status(200).json({ verified: true, new: false });

        user.confirmEmail((err, user) => {
          if (err || user === null)
            return res.status(200).json({
              verified: false,
              err,
            });
          res.cookie("auth", user.token);
          return res.status(200).json({
            changeAuth: true,
            verification: { verified: true, new: true },
            user: {
              isAuth: true,
              id: user._id,
              role: user.role,
              email: user.email,
              name: user.name,
              lastname: user.lastname,
              image: user.imageURL,
              address: [...user.address],
              mobile: user.mobile,
            },
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
      (err, user) => {
        if (err || !user) return res.status(200).json({ update: false, err });

        return res.status(200).json({
          update: true,
          user: {
            isAuth: true,
            id: user._id,
            role: user.role,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            image: user.imageURL,
            address: [...user.address],
            mobile: user.mobile,
          },
        });
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
        if (err || !user)
          return res.status(400).json({ success: false, delete: false, err });

        user.deleteUser((err) => {
          if (err) return res.status(400).json({ delete: false, err });
          return res.status(200).json({
            success: true,
            deleted: true,
            user: {
              _id: user._id,
              role: user.role,
              email: user.email,
              name: user.name,
              lastname: user.lastname,
              image: user.imageURL,
              mobile: user.mobile,
            },
          });
        });
      });
    }
  });
};
