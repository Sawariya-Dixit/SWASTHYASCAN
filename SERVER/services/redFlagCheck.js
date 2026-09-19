const { RED_FLAG_KEYS, SYMPTOMS } = require("../utills/symptomsList");

const RED_FLAG_PHRASES = [
  {
    key: "chest_pain",
    label: "Chest pain",
    keywords: [
      "chest pain", "pain in chest", "chest pressure", "heart pain",
      "chhati me dard", "seene me dard", "seena dard",
      "सीने में दर्द", "छाती में दर्द", "दिल में दर्द"
    ]
  },
  {
    key: "severe_breathlessness",
    label: "Severe breathlessness",
    keywords: [
      "breathlessness", "severe breathlessness", "shortness of breath", "trouble breathing",
      "saans phoolna", "saans lene me takleef", "saans lene me dikkat", "dam ghutna",
      "सांस फूलना", "सांस लेने में तकलीफ", "दम घुटना"
    ]
  }
];

/**
 * Checks user-selected symptoms against a hardcoded list of emergency
 * red-flag symptoms. This is intentionally NOT decided by the AI model —
 * safety-critical decisions should not depend on unpredictable AI output.
 *
 * @param {string[]} symptoms - array of symptom keys or free-text symptoms entered by the user
 * @returns {{ isUrgent: boolean, matchedSymptoms: string[], message?: string }}
 */
function checkRedFlag(symptoms = []) {
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return { isUrgent: false, matchedSymptoms: [] };
  }

  const matchedSet = new Set();
  const matchedLabels = [];

  for (const symptom of symptoms) {
    const sLower = String(symptom).toLowerCase().trim();

    // 1. Direct standard key check
    if (RED_FLAG_KEYS.includes(sLower)) {
      matchedSet.add(sLower);
      const found = SYMPTOMS.find((item) => item.key === sLower);
      matchedLabels.push(found ? found.en : sLower);
      continue;
    }

    // 2. Phrase matching for custom/voice-entered text
    for (const rf of RED_FLAG_PHRASES) {
      const isMatched = rf.keywords.some((kw) => sLower.includes(kw.toLowerCase()));
      if (isMatched && !matchedSet.has(rf.key)) {
        matchedSet.add(rf.key);
        matchedLabels.push(rf.label);
      }
    }
  }

  const matched = Array.from(matchedSet);

  if (matched.length > 0) {
    return {
      isUrgent: true,
      matchedSymptoms: matched,
      message:
        "This may be a medical emergency (" +
        matchedLabels.join(", ") +
        "). Please seek immediate medical attention or call emergency services.",
    };
  }

  return { isUrgent: false, matchedSymptoms: [] };
}

module.exports = { checkRedFlag };
