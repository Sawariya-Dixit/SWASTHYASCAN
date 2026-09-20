import { useLocation, useNavigate } from "react-router-dom";
import NearestFacilities from "../components/NearestFacilities";
import { getDeviceId } from "../deviceId";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/+$/, "");
const riskConfig = {
  Low:    { bg: "bg-green-50",  border: "border-green-200",  icon: "✅", iconBg: "bg-green-100",  text: "text-green-700",  label: "LOW RISK" },
  Medium: { bg: "bg-amber-50", border: "border-amber-200", icon: "⚠️", iconBg: "bg-amber-100", text: "text-amber-700", label: "MEDIUM RISK" },
  High:   { bg: "bg-rose-50",    border: "border-rose-200",    icon: "🔴", iconBg: "bg-rose-100",    text: "text-rose-700",   label: "HIGH RISK" },
  Urgent: { bg: "bg-rose-50",    border: "border-rose-300",    icon: "🚨", iconBg: "bg-rose-100",    text: "text-rose-700",   label: "URGENT" },
};

export default function Result({ t }) {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) { navigate("/"); return null; }

  const { result, payload } = state;
  const riskLevel = result.isUrgent ? "Urgent" : result.riskLevel;
  const cfg = riskConfig[riskLevel] || riskConfig.Low;
  const isHindi = payload?.language === "hi";

  // Urgent screen (image 5)
  if (result.isUrgent) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 relative overflow-hidden flex justify-center items-center">
        {/* Background glowing orbs */}
        <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-rose-300/20 blur-[100px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-green-300/15 blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-2xl mx-auto relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-900/10 border border-white p-8 sm:p-12 space-y-6">
            
            {/* Warning banner */}
            <div className="flex items-center justify-between bg-rose-50 border-l-4 border-rose-500 rounded-r-xl px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3 text-rose-700 text-sm font-semibold">
                <span className="text-xl">⚠️</span>
                <span>
                  {isHindi
                    ? "एक गंभीर लक्षण चुना गया है। कृपया पेशेवर देखभाल में देरी न करें।"
                    : "A potentially serious symptom has been selected. Please do not delay professional care."}
                </span>
              </div>
              <button onClick={() => navigate("/")} className="text-rose-400 hover:text-rose-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Urgent card */}
            <div className="bg-white border border-rose-100 rounded-2xl p-8 text-center space-y-4 shadow-sm shadow-rose-100/50">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner mb-2 animate-pulse">🚨</div>
              <h2 className="text-2xl font-extrabold text-rose-700 uppercase tracking-wide">
                {isHindi ? "तत्काल चिकित्सा ध्यान" : "URGENT MEDICAL ATTENTION"}
              </h2>
              <p className="text-rose-600 text-base leading-relaxed max-w-md mx-auto">
                {result.advice || (isHindi
                  ? "सीने में दर्द या सांस लेने में गंभीर तकलीफ जानलेवा हो सकती है। कृपया तुरंत चिकित्सा सहायता लें।"
                  : "Chest pain or severe breathlessness can be life-threatening. Please seek immediate medical attention.")}
              </p>
              <div className="pt-4">
                <a
                  href="tel:112"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:-translate-y-0.5 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {isHindi ? "तत्काल सहायता लें" : "Get Immediate Help"}
                </a>
              </div>
            </div>

            {/* Nearest PHC / Hospital suggestion for Urgent cases */}
            <NearestFacilities isHindi={isHindi} />

            <div className="pt-4 text-center border-t border-slate-100">
              <button onClick={() => navigate("/")} className="text-sm font-semibold text-slate-500 hover:text-green-600 inline-flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                {isHindi ? "पिछले चरण पर वापस जाएं" : "Back to previous step"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal result dashboard
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden flex justify-center items-center">
      {/* Background glowing orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-green-300/20 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-300/15 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* Main Result Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-900/5 border border-white p-8">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Risk info */}
            <div className="flex-1 space-y-8">
              
              {/* Header section with risk level */}
              <div className={`p-6 rounded-2xl ${cfg.bg} border ${cfg.border} flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left`}>
                <div className={`w-20 h-20 ${cfg.iconBg} rounded-full flex items-center justify-center text-4xl flex-shrink-0 shadow-sm border border-white/50`}>
                  {cfg.icon}
                </div>
                <div className="flex-1">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                    {isHindi ? "विश्लेषण परिणाम" : "Analysis Result"}
                  </span>
                  <h2 className={`text-3xl font-extrabold ${cfg.text} tracking-tight mb-2`}>
                    {isHindi
                      ? (riskLevel === "Medium" ? "मध्यम जोखिम" : riskLevel === "High" ? "उच्च जोखिम" : "कम जोखिम")
                      : cfg.label}
                  </h2>
                  <p className={`text-sm ${cfg.text} opacity-90 leading-relaxed`}>
                    {isHindi
                      ? `आपके परिणाम ${riskLevel === "Medium" ? "मध्यम" : riskLevel === "High" ? "उच्च" : "कम"} जोखिम दर्शाते हैं। नीचे दिए गए विवरण पढ़ें और किसी स्वास्थ्य पेशेवर से परामर्श करें।`
                      : `Your results indicate a ${riskLevel.toLowerCase()} risk based on the symptoms and vitals you provided. Please read the details below and consider consulting a healthcare professional.`}
                  </p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Why this risk */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                    <span className="text-green-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    </span>
                    {isHindi ? "यह जोखिम क्यों?" : "Why this risk?"}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mb-4 pb-3 border-b border-slate-100">
                    {isHindi
                      ? `${result.factors?.length || 0} कारण आपके लक्षणों और वाइटल्स से पाए गए।`
                      : `${result.factors?.length || 0} factors were detected from the symptoms and vitals.`}
                  </p>
                  
                  <ul className="space-y-4">
                    {result.factors?.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full ${cfg.bg} ${cfg.text} text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5 border ${cfg.border}`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-snug">{f}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{isHindi ? "पाया गया लक्षण" : "Detected symptom"}</p>
                        </div>
                      </li>
                    ))}
                    {payload?.vitals?.bp && (
                      <li className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full ${cfg.bg} ${cfg.text} text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5 border ${cfg.border}`}>
                          {(result.factors?.length || 0) + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-snug">{isHindi ? "ऊंचा रक्तचाप" : "Elevated blood pressure"}</p>
                          <p className="text-xs text-slate-400 mt-0.5">BP: {payload.vitals.bp}</p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>

                {/* What to do */}
                <div className="bg-green-50/50 rounded-2xl border border-green-100 p-6 shadow-sm flex flex-col">
                  <h3 className="font-bold text-green-900 text-base mb-4 flex items-center gap-2">
                    <span className="text-green-600 text-lg">💡</span>
                    {isHindi ? "क्या करें?" : "What should you do?"}
                  </h3>
                  <div className="flex-1 bg-white rounded-xl p-4 border border-green-50 shadow-sm text-sm text-slate-700 leading-relaxed font-medium">
                    {result.advice}
                  </div>
                  <div className="mt-4 flex items-start gap-2 text-xs text-green-400/80 font-medium">
                    <span className="mt-0.5 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </span>
                    <p>{result.disclaimer || (isHindi ? "यह कोई चिकित्सा निदान नहीं है। कृपया डॉक्टर से मिलें।" : "This is not a medical diagnosis. Please consult a doctor.")}</p>
                  </div>
                </div>

              </div>

              {/* Nearest PHC / Hospital suggestion for High Risk results */}
              {riskLevel === "High" && <NearestFacilities isHindi={isHindi} />}
            </div>

            {/* Right: Screening summary profile */}
            <div className="lg:w-64 flex flex-col items-center gap-4 flex-shrink-0">
              
              <div className="w-full bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isHindi ? "रोगी" : "Patient"}</p>
                    <p className="font-bold text-slate-800">
                      {payload?.screenedFor === "self" ? (isHindi ? "स्वयं" : "Myself") : (payload?.name || (isHindi ? "अन्य" : "Other"))}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{isHindi ? "उम्र व लिंग" : "Age & Gender"}</p>
                    <p className="font-bold text-slate-700 text-sm bg-white px-3 py-2 rounded-lg border border-slate-100">
                      {payload?.age} {isHindi ? "वर्ष" : "yrs"} • {payload?.gender}
                    </p>
                  </div>
                  
                  {(payload?.vitals?.bp || payload?.vitals?.sugar) && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-1">{isHindi ? "वाइटल्स" : "Vitals"}</p>
                      <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-2">
                        {payload?.vitals?.bp && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-medium">BP</span>
                            <span className="text-sm font-bold text-slate-800">{payload.vitals.bp}</span>
                          </div>
                        )}
                        {payload?.vitals?.sugar && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-medium">Sugar</span>
                            <span className="text-sm font-bold text-slate-800">{payload.vitals.sugar}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate("/screen")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                {isHindi ? "नई जांच शुरू करें" : "Start New Screening"}
              </button>
              
              {result.recordId && (
                <a
                 href={`${API_BASE}/api/v1/${result.recordId}/summary?deviceId=${getDeviceId()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  {isHindi ? "PDF डाउनलोड करें" : "Download PDF"}
                </a>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
