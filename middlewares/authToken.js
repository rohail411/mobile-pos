const jwt = require("jsonwebtoken");
const getJwtSecret = require("../config/jwtSecret");

module.exports = (req, res, next) => {
  const header = req.header("Authorization");
  const token = header && header.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
  next();
};
