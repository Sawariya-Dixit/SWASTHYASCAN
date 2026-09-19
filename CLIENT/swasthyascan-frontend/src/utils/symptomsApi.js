import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Curated UI icons for standard symptoms, with fallback support for dynamic symptoms
export const SYMPTOM_ICONS = {
  fever: "🌡️",
  cough: "😷",
  headache_dizziness: "🤕",
  fatigue: "😴",
  chest_pain: "❤️",
  severe_breathlessness: "💨",
  nausea: "🤢",
  vomiting: "🤮",
  frequent_thirst: "💧",
  frequent_urination: "🚿",
  blurred_vision: "👁️",
  numbness: "🖐️",
  weight_loss: "⚖️",
  slow_healing: "🩹",
};

/**
 * Returns an appropriate icon for any symptom key.
 * If not in the icon dictionary, defaults to 🩺.
 */
export function getSymptomIcon(key) {
  if (!key) return "🩺";
  const lower = String(key).toLowerCase().trim();
  if (SYMPTOM_ICONS[lower]) return SYMPTOM_ICONS[lower];

  // Try substring matching for compound names
  for (const [k, icon] of Object.entries(SYMPTOM_ICONS)) {
    if (lower.includes(k) || k.includes(lower)) return icon;
  }
  return "🩺";
}

// Fallback symptom list in case backend server is booting or unreachable
export const DEFAULT_FALLBACK_SYMPTOMS = [
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
  { key: "fever", en: "Fever", hi: "बुखार", isRedFlag: false },
  { key: "cough", en: "Cough", hi: "खांसी", isRedFlag: false },
  { key: "nausea", en: "Nausea", hi: "मतली / जी घबराना", isRedFlag: false },
  { key: "vomiting", en: "Vomiting", hi: "उल्टी आना", isRedFlag: false },
];

/**
 * Fetches the dynamic symptoms list from the backend API.
 * Calls /api/v1/symptoms-list or /api/symptoms-list, and falls back to
 * default list if offline.
 *
 * @returns {Promise<Array<{ key: string, en: string, hi: string, isRedFlag: boolean }>>}
 */
export async function fetchSymptomsList() {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/symptoms-list`, { timeout: 4000 });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (_err) {
    // Try alternate endpoint
    try {
      const altRes = await axios.get(`${API_BASE}/api/symptoms-list`, { timeout: 3000 });
      if (Array.isArray(altRes.data) && altRes.data.length > 0) {
        return altRes.data;
      }
      if (altRes.data?.data && Array.isArray(altRes.data.data)) {
        return altRes.data.data;
      }
    } catch (altErr) {
      console.warn("Could not reach backend symptoms API, falling back to local list:", altErr.message);
    }
  }

  return DEFAULT_FALLBACK_SYMPTOMS;
}
