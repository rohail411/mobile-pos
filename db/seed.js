const users = require("./users");

const DEMO_USER = {
  name: "Shop Owner",
  email: "demo@shop.com",
  password: "Demo@1234",
};

// Runs on every app start; only actually creates an account the very
// first time (when the local database has no users yet), so the app
// is usable out of the box without any manual setup step.
async function seedDemoUser() {
  if (users.findAll().length > 0) return;

  await users.create(DEMO_USER);
  console.log("Created demo login:");
  console.log(`  Email:    ${DEMO_USER.email}`);
  console.log(`  Password: ${DEMO_USER.password}`);
}

module.exports = seedDemoUser;
