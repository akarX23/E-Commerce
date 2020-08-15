const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = mongoose.Schema({
  _id: { type: String, required: true },
  products: [
    {
      quantity: { type: Number, default: 1, min: 1 },
      totalPrice: { type: Number, default: 0 },
      product: {},
      _id: false,
    },
  ],
});

cartSchema.methods.addItem = function (id, product, quantity, cb) {
  let cart = this;
  let found = false;
  let exceeded = false;

  for (const item of cart.products) {
    if (item.product._id.toString().localeCompare(id) === 0) {
      found = true;
      item.product = product;
      if (item.quantity + quantity > item.product.quantity) {
        item.quantity = item.product.quantity;
        exceeded = true;
      } else item.quantity += quantity;
      item.totalPrice = item.quantity * item.product.price;
      break;
    }
  }

  if (!found) {
    cart.products.unshift({ product });
    cart.products[0].totalPrice = product.price;
  }

  cart.save((err, cart) => {
    if (err || !cart) return cb(err);
    return cb(null, cart, exceeded);
  });
};

cartSchema.methods.deleteItem = function (id, product, cb) {
  let cart = this;
  let found = false;

  for (const item of cart.products) {
    if (item.product._id.toString().localeCompare(id) === 0) {
      found = true;
      item.product = product;
      if (item.quantity - 1 >= 1) {
        item.quantity -= 1;
        item.totalPrice -= item.product.price;
      }
      break;
    }
  }
  if (!found) return cb(err);
  cart.save((err, cart) => {
    if (err || !cart) return cb(err);
    return cb(null, cart);
  });
};

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
