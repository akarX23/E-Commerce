const mongoose = require("mongoose"); // Erase if already required
const Cart = require("../Models/cart");
const Product = require("../Models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const orderHistory = require("./orderHistory");
const Token = require("./Token");
const { sendEmail } = require("../Mail/email");
const config = require("../config/config").get(process.env.NODE_ENV);
const salt_i = 10;

// Declare the Schema of the Mongo model

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  lastname: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  token: {
    type: String,
  },
  role: {
    type: Number,
    default: 0,
  },
  address: [
    {
      _id: false,
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: Number },
    },
  ],
  validated: {
    type: Boolean,
    default: false,
  },
  imageURL: { type: String, default: "" },
});

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(salt_i, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.generateAuthToken = function generateAuthToken(cb) {
  let user = this;
  let token = jwt.sign({ _id: user._id }, config.SECRET);
  user.token = token;

  user.save((err, user) => {
    if (err) return cb(err);
    return cb(null, user);
  });
};

userSchema.methods.comparePasswords = function (candidatePassword, cb) {
  let user = this;
  bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  if (!token) return cb(null, null);
  let user = this;
  jwt.verify(token, config.SECRET, function (err, decode) {
    if (err) return cb(err);
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      return cb(null, user);
    });
  });
};

userSchema.methods.confirmEmail = function (cb) {
  let user = this;
  user.validated = true;

  new Cart({ _id: user._id, products: [] }).save((err, doc) => {
    if (err) return cb(err);
  });
  new orderHistory({ ownerId: user._id, entries: [] })
    .populate("ownerId")
    .save((err, doc) => {
      if (err) return cb(err);
    });

  user.save((err, user) => {
    if (err) return cb(err);

    return cb(null, user);
  });
};

userSchema.methods.sendConfirmationEmail = function (id, token, cb) {
  let user = this;

  const newtoken = new Token({ token: token });
  newtoken.save((err) => {
    if (err) return cb(err);
  });

  sendEmail(
    id,
    token,
    user.email,
    `${user.name} ${user.lastname}`,
    "confirmEmail",
    (err) => {
      if (err) return cb(err);
      return cb(null);
    }
  );
};

userSchema.methods.deleteToken = function (cb) {
  let user = this;
  user.update({ $unset: { token: 1 } }, (err, user) => {
    if (err) return cb(err);
    return cb(null, user);
  });
};

userSchema.methods.deleteUser = function (cb) {
  let user = this;

  Product.deleteMany({ ownerId: user._id }, (err) => {
    if (err) return cb(err);
  });

  Cart.findByIdAndDelete(user._id, (err, doc) => {
    if (err) return cb(err);
  });

  orderHistory.findOneAndDelete({ ownerId: user._id }, (err) => {
    if (err) return cb(err);
  });

  user.deleteOne((err, doc) => {
    if (err) return cb(err);
  });
  return cb(null);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
