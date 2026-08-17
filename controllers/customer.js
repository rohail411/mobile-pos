const customers = require("../db/customers");

const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    res.json({ customers: customers.findAll({ search }) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = customers.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const history = customers.purchaseHistory(req.params.id);
    res.json({ customer, orders: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportCustomers = async (req, res) => {
  try {
    const all = customers.findAll();
    const rows = [["Name", "Phone", "CNIC"]];
    all.forEach((c) => rows.push([c.name, c.phone, c.cnic || ""]));
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=customers.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCustomers, getCustomerById, exportCustomers };
