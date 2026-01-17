const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  name: String,     
  category: String,
  base: String,
  quantity: Number
});

module.exports = mongoose.model("Asset", AssetSchema);