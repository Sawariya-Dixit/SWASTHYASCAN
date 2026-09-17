const express = require("express");
const router = express.Router();

const {
  submitScreening,
  getHistory,
  getSymptomsList,
} = require("../controllers/screeningController");

router.post("/screening", submitScreening);
router.get("/screening/history", getHistory);
router.get("/symptoms-list", getSymptomsList);

module.exports = router;
