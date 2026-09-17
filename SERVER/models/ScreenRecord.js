const mongoose = require("mongoose");

const ScreeningSchema = new mongoose.Schema({
  deviceId: String,
  screenedFor: String,
  name: String,
  age: Number,
  gender: String,
  symptoms: [String],
  vitals: {
    bp: String,
    sugar: Number,
  },
  aiResult: {
    riskLevel: String,
    factors: [String],
    advice: String,
    disclaimer: String,
  },
  isUrgent: Boolean,
  language: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ScreeningRecord", ScreeningSchema);
