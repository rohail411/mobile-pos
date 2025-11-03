const express = require("express");

const { register, login, getAllUsers } = require("../controllers/user");
const protect = require("../middlewares/authToken");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get all users
router.get("/", protect, getAllUsers);

module.exports = router;
