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

productSchema.index({ name: "text", tags: "text" });

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

productSchema.statics.searchFilter = function (
  { searchArray, sortby, rating, priceRange, limit, skip, order },
  cb
) {
  const regex = searchArray.map((searchItem) => {
    searchItem =
      searchItem[0] === "#"
        ? searchItem.substring(1, searchItem.length)
        : searchItem;
    return new RegExp(searchItem, "i");
  });

  let query = null;
  let sortParam = "";
  let products = this;

  if (regex.length > 0)
    query = products.find({
      $or: [{ tags: { $in: [...regex] } }, { title: { $in: [...regex] } }],
    });
  else query = products.find();

  if (sortby === 0) sortParam = "updatedAt";
  else if (sortby === 1) sortParam = "rating";
  else if (sortby === 2) sortParam = "updatedAt";
  else if (sortby === 3) sortParam = "price";
  else if (sortby === 4) sortParam = "rating";

  query
    .where("rating")
    .gte(rating[0])
    .lte(rating[1])
    .where("price")
    .gte(priceRange[0])
    .lte(priceRange[1])
    .limit(limit)
    .skip(skip)
    .sort({ [sortParam]: order })
    .exec((err, products) => {
      if (err) return cb(err);
      return cb(null, products);
    });
};

//Export the model
module.exports = mongoose.model("Product", productSchema);
