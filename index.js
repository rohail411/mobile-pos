const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const brandRoutes = require("./routes/brand");
const supplierRoutes = require("./routes/Supplier");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors("*"));
// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// i want to server siatic build of react app through nodejs
// app.get(
//   [
//     "/",
//     "/login",
//     "/dashboard",
//     "/dashboard/default",
//     "/new-mobiles",
//     "/old-mobiles",
//     "/sold-mobiles",
//   ],
//   (req, res) => {
//     // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//     return res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
//   }
// );
// app.use(
//   "/assets",
//   (req, res, next) => {
//     console.log("FILE==", req.url);
//     const fileName = req.url.split("/")[1];
//     res.sendFile(path.join(__dirname, "client", "dist", "assets", fileName));
//     //next();
//   }
//   //express.static(path.join(__dirname, "client", "dist", "assets"))
// );
app.use("/data", express.static("data"));
// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/brand", brandRoutes);

app.use("/api/v1/supplier", supplierRoutes);

app.use(express.static(path.join(__dirname, "client", "dist")));

// Handle all requests by sending the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
