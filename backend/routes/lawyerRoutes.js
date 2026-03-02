const express = require("express");
const bcrypt = require("bcryptjs");
const Lawyer = require("../models/Lawyer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ================= MULTER STORAGE (RENDER SAFE) =================

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, password } = req.body;

    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
router.post(
  "/verify",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "enrollmentCert", maxCount: 1 },
    { name: "practiceCert", maxCount: 1 }
  ]),
  async (req, res) => {
    try {

      const {
        email,
        barId,
        experience,
        specialization,
        courts,
        qualifications,
        bio,
        consultationFee,
        languages
      } = req.body;

      const lawyer = await Lawyer.findOne({ email });

      if (!lawyer) {
        return res.status(404).json({ message: "Lawyer not found" });
      }

      if (!req.files || !req.files.idProof || !req.files.enrollmentCert || !req.files.practiceCert) {
        return res.status(400).json({ message: "All 3 documents are required" });
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

      lawyer.documents = {
        idProof: req.files.idProof[0].filename,
        enrollmentCert: req.files.enrollmentCert[0].filename,
        practiceCert: req.files.practiceCert[0].filename
      };

      lawyer.verificationStatus = "submitted";

      await lawyer.save();

      res.json({ message: "Verification submitted successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);


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


// ================= ADMIN REJECT =================
router.put("/reject/:id", async (req, res) => {
  try {

    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    lawyer.verificationStatus = "rejected";

    await lawyer.save();

    res.json({ message: "Lawyer rejected successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET LAWYER BY ID =================
router.get("/me/:id", async (req, res) => {
  try {

    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    res.json({
      id: lawyer._id,
      firstName: lawyer.firstName,
      lastName: lawyer.lastName,
      email: lawyer.email,
      verificationStatus: lawyer.verificationStatus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= ADMIN - GET ALL LAWYERS =================
router.get("/all", async (req, res) => {
  try {

    const lawyers = await Lawyer.find().select("-password");

    res.json(lawyers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
