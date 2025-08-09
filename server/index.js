const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Order = require('./models/Order');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/eth-gateway', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

app.post('/api/orders', async (req, res) => {
  try {
    const { product, amount, userAddress } = req.body;
    const order = new Order({ product, amount, userAddress });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
