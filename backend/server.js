require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // ✅ ADD THIS

// Static uploads folder (only once!)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // ✅ FIX PATH

// Serve frontend from project root
app.use(express.static(path.join(__dirname, "../")));

// Routes
const lawyerRoutes = require("./routes/lawyerRoutes");
app.use("/api/lawyer", lawyerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
