const express = require("express");
const bcrypt = require("bcryptjs");
const Client = require("../models/Client"); // Import client schema

const router = express.Router();

/* ==============================
   📝 REGISTER CLIENT
   ============================== */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // STEP 2: Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new client
    const newClient = new Client({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword
    });

    await newClient.save();

    res.status(201).json({ message: "Client registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==============================
   🔐 LOGIN CLIENT
   ============================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      client
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
