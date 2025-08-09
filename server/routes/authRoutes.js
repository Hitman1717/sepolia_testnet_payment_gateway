const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/nonce', authController.getNonce);
router.post('/verify', authController.verifySignature);

module.exports = router;


