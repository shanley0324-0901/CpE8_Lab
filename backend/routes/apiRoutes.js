const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');

// Public Routes
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

// Protected Routes (Anyone with a token can access)
router.get('/profile', protect, (req, res) => {
    res.json({ message: "This is your private profile", user: req.user });
});

// Admin Only Route (Lab Requirement)
router.get('/admin-dashboard', protect, restrictTo('admin'), (req, res) => {
    res.json({ message: "Welcome to the Secret Admin Panel!" });
});

module.exports = router;