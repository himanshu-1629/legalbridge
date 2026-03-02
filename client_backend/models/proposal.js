const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case"
  },
  lawyerName: String,
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Proposal", proposalSchema);
