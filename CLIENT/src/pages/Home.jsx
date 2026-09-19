import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const features = [
  {
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
    borderHover: "hover:border-emerald-400",
    route: "/screen",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
      </svg>
    ),
    tagEn: "Voice AI",
    tagHi: "वॉयस इनपुट",
    titleEn: "Voice & Touch Input",
    titleHi: "बोलकर या चुनकर लक्षण बताएं",
    descEn: "Speak symptoms naturally in Hindi or English, or tap through our smart checklist.",
    descHi: "माइक से अपनी आम भाषा में लक्षण बोलें या सुगम चेकबॉक्स सूची से तुरंत चुनें।",
    actionEn: "Start Basic Info",
    actionHi: "बेसिक जानकारी भरें"
  },
  {
    gradient: "from-green-600 to-emerald-500",
    shadow: "shadow-green-500/25",
    borderHover: "hover:border-green-400",
    route: "/screen",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    tagEn: "AI Triage",
    tagHi: "स्मार्ट AI",
    titleEn: "Instant AI Risk Assessment",
    titleHi: "त्वरित AI जोखिम मूल्यांकन",
    descEn: "Calculates Low, Moderate, or High risk levels in seconds with clinical guidance.",
    descHi: "लक्षणों व वाइटल्स के आधार पर तुरंत सटीक जोखिम स्तर और उचित प्राथमिक सलाह।",
    actionEn: "Open Screening Form",
    actionHi: "जांच फॉर्म खोलें"
  },
  {
    gradient: "from-blue-600 to-teal-500",
    shadow: "shadow-blue-500/25",
    borderHover: "hover:border-blue-400",
    route: "/screen",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    tagEn: "Live GPS",
    tagHi: "GPS मैप्स",
    titleEn: "Nearby Hospitals & Routing",
    titleHi: "निकटतम अस्पताल व नेविगेशन",
    descEn: "Live GPS mapping to find verified clinics within 15-20 km with 1-tap route directions.",
    descHi: "GPS से अपने 15-20 किमी के दायरे में निकटतम अस्पताल खोजें और सीधा रास्ता पाएं।",
    actionEn: "Start Health Screening",
    actionHi: "स्वास्थ्य जांच शुरू करें"
  },
  {
    gradient: "from-teal-600 to-emerald-600",
    shadow: "shadow-teal-500/25",
    borderHover: "hover:border-teal-400",
    route: "/screen",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
      </svg>
    ),
    tagEn: "Visual Analytics",
    tagHi: "ट्रेंड चार्ट",
    titleEn: "Patient Timeline & Graphs",
    titleHi: "मरीज़ का ट्रेंड व डिजिटल इतिहास",
    descEn: "Interactive risk progression charts and timeline history for up to 10 screening visits.",
    descHi: "पिछले 10 स्क्रीनिंग रिकॉर्ड्स का आकर्षक विज़ुअल ग्राफ और स्वास्थ्य सुधार ट्रैकिंग।",
    actionEn: "Start New Screening",
    actionHi: "नया स्क्रीनिंग फॉर्म भरें"
  },
  {
    gradient: "from-amber-500 to-emerald-600",
    shadow: "shadow-amber-500/25",
    borderHover: "hover:border-amber-400",
    route: "/screen",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
    tagEn: "1-Click Export",
    tagHi: "Excel डाउनलोड",
    titleEn: "Instant Excel & PDF Reports",
    titleHi: "1-क्लिक Excel व मेडिकल रिपोर्ट",
    descEn: "Export complete screening summaries formatted with Hindi UTF-8 for doctor visits.",
    descHi: "डॉक्टर परामर्श के लिए पूरी स्वास्थ्य हिस्ट्री को 1-क्लिक में साफ-सुथरे Excel में डाउनलोड करें।",
    actionEn: "Begin Health Scan",
    actionHi: "जांच शुरू करें"
  },
  {
    gradient: "from-emerald-700 to-green-600",
    shadow: "shadow-emerald-600/25",
    borderHover: "hover:border-emerald-500",
    route: "/screen",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    tagEn: "Rural First",
    tagHi: "जन स्वास्थ्य",
    titleEn: "Bilingual & Community First",
    titleHi: "द्विभाषी व जन-कल्याण समर्पित",
    descEn: "Designed for rural clinics with fast lightweight interfaces in Hindi and English.",
    descHi: "ग्रामीण व वंचित क्षेत्रों के लिए अनुकूलित, बिना किसी जटिलता के सरल व सुगम इंटरफ़ेस।",
    actionEn: "Fill Basic Details",
    actionHi: "बेसिक जानकारी भरें"
  }
];

