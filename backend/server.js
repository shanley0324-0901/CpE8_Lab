const express = require("express");
const cors = require("cors");
const PORT = 5000;

const db = require("./config/db"); 
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// --- MIDDLEWARES (MUST COME FIRST) ---
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request received at ${req.url}`);
  next();
});
app.use(express.urlencoded({ extended: false }));

// --- ROUTES ---
app.use("/api/auth", authRoutes); // Handles Login/Register
app.use("/api/users", userRoutes); // Handles User management
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});