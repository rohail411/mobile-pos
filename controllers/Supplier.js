// controllers/supplierController.js
const Supplier = require("../models/Supplier");

// Create a new supplier with name, email, and number
const createSupplier = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Number are required" });
    }
    const supplier = new Supplier({ name, email });
    await supplier.save();
    res
      .status(201)
      .json({ message: "Supplier created successfully", supplier });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "Failed to create supplier: " + error.message });
  }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve suppliers: " + error.message });
  }
};

// Get a single supplier by ID
const mongoose = require("mongoose");

const getSupplierById = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid supplier ID format" });
  }

  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve supplier: " + error.message });
  }
};

// Update a supplier by ID
const updateSupplier = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Number are required" });
    }
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true } // Ensure validation is run on update
    );
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res
      .status(200)
      .json({ message: "Supplier updated successfully", supplier });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to update supplier: " + error.message });
  }
};

// Delete a supplier by ID
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to delete supplier: " + error.message });
  }
};

// Export the functions
module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
