const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');

// --- PUBLIC ROUTES ---
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

// --- USER & ADMIN ROUTES (Self-Management) ---
router.patch('/update-me/:id', protect, userCtrl.updateUser);

// --- ADMIN ONLY ROUTES (User Management) ---
// 1. Fetch all users
router.get('/all-users', protect, restrictTo('admin'), userCtrl.getUsers);

// 2. Admin Create User (Assign Roles)
router.post('/admin/add-user', protect, restrictTo('admin'), userCtrl.addUser);

// 3. Deactivate/Activate Accounts (Soft Delete Requirement)
// FIX: Adding these specific routes prevents the 404 errors in Angular
router.put('/enable/:id', protect, restrictTo('admin'), userCtrl.enableUser);
router.put('/disable/:id', protect, restrictTo('admin'), userCtrl.disableUser);

module.exports = router;