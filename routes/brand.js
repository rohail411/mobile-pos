const express = require("express");
const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand");

const router = express.Router();

//create a brand route

router.post("/createBrand", createBrand);

//get all brands route

router.get("/getAllBrands", getAllBrands);

//get a brand by id route
// ?ID=123 QUERYPARAM
// :ID PARAM
router.get("/getBrandById/:id", getBrandById);

//update a brand route

router.put("/updateBrand/:id", updateBrand);

//delete a brand route

router.delete("/deleteBrand/:id", deleteBrand);

module.exports = router;
