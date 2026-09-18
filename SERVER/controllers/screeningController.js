const ScreeningRecord = require("../models/ScreenRecord");
const { checkRedFlag } = require("../services/redFlagCheck");
const { getRiskAssessment } = require("../services/AiServicegroq");
const { SYMPTOMS } = require("../utills/symptomsList");

/**
 * POST /api/screening
 * Main flow:
 *   1. Validate input
 *   2. Run red-flag check (hardcoded, no AI)
 *   3. If urgent -> save + return immediately, skip Bedrock
 *   4. Else -> call Bedrock, save result, return it
 */
async function submitScreening(req, res) {
  try {
    const {
      deviceId,
      screenedFor = "self",
      name = "",
      age,
      gender,
      symptoms = [],
      vitals = {},
      language = "en",
    } = req.body;

    if (!deviceId || !age || !gender || symptoms.length === 0) {
      return res.status(400).json({
        error: "deviceId, age, gender and at least one symptom are required.",
      });
    }

    // Step 1: Red-flag safety check — runs BEFORE any AI call
    const redFlagResult = checkRedFlag(symptoms);

    if (redFlagResult.isUrgent) {
      const record = await ScreeningRecord.create({
        deviceId,
        screenedFor,
        name,
        age,
        gender,
        symptoms,
        vitals,
        aiResult: {
          riskLevel: "Urgent",
          factors: redFlagResult.matchedSymptoms,
          advice: redFlagResult.message,
          disclaimer:
            "This is an automatic safety alert, not an AI-generated assessment.",
        },
        isUrgent: true,
        language,
      });

      return res.status(200).json({
        riskLevel: "Urgent",
        factors: redFlagResult.matchedSymptoms,
        advice: redFlagResult.message,
        disclaimer:
          "This is an automatic safety alert, not an AI-generated assessment.",
        isUrgent: true,
        recordId: record._id,
      });
    }

    // Step 2: No red flag -> call Bedrock for AI risk assessment
    const aiResult = await getRiskAssessment({
      age,
      gender,
      symptoms,
      bp: vitals.bp,
      sugar: vitals.sugar,
      language,
    });

    // Step 3: Save to MongoDB
    const record = await ScreeningRecord.create({
      deviceId,
      screenedFor,
      name,
      age,
      gender,
      symptoms,
      vitals,
      aiResult,
      isUrgent: false,
      language,
    });

    return res.status(200).json({
      ...aiResult,
      isUrgent: false,
      recordId: record._id,
    });
  } catch (err) {
    console.error("submitScreening error:", err);
    return res.status(500).json({
      error: "Something went wrong while processing the screening. Please try again.",
    });
  }
}

/**
 * GET /api/screening/history?deviceId=xxx
 * Returns past screenings for this anonymous device, newest first.
 */
async function getHistory(req, res) {
  try {
    const { deviceId } = req.query;

    if (!deviceId) {
      return res.status(400).json({ error: "deviceId query param is required." });
    }

    const records = await ScreeningRecord.find({ deviceId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(records);
  } catch (err) {
    console.error("getHistory error:", err);
    return res.status(500).json({ error: "Could not fetch history." });
  }
}

/**
 * GET /api/symptoms-list
 * Returns the static, bilingual symptom list for the frontend form.
 */
function getSymptomsList(req, res) {
  return res.status(200).json(SYMPTOMS);
}

module.exports = { submitScreening, getHistory, getSymptomsList };
