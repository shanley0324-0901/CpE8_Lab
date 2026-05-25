const db = require("../config/db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. AUTHENTICATION MODULE ---

// REGISTER
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO accounts (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sql, [name, email, hashedPassword, role || 'user', 'active'], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Email already exists!" });
                }
                return res.status(500).json({ message: "Database error" });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }
};

// LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM accounts WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                "fullstack_secret_key", 
                { expiresIn: '1h' }
            );

            res.json({ 
                token, 
                role: user.role,
                message: `Welcome back, ${user.name}` 
            });
        } catch (error) {
            res.status(500).json({ message: "Error comparing passwords" });
        }
    });
};

// LOGOUT
exports.logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};


// --- 2. USER MANAGEMENT MODULE (Admin Only) ---

// FETCH ALL USERS
exports.getUsers = (req, res) => {
    const sql = "SELECT id, name, email, role, status FROM accounts";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching users" });
        res.json(results);
    });
};

// ADD USER (The fix for your "Failed" toast)
exports.addUser = (req, res) => {
    const { name } = req.body;
    const sql = "INSERT INTO accounts (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
    
    // Default values for admin-added users
    const dummyEmail = `${name.toLowerCase().replace(/\s/g, '')}@example.com`;
    const dummyPass = '$2a$10$vY3ZVN5f0oUxEJKk0aiQOMQoUHuuviovFzQxup2..'; // 'password123'

    db.query(sql, [name, dummyEmail, dummyPass, 'user', 'active'], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        // This JSON response tells Angular the request was successful
        res.status(201).json({ message: "User created", id: result.insertId });
    });
};

// UPDATE USER NAME
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = "UPDATE accounts SET name = ? WHERE id = ?";
    
    db.query(sql, [name, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "User updated successfully" });
    });
};

// DISABLE USER
exports.disableUser = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE accounts SET status = 'disabled' WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error disabling user" });
        res.json({ message: "User disabled" });
    });
};

// ENABLE USER
exports.enableUser = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE accounts SET status = 'active' WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error enabling user" });
        res.json({ message: "User enabled" });
    });
};