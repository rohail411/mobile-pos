// routes/productRoutes.js
const express = require("express");
const authToken = require("../middlewares/authToken");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getStats,
} = require("../controllers/product");

const router = express.Router();

router.post("/", authToken, createProduct);
router.get("/", authToken, getAllProducts);
router.get("/stats", authToken, getStats);
router.put("/:id", authToken, updateProduct);
router.delete("/:id", authToken, deleteProduct);

module.exports = router;
