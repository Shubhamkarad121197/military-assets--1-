const mongoose = require("mongoose");

module.exports = mongoose.model("Expenditure", {
  base: String,
  equipmentType: String,
  quantity: Number,
  reason: String,
  date: { type: Date, default: Date.now }
});
