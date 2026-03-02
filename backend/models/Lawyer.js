const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  phone: String,
  address: String,
  password: String,

verificationStatus: {
  type: String,
  enum: ["not_verified", "verified"],
  default: "not_verified"
},  // ✅ IMPORTANT COMMA HERE

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
  documents: {
  idProof: String,
  enrollmentCert: String,
  practiceCert: String
},

}, { timestamps: true });

module.exports = mongoose.model("Lawyer", lawyerSchema);
