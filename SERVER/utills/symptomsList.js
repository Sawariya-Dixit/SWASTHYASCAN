// Predefined symptom list used by the frontend form.
// isRedFlag=true symptoms trigger the urgent-care safety layer
// BEFORE any AI call is made.

const SYMPTOMS = [
  // --- Diabetes / metabolic warning signs ---
  { key: "frequent_thirst", en: "Frequent thirst", hi: "बार-बार प्यास लगना", isRedFlag: false },
  { key: "frequent_urination", en: "Frequent urination", hi: "बार-बार पेशाब आना", isRedFlag: false },
  { key: "weight_loss", en: "Sudden weight loss", hi: "अचानक वज़न कम होना", isRedFlag: false },
  { key: "blurred_vision", en: "Blurred vision", hi: "धुंधला दिखना", isRedFlag: false },
  { key: "numbness", en: "Numbness in hands/feet", hi: "हाथ-पैर सुन्न होना", isRedFlag: false },
  { key: "slow_healing", en: "Slow-healing wounds", hi: "घाव जल्दी न भरना", isRedFlag: false },

  // --- General / common symptoms ---
  { key: "fatigue", en: "Excessive fatigue", hi: "ज़्यादा थकान", isRedFlag: false },
  { key: "fever", en: "Fever", hi: "बुखार", isRedFlag: false },
  { key: "high_fever", en: "High fever (above 103°F)", hi: "तेज़ बुखार (103°F से ऊपर)", isRedFlag: true },
  { key: "cough", en: "Cough", hi: "खांसी", isRedFlag: false },
  { key: "sore_throat", en: "Sore throat", hi: "गले में खराश", isRedFlag: false },
  { key: "headache_dizziness", en: "Headache / Dizziness", hi: "सिरदर्द / चक्कर", isRedFlag: false },
  { key: "nausea", en: "Nausea", hi: "मतली", isRedFlag: false },
  { key: "vomiting", en: "Vomiting", hi: "उल्टी", isRedFlag: false },
  { key: "diarrhea", en: "Diarrhea", hi: "दस्त", isRedFlag: false },
  { key: "abdominal_pain", en: "Abdominal pain", hi: "पेट में दर्द", isRedFlag: false },
  { key: "joint_pain", en: "Joint pain", hi: "जोड़ों में दर्द", isRedFlag: false },
  { key: "skin_rash", en: "Skin rash", hi: "त्वचा पर चकत्ते", isRedFlag: false },
  { key: "loss_of_appetite", en: "Loss of appetite", hi: "भूख न लगना", isRedFlag: false },

  // --- Red-flag / urgent-care symptoms ---
  { key: "chest_pain", en: "Chest pain", hi: "सीने में दर्द", isRedFlag: true },
  { key: "severe_breathlessness", en: "Severe breathlessness", hi: "सांस फूलना (गंभीर)", isRedFlag: true },
  { key: "severe_abdominal_pain", en: "Severe abdominal pain", hi: "पेट में तेज़ दर्द", isRedFlag: true },
  { key: "fainting", en: "Fainting / loss of consciousness", hi: "बेहोशी", isRedFlag: true },
  { key: "seizures", en: "Seizures / fits", hi: "दौरा पड़ना", isRedFlag: true },
  { key: "severe_bleeding", en: "Severe or uncontrolled bleeding", hi: "अत्यधिक रक्तस्राव", isRedFlag: true },
  { key: "slurred_speech", en: "Sudden slurred speech / facial drooping", hi: "बोलने में दिक्कत / चेहरे का लटकना", isRedFlag: true },
  { key: "severe_allergic_reaction", en: "Severe allergic reaction (swelling, difficulty breathing)", hi: "गंभीर एलर्जी प्रतिक्रिया (सूजन, सांस लेने में तकलीफ)", isRedFlag: true },
];

const RED_FLAG_KEYS = SYMPTOMS.filter((s) => s.isRedFlag).map((s) => s.key);

module.exports = { SYMPTOMS, RED_FLAG_KEYS };