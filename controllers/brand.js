const brands = require("../db/brands");

const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (brands.findAll().some((b) => b.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ message: "Brand already exists" });
    }
    const brand = brands.create({ name });
    res.status(201).json({ message: "Brand saved successfully", brand });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    res.status(200).json(brands.findAll());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = brands.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "brand not found" });
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const existing = brands.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "brand not found" });
    const brand = brands.update(req.params.id, { name: req.body.name });
    res.status(200).json({ message: "brand updated successfully", brand });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const existing = brands.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "brand not found" });
    brands.remove(req.params.id);
    res.status(200).json({ message: "brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
