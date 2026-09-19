// routes/facilities.js  (or wherever your route handlers live)
// This replaces the "static JSON array in code" approach — now reads from MongoDB.

const express = require("express");
const router = express.Router();
const Facility = require("../models/Facility"); // path where Facility.js actually lives

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 -   lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/facilities/nearby?lat=..&lng=..
router.get("/nearby", async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: "lat and lng query params are required" });
    }

    // For a country-wide static set, fetching all and sorting in JS is fine
    // (dataset is small — a few hundred rows at most for a hackathon demo).
    const facilities = await Facility.find({}).lean();

    const withDistance = facilities
      .map((f) => ({
        name: f.name,
        type: f.type,
        state: f.state,
        district: f.district,
        distanceKm: haversineKm(userLat, userLng, f.lat, f.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 2); // nearest 2

    res.json(withDistance);
  } catch (err) {
    console.error("Error fetching nearby facilities:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;