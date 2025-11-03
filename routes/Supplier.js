const express = require("express");
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/Supplier");

// create a supplier route
router.post("/createSupplier", createSupplier);

// get all suppliers route

router.get("/getAllSuppliers", getAllSuppliers);

// get a supplier by id route

router.get("/getSupplierById/:id", getSupplierById);

// update a supplier route

router.put("/updateSupplier/:id", updateSupplier);

// delete a supplier route

router.delete("/deleteSupplier/:id", deleteSupplier);

module.exports = router;
