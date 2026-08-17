const users = require("../db/users");
const jwt = require("jsonwebtoken");
const getJwtSecret = require("../config/jwtSecret");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (users.findByEmail(email)) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }
    const user = await users.create({ name, email, password });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.findByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await users.comparePassword(user, password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, getJwtSecret(), {
    expiresIn: "12h",
  });
  res.status(200).json({ token, user: { name: user.name, email: user.email } });
};

const getAllUsers = async (req, res) => {
  res.send(users.findAll());
};

const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) {
    return res.status(400).json({ message: "You can't delete the account you're logged in with" });
  }
  if (users.count() <= 1) {
    return res.status(400).json({ message: "At least one account must remain" });
  }
  users.remove(id);
  res.json({ message: "User removed successfully" });
};

module.exports = {
  register,
  login,
  getAllUsers,
  deleteUser,
};
