const mongoose = require("mongoose");

const ScreeningSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    screenedFor: { type: String, enum: ["self", "other"], default: "self" },
    name: { type: String, default: "" },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    symptoms: [{ type: String }],
    vitals: {
      bp: { type: String, default: "" },
      sugar: { type: Number, default: null },
    },
    aiResult: {
      riskLevel: { type: String, enum: ["Low", "Medium", "High", "Urgent"] },
      factors: [{ type: String }],
      advice: { type: String },
      disclaimer: { type: String },
    },
    isUrgent: { type: Boolean, default: false },
    language: { type: String, enum: ["hi", "en"], default: "en" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScreeningRecord", ScreeningSchema);
