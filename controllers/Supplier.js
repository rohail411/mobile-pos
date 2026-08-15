const suppliers = require("../db/suppliers");

const createSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const supplier = suppliers.create({ name, email, phone });
    res.status(201).json({ message: "Supplier created successfully", supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create supplier: " + error.message });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    res.status(200).json(suppliers.findAll());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve suppliers: " + error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = suppliers.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve supplier: " + error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const existing = suppliers.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    const supplier = suppliers.update(req.params.id, { name, email, phone });
    res.status(200).json({ message: "Supplier updated successfully", supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update supplier: " + error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const existing = suppliers.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    suppliers.remove(req.params.id);
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete supplier: " + error.message });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
