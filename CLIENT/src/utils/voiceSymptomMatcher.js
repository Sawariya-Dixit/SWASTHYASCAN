/**
 * Voice and Text Symptom Matcher
 * Maps spoken speech or typed text (Hindi, Hinglish, English) to standard symptom keys.
 */

export const SYMPTOM_KEYWORDS = {
  fever: [
    "fever", "high temperature", "pyrexia", "feverish", "shivering",
    "bukhar", "bukhaar", "taap", "tap", "body hot", "garam sharir",
    "बुखार", "तेज बुखार", "ताप", "तापमान"
  ],
  cough: [
    "cough", "coughing", "dry cough", "wet cough", "cold", "throat pain",
    "khansi", "khaansi", "khasi", "gala kharab", "kansi",
    "खांसी", "सुखी खांसी", "खाँसी", "कफ", "गले में खराश"
  ],
  headache_dizziness: [
    "headache", "dizziness", "dizzy", "head ache", "migraine", "vertigo", "spinning",
    "sar dard", "sardard", "sar me dard", "chakkar", "chakar", "sar ghumna", "sir ghumna",
    "सिरदर्द", "सिर दर्द", "चक्कर", "सिर घूमना", "माइग्रेन"
  ],
  fatigue: [
    "fatigue", "tired", "tiredness", "exhausted", "exhaustion", "weakness", "weak",
    "thakan", "thakaan", "kamzori", "kamjori", "sustee", "sust", "body ache",
    "थकान", "कमजोरी", "कमज़ोरी", "सुस्ती", "थकावट", "शरीर में दर्द"
  ],
  chest_pain: [
    "chest pain", "pain in chest", "chest tightness", "chest pressure", "heart pain", "cardiac pain",
    "chhati me dard", "chhati dard", "seene me dard", "seena dard", "chhati pe dabav",
    "सीने में दर्द", "छाती में दर्द", "सीने पर दबाव", "छाती में जकड़न", "दिल में दर्द"
  ],
  severe_breathlessness: [
    "breathlessness", "short of breath", "shortness of breath", "trouble breathing", "difficulty breathing", "suffocation",
    "saans lene me dikkat", "saans phoolna", "sans fulna", "saans lene me takleef", "dam ghutna",
    "सांस लेने में तकलीफ", "सांस फूलना", "सांस की तकलीफ", "दम घुटना", "सांस न आना"
  ],
  nausea: [
    "nausea", "nauseous", "feeling sick", "queasy",
    "ulti jaisa lagna", "jee ghabrana", "jee machalna", "ji machalna",
    "मतली", "जी मिचलाना", "जी घबराना", "उल्टी जैसा लगना"
  ],
  vomiting: [
    "vomit", "vomiting", "throwing up", "puking",
    "ulti", "ultee", "vaman", "dast ulti",
    "उल्टी", "वमन", "उल्टियां"
  ],
  frequent_thirst: [
    "thirst", "frequent thirst", "excessive thirst", "very thirsty", "dry mouth",
    "pyas", "pyaas", "bar bar pyas", "gala sookhna", "bohot pyas",
    "बार-बार प्यास", "प्यास लगना", "अत्यधिक प्यास", "गला सूखना"
  ],
  frequent_urination: [
    "frequent urination", "urinating often", "peeing often", "excessive urination",
    "peshab", "bar bar peshab", "peshab aana", "mutra",
    "बार-बार पेशाब", "पेशाब आना", "अधिक पेशाब"
  ],
  blurred_vision: [
    "blurred vision", "blurry eyes", "blurry vision", "dim vision", "vision problem",
    "dhundhla dikhna", "dhundla", "kam dikhna", "ankho me dhundhla",
    "धुंधला दिखना", "आंखों से धुंधला", "कम दिखाई देना"
  ],
  numbness: [
    "numbness", "tingling", "pins and needles", "loss of sensation",
    "sunn", "haath pair sunn", "jhunjhuni", "hath pair sunn hona",
    "सुन्न होना", "हाथ पैर सुन्न", "झनझनाहट", "शून्य होना"
  ],
  weight_loss: [
    "weight loss", "losing weight", "sudden weight loss",
    "vajan kam hona", "vajan ghatna", "patla hona",
    "वज़न कम होना", "वजन घटना", "कमजोरी से वजन घटना"
  ],
  slow_healing: [
    "slow healing", "wounds not healing", "cuts take time to heal",
    "ghav na bharna", "chot theek na hona", "zakhm na bharna",
    "घाव न भरना", "घाव देर से भरना", "चोट ठीक न होना"
  ],
};

/**
 * Parses spoken text or typed query and identifies matching symptom keys.
 * Also returns recognized standard keys and unmatched phrases that can be treated as custom symptoms.
 * 
 * @param {string} text - Spoken speech or typed query
 * @returns {{ matchedKeys: string[], customSymptoms: string[], transcript: string }}
 */
export function matchSymptomsFromText(text) {
  if (!text || typeof text !== "string") {
    return { matchedKeys: [], customSymptoms: [], transcript: "" };
  }

  const cleanText = text.toLowerCase().trim();
  const matchedKeys = new Set();

  // Search each symptom key
  for (const [key, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
    for (const kw of keywords) {
      const lowerKw = kw.toLowerCase();
      if (cleanText.includes(lowerKw)) {
        matchedKeys.add(key);
        break;
      }
    }
  }

  // Look for custom symptoms: split words by conjunctions ("and", "aur", "or", comma, "तथा", "और")
  const phrases = cleanText
    .split(/,| and | aur | or | तथा | और |\+/gi)
    .map(p => p.trim())
    .filter(p => p.length > 2);

  const customSymptoms = [];
  for (const phrase of phrases) {
    let matchedAny = false;
    for (const [key, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
      if (keywords.some(kw => phrase.includes(kw.toLowerCase()))) {
        matchedAny = true;
        break;
      }
    }
    // If not matched to any known standard symptom key, and isn't filler words
    const fillerWords = ["i have", "mujhe", "problem", "feel", "feeling", "hai", "ho raha hai", "lag raha hai", "symptoms", "lakshan", "bhi"];
    const isOnlyFiller = fillerWords.some(f => phrase === f);
    if (!matchedAny && !isOnlyFiller && phrase.length >= 3) {
      customSymptoms.push(phrase);
    }
  }

  return {
    matchedKeys: Array.from(matchedKeys),
    customSymptoms,
    transcript: text.trim(),
  };
}
