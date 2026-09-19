// models/Facility.js
const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["PHC", "District Hospital", "CHC", "Govt Hospital"], default: "District Hospital" },
  state: { type: String, required: true },
  district: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

// 2dsphere index isn't used here since we do haversine in app code,
// but a plain index on state/district speeds up filtering if needed later.
FacilitySchema.index({ state: 1, district: 1 });

module.exports = mongoose.model("Facility", FacilitySchema);