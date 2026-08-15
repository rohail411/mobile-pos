const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

function resolveDbPath() {
  if (process.env.DB_PATH) return process.env.DB_PATH;

  try {
    // When required from within the Electron main process, store the
    // database in the OS-standard per-app data directory so it survives
    // app updates and reinstalls, and is trivial to back up (one file).
    const { app } = require("electron");
    if (app) {
      const dir = app.getPath("userData");
      fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, "mobile-shop.db");
    }
  } catch (err) {
    // Not running inside Electron (e.g. `npm run server:dev`) — fall
    // back to a local ./data folder for development.
  }

  const dir = path.join(__dirname, "..", "data");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "mobile-shop.db");
}

const dbPath = resolveDbPath();
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    sku TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    email TEXT,
    phone TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    cnic TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brandId INTEGER NOT NULL REFERENCES brands(id),
    model TEXT NOT NULL,
    price REAL NOT NULL,
    type TEXT NOT NULL DEFAULT 'new',
    imei TEXT NOT NULL UNIQUE,
    supplierId INTEGER REFERENCES suppliers(id),
    userId INTEGER REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'in_stock',
    deletedAt TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER REFERENCES products(id),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    price REAL NOT NULL,
    sellPrice REAL,
    type TEXT,
    userId INTEGER REFERENCES users(id),
    customerId INTEGER NOT NULL REFERENCES customers(id),
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
  CREATE INDEX IF NOT EXISTS idx_products_deletedAt ON products(deletedAt);
  CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt);
  CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
`);

module.exports = db;
