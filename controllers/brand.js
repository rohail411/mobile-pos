const Brand = require("../models/brand");

//create new brand

const createBrand = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { name, description } = req.body;
    const isExistBrand = await Brand.findOne({ name: name });
    if (isExistBrand)
      return res.status(400).json({ message: "Brand already exists" });
    const brand = new Brand({ name, description });
    await brand.save();
    res.status(201).json({ message: "Brand saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all brands

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get single brand

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "brand not found" });

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update brand

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { ...req.body, sku: req.body.name.toLowerCase().replaceAll(" ", "-") },
      {
        new: true,
      }
    );
    if (!brand) return res.status(404).json({ message: "brand not found" });

    res.status(200).json({ message: "brand updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete brand

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: "brand not found" });

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
