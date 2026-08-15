const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/authToken");
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/Supplier");

router.post("/createSupplier", authToken, createSupplier);
router.get("/getAllSuppliers", authToken, getAllSuppliers);
router.get("/getSupplierById/:id", authToken, getSupplierById);
router.put("/updateSupplier/:id", authToken, updateSupplier);
router.delete("/deleteSupplier/:id", authToken, deleteSupplier);

module.exports = router;
