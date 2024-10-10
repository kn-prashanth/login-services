const express = require('express');
const {
    registerUser,
    loginUser,
    enable2FA,
    verify2FA,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/verify', protect, verify2FA);

module.exports = router;
