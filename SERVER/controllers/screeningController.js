const ScreeningRecord = require("../models/ScreenRecord");

const { checkRedFlag } = require("../services/redFlagCheck");

const { getRiskAssessment } = require("../services/AiServicegroq");

const { SYMPTOMS } = require("../utills/symptomsList");
const {
  generateScreeningPDF,
} = require("../services/pdfService");
/**
 * Calculates symptom overlap.
 *
 * Example:
 *
 * current:
 * ["fatigue", "frequent_thirst", "headache"]
 *
 * previous:
 * ["fatigue", "frequent_thirst"]
 *
 * overlap:
 * 2 / 3 = 0.66
 */
function calculateSymptomOverlap(
  currentSymptoms = [],
  previousSymptoms = []
) {
  if (
    !Array.isArray(currentSymptoms) ||
    !Array.isArray(previousSymptoms) ||
    currentSymptoms.length === 0 ||
    previousSymptoms.length === 0
  ) {
    return 0;
  }

  const previousSet = new Set(previousSymptoms);

  const commonSymptoms = currentSymptoms.filter((symptom) =>
    previousSet.has(symptom)
  );

  return commonSymptoms.length / currentSymptoms.length;
}


/**
 * POST /api/screening
 *
 * Main flow:
 *   1. Validate input
 *   2. Run red-flag check
 *   3. If urgent -> save + return immediately
 *   4. Else -> call AI
 *   5. Save result
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
        error:
          "deviceId, age, gender and at least one symptom are required.",
      });
    }

    // =========================================
    // STEP 1: RED FLAG CHECK
    // =========================================

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

    // =========================================
    // STEP 2: AI ASSESSMENT
    // =========================================

    const aiResult = await getRiskAssessment({
      age,
      gender,
      symptoms,
      bp: vitals.bp,
      sugar: vitals.sugar,
      language,
    });

    // =========================================
    // STEP 3: SAVE
    // =========================================

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

    // =========================================
    // STEP 4: RESPONSE
    // =========================================

    return res.status(200).json({
      ...aiResult,

      isUrgent: false,

      recordId: record._id,
    });
  } catch (err) {
    console.error("submitScreening error:", err);

    return res.status(500).json({
      error:
        "Something went wrong while processing the screening. Please try again.",
    });
  }
}


/**
 * GET /api/screening/history?deviceId=xxx
 *
 * Returns last 5 screenings.
 *
 * Also detects repeated symptom pattern.
 */
async function getHistory(req, res) {
  try {
    const { deviceId } = req.query;

    if (!deviceId) {
      return res.status(400).json({
        error: "deviceId query param is required.",
      });
    }

    // =========================================
    // GET LAST 5 SCREENINGS
    // =========================================

    const records = await ScreeningRecord.find({
      deviceId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // =========================================
    // REPEAT PATTERN CHECK
    // =========================================

    let repeatedPattern = false;

    let similarScreenings = 0;

    let matchedSymptoms = [];

    // Need minimum 3 screenings
    if (records.length >= 3) {
      const latestSymptoms =
        records[0].symptoms || [];

      // Compare latest screening with
      // previous 4 screenings
      for (let i = 1; i < records.length; i++) {
        const previousSymptoms =
          records[i].symptoms || [];

        const overlap =
          calculateSymptomOverlap(
            latestSymptoms,
            previousSymptoms
          );

        // 50% or more overlap
        if (overlap >= 0.5) {
          similarScreenings++;

          const commonSymptoms =
            latestSymptoms.filter((symptom) =>
              previousSymptoms.includes(symptom)
            );

          matchedSymptoms = [
            ...new Set([
              ...matchedSymptoms,
              ...commonSymptoms,
            ]),
          ];
        }
      }

      // Similar symptoms found in
      // at least 2 previous screenings
      if (similarScreenings >= 2) {
        repeatedPattern = true;
      }
    }

    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({
      records,

      repeatedPattern,

      similarScreenings,

      matchedSymptoms,

      nudgeMessage: repeatedPattern
        ? "You have reported similar symptoms multiple times. Please consider consulting a healthcare professional instead of repeatedly relying on self-screening."
        : null,
    });
  } catch (err) {
    console.error("getHistory error:", err);

    return res.status(500).json({
      error: "Could not fetch history.",
    });
  }
}

/**
 * GET /api/screening/:id/summary
 *
 * Generates downloadable PDF summary
 * for a saved screening record.
 */
async function getSummary(req, res) {
  try {
    const { id } = req.params;

    const record = await ScreeningRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        error: "Screening record not found.",
      });
    }

    generateScreeningPDF(record, res);
  } catch (err) {
    console.error("getSummary error:", err);

    return res.status(500).json({
      error: "Could not generate screening summary.",
    });
  }
}

/**
 * GET /api/symptoms-list
 *
 * Returns static bilingual symptom list.
 */
function getSymptomsList(req, res) {
  return res.status(200).json(SYMPTOMS);
}


module.exports = {
  submitScreening,
  getHistory,
  getSymptomsList,
  getSummary,
};