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

  // 🔹 Verification Fields
verificationStatus: {
  type: String,
  enum: ["not_submitted", "submitted", "approved", "rejected"],
  default: "not_submitted"
}

  professionalDetails: {
    barId: String,
    experience: Number,
    specialization: String,
    courts: String,
    qualifications: String,
    bio: String,
    consultationFee: Number,
    languages: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Lawyer", lawyerSchema);

module.exports = mongoose.model("Lawyer", lawyerSchema);
