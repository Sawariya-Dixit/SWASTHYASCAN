const { RED_FLAG_KEYS, SYMPTOMS } = require("../utills/symptomsList");

/**
 * Checks user-selected symptoms against emergency red-flag symptoms.
 * Driven directly by the single source of truth in symptomsList.js.
 * This is intentionally NOT decided by the AI model — safety-critical
 * decisions should not depend on unpredictable AI output.
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
  const redFlagSymptoms = SYMPTOMS.filter((s) => s.isRedFlag);

  for (const symptom of symptoms) {
    const sLower = String(symptom).toLowerCase().trim();

    // 1. Direct standard key check
    if (RED_FLAG_KEYS.includes(sLower)) {
      matchedSet.add(sLower);
      const found = redFlagSymptoms.find((item) => item.key === sLower);
      matchedLabels.push(found ? found.en : sLower);
      continue;
    }

    // 2. Phrase matching for custom/voice-entered text against all red-flag symptoms
    for (const rf of redFlagSymptoms) {
      const keywords = Array.isArray(rf.keywords) ? rf.keywords : [];
      const isMatched =
        keywords.some((kw) => sLower.includes(kw.toLowerCase())) ||
        (rf.en && sLower.includes(rf.en.toLowerCase())) ||
        (rf.hi && sLower.includes(rf.hi.toLowerCase()));

      if (isMatched && !matchedSet.has(rf.key)) {
        matchedSet.add(rf.key);
        matchedLabels.push(rf.en || rf.key);
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
