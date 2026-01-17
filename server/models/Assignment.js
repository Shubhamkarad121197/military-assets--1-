const mongoose = require("mongoose");

module.exports = mongoose.model("Assignment", {
  base: String,
  equipmentType: String,
  assignedTo: String,
  quantity: Number,
  date: { type: Date, default: Date.now }
});
