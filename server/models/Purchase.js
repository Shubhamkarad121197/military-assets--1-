const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  base: String,
  equipment: String,
  quantity: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
