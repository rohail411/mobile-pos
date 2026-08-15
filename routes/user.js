const express = require("express");

const { register, login, getAllUsers, deleteUser } = require("../controllers/user");
const protect = require("../middlewares/authToken");

const router = express.Router();

// Login user (public)
router.post("/login", login);

// Create a new staff/user account — requires being logged in already,
// since the very first account is created automatically on first run
// (see db/seed.js), so this is now an in-app "add user" action, not a
// public sign-up form.
router.post("/register", protect, register);

// List / remove user accounts
router.get("/", protect, getAllUsers);
router.delete("/users/:id", protect, deleteUser);

module.exports = router;
