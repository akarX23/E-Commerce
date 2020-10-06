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
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userReview: [
      {
        userInfo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comment: String,
        _id: false,
        updatedAt: { type: Date, default: Date.now },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        usersLiked: [String],
        usersDisliked: [String],
      },
    ],
    quantity: { type: Number, default: 1 },
    imageURLs: [String],
  },
  { timestamps: true }
);

productSchema.pre("find", function () {
  this.populate({
    path: "owner",
    select: "-password -token  -__v -validated",
  }).populate({
    path: "userReview.userInfo",
    select: "-password -token  -__v -validated",
  });
});

productSchema.pre("save", function (next) {
  this.populate({
    path: "owner",
    select: "-password -token  -__v -validated",
  })
    .populate({
      path: "userReview.userInfo",
      select: "-password -token  -__v -validated",
    })
    .execPopulate()
    .then(function () {
      next();
    });
});

productSchema.methods.addOrUpdateReview = function (data, user, cb) {
  let product = this;
  let found = false;

  for (const review of product.userReview) {
    if (`${review.userInfo._id}`.localeCompare(user._id) === 0) {
      product.totalRating -= review.rating;
      review.rating = data.rating;
      review.comment = data.comment;
      product.totalRating += review.rating;
      review.updatedAt = Date.now();
      found = true;
      break;
    }
  }

  if (!found) {
    product.userReview.unshift({
      userInfo: user._id,
      rating: data.rating,
      comment: data.comment,
      updatedAt: Date.now(),
    });
    product.totalRating += data.rating;
  }
  product.rating = product.totalRating / (product.userReview.length + 1);

  return cb(null, product);
};

productSchema.methods.deleteReview = function (userId, cb) {
  let product = this;

  product.userReview = product.userReview.filter((review) => {
    if (review.userInfo._id.toString().localeCompare(userId) === 0) {
      product.totalRating -= review.rating;
      return false;
    }
    return true;
  });

  product.rating = product.totalRating / (product.userReview.length + 1);

  product.save((err, product) => {
    if (err) return cb(err);
    return cb(null, product);
  });
};

productSchema.methods.updateLikes = function (
  { liked, disliked, ownerId },
  userId,
  cb
) {
  let product = this;

  for (const review of product.userReview) {
    if (`${review.userInfo._id}`.localeCompare(ownerId) === 0) {
      if (liked === false)
        review.usersLiked = review.usersLiked.filter((id) => {
          return userId.localeCompare(id) !== 0;
        });
      else {
        review.usersLiked.push(userId);
        review.usersLiked = new Set(review.usersLiked);
        review.usersLiked = [...review.usersLiked];
      }

      if (disliked === false)
        review.usersDisliked = review.usersDisliked.filter((id) => {
          return userId.localeCompare(id) !== 0;
        });
      else {
        review.usersDisliked.push(userId);
        review.usersDisliked = new Set(review.usersDisliked);
        review.usersDisliked = [...review.usersDisliked];
      }

      review.likes = review.usersLiked.length;
      review.dislikes = review.usersDisliked.length;
      break;
    }
  }

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
