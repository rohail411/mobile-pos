const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: false },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedAt: { type: Date, default: null },
    imei: { type: String, required: true, unique: true },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: false,
    },
    customerName: { type: String, required: true, unique: true },
    customerCnic: { type: String, required: true },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model("Product", productSchema);
