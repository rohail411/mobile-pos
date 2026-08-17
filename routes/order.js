// routes/orderRoutes.js
const express = require("express");
const authToken = require("../middlewares/authToken");
const {
  createOrder,
  getAllOrders,
  downloadReport,
  getStats,
} = require("../controllers/order");

const router = express.Router();

router.post("/", authToken, createOrder);
router.get("/", authToken, getAllOrders);
router.get("/stats", authToken, getStats);
router.get("/download-report", authToken, downloadReport);

module.exports = router;
