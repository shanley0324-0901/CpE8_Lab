const express = require('express');
const router = express.Router();

// Import the controller where your logic lives
// Note: Based on your screenshot, your logic is in userController.js
const authController = require('../controllers/userController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Hashes password via bcrypt)
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token (JWT)
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public (Client-side handles token deletion)
 */
router.post('/logout', authController.logout);

module.exports = router;