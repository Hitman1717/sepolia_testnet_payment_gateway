const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priceWei: { type: String, required: true },
    isDigital: { type: Boolean, default: false },
    sellerAddress: { type: String, required: true },
    metadataURI: { type: String, default: '' },
    // Optional: link to on-chain productId when created via contract
    onchainProductId: { type: String },
    // For digital products, an optional download or IPFS CID managed off-chain
    digitalDownloadURI: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);


