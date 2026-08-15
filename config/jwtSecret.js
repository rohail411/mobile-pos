const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function resolveConfigDir() {
  try {
    const { app } = require("electron");
    if (app) {
      const dir = app.getPath("userData");
      fs.mkdirSync(dir, { recursive: true });
      return dir;
    }
  } catch (err) {
    // not running inside Electron
  }
  const dir = path.join(__dirname, "..", "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// The app runs fully offline on a single machine, so a per-install
// secret generated on first run (and persisted alongside the SQLite
// file) is sufficient — no need to hand-manage a shared server secret.
function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  const secretPath = path.join(resolveConfigDir(), "jwt-secret.txt");
  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, "utf8").trim();
  }
  const secret = crypto.randomBytes(48).toString("hex");
  fs.writeFileSync(secretPath, secret, "utf8");
  return secret;
}

module.exports = getJwtSecret;
