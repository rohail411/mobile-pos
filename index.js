const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

require("./db"); // initializes the local SQLite database and schema
const seedDemoUser = require("./db/seed");

const { resolveReportsDir } = require("./middlewares/pdf");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const brandRoutes = require("./routes/brand");
const supplierRoutes = require("./routes/Supplier");
const customerRoutes = require("./routes/customer");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/reports", express.static(resolveReportsDir()));

app.use("/api/v1", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/brand", brandRoutes);
app.use("/api/v1/supplier", supplierRoutes);
app.use("/api/v1/customers", customerRoutes);

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Electron's main process awaits this before pointing a BrowserWindow
// at the server, so the window never races an HTTP request against a
// server that hasn't started listening yet.
const ready = seedDemoUser()
  .catch((err) => console.error("Failed to seed demo user:", err))
  .then(
    () =>
      new Promise((resolve) => {
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
          resolve();
        });
      })
  );

module.exports = app;
module.exports.ready = ready;
