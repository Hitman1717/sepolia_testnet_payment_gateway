const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectMongo } = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.options(/.*/, cors());
app.use(express.json());

connectMongo();

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
