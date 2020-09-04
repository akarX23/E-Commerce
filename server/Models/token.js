const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var tokenSchema = new mongoose.Schema({
  user_id: String,
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 30 },
});

//Export the model
module.exports = mongoose.model("Token", tokenSchema);
