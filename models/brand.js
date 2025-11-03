const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    sku: { type: String, required: false },
  },
  { timestamps: true }
);

brandSchema.pre("save", async function (next) {
  this.sku = this.name.toLowerCase().replaceAll(" ", "-");

  next();
});

module.exports = mongoose.model("Brand", brandSchema);
