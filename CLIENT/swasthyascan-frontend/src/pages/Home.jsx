import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    en: "Simple to use", hi: "सरल उपयोग के लिए"
  },
  {
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
      </svg>
    ),
    en: "Bilingual (Hindi / English)", hi: "द्विभाषी (हिंदी / English)"
  },
  {
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
      </svg>
    ),
    en: "Voice, Type & Checkbox Input", hi: "बोलकर, टाइप करके या चुनकर लक्षण बताएं"
  },
  {
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    en: "AI-assisted risk assessment", hi: "AI-सहायित जोखिम आकलन"
  },
  {
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
    en: "For rural & underserved communities", hi: "ग्रामीण व वंचित समुदायों के लिए"
  },
];

export default function Home({ lang }) {
  const navigate = useNavigate();
  const isHindi = lang === "hi";

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-green-300/30 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 text-sm font-semibold mb-8 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          {isHindi ? "स्वासथ्य स्कैन में आपका स्वागत है" : "Welcome to SwasthyaScan"}
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-800 leading-tight tracking-tight mb-6 max-w-4xl">
          {isHindi ? (
            <>आपका स्वास्थ्य,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">एक सरल स्कैन में।</span></>
          ) : (
            <>Your Health,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">One Simple Scan.</span></>
          )}
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
          {isHindi
            ? "अपने लक्षणों और मूलभूत संकेतों की जाँच करें ताकि समय पर स्वास्थ्य जोखिम का पता चल सके।"
            : "Check your symptoms and basic vitals for an early health risk signal."}
        </p>

        <button
          onClick={() => navigate("/screen")}
          className="group relative inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-5 rounded-2xl text-lg transition-all shadow-xl shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-1 mb-16 overflow-hidden"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          <span className="relative flex items-center gap-2">
            {isHindi ? "स्वास्थ्य जांच शुरू करें" : "Start Health Screening"}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </span>
        </button>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 rounded-2xl hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                {f.icon}
              </div>
              <span className="font-semibold text-slate-700">{isHindi ? f.hi : f.en}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-16 text-sm text-slate-400 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>
            {isHindi
              ? "AI-संचालित प्रारंभिक स्वास्थ्य स्क्रीनिंग | यह कोई चिकित्सा निदान नहीं है।"
              : "AI-powered preliminary screening | Not a medical diagnosis."}
          </span>
        </div>
      </div>
    </div>
  );
}
