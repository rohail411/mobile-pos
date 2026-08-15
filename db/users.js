const db = require("./index");
const bcrypt = require("bcrypt");

async function create({ name, email, password }) {
  const hash = await bcrypt.hash(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run(name, email, hash);
  return findById(info.lastInsertRowid);
}

function findById(id) {
  return db
    .prepare("SELECT id, name, email, createdAt FROM users WHERE id = ?")
    .get(id);
}

function findByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

function findAll() {
  return db.prepare("SELECT id, name, email, createdAt FROM users").all();
}

function count() {
  return db.prepare("SELECT COUNT(*) as count FROM users").get().count;
}

function remove(id) {
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}

async function comparePassword(user, password) {
  return bcrypt.compare(password, user.password);
}

module.exports = { create, findById, findByEmail, findAll, count, remove, comparePassword };
