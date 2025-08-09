const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);
router.patch('/:id', productController.updateProduct);

// Simple seed endpoint for quick testing (remove in production)
router.post('/__seed', async (req, res) => {
  try {
    const base = [
      { title: 'Procreate Brush Pack – Neon Glows', description: '24 neon brushes', priceWei: '10000000000000000', isDigital: true, sellerAddress: '0x0000000000000000000000000000000000000001', metadataURI: 'ipfs://neon-brushes' },
      { title: '3D-Printed Phone Stand', description: 'Minimalist PLA stand', priceWei: '15000000000000000', isDigital: false, sellerAddress: '0x0000000000000000000000000000000000000001', metadataURI: 'https://images.example.com/stand.jpg' },
      { title: 'Lo‑fi Beat Pack Vol. 1', description: '30 royalty-free loops', priceWei: '20000000000000000', isDigital: true, sellerAddress: '0x0000000000000000000000000000000000000001', metadataURI: 'ipfs://lofi-pack' },
      { title: 'Leather Wallet', description: 'Handmade bifold, espresso', priceWei: '50000000000000000', isDigital: false, sellerAddress: '0x0000000000000000000000000000000000000001', metadataURI: 'https://images.example.com/wallet.jpg' },
      { title: 'E‑book: Mastering Solidity', description: '180-page PDF', priceWei: '30000000000000000', isDigital: true, sellerAddress: '0x0000000000000000000000000000000000000001', metadataURI: 'ipfs://solidity-ebook' }
    ];
    const created = await require('../models/Product').insertMany(base);
    res.json({ created: created.length });
  } catch (e) {
    res.status(500).json({ error: 'seed failed', details: e?.message });
  }
});

module.exports = router;


