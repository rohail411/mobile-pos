const db = require("./index");

function withJoins(row) {
  if (!row) return row;
  const brand = db.prepare("SELECT * FROM brands WHERE id = ?").get(row.brandId);
  const supplier = row.supplierId
    ? db.prepare("SELECT * FROM suppliers WHERE id = ?").get(row.supplierId)
    : null;
  return { ...row, brandId: brand, supplierId: supplier };
}

function create({ brandId, model, price, type, imei, supplierId, userId }) {
  const info = db
    .prepare(
      `INSERT INTO products (brandId, model, price, type, imei, supplierId, userId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(brandId, model, price, type || "new", imei, supplierId || null, userId);
  return withJoins(findRaw(info.lastInsertRowid));
}

function findRaw(id) {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id);
}

function findAll({ type, search, page = 1, pageSize = 20 } = {}) {
  const clauses = ["deletedAt IS NULL"];
  const params = [];
  if (type) {
    clauses.push("type = ?");
    params.push(type);
  }
  if (search) {
    clauses.push(
      "(model LIKE ? OR imei LIKE ? OR brandId IN (SELECT id FROM brands WHERE name LIKE ?))"
    );
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  const where = clauses.join(" AND ");

  const total = db
    .prepare(`SELECT COUNT(*) as count FROM products WHERE ${where}`)
    .get(...params).count;

  const offset = (Number(page) - 1) * Number(pageSize);
  const rows = db
    .prepare(
      `SELECT * FROM products WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`
    )
    .all(...params, Number(pageSize), offset);

  return { products: rows.map(withJoins), total, page: Number(page), pageSize: Number(pageSize) };
}

function update(id, { brandId, model, price, type, imei, supplierId }) {
  db.prepare(
    `UPDATE products SET brandId = ?, model = ?, price = ?, type = ?, imei = ?, supplierId = ?, updatedAt = datetime('now')
     WHERE id = ?`
  ).run(brandId, model, price, type, imei, supplierId || null, id);
  return withJoins(findRaw(id));
}

function softDelete(id) {
  db.prepare("UPDATE products SET deletedAt = datetime('now') WHERE id = ?").run(id);
}

function markSold(id) {
  db.prepare(
    "UPDATE products SET status = 'sold', deletedAt = datetime('now') WHERE id = ?"
  ).run(id);
}

function stats() {
  const inStock = db
    .prepare(
      "SELECT type, COUNT(*) as count, COALESCE(SUM(price),0) as value FROM products WHERE deletedAt IS NULL GROUP BY type"
    )
    .all();
  return inStock;
}

module.exports = { create, findAll, findRaw, update, softDelete, markSold, stats };
