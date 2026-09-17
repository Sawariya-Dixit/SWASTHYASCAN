const mongoose = require("mongoose");

const ScreeningSchema = new mongoose.Schema(
  {
    // Anonymous identifier stored in the browser's localStorage.
    // No login required — this is enough to group a user's own history.
    deviceId: { type: String, required: true, index: true },

    screenedFor: { type: String, enum: ["self", "other"], default: "self" },
    name: { type: String, default: "" }, // only used when screenedFor = "other"

    age: { type: Number, required: true },
    gender: { type: String, required: true },

    symptoms: [{ type: String }], // e.g. ["frequent_thirst", "fatigue"]

    vitals: {
      bp: { type: String, default: "" }, // e.g. "140/90"
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
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("ScreeningRecord", ScreeningSchema);
