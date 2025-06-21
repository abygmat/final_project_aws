const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true },
  productId: { type: String, required: true },
  dateOfOrdering: { type: Date, default: Date.now },
  paymentMode: { type: String, enum: ['card', 'upi', 'netbanking', 'cod'], required: true }
});

module.exports = mongoose.model('Order', orderSchema);

