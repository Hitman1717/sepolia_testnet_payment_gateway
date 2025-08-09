const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: String,
  amount: Number,
  userAddress: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
