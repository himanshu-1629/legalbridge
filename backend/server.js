require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static(__dirname));

// ✅ Load index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Routes
const lawyerRoutes = require("./routes/lawyerRoutes");
app.use("/api/lawyer", lawyerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
