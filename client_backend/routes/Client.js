const express = require("express");
const router = express.Router();
const Client = require("../models/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 AUTH MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const existingUser = await Client.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Client already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = new Client({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword
    });

    await newClient.save();

    const token = jwt.sign(
  { id: newClient._id },
  "secretkey",
  { expiresIn: "1d" }
);

res.status(201).json({
  token,
  user: {
    name: firstName + " " + lastName,
    email,
    phone
  }
});

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Client not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
  token,
  user: {
    name: user.firstName + " " + user.lastName,
    email: user.email,
    phone: user.phone
  }
});

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DASHBOARD =================
router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await Client.findById(req.userId).select("-password");

    res.json({
      name: user.firstName,
      email: user.email,
      phone: user.phone
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
