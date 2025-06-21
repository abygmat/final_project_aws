const express = require('express');
const mongoose = require('mongoose'); // Required for ObjectId
const router = express.Router();
const Order = require('../models/order');

// Helper to generate a 9-digit random order ID
function generateOrderId() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

router.post('/', async (req, res) => {
  try {
    const { productId, paymentMode } = req.body;
    const userId = req.session.userId;

    console.log('Received:', req.body);
    console.log('👤 Session userId:', userId);

    if (!userId || !productId || !paymentMode) {
      return res.status(400).json({ message: 'Missing fields or not logged in' });
    }

    const newOrder = new Order({
      orderId: generateOrderId(),
      productId,
      paymentMode,
      customerId: new mongoose.Types.ObjectId(userId) // ✅ Corrected ObjectId usage
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      orderId: savedOrder.orderId,
      productId: savedOrder.productId,
      paymentMode: savedOrder.paymentMode
    });

  } catch (err) {
    console.error('❌ Order save failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
