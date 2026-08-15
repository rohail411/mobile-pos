const db = require("./index");

function create({ name, email, phone }) {
  const info = db
    .prepare("INSERT INTO suppliers (name, email, phone) VALUES (?, ?, ?)")
    .run(name, email || null, phone || null);
  return db.prepare("SELECT * FROM suppliers WHERE id = ?").get(info.lastInsertRowid);
}

function findAll() {
  return db.prepare("SELECT * FROM suppliers ORDER BY name ASC").all();
}

function findById(id) {
  return db.prepare("SELECT * FROM suppliers WHERE id = ?").get(id);
}

function update(id, { name, email, phone }) {
  db.prepare(
    "UPDATE suppliers SET name = ?, email = ?, phone = ?, updatedAt = datetime('now') WHERE id = ?"
  ).run(name, email || null, phone || null, id);
  return findById(id);
}

function remove(id) {
  db.prepare("DELETE FROM suppliers WHERE id = ?").run(id);
}

module.exports = { create, findAll, findById, update, remove };
