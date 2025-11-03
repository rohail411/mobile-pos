const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  res.status(200).json({ token, user: { name: user.name, email: user.email } });
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

module.exports = {
  register,
  login,
  getAllUsers,
};
