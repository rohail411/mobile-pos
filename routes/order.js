// routes/orderRoutes.js
const express = require("express");
const authToken = require("../middlewares/authToken");
const {
  createOrder,
  getAllOrders,
  downloadReport,
} = require("../controllers/order");

const router = express.Router();

// Create a new order
router.post("/", authToken, createOrder);

// Get all orders
router.get("/", authToken, getAllOrders);

// Download report
router.get("/download-report", authToken, downloadReport);

module.exports = router;
