const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var tokenSchema = new mongoose.Schema({
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

//Export the model
module.exports = mongoose.model("Token", tokenSchema);
