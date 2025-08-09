const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    productTitle: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    amountWei: String,
    buyerAddress: String,
    sellerAddress: String,
    status: {
      type: String,
      enum: ['paid', 'fulfilled', 'refunded', 'cancelled'],
      default: 'paid'
    },
    transactionHash: String,
    onchainProductId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
