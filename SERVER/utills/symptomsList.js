// Predefined symptom list used by the frontend form.
// isRedFlag=true symptoms trigger the urgent-care safety layer
// BEFORE any AI call is made.

const SYMPTOMS = [
  { key: "frequent_thirst", en: "Frequent thirst", hi: "बार-बार प्यास लगना", isRedFlag: false },
  { key: "frequent_urination", en: "Frequent urination", hi: "बार-बार पेशाब आना", isRedFlag: false },
  { key: "weight_loss", en: "Sudden weight loss", hi: "अचानक वज़न कम होना", isRedFlag: false },
  { key: "fatigue", en: "Excessive fatigue", hi: "ज़्यादा थकान", isRedFlag: false },
  { key: "blurred_vision", en: "Blurred vision", hi: "धुंधला दिखना", isRedFlag: false },
  { key: "headache_dizziness", en: "Headache / Dizziness", hi: "सिरदर्द / चक्कर", isRedFlag: false },
  { key: "severe_breathlessness", en: "Severe breathlessness", hi: "सांस फूलना (गंभीर)", isRedFlag: true },
  { key: "numbness", en: "Numbness in hands/feet", hi: "हाथ-पैर सुन्न होना", isRedFlag: false },
  { key: "chest_pain", en: "Chest pain", hi: "सीने में दर्द", isRedFlag: true },
  { key: "slow_healing", en: "Slow-healing wounds", hi: "घाव जल्दी न भरना", isRedFlag: false },
];

const RED_FLAG_KEYS = SYMPTOMS.filter((s) => s.isRedFlag).map((s) => s.key);

module.exports = { SYMPTOMS, RED_FLAG_KEYS };
