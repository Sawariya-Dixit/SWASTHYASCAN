import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDeviceId } from "../deviceId";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const DISPLAY_SYMPTOMS = [
  { key: "fever",                 redFlag: false, icon: "🌡️" },
  { key: "cough",                 redFlag: false, icon: "😷" },
  { key: "headache_dizziness",    redFlag: false, icon: "🤕" },
  { key: "fatigue",               redFlag: false, icon: "😴" },
  { key: "chest_pain",            redFlag: true,  icon: "❤️" },
  { key: "severe_breathlessness", redFlag: true,  icon: "💨" },
  { key: "nausea",                redFlag: false, icon: "🤢" },
  { key: "vomiting",              redFlag: false, icon: "🤮" },
  { key: "frequent_thirst",       redFlag: false, icon: "💧" },
  { key: "frequent_urination",    redFlag: false, icon: "🚿" },
  { key: "blurred_vision",        redFlag: false, icon: "👁️" },
  { key: "numbness",              redFlag: false, icon: "🖐️" },
];

const LABELS = {
  en: {
    fever: "Fever", cough: "Cough", headache_dizziness: "Headache", fatigue: "Fatigue",
    chest_pain: "Chest pain", severe_breathlessness: "Severe breathlessness",
    nausea: "Nausea", vomiting: "Vomiting", frequent_thirst: "Frequent thirst",
    frequent_urination: "Frequent urination", blurred_vision: "Blurred vision", numbness: "Others",
  },
  hi: {
    fever: "बुखार", cough: "खांसी", headache_dizziness: "सिरदर्द", fatigue: "थकान",
    chest_pain: "सीने में दर्द", severe_breathlessness: "सांस की तकलीफ",
    nausea: "मतली", vomiting: "उल्टी", frequent_thirst: "बार-बार प्यास",
    frequent_urination: "बार-बार पेशाब", blurred_vision: "धुंधला दिखना", numbness: "अन्य",
  },
};

