const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const { protect } = require("../middlewares/auth"); // Keep this if you have the middleware ready

// --- ADMIN & USER MANAGEMENT ROUTES ---

// 1. Get all users (Matches: GET /api/users)
router.get("/", userController.getUsers);

// 2. Add User (Matches: POST /api/users) 
// Note: Changed from "/add-user" to "/" to match standard REST and your Angular Service
router.post("/", userController.addUser);

// 3. Update User Name (Matches: PUT /api/users/:id)
router.put("/:id", userController.updateUser);

// 4. Disable User (Matches: PUT /api/users/disable/:id)
// Changed to PUT to match your Controller and Angular Service
router.put("/disable/:id", userController.disableUser);

// 5. Enable User (Matches: PUT /api/users/enable/:id)
router.put("/enable/:id", userController.enableUser);


// --- AUTH ROUTES ---
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;