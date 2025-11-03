const Product = require("../models/Product");
const mongoose = require("mongoose");
const Supplier = require("../models/Supplier");

// Create a new product
const createProduct = async (req, res) => {
  const productData = req.body;

  try {
    const product = new Product({
      ...productData,
      supplierId: productData.supplierId
        ? new mongoose.Types.ObjectId(productData.supplierId)
        : null,
      userId: req.user.id,
      brandId: new mongoose.Types.ObjectId(productData.brand),
    });

    await product.save();
    res.status(201).json({ message: "Mobile added successfully", product });
  } catch (error) {
    console.error("Error adding mobile:", error);
    res
      .status(400)
      .json({ message: "Error adding mobile", error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      type: req.query.type,
      deletedAt: null,
    })
      .populate("supplierId")
      .populate("brandId");
    return res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    // find one and update it with the new
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body, brandId: new mongoose.Types.ObjectId(req.body.brand) },
      { new: true }
    );
    res.json({ message: "Mobile updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(400)
      .json({ message: "Error updating product", error: error.message });
  }
};

// Delete a product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).send({ message: "Mobile not found" });
    }

    // Set deletedAt to the current date for soft delete
    product.deletedAt = new Date();
    await product.save();
    res.json({ message: "Mobile deleted successfully" });
  } catch (error) {
    console.error("Error deleting mobile:", error);
    res
      .status(400)
      .json({ message: "Error deleting mobile", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
