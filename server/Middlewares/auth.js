const User = require("../Models/user");

let auth = (req, res, next) => {
  let token = req.cookies.auth;

  User.findByToken(token, (err, user) => {
    if (err) return res.status(200).json({ isAuth: false, err });
    if (!user || user.validated === false)
      return res.status(200).json({
        isAuth: false,
        error: true,
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
