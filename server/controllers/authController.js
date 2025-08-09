const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

async function getNonce(req, res) {
  try {
    const address = String(req.query.address || '').toLowerCase();
    if (!address) return res.status(400).json({ error: 'address required' });
    const nonce = generateNonce();
    const user = await User.findOneAndUpdate(
      { address },
      { $set: { nonce } },
      { upsert: true, new: true }
    );
    res.json({ nonce: user.nonce });
  } catch (e) {
    res.status(500).json({ error: 'failed to get nonce' });
  }
}

async function verifySignature(req, res) {
  try {
    const { address, signature } = req.body || {};
    if (!address || !signature) return res.status(400).json({ error: 'address and signature required' });
    const user = await User.findOne({ address: String(address).toLowerCase() });
    if (!user) return res.status(400).json({ error: 'no nonce, request nonce first' });

    const message = `Sign this nonce to authenticate: ${user.nonce}`;
    const web3 = new Web3();
    const recovered = web3.eth.accounts.recover(message, signature);
    if (!recovered || recovered.toLowerCase() !== String(address).toLowerCase()) {
      return res.status(401).json({ error: 'invalid signature' });
    }
    // rotate nonce
    user.nonce = generateNonce();
    await user.save();
    const token = jwt.sign({ sub: user.address }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, address: user.address });
  } catch (e) {
    res.status(500).json({ error: 'verification failed' });
  }
}

module.exports = { getNonce, verifySignature };


