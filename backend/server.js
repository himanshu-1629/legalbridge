require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from backend folder
app.use(express.static(path.join(__dirname)));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API routes
const lawyerRoutes = require("./routes/lawyerRoutes");
app.use("/api/lawyer", lawyerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
