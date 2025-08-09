const Order = require('../models/Order');
const Product = require('../models/Product');

async function createOrder(req, res) {
  try {
    const order = await Order.create(req.body);
    // Update product ownership/off-chain availability if product exists
    if (order.productId) {
      const updates = {
        $set: { currentOwner: order.buyerAddress, active: false },
        $addToSet: { owners: order.buyerAddress },
      };
      await Product.findByIdAndUpdate(order.productId, updates, { new: true });
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save order', details: err?.message });
  }
}

async function listOrders(_req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

module.exports = { createOrder, listOrders };


