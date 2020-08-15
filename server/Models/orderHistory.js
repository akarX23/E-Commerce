const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const orderHistorySchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  entries: [
    {
      items: [],
      _id: false,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

//Export the model
module.exports = mongoose.model("OrderHistory", orderHistorySchema);
