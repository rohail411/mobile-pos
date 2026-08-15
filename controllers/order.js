const orders = require("../db/orders");
const products = require("../db/products");
const customers = require("../db/customers");
const generatePDF = require("../middlewares/pdf");

const createOrder = async (req, res) => {
  const { productId, brand, model, price, sellPrice, type, customerName, customerPhone, customerCnic } = req.body;
  try {
    if (!customerName || !customerPhone) {
      return res.status(400).json({ message: "Customer name and phone are required" });
    }

    const customer = customers.findOrCreate({
      name: customerName,
      phone: customerPhone,
      cnic: customerCnic,
    });

    const order = orders.create({
      productId,
      brand,
      model,
      price,
      sellPrice,
      type,
      userId: req.user.id,
      customerId: customer.id,
    });

    if (productId) {
      products.markSold(productId);
    }

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(req.body, error);
    res.status(400).json({ message: "Error creating order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { type, order, week, month, year } = req.query;
    const result = orders.findAll({ type, order, week, month, year });
    res.json({ orders: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const downloadReport = async (req, res) => {
  try {
    const { type, order, week, month, year } = req.query;
    const result = orders.findAll({ type, order, week, month, year });
    const pdfPath = await generatePDF(result);
    res.json({ pdfPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getStats = async (req, res) => {
  try {
    res.json(orders.stats());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  downloadReport,
  getStats,
};
