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
    <div className="flex flex-col items-center mb-10 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between w-full mb-3 px-2">
        {steps.map((label, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={i} className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shadow-sm
                ${done || active ? "bg-green-600 border-green-600 text-white shadow-green-200" : "bg-white border-slate-200 text-slate-400"}`}>
                {done ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                ) : num}
              </div>
              <span className={`absolute -bottom-6 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                ${active ? "text-green-700" : done ? "text-green-400" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
          );
        })}
        {/* Connecting Lines Behind */}
        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }} />
        </div>
      </div>
      
      <div className="flex justify-between w-full mt-10 items-center px-4">
        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {stepLabel}
        </span>
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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-10 flex flex-col justify-center items-center">
        {/* Background glowing orbs */}
        <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-green-300/20 blur-[100px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-300/15 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        
        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-2xl shadow-green-900/5 p-8 sm:p-12">
            
            <Stepper step={step} isHindi={isHindi} />

            {urgentWarning && (
              <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl px-5 py-4 mb-8 text-sm shadow-sm animate-pulse">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold">
                  {isHindi
                    ? "एक गंभीर लक्षण चुना गया है। कृपया पेशेवर देखभाल में देरी न करें।"
                    : "A potentially serious symptom has been selected. Please do not delay professional care."}
                </span>
              </div>
            )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">
                {isHindi ? "आप किसके लिए स्क्रीनिंग कर रहे हैं?" : "Who are you screening for?"}
              </h2>
              <p className="text-slate-500 text-center mb-8">
                {isHindi
                  ? "नीचे एक विकल्प चुनें। आप व्यक्ति का नाम भी जोड़ सकते हैं (वैकल्पिक)।"
                  : "Select an option below. You can also add the person's name (optional)."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  {
                    val: "self",
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    ),
                    title: isHindi ? "स्वयं" : "Myself",
                    sub: isHindi ? "मैं अपनी स्वास्थ्य जांच कर रहा/रही हूं" : "I am checking my own health",
                  },
                  {
                    val: "other",
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    ),
                    title: isHindi ? "किसी और के लिए" : "Someone else",
                    sub: isHindi ? "मैं किसी और के लिए जांच कर रहा/रही हूं" : "I am checking for someone else",
                  },
                ].map(({ val, icon, title, sub }) => (
                  <button key={val} type="button" onClick={() => setScreenedFor(val)}
                    className={`relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-300
                      ${screenedFor === val 
                        ? "border-green-500 bg-green-50 shadow-md shadow-green-100" 
                        : "border-slate-200 bg-white hover:border-green-200 hover:shadow-sm"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3
                      ${screenedFor === val ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {icon}
                    </div>
                    <p className={`font-bold text-lg ${screenedFor === val ? "text-green-900" : "text-slate-700"}`}>{title}</p>
                    <p className="text-xs text-slate-500 mt-1">{sub}</p>
                    
                    {screenedFor === val && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {isHindi ? "नाम (वैकल्पिक)" : "Name (optional)"}
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder={isHindi ? "नाम दर्ज करें" : "Enter name"}
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm transition-shadow" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {isHindi ? "उम्र" : "Age"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input type="number" min="1" max="120" value={age}
                        onChange={(e) => setAge(e.target.value)} placeholder="e.g. 32"
                        className="w-full border border-slate-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm pr-14 transition-shadow" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">{isHindi ? "वर्ष" : "years"}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {isHindi ? "लिंग" : "Gender"} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button key={g} type="button" onClick={() => setGender(g.toLowerCase())}
                          className={`flex-1 py-3.5 rounded-xl text-xs font-bold border-2 transition-all
                            ${gender === g.toLowerCase()
                              ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-200"
                              : "border-slate-200 text-slate-600 bg-white hover:border-green-300"}`}>
                          {isHindi ? (g === "Male" ? "पुरुष" : g === "Female" ? "महिला" : "अन्य") : g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-4 font-medium text-center">{error}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">
                {isHindi ? "आप क्या अनुभव कर रहे हैं?" : "What are you experiencing?"}
              </h2>
              <p className="text-slate-500 text-center mb-8 font-medium">{isHindi ? "सभी लागू विकल्प चुनें" : "Select all that apply"}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {DISPLAY_SYMPTOMS.map((s) => {
                  const checked = selectedSymptoms.includes(s.key);
                  return (
                    <button key={s.key} type="button" onClick={() => toggleSymptom(s.key)}
                      className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1
                        ${s.redFlag && checked ? "border-rose-500 bg-rose-50 text-rose-800 shadow-md shadow-rose-100"
                          : checked ? "border-green-500 bg-green-50 text-green-800 shadow-md shadow-green-100"
                          : "border-slate-200 text-slate-600 hover:border-green-300 bg-white"}`}>
                      {checked && (
                        <span className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white
                          ${s.redFlag ? "bg-rose-500" : "bg-green-600"}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                        </span>
                      )}
                      <span className="text-3xl mb-2 filter drop-shadow-sm">{s.icon}</span>
                      <span className="text-xs font-bold text-center leading-snug">{labels[s.key]}</span>
                    </button>
                  );
                })}
              </div>
              {error && <p className="text-red-500 text-sm mt-4 font-medium text-center">{error}</p>}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">
                {isHindi ? "वैकल्पिक वाइटल्स" : "Optional Vitals"}
              </h2>
              <p className="text-slate-500 text-center mb-8 font-medium">
                {isHindi ? "अपना ब्लड प्रेशर और ब्लड शुगर जोड़ें (वैकल्पिक)" : "Add your blood pressure and blood sugar (optional)"}
              </p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {isHindi ? "ब्लड प्रेशर (mmHg)" : "Blood Pressure (mmHg)"}
                  </label>
                  <input type="text" value={bp} onChange={(e) => setBp(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {isHindi ? "ब्लड शुगर (mg/dL)" : "Blood Sugar (mg/dL)"}
                  </label>
                  <input type="number" value={sugar} onChange={(e) => setSugar(e.target.value)}
                    placeholder="e.g. 98"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm transition-shadow" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-4 font-medium text-center">{error}</p>}
            </div>
          )}

          {/* Bottom nav bar */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
            {step === 1 ? (
              <button onClick={() => navigate("/")} className="text-slate-500 hover:text-green-600 text-sm font-bold flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                {isHindi ? "होम पर वापस" : "Back to Home"}
              </button>
            ) : (
              <button onClick={() => setStep((s) => s - 1)} className="text-slate-500 hover:text-green-600 text-sm font-bold flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                {isHindi ? "वापस" : "Back"}
              </button>
            )}
            
            {step < 3 ? (
              <button onClick={nextStep}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50 hover:-translate-y-0.5 text-sm flex items-center gap-2">
                {step === 1
                  ? (isHindi ? "अगला: लक्षण" : "Next: Symptoms")
                  : (isHindi ? "अगला: वाइटल्स" : "Next: Vitals")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 text-sm flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {isHindi ? "विश्लेषण हो रहा है..." : "Analyzing..."}
                  </>
                ) : (
                  <>
                    {isHindi ? "स्वास्थ्य विश्लेषण करें" : "Analyze My Health"}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </>
                )}
              </button>
            )}
          </div>

        </div>{/* end card */}
      </div>{/* end max-w-2xl */}
    </div>
  );
}
