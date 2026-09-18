import { useLocation, useNavigate } from "react-router-dom";

const riskConfig = {
  Low:    { bg: "bg-green-50",  border: "border-green-200",  icon: "✅", iconBg: "bg-green-100",  text: "text-green-700",  label: "LOW RISK" },
  Medium: { bg: "bg-yellow-50", border: "border-yellow-200", icon: "⚠️", iconBg: "bg-yellow-100", text: "text-yellow-700", label: "MEDIUM RISK" },
  High:   { bg: "bg-red-50",    border: "border-red-200",    icon: "🔴", iconBg: "bg-red-100",    text: "text-red-700",   label: "HIGH RISK" },
  Urgent: { bg: "bg-red-50",    border: "border-red-300",    icon: "🚨", iconBg: "bg-red-100",    text: "text-red-700",   label: "URGENT" },
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
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 space-y-5">
          {/* Warning banner */}
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
              <span>⚠️</span>
              <span>
                {isHindi
                  ? "एक गंभीर लक्षण चुना गया है। कृपया पेशेवर देखभाल में देरी न करें।"
                  : "A potentially serious symptom has been selected. Please do not delay professional care."}
              </span>
            </div>
            <button onClick={() => navigate("/")} className="text-red-400 hover:text-red-600 text-lg">✕</button>
          </div>

          {/* Urgent card */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-3xl">🚨</div>
            <h2 className="text-xl font-extrabold text-red-700 uppercase tracking-wide">
              {isHindi ? "तत्काल चिकित्सा ध्यान" : "URGENT MEDICAL ATTENTION"}
            </h2>
            <p className="text-red-600 text-sm leading-relaxed">
              {result.advice || (isHindi
                ? "सीने में दर्द या सांस लेने में गंभीर तकलीफ जानलेवा हो सकती है। कृपया तुरंत चिकित्सा सहायता लें।"
                : "Chest pain or severe breathlessness can be life-threatening. Please seek immediate medical attention.")}
            </p>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition text-base mt-2"
            >
              📞 {isHindi ? "तत्काल सहायता लें" : "Get Immediate Help"}
            </a>
          </div>

          <button onClick={() => navigate("/")} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← {isHindi ? "पिछले चरण पर वापस जाएं" : "Back to previous step"}
          </button>
        </div>
        </div>
      </div>
    );
  }

  // Normal result dashboard (image 6)
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Risk Header */}
        <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-6 flex flex-col md:flex-row gap-6`}>
          {/* Left: Risk info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 ${cfg.iconBg} rounded-full flex items-center justify-center text-3xl flex-shrink-0`}>
                {cfg.icon}
              </div>
              <div>
                <h2 className={`text-2xl font-extrabold ${cfg.text} uppercase tracking-wide`}>
                  {isHindi
                    ? (riskLevel === "Medium" ? "मध्यम जोखिम" : riskLevel === "High" ? "उच्च जोखिम" : "कम जोखिम")
                    : cfg.label}
                </h2>
                <p className="text-sm text-gray-600 mt-1 max-w-md leading-relaxed">
                  {isHindi
                    ? `आपके परिणाम ${riskLevel === "Medium" ? "मध्यम" : riskLevel === "High" ? "उच्च" : "कम"} जोखिम दर्शाते हैं। नीचे दिए गए विवरण पढ़ें और किसी स्वास्थ्य पेशेवर से परामर्श करें।`
                    : `Your results indicate a ${riskLevel.toLowerCase()} risk based on the symptoms and vitals you provided. Please read the details below and consider consulting a healthcare professional.`}
                </p>
              </div>
            </div>

            {/* Two columns: Why + What to do */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Why this risk */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">
                  {isHindi ? "यह जोखिम क्यों?" : "Why this risk?"}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  {isHindi
                    ? `${result.factors?.length || 0} कारण आपके लक्षणों और वाइटल्स से पाए गए।`
                    : `${result.factors?.length || 0} factors were detected from the symptoms and vitals you provided.`}
                </p>
                <ol className="space-y-2">
                  {result.factors?.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`w-5 h-5 rounded-full ${cfg.iconBg} ${cfg.text} text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5`}>
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-medium">{f}</span>
                        <span className="block text-xs text-gray-400">{isHindi ? "पाया गया लक्षण" : "Detected symptom"}</span>
                      </div>
                    </li>
                  ))}
                  {payload?.vitals?.bp && (
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`w-5 h-5 rounded-full ${cfg.iconBg} ${cfg.text} text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5`}>
                        {(result.factors?.length || 0) + 1}
                      </span>
                      <div>
                        <span className="font-medium">{isHindi ? "ऊंचा रक्तचाप" : "Elevated blood pressure"}</span>
                        <span className="block text-xs text-gray-400">BP: {payload.vitals.bp} (optional)</span>
                      </div>
                    </li>
                  )}
                </ol>
              </div>

              {/* What to do */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5">
                  <span className="text-teal-600 text-base">💡</span>
                  {isHindi ? "क्या करें?" : "What should you do?"}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{result.advice}</p>
                <p className="text-xs text-gray-400 mt-3 flex items-start gap-1">
                  <span className="mt-0.5">ℹ️</span>
                  <span>{result.disclaimer || (isHindi ? "यह कोई चिकित्सा निदान नहीं है। कृपया डॉक्टर से मिलें।" : "This is not a medical diagnosis. Please consult a doctor.")}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Screening summary + illustration */}
          <div className="md:w-44 flex flex-col items-center gap-3 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 w-full text-sm space-y-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {isHindi ? "किसके लिए स्क्रीनिंग" : "Screening for"}
              </p>
              <p className="font-semibold text-gray-700 flex items-center gap-1">
                👤 {payload?.screenedFor === "self" ? (isHindi ? "स्वयं" : "Myself") : (payload?.name || (isHindi ? "अन्य" : "Other"))}
              </p>
              <p className="text-xs text-gray-500">
                {isHindi ? "उम्र / लिंग" : "Age / Gender"}<br />
                <span className="font-medium text-gray-700">{payload?.age} {isHindi ? "वर्ष" : "years"} / {payload?.gender}</span>
              </p>
              {payload?.vitals?.bp && <p className="text-xs text-gray-500">BP: <span className="font-medium text-gray-700">{payload.vitals.bp}</span></p>}
              {payload?.vitals?.sugar && <p className="text-xs text-gray-500">Sugar: <span className="font-medium text-gray-700">{payload.vitals.sugar}</span></p>}
            </div>

            {/* Small illustration */}
            <div className="w-32 h-32 bg-gradient-to-b from-sky-100 to-green-100 rounded-xl flex items-end justify-center overflow-hidden">
              <svg viewBox="0 0 80 90" className="w-24 h-24" fill="none">
                <ellipse cx="40" cy="86" rx="30" ry="5" fill="#86efac" opacity="0.5"/>
                <rect x="28" y="48" width="24" height="32" fill="#ccfbf1" rx="4"/>
                <circle cx="40" cy="38" r="12" fill="#fde68a"/>
                <path d="M28 34 Q40 24 52 34" fill="#1e293b"/>
                <path d="M35 43 Q40 47 45 43" stroke="#92400e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <circle cx="36" cy="38" r="1.5" fill="#1e293b"/>
                <circle cx="44" cy="38" r="1.5" fill="#1e293b"/>
                <path d="M34 58 Q32 65 36 67 Q40 69 44 65 Q46 62 44 58" stroke="#0f766e" strokeWidth="1.5" fill="none"/>
                <circle cx="44" cy="65" r="2.5" fill="#0f766e"/>
              </svg>
            </div>
            <p className="text-xs text-center text-gray-400 leading-snug">{isHindi ? "बेहतर जागरूकता। स्वस्थ समुदाय।" : "Better awareness. Healthier communities."}</p>
          </div>
        </div>

        {/* New Screening Button */}
        <button
          onClick={() => navigate("/screen")}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition text-base"
        >
          {isHindi ? "नई जांच शुरू करें" : "Start New Screening"}
        </button>
      </div>
    </div>
  );
}
