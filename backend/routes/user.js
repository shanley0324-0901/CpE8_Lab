const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middlewares/auth");

// --- USER MANAGEMENT (Admin Only) ---
router.get("/", protect, restrictTo('admin'), userController.getUsers);
router.post("/", protect, restrictTo('admin'), userController.addUser);

// Specific PUT routes to fix the Angular 404 errors
router.put("/enable/:id", protect, restrictTo('admin'), userController.enableUser);
router.put("/disable/:id", protect, restrictTo('admin'), userController.disableUser);

// --- PROFILE MANAGEMENT (Self or Admin) ---
router.patch("/:id", protect, userController.updateUser);

// --- AUTH ROUTES ---
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;