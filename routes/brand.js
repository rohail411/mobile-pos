const express = require("express");
const authToken = require("../middlewares/authToken");
const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand");

const router = express.Router();

router.post("/createBrand", authToken, createBrand);
router.get("/getAllBrands", authToken, getAllBrands);
router.get("/getBrandById/:id", authToken, getBrandById);
router.put("/updateBrand/:id", authToken, updateBrand);
router.delete("/deleteBrand/:id", authToken, deleteBrand);

module.exports = router;