export default function Home({ lang }) {
  const navigate = useNavigate();
  const isHindi = lang === "hi";

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 relative overflow-hidden flex flex-col justify-between w-full">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-green-300/30 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 text-center flex flex-col items-center flex-1 justify-center w-full">
        
        {/* Welcome Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-semibold mb-6 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          {isHindi ? "स्वास्थ्यास्कैन में आपका स्वागत है" : "Welcome to SwasthyaScan"}
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-800 leading-tight tracking-tight mb-5 max-w-4xl">
          {isHindi ? (
            <>आपका स्वास्थ्य,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600">एक सरल स्कैन में।</span></>
          ) : (
            <>Your Health,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600">One Simple Scan.</span></>
          )}
        </h1>
        
        {/* Subtitle */}
        <p className="text-slate-600 text-base md:text-xl mb-9 max-w-2xl leading-relaxed font-normal">
          {isHindi
            ? "अपने लक्षणों और मूलभूत संकेतों की तुरंत जाँच करें ताकि समय रहते स्वास्थ्य जोखिम का पता चल सके।"
            : "Check your symptoms and basic vitals in seconds for an early, actionable health signal."}
        </p>

        {/* Main CTA Button */}
        <button
          onClick={() => navigate("/screen")}
          className="group relative inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-9 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:-translate-y-1 mb-16 overflow-hidden cursor-pointer"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-64 group-hover:h-64 opacity-15"></span>
          <span className="relative flex items-center gap-2.5">
            <span>{isHindi ? "स्वास्थ्य जांच शुरू करें" : "Start Health Screening"}</span>
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </span>
        </button>

        {/* Section Heading for Features */}
        <div className="w-full text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full mb-2.5 shadow-2xs">
            <span>✨</span>
            <span>{isHindi ? "स्वास्थ्यास्कैन की प्रमुख क्षमताएं" : "Platform Capabilities"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {isHindi ? (
              <>हर नागरिक के लिए <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">सरल, तेज़ और विश्वसनीय</span></>
            ) : (
              <>Simple, Fast & Reliable <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">for Everyone</span></>
            )}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            {isHindi
              ? "आधुनिक AI तकनीक और प्राथमिक स्वास्थ्य सेवा का अनूठा संगम, जिससे सही समय पर सही उपचार मिल सके।"
              : "Bridging intelligent AI screening signals with accessible frontline healthcare."}
          </p>
        </div>

        {/* Attractive 6-Card Features Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => navigate("/screen")}
              className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 ${f.borderHover} p-6 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between text-left group cursor-pointer`}
            >
              {/* Top Accent Hover Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Ambient Background Corner Glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl group-hover:bg-emerald-400/25 transition-all duration-300 pointer-events-none"></div>

              <div>
                {/* Top Row: Icon + Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg ${f.shadow} group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}>
                    {f.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100/90 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-700 border border-slate-200/70 group-hover:border-emerald-200 transition-colors">
                    {isHindi ? f.tagHi : f.tagEn}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mb-1.5 leading-snug">
                  {isHindi ? f.titleHi : f.titleEn}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isHindi ? f.descHi : f.descEn}
                </p>
              </div>

              {/* Bottom Action CTA Row */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                <span>{isHindi ? f.actionHi : f.actionEn}</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Balanced Bilingual Footer */}
      <Footer lang={lang} />
    </div>
  );
}
