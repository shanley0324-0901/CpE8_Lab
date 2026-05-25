const jwt = require("jsonwebtoken");
const env = require("../config/db.config");

// This verifies if the user is logged in
exports.protect = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    
    // This saves the user's ID and ROLE into the request for the next function
    req.user = decoded; 
    next();
  });
};

// Lab Requirement: Role-based access (e.g., restrictTo('admin'))
exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access forbidden: Admins only" });
    }
    next();
  };
};