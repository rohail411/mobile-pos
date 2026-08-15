const db = require("./index");

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

// Finds a customer by phone, or creates one — this is the single
// dedupe point so the same phone number never gets a second row.
function findOrCreate({ name, phone, cnic }) {
  const normalized = normalizePhone(phone);
  const existing = db
    .prepare("SELECT * FROM customers WHERE phone = ?")
    .get(normalized);
  if (existing) {
    db.prepare(
      "UPDATE customers SET name = ?, cnic = COALESCE(?, cnic), updatedAt = datetime('now') WHERE id = ?"
    ).run(name, cnic || null, existing.id);
    return db.prepare("SELECT * FROM customers WHERE id = ?").get(existing.id);
  }
  const info = db
    .prepare("INSERT INTO customers (name, phone, cnic) VALUES (?, ?, ?)")
    .run(name, normalized, cnic || null);
  return db.prepare("SELECT * FROM customers WHERE id = ?").get(info.lastInsertRowid);
}

function findAll({ search } = {}) {
  if (search) {
    const like = `%${search}%`;
    return db
      .prepare(
        "SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY createdAt DESC"
      )
      .all(like, like);
  }
  return db.prepare("SELECT * FROM customers ORDER BY createdAt DESC").all();
}

function findById(id) {
  return db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
}

function purchaseHistory(customerId) {
  return db
    .prepare("SELECT * FROM orders WHERE customerId = ? ORDER BY createdAt DESC")
    .all(customerId);
}

module.exports = { findOrCreate, findAll, findById, purchaseHistory, normalizePhone };
