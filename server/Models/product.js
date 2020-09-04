const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    rating: { type: String, default: 5 },
    totalRating: { type: Number, default: 5 },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [String],
    owner: {},
    userReview: [
      {
        id: String,
        rating: Number,
        comment: String,
        _id: false,
      },
    ],
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

productSchema.methods.addOrUpdateReview = function (data, cb) {
  let product = this;
  let found = false;

  for (const review of product.userReview) {
    if (review.id === data.id) {
      product.totalRating -= review.rating;
      review.rating = data.rating;
      review.comment = data.comment;
      product.totalRating += review.rating;
      found = true;
      break;
    }
  }

  if (!found) {
    product.userReview.unshift({
      id: data.id,
      rating: data.rating,
      comment: data.comment,
    });
    product.totalRating += data.rating;
  }
  product.rating = product.totalRating / (product.userReview.length + 1);

  product.save((err, product) => {
    if (err) return cb(err);
    return cb(null, product);
  });
};

//Export the model
module.exports = mongoose.model("Product", productSchema);
