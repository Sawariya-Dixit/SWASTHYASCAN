const express = require("express");

const router = express.Router();

const {
  submitScreening,
  getHistory,
  getSymptomsList,
  getSummary
} = require("../controllers/screeningController");

// POST /api/screening
router.post("/", submitScreening);

// GET /api/screening/history
router.get("/history", getHistory);

// GET /api/screening/symptoms-list
router.get("/symptoms-list", getSymptomsList);
// GET /api/screening/:id/summary
router.get("/:id/summary", getSummary);

module.exports = router;