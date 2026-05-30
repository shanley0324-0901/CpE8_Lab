const jwt = require("jsonwebtoken");

// This verifies if the user is logged in
exports.protect = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  // IMPORTANT: This must match the key used in your login controller
  const secretKey = "fullstack_secret_key"; 

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    
    // Decoded contains { id: user.id, role: user.role }
    req.user = decoded; 
    next();
  });
};

// Lab Requirement: Role-based access (e.g., restrictTo('admin'))
exports.restrictTo = (role) => {
  return (req, res, next) => {
    // Safety check: ensure req.user was set by 'protect'
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access forbidden: Admins only" });
    }
    next();
  };
};