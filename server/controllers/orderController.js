const Order = require('../models/Order');

async function createOrder(req, res) {
  try {
    const order = await Order.create(req.body);
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


