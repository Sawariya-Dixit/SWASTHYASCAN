const { RED_FLAG_KEYS, SYMPTOMS } = require("../utills/symptomsList");

/**
 * Checks user-selected symptoms against a hardcoded list of emergency
 * red-flag symptoms. This is intentionally NOT decided by the AI model —
 * safety-critical decisions should not depend on unpredictable AI output.
 *
 * @param {string[]} symptoms - array of symptom keys selected by the user
 * @returns {{ isUrgent: boolean, matchedSymptoms: string[], message?: string }}
 */
function checkRedFlag(symptoms = []) {
  const matched = symptoms.filter((s) => RED_FLAG_KEYS.includes(s));

  if (matched.length > 0) {
    const matchedLabels = matched.map((key) => {
      const found = SYMPTOMS.find((s) => s.key === key);
      return found ? found.en : key;
    });

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
