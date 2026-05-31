const db = require("../config/db");
const { JWT_SECRET } = require("../config/db.config");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. AUTHENTICATION MODULE ---

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO accounts (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sql, [name, email, hashedPassword, role || 'user', 'active'], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Email already exists!" });
                return res.status(500).json({ message: "Database error" });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = (req, res) => {
    const { email, password, role } = req.body;

    console.log("LOGIN ATTEMPT");
    console.log("Email:", email);
    console.log("Selected Role:", role);

    const sql = "SELECT * FROM accounts WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        console.log("Results found:", results.length);

        if (results.length === 0)
            return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];

        console.log("DB Role:", user.role);
        console.log("DB Status:", user.status);

        if (user.status === 'disabled') {
            return res.status(403).json({ message: "Account deactivated. Contact Admin." });
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            console.log("Password Match:", isMatch);

            if (!isMatch)
                return res.status(401).json({ message: "Invalid credentials" });

            if (role && user.role !== role) {
                console.log("ROLE MISMATCH");
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                JWT_SECRET, 
                { expiresIn: '1h' }
            );

            res.json({ token,
                role: user.role,
                id: user.id,
                name: user.name,
                email: user.email,
                message: `Welcome back, ${user.name}`
            });
        } catch (error) {
            res.status(500).json({ message: "Error during login" });
        }
    });
};

exports.logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};

// --- 2. USER MANAGEMENT MODULE ---

exports.getUsers = (req, res) => {
    const sql = "SELECT id, name, email, role, status FROM accounts";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching users" });
        res.json(results);
    });
};

exports.addUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    console.log("ADD USER REQUEST:", req.body);

    try {
        const hashedPassword = await bcrypt.hash(password || 'password123', 10);

        const sql = `
            INSERT INTO accounts
            (name, email, password, role, status)
            VALUES (?, ?, ?, ?, 'active')
        `;

        db.query(sql, [name, email, hashedPassword, role || 'user'], (err, result) => {

            if (err) {
                console.error("MYSQL ERROR:", err);
                return res.status(500).json({ message: "Database error" });
            }

            res.status(201).json({
                message: "User created by admin",
                id: result.insertId
            });
        });

    } catch (e) {
        console.error("SERVER ERROR:", e);
        res.status(500).json({ message: "Error" });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const requester = req.user; 

    if (requester.role !== 'admin' && requester.id != id) {
        return res.status(403).json({ message: "You can only manage your own profile." });
    }

    try {
        let updates = [];
        let params = [];

        if (name) { updates.push("name = ?"); params.push(name); }
        if (email) { updates.push("email = ?"); params.push(email); }
        if (role && requester.role === 'admin') { updates.push("role = ?"); params.push(role); }
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            updates.push("password = ?"); params.push(hashed);
        }

        if (updates.length === 0) return res.status(400).json({ message: "No fields to update" });

        params.push(id);
        const sql = `UPDATE accounts SET ${updates.join(", ")} WHERE id = ?`;

        db.query(sql, params, (err, result) => {
            if (err) return res.status(500).json({ message: "Update failed" });
            res.json({ message: "User updated successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during update" });
    }
};

// NEW: Specific function for Angular's /enable/:id PUT request
exports.enableUser = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE accounts SET status = 'active' WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error enabling user" });
        res.json({ message: "User enabled successfully" });
    });
};

// NEW: Specific function for Angular's /disable/:id PUT request
exports.disableUser = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE accounts SET status = 'disabled' WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error disabling user" });
        res.json({ message: "User disabled successfully" });
    });
};

// Keep this for general status toggles if needed
exports.toggleStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    const sql = "UPDATE accounts SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error toggling status" });
        res.json({ message: `Account status updated to ${status}` });
    });
};