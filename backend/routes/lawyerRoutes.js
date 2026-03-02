const express = require("express");
const bcrypt = require("bcryptjs");
const Lawyer = require("../models/Lawyer");

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, password } = req.body;

    // Check if email already exists
    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new lawyer
    const lawyer = new Lawyer({
      firstName,
      lastName,
      email,
      phone,
      address,
      password: hashedPassword
    });

    await lawyer.save();

    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
  message: "Login successful",
  lawyer: {
    id: lawyer._id,
    firstName: lawyer.firstName,
    lastName: lawyer.lastName,
    email: lawyer.email,
    verificationStatus: lawyer.verificationStatus
  }
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ================= SUBMIT VERIFICATION =================
router.post("/verify", async (req, res) => {
  try {
    const { email, barId, experience, specialization, courts, qualifications, bio, consultationFee, languages } = req.body;

    const lawyer = await Lawyer.findOne({ email });

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    lawyer.professionalDetails = {
      barId,
      experience,
      specialization,
      courts,
      qualifications,
      bio,
      consultationFee,
      languages
    };

    lawyer.verificationStatus = "submitted";

    await lawyer.save();

    res.json({ message: "Verification submitted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ================= ADMIN APPROVE =================
router.put("/approve/:id", async (req, res) => {
  try {

    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    lawyer.verificationStatus = "approved";

    await lawyer.save();

    res.json({ message: "Lawyer approved successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
