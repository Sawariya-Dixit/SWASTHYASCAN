import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDeviceId } from "../deviceId";
import VoiceSymptomButton from "./VoiceSymptomButton";
import { matchSymptomsFromText } from "../utils/voiceSymptomMatcher";
import { fetchSymptomsList, getSymptomIcon } from "../utils/symptomsApi";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/+$/, "");

function checkIfUrgent(symptomsList, redFlags = ["chest_pain", "severe_breathlessness"]) {
  const hasStandard = symptomsList.some((s) => redFlags.includes(s));
  if (hasStandard) return true;

  const URGENT_PHRASES = [
    "chest pain", "pain in chest", "heart pain", "breathlessness", "breathing difficulty",
    "seene me dard", "chhati me dard", "saans lene me", "saans phoolna", "dam ghutna",
    "सीने में दर्द", "छाती में दर्द", "सांस फूलना", "सांस लेने में तकलीफ", "दम घुटना"
  ];
  return symptomsList.some((s) => {
    const lower = String(s).toLowerCase();
    return URGENT_PHRASES.some((phrase) => lower.includes(phrase));
  });
}

function Stepper({ step, isHindi }) {
  const steps = isHindi
    ? ["बेसिक जानकारी", "लक्षण", "वाइटल्स"]
    : ["Basic Info", "Symptoms", "Vitals"];
  const stepLabel = isHindi ? `चरण ${step} / 3` : `Step ${step} of 3`;

  return (
    <div className="flex flex-col items-center mb-8 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between w-full mb-3 px-2 relative">
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
        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }} />
        </div>
      </div>
      
      <div className="flex justify-between w-full mt-8 items-center px-4">
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
  const [typedSymptom, setTypedSymptom] = useState("");
  const [bp, setBp] = useState("");
  const [sugar, setSugar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [urgentWarning, setUrgentWarning] = useState(false);

  // Dynamic symptoms fetched from backend
  const [symptomsList, setSymptomsList] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  const isHindi = lang === "hi";

  // Automatically scroll to top whenever the form step changes (Step 1 -> 2 -> 3 or back)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [step]);

  useEffect(() => {
    let isMounted = true;
    async function loadSymptoms() {
      setLoadingSymptoms(true);
      try {
        const data = await fetchSymptomsList();
        if (isMounted) {
          setSymptomsList(data);
        }
      } catch (err) {
        console.error("Failed to load symptoms list:", err);
      } finally {
        if (isMounted) {
          setLoadingSymptoms(false);
        }
      }
    }
    loadSymptoms();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute localized labels: { [key]: translatedName }
  const labels = useMemo(() => {
    const map = {};
    symptomsList.forEach((s) => {
      map[s.key] = s[lang] || s.en || s.key;
    });
    return map;
  }, [symptomsList, lang]);

  // Compute red-flag symptom keys dynamically from backend
  const redFlagKeys = useMemo(() => {
    return symptomsList
      .filter((s) => s.isRedFlag)
      .map((s) => s.key);
  }, [symptomsList]);

  // Toggle checkbox / item
  function toggleSymptom(key) {
    const next = selectedSymptoms.includes(key)
      ? selectedSymptoms.filter((s) => s !== key)
      : [...selectedSymptoms, key];
    setSelectedSymptoms(next);
    setUrgentWarning(checkIfUrgent(next, redFlagKeys));
  }

  // Remove any symptom tag
  function removeSymptom(item) {
    const next = selectedSymptoms.filter((s) => s !== item);
    setSelectedSymptoms(next);
    setUrgentWarning(checkIfUrgent(next, redFlagKeys));
  }

  // Clear all
  function clearAll() {
    setSelectedSymptoms([]);
    setUrgentWarning(false);
  }

  // Voice speech detected handler
  function handleVoiceDetected({ matchedKeys, customSymptoms }) {
    setSelectedSymptoms((prev) => {
      const combined = new Set(prev);
      matchedKeys.forEach((k) => combined.add(k));
      customSymptoms.forEach((cs) => {
        const formatted = cs.charAt(0).toUpperCase() + cs.slice(1);
        combined.add(formatted);
      });
      const next = Array.from(combined);
      setUrgentWarning(checkIfUrgent(next, redFlagKeys));
      return next;
    });
    setError("");
  }

  // Type symptom / Search bar add handler
  function handleAddTypedSymptom(e) {
    if (e) e.preventDefault();
    const query = typedSymptom.trim();
    if (!query) return;

    const { matchedKeys } = matchSymptomsFromText(query);

    setSelectedSymptoms((prev) => {
      const combined = new Set(prev);
      if (matchedKeys.length > 0) {
        matchedKeys.forEach((k) => combined.add(k));
      } else {
        // Add as custom symptom
        const formatted = query.charAt(0).toUpperCase() + query.slice(1);
        combined.add(formatted);
      }
      const next = Array.from(combined);
      setUrgentWarning(checkIfUrgent(next, redFlagKeys));
      return next;
    });

    setTypedSymptom("");
    setError("");
  }

  function nextStep() {
    if (step === 1 && (!age || !gender)) {
      setError(isHindi ? "उम्र और लिंग भरें।" : "Please fill age and gender.");
      return;
    }
    if (step === 2 && selectedSymptoms.length === 0) {
      setError(
        isHindi
          ? "कम से कम एक लक्षण चुनें, बोलें या टाइप करें।"
          : "Please select, speak, or type at least one symptom."
      );
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

  // Helper to render label for a selected symptom tag
  function getSymptomTagLabel(item) {
    if (labels[item]) {
      const icon = getSymptomIcon(item);
      return `${icon} ${labels[item]}`;
    }
    return `✨ ${item}`;
  }

  function isRedFlagSymptom(item) {
    if (redFlagKeys.includes(item)) return true;
    const lower = String(item).toLowerCase();
    return (
      lower.includes("chest") ||
      lower.includes("chhati") ||
      lower.includes("seene") ||
      lower.includes("breath") ||
      lower.includes("saans") ||
      lower.includes("सीने") ||
      lower.includes("सांस")
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-10 flex flex-col justify-center items-center">
      {/* Background glowing orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-green-300/20 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-300/15 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-3xl mx-auto relative z-10 px-4">
        
        {/* Glassmorphism Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl shadow-2xl shadow-green-900/5 p-6 sm:p-10">
            
          <Stepper step={step} isHindi={isHindi} />

          {urgentWarning && (
            <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl px-5 py-4 mb-8 text-sm shadow-sm animate-pulse">
              <span className="text-xl">⚠️</span>
              <span className="font-semibold">
                {isHindi
                  ? "आपातकालीन चेतावनी: एक गंभीर लक्षण चुना गया है (जैसे सीने में दर्द या सांस की तकलीफ)। कृपया तुरंत आपातकालीन चिकित्सा सहायता लें।"
                  : "Emergency Warning: A potentially life-threatening symptom (such as chest pain or severe breathlessness) has been detected. Please seek immediate medical care."}
              </span>
            </div>
          )}

          {/* STEP 1: Basic Info */}
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

          {/* STEP 2: Symptoms Input (Voice + Type + Checkboxes) */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
                  {isHindi ? "आप क्या लक्षण अनुभव कर रहे हैं?" : "What symptoms are you experiencing?"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {isHindi
                    ? "आवाज़ से बोलें, टाइप करें या नीचे दिए चेकबॉक्स से चुनें"
                    : "Speak using voice, type in the box, or select checkboxes below"}
                </p>
              </div>

              {/* 1. VOICE INPUT COMPONENT */}
              <VoiceSymptomButton
                lang={lang}
                labels={labels}
                onSymptomsDetected={handleVoiceDetected}
              />

              {/* 2. TYPE / SEARCH SYMPTOM INPUT */}
              <div className="mb-6">
                <form onSubmit={handleAddTypedSymptom} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={typedSymptom}
                      onChange={(e) => setTypedSymptom(e.target.value)}
                      placeholder={
                        isHindi
                          ? "लक्षण टाइप करें या खोजें (जैसे: बुखार, पेट दर्द, खांसी)..."
                          : "Type a symptom or search (e.g., Fever, Stomach ache)..."
                      }
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!typedSymptom.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>+</span>
                    <span>{isHindi ? "जोड़ें" : "Add"}</span>
                  </button>
                </form>
              </div>

              {/* 3. SELECTED SYMPTOMS PILLS BAR */}
              {selectedSymptoms.length > 0 && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {isHindi ? "चुने गए लक्षण" : "Selected Symptoms"} ({selectedSymptoms.length})
                    </span>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors"
                    >
                      {isHindi ? "सभी हटाएं" : "Clear All"}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((item) => {
                      const isUrgent = isRedFlagSymptom(item);
                      return (
                        <span
                          key={item}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                            ${isUrgent
                              ? "bg-rose-100 text-rose-800 border-rose-300 shadow-sm shadow-rose-100"
                              : "bg-white text-emerald-800 border-emerald-300 shadow-sm"
                            }`}
                        >
                          <span>{getSymptomTagLabel(item)}</span>
                          {isUrgent && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-md">⚠️</span>}
                          <button
                            type="button"
                            onClick={() => removeSymptom(item)}
                            className="hover:text-rose-600 font-bold ml-1 text-sm leading-none"
                            title={isHindi ? "हटाएं" : "Remove"}
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. VISUAL CHECKBOX CARDS GRID */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isHindi ? "त्वरित चयन चेकबॉक्स (क्लिक करें)" : "Quick Checklist (Click to select)"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isHindi ? "कई विकल्प चुन सकते हैं" : "Multi-select enabled"}
                  </span>
                </div>

                {loadingSymptoms ? (
                  /* Loading skeleton cards */
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <div
                        key={n}
                        className="h-28 rounded-2xl border-2 border-slate-100 bg-slate-50/70 p-4 flex flex-col items-center justify-center animate-pulse"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-200 mb-2"></div>
                        <div className="h-3 w-16 bg-slate-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-6">
                    {symptomsList.map((s) => {
                      const checked = selectedSymptoms.includes(s.key);
                      const symptomLabel = labels[s.key] || s.en || s.key;
                      const icon = getSymptomIcon(s.key);
                      const isHighlighted =
                        typedSymptom.trim().length > 1 &&
                        (symptomLabel.toLowerCase().includes(typedSymptom.toLowerCase()) ||
                          s.key.toLowerCase().includes(typedSymptom.toLowerCase()));

                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => toggleSymptom(s.key)}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 text-center
                            ${s.isRedFlag && checked
                              ? "border-rose-500 bg-rose-50 text-rose-900 shadow-md shadow-rose-100 ring-2 ring-rose-300"
                              : checked
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md shadow-emerald-100 ring-2 ring-emerald-300"
                              : isHighlighted
                              ? "border-amber-400 bg-amber-50 text-amber-900 shadow-sm"
                              : "border-slate-200 text-slate-700 hover:border-emerald-300 bg-white hover:bg-slate-50/50"
                            }`}
                        >
                          {/* Checkbox badge */}
                          <div className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-colors
                            ${checked
                              ? (s.isRedFlag ? "bg-rose-500 border-rose-500 text-white" : "bg-emerald-600 border-emerald-600 text-white")
                              : "border-slate-300 bg-white"
                            }`}
                          >
                            {checked && (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>

                          {s.isRedFlag && (
                            <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded">
                              {isHindi ? "गंभीर" : "Urgent"}
                            </span>
                          )}

                          <span className="text-3xl my-1.5 filter drop-shadow-sm">{icon}</span>
                          <span className="text-xs font-bold leading-tight line-clamp-2 mt-1">
                            {symptomLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-sm mt-4 font-medium text-center">{error}</p>}
            </div>
          )}

          {/* STEP 3: Vitals */}
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

        </div>
      </div>
    </div>
  );
}
