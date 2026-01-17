const mongoose = require("mongoose");

module.exports = mongoose.model("Log", {
  action: String,
  base: String,
  equipmentType: String,
  quantity: Number,
  user: String,
  createdAt: { type: Date, default: Date.now }
});
