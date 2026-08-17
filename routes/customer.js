const express = require("express");
const authToken = require("../middlewares/authToken");
const { getAllCustomers, getCustomerById, exportCustomers } = require("../controllers/customer");

const router = express.Router();

router.get("/", authToken, getAllCustomers);
router.get("/export", authToken, exportCustomers);
router.get("/:id", authToken, getCustomerById);

module.exports = router;
