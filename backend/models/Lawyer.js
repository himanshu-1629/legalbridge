const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ["not_verified", "verified", "rejected"], 
    default: "not_verified" 
  },
  // This must match your lawyerRoutes.js structure
  professionalDetails: {
    barId: String,
    experience: Number,
    specialization: String,
    courts: String,
    qualifications: String,
    bio: String,
    consultationFee: Number,
    languages: String
  },
  // This must match the file keys in lawyerRoutes.js
  documents: {
    idProof: String,
    enrollmentCert: String,
    practiceCert: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Lawyer", lawyerSchema);
