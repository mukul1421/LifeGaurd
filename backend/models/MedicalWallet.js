const mongoose = require("mongoose");

const medicalWalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  documentName: String,
  documentType: String,
  fileUrl: String,
  notes: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MedicalWallet", medicalWalletSchema);
