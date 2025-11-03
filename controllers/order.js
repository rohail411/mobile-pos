// controllers/orderController.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const generatePDF = require("../middlewares/pdf");

// Create a new order
const createOrder = async (req, res) => {
  const order = new Order({ ...req.body, userId: req.user.id });
  try {
    await order.save();
    // delete product on the base of imei
    const updateProduct = { deletedAt: new Date() };

    await Product.updateOne({ _id: req.body.productId }, updateProduct);
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.log(req.body, error);
    res.status(400).json({ message: "Error creating order" });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { type, order, week, month, year } = req.query;

    // Build the filter object
    const filter = {};
    if (type) {
      filter.type = type;
    }

    if (week) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7));
      filter.createdAt = { $gte: startOfWeek };
    }

    if (month) {
      const startOfMonth = new Date();
      startOfMonth.setDate(startOfMonth.getDate() - 29);
      filter.createdAt = { $gte: startOfMonth };
    }

    if (year) {
      const startOfYear = new Date();
      startOfYear.setDate(startOfYear.getDate() - 364);
      filter.createdAt = { $gte: startOfYear };
    }

    // Determine sorting
    const sortOptions = {};
    if (order) {
      sortOptions["createdAt"] = order === "desc" ? -1 : 1;
    }

    // Fetch orders with filters and sorting
    const orders = await Order.find(filter).sort(sortOptions);
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Download report
const downloadReport = async (req, res) => {
  try {
    const { type, order, week, month, year } = req.query;

    // Build the filter object
    const filter = {};
    if (type) {
      filter.type = type;
    }

    if (week) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7));
      filter.createdAt = { $gte: startOfWeek };
    }

    if (month) {
      const startOfMonth = new Date();
      startOfMonth.setDate(startOfMonth.getDate() - 29);
      filter.createdAt = { $gte: startOfMonth };
    }

    if (year) {
      const startOfYear = new Date();
      startOfYear.setDate(startOfYear.getDate() - 364);
      filter.createdAt = { $gte: startOfYear };
    }

    // Determine sorting
    const sortOptions = {};
    if (order) {
      sortOptions["createdAt"] = order === "desc" ? -1 : 1;
    }

    // Fetch orders with filters and sorting
    const orders = await Order.find(filter).sort(sortOptions);
    const pdfPath = await generatePDF(orders);
    res.json({ pdfPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  downloadReport,
};
