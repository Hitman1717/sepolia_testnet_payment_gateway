const Product = require('../models/Product');

async function createProduct(req, res) {
  try {
    const { title, priceWei, sellerAddress } = req.body || {};
    if (!title || !priceWei || !sellerAddress) {
      return res.status(400).json({ error: 'title, priceWei, and sellerAddress are required' });
    }
    const product = await Product.create({
      ...req.body,
      currentOwner: sellerAddress,
      owners: [sellerAddress]
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product', details: err?.message });
  }
}

async function listProducts(_req, res) {
  try {
    // Include legacy docs that don't have `active` set
    const products = await Product.find({ $or: [{ active: true }, { active: { $exists: false } }] }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
}

async function listOwned(req, res) {
  try {
    const owner = String(req.query.owner || '').toLowerCase();
    if (!owner) return res.status(400).json({ error: 'owner required' });
    const products = await Product.find({ currentOwner: { $regex: new RegExp(`^${owner}$`, 'i') } }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch owned products' });
  }
}

async function listHistory(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ owners: product.owners || [] });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
}

module.exports = { createProduct, listProducts, getProduct, updateProduct, listOwned, listHistory };


