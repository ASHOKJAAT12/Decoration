const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    login,
    refreshTokenHandler,
    getMe,
    forgotPassword,
    resetPassword,
    logout,
} = require('../controllers/authController');

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshTokenHandler);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
