const products = require("../db/products");

const createProduct = async (req, res) => {
  const { brand, model, price, type, imei, supplierId } = req.body;
  try {
    if (!brand || !model || !price || !imei) {
      return res.status(400).json({ message: "Brand, model, price and IMEI are required" });
    }
    const product = products.create({
      brandId: brand,
      model,
      price,
      type,
      imei,
      supplierId,
      userId: req.user.id,
    });
    res.status(201).json({ message: "Mobile added successfully", product });
  } catch (error) {
    console.error("Error adding mobile:", error);
    res.status(400).json({ message: "Error adding mobile", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { type, search, page, pageSize } = req.query;
    const result = products.findAll({ type, search, page, pageSize });
    return res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { brand, model, price, type, imei, supplierId } = req.body;
    const product = products.update(req.params.id, {
      brandId: brand,
      model,
      price,
      type,
      imei,
      supplierId,
    });
    res.json({ message: "Mobile updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = products.findRaw(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Mobile not found" });
    }
    products.softDelete(req.params.id);
    res.json({ message: "Mobile deleted successfully" });
  } catch (error) {
    console.error("Error deleting mobile:", error);
    res.status(400).json({ message: "Error deleting mobile", error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    res.json({ stats: products.stats() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getStats,
};
