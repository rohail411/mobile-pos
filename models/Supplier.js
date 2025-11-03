// models/Supplier.js
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Supplier", supplierSchema);
