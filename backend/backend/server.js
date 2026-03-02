require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const lawyerRoutes = require("./routes/lawyerRoutes");
app.use("/api/lawyer", lawyerRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});