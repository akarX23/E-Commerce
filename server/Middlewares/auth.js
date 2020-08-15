const User = require("../Models/user");

let auth = (req, res, next) => {
  let token = req.cookies.auth;

  if (!token) return res.status(200).send("Please Log In");
  User.findByToken(token, (err, user) => {
    if (err) return res.status(400).json({ isAuth: false, err });
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
