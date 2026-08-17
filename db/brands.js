const db = require("./index");

const toSku = (name) => name.toLowerCase().replaceAll(" ", "-");

function create({ name }) {
  const info = db
    .prepare("INSERT INTO brands (name, sku) VALUES (?, ?)")
    .run(name, toSku(name));
  return db.prepare("SELECT * FROM brands WHERE id = ?").get(info.lastInsertRowid);
}

function findAll() {
  return db.prepare("SELECT * FROM brands ORDER BY name ASC").all();
}

function findById(id) {
  return db.prepare("SELECT * FROM brands WHERE id = ?").get(id);
}

function update(id, { name }) {
  db.prepare(
    "UPDATE brands SET name = ?, sku = ?, updatedAt = datetime('now') WHERE id = ?"
  ).run(name, toSku(name), id);
  return findById(id);
}

function remove(id) {
  db.prepare("DELETE FROM brands WHERE id = ?").run(id);
}

module.exports = { create, findAll, findById, update, remove };
