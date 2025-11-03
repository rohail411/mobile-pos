const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    sellPrice: { type: Number, required: false },
    type: { type: String, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerCnic: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
