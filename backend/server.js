const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

/* ==============================
   🔥 MONGODB CONNECTION
   ============================== */

mongoose.connect(
  "mongodb+srv://apgotaku_db_user:Nacos1629@legalbridge.6rqgnri.mongodb.net/legalbridge?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("MongoDB Connection Error:", err));


/* ==============================
   📦 LAWYER SCHEMA
   ============================== */

const lawyerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  barCouncilId: String,
  specialization: String,
  experience: Number,
  achievements: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lawyer = mongoose.model("Lawyer", lawyerSchema);


/* ==============================
   📝 REGISTER LAWYER
   ============================== */

app.post("/lawyer/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      barCouncilId,
      specialization,
      experience,
      achievements
    } = req.body;

    const existingLawyer = await Lawyer.findOne({ email });

    if (existingLawyer) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLawyer = new Lawyer({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      barCouncilId,
      specialization,
      experience,
      achievements
    });

    await newLawyer.save();

    res.status(201).json({
      message: "Registration successful. Waiting for admin verification."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/* ==============================
   🔐 LOGIN LAWYER
   ============================== */

app.post("/lawyer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const lawyer = await Lawyer.findOne({ email });

    if (!lawyer) {
      return res.status(404).json({
        message: "Lawyer not found"
      });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    if (!lawyer.isVerified) {
      return res.status(403).json({
        message: "Account under verification"
      });
    }

    res.json({
      message: "Login successful",
      lawyer
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/* ==============================
   🛠 ADMIN VERIFY LAWYER
   ============================== */

app.put("/admin/verify/:id", async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    res.json({
      message: "Lawyer verified successfully",
      lawyer
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/* ==============================
   🚀 START SERVER
   ============================== */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
