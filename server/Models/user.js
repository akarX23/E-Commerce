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

const userSchema = mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  if (user.isNew) {
    new Cart({ _id: user._id, products: [] }).save((err, doc) => {
      if (err) return next(err);
    });
    new orderHistory({ ownerId: user._id, entries: [] })
      .populate("ownerId")
      .save((err, doc) => {
        if (err) return next(err);
      });
  }

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

  user.save((err, user) => {
    if (err) return cb(err);

    return cb(null, user);
  });
};

userSchema.statics.getUserList = function (
  { searchString, limit, skip, role },
  cb
) {
  const regex = searchString.split(" ").map((item) => new RegExp(item, "i"));

  let query = null;
  let users = this;

  if (regex.length > 0)
    query = users.find({
      $or: [{ name: { $in: [...regex] } }, { lastname: { $in: [...regex] } }],
    });
  else query = users.find();

  query
    .limit(limit)
    .skip(skip)
    .exec((err, users) => {
      if (err) return cb(err);
      if (role !== 2) {
        users = users.filter((user) => user.role === role);
      }
      return cb(null, users);
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

userSchema.methods.sendPasswordResetLink = function (token, id, cb) {
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
    "passwordResetEmail",
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

  Product.deleteMany({ owner: user._id }, (err) => {
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
