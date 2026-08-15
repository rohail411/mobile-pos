const db = require("./index");

function withJoins(row) {
  if (!row) return row;
  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(row.customerId);
  return { ...row, customer };
}

function create({ productId, brand, model, price, sellPrice, type, userId, customerId }) {
  const info = db
    .prepare(
      `INSERT INTO orders (productId, brand, model, price, sellPrice, type, userId, customerId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(productId || null, brand, model, price, sellPrice ?? null, type || null, userId, customerId);
  return withJoins(findById(info.lastInsertRowid));
}

function findById(id) {
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
}

function dateFilterClause({ week, month, year }) {
  if (week) return "createdAt >= datetime('now', '-7 days')";
  if (month) return "createdAt >= datetime('now', '-30 days')";
  if (year) return "createdAt >= datetime('now', '-365 days')";
  return null;
}

function findAll({ type, order, week, month, year } = {}) {
  const clauses = [];
  const params = [];
  if (type) {
    clauses.push("type = ?");
    params.push(type);
  }
  const dateClause = dateFilterClause({ week, month, year });
  if (dateClause) clauses.push(dateClause);

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const dir = order === "asc" ? "ASC" : "DESC";

  const rows = db
    .prepare(`SELECT * FROM orders ${where} ORDER BY createdAt ${dir}`)
    .all(...params);
  return rows.map(withJoins);
}

function stats() {
  const week = db
    .prepare(
      `SELECT COUNT(*) as count, COALESCE(SUM(sellPrice),0) as revenue, COALESCE(SUM(sellPrice - price),0) as profit
       FROM orders WHERE createdAt >= datetime('now', '-7 days')`
    )
    .get();
  const month = db
    .prepare(
      `SELECT COUNT(*) as count, COALESCE(SUM(sellPrice),0) as revenue, COALESCE(SUM(sellPrice - price),0) as profit
       FROM orders WHERE createdAt >= datetime('now', '-30 days')`
    )
    .get();
  const topBrands = db
    .prepare(
      `SELECT brand, COUNT(*) as count FROM orders WHERE createdAt >= datetime('now', '-30 days')
       GROUP BY brand ORDER BY count DESC LIMIT 5`
    )
    .all();
  const recent = findAll({ order: "desc" }).slice(0, 8);
  return { week, month, topBrands, recent };
}

module.exports = { create, findAll, findById, stats };