function Stepper({ step, isHindi }) {
  const steps = isHindi
    ? ["बेसिक जानकारी", "लक्षण", "वाइटल्स"]
    : ["Basic Info", "Symptoms", "Vitals"];
  const stepLabel = isHindi ? `चरण ${step} / 3` : `Step ${step} of 3`;
  const progress = (step / 3) * 100;

  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-0">
        {steps.map((label, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition
                  ${done || active ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                  {done ? "✓" : num}
                </div>
                <span className={`text-xs mt-1 font-medium whitespace-nowrap ${active ? "text-teal-700" : done ? "text-teal-500" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-20 h-0.5 mb-5 mx-1 ${step > num ? "bg-teal-500" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-end gap-1.5 min-w-[110px]">
        <span className="text-xs font-semibold text-teal-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          {stepLabel}
        </span>
        <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function SymptomForm({ lang }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [screenedFor, setScreenedFor] = useState("self");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [bp, setBp] = useState("");
  const [sugar, setSugar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [urgentWarning, setUrgentWarning] = useState(false);

  const isHindi = lang === "hi";
  const labels = LABELS[lang] || LABELS.en;

  function toggleSymptom(key) {
    const next = selectedSymptoms.includes(key)
      ? selectedSymptoms.filter((s) => s !== key)
      : [...selectedSymptoms, key];
    setSelectedSymptoms(next);
    setUrgentWarning(next.some((s) => DISPLAY_SYMPTOMS.find((x) => x.key === s)?.redFlag));
  }

  function nextStep() {
    if (step === 1 && (!age || !gender)) {
      setError(isHindi ? "उम्र और लिंग भरें।" : "Please fill age and gender.");
      return;
    }
    if (step === 2 && selectedSymptoms.length === 0) {
      setError(isHindi ? "कम से कम एक लक्षण चुनें।" : "Select at least one symptom.");
      return;
    }
    setError("");
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const payload = {
        deviceId: getDeviceId(),
        screenedFor,
        name: screenedFor === "other" ? name : undefined,
        age: Number(age),
        gender,
        symptoms: selectedSymptoms,
        vitals: { bp: bp || undefined, sugar: sugar ? Number(sugar) : undefined },
        language: lang,
      };
      const { data } = await axios.post(`${API_BASE}/api/v1/screening`, payload);
      navigate("/result", { state: { result: data, payload } });
    } catch {
      setError(isHindi ? "कुछ गलत हुआ। दोबारा कोशिश करें।" : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-6 min-h-[calc(100vh-64px)]">

          {/* LEFT: form */}
          <div className="flex-1 flex flex-col">
          <div className="p-8 pb-0">
            <Stepper step={step} isHindi={isHindi} />

            {urgentWarning && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">
                  {isHindi
                    ? "एक गंभीर लक्षण चुना गया है। कृपया पेशेवर देखभाल में देरी न करें।"
                    : "A potentially serious symptom has been selected. Please do not delay professional care."}
                </span>
              </div>
            )}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="px-8 pb-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {isHindi ? "आप किसके लिए स्क्रीनिंग कर रहे हैं?" : "Who are you screening for?"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {isHindi
                  ? "नीचे एक विकल्प चुनें। आप व्यक्ति का नाम भी जोड़ सकते हैं (वैकल्पिक)।"
                  : "Select an option below. You can also add the person's name (optional)."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    val: "self",
                    icon: (
                      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    ),
                    title: isHindi ? "स्वयं" : "Myself",
                    sub: isHindi ? "मैं अपनी स्वास्थ्य जांच कर रहा/रही हूं" : "I am checking my own health",
                  },
                  {
                    val: "other",
                    icon: (
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    ),
                    title: isHindi ? "किसी और के लिए" : "Someone else",
                    sub: isHindi ? "मैं किसी और के लिए जांच कर रहा/रही हूं" : "I am checking for someone else",
                  },
                ].map(({ val, icon, title, sub }) => (
                  <button key={val} type="button" onClick={() => setScreenedFor(val)}
                    className={`relative flex items-center gap-4 p-5 rounded-xl border-2 text-left transition
                      ${screenedFor === val ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-teal-200"}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                      ${screenedFor === val ? "bg-teal-100" : "bg-gray-100"}`}>
                      {icon}
                    </div>
                    <div>
                      <p className={`font-semibold text-base ${screenedFor === val ? "text-teal-700" : "text-gray-700"}`}>{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sub}</p>
                    </div>
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${screenedFor === val ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}>
                      {screenedFor === val && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  {isHindi ? "नाम (वैकल्पिक)" : "Name (optional)"}
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={isHindi ? "नाम दर्ज करें" : "Enter name"}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50" />
              </div>

              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">{isHindi ? "बेसिक जानकारी" : "Basic Information"}</p>
                    <p className="text-xs text-gray-400">{isHindi ? "बेहतर विश्लेषण के लिए कुछ विवरण दें।" : "Please provide a few details for better analysis."}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {isHindi ? "उम्र" : "Age"}
                    </label>
                    <div className="relative">
                      <input type="number" min="1" max="120" value={age}
                        onChange={(e) => setAge(e.target.value)} placeholder="e.g. 32"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white pr-14" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">{isHindi ? "वर्ष" : "years"}</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
                      <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      {isHindi ? "लिंग" : "Gender"}
                    </label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button key={g} type="button" onClick={() => setGender(g.toLowerCase())}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition
                            ${gender === g.toLowerCase()
                              ? "bg-teal-600 border-teal-600 text-white"
                              : "border-gray-200 text-gray-600 bg-white hover:border-teal-300"}`}>
                          {isHindi ? (g === "Male" ? "पुरुष" : g === "Female" ? "महिला" : "अन्य") : g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="px-8 pb-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {isHindi ? "आप क्या अनुभव कर रहे हैं?" : "What are you experiencing?"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">{isHindi ? "सभी लागू विकल्प चुनें" : "Select all that apply"}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                {DISPLAY_SYMPTOMS.map((s) => {
                  const checked = selectedSymptoms.includes(s.key);
                  return (
                    <button key={s.key} type="button" onClick={() => toggleSymptom(s.key)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-xs font-medium transition
                        ${s.redFlag && checked ? "border-red-400 bg-red-50 text-red-700"
                          : checked ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 text-gray-600 hover:border-teal-300 bg-white"}`}>
                      {checked && (
                        <span className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold
                          ${s.redFlag ? "bg-red-500" : "bg-teal-500"}`}>✓</span>
                      )}
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-center leading-tight">{labels[s.key]}</span>
                    </button>
                  );
                })}
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="px-8 pb-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {isHindi ? "वैकल्पिक वाइटल्स" : "Optional Vitals"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {isHindi ? "अपना ब्लड प्रेशर और ब्लड शुगर जोड़ें (वैकल्पिक)" : "Add your blood pressure and blood sugar (optional)"}
              </p>
              <div className="grid grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isHindi ? "ब्लड प्रेशर (mmHg)" : "Blood Pressure (mmHg)"}
                  </label>
                  <input type="text" value={bp} onChange={(e) => setBp(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isHindi ? "ब्लड शुगर (mg/dL)" : "Blood Sugar (mg/dL)"}
                  </label>
                  <input type="number" value={sugar} onChange={(e) => setSugar(e.target.value)}
                    placeholder="e.g. 98"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            </div>
          )}

          {/* Bottom nav bar */}
          <div className="flex justify-between items-center px-8 py-5 mt-auto">
            {step === 1 ? (
              <button onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1.5">
                ← {isHindi ? "होम पर वापस" : "Back to Home"}
              </button>
            ) : (
              <button onClick={() => setStep((s) => s - 1)} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1.5">
                ← {isHindi ? "वापस" : "Back"}
              </button>
            )}
            {step < 3 ? (
              <button onClick={nextStep}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-10 py-3 rounded-xl transition text-sm">
                {step === 1
                  ? (isHindi ? "अगला: लक्षण →" : "Next: Symptoms →")
                  : (isHindi ? "अगला: वाइटल्स →" : "Next: Vitals →")}
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-10 py-3 rounded-xl transition disabled:opacity-60 text-sm">
                {loading
                  ? (isHindi ? "विश्लेषण हो रहा है..." : "Analyzing...")
                  : (isHindi ? "स्वास्थ्य विश्लेषण करें →" : "Analyze My Health →")}
              </button>
            )}
          </div>
          </div>{/* end LEFT */}

          {/* RIGHT: illustration panel */}
          <div className="hidden lg:flex flex-shrink-0 w-[52%] justify-end sticky top-20 self-start pointer-events-none overflow-visible">
            <img
              src="/image.png"
              alt="Doctor illustration"
              className="w-full max-w-[900px] h-auto object-contain scale-[1.5] -translate-x-24 translate-y-24 lg:-translate-x-28 lg:translate-y-24"
            />
          </div>{/* end RIGHT */}

      </div>{/* end max-w-7xl */}
    </div>
  );
}
