// routes/productRoutes.js
const express = require("express");
const authToken = require("../middlewares/authToken");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const router = express.Router();

// Create a new product
router.post("/", authToken, createProduct);

// Get all products
router.get("/", authToken, getAllProducts);

// Update a product
router.put("/:id", authToken, updateProduct);

// Delete a product
router.delete("/:id", authToken, deleteProduct);

module.exports = router;
