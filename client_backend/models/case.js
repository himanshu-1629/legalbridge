const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["ACTIVE", "WAITING", "COMPLETED"],
    default: "ACTIVE"
  },
  progress: {
    type: Number,
    default: 0
  },
  hearingDate: Date,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  }
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);
