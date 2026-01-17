
const mongoose = require("mongoose");
module.exports = mongoose.model("Transfer", {
  fromBase: String,
  toBase: String,
  equipment: String,
  quantity: Number,
  timestamp: { type: Date, default: Date.now }
});
