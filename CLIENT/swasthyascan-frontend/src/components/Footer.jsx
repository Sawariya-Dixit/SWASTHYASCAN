import { Link } from "react-router-dom";

export default function Footer({ lang }) {
  const isHindi = lang === "hi";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto relative overflow-hidden">
      {/* Top green-to-emerald gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500"></div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* 3-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5 group inline-flex">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-green-600/30 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21C12 21 4 13.5 4 8a8 8 0 0116 0c0 5.5-8 13-8 13z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 10h6M12 7v6" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Swasthya<span className="text-emerald-400">Scan</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isHindi
                ? "ग्रामीण व वंचित समुदायों के लिए AI-संचालित प्राथमिक स्वास्थ्य जोखिम स्क्रीनिंग। समय पर संकेत, सुरक्षित जीवन।"
                : "AI-assisted early health risk screening designed for rural & underserved communities. Timely signals, safer lives."}
            </p>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{isHindi ? "सामुदायिक स्वास्थ्य मिशन" : "Community Health Mission"}</span>
            </div>
          </div>

          {/* Col 2: Navigation & Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {isHindi ? "त्वरित लिंक व सेवाएं" : "Quick Links & Services"}
            </h4>

            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" onClick={scrollToTop} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">→</span>
                  <span>{isHindi ? "मुख्य पृष्ठ (Home)" : "Home Page"}</span>
                </Link>
              </li>
              <li>
                <Link to="/screen" onClick={scrollToTop} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">→</span>
                  <span>{isHindi ? "स्वास्थ्य जांच शुरू करें (Screening)" : "Start Health Screening"}</span>
                </Link>
              </li>
              <li>
                <Link to="/history" onClick={scrollToTop} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">→</span>
                  <span>{isHindi ? "स्क्रीनिंग इतिहास व डैशबोर्ड" : "Screening History & Dashboard"}</span>
                </Link>
              </li>
            </ul>

            <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1">
              <span>⚡</span>
              <span>{isHindi ? "आवाज द्वारा लक्षण • GPS अस्पताल खोज • Excel रिपोर्ट" : "Voice Input • Hospital Locator • Excel Reports"}</span>
            </div>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              {isHindi ? "24x7 आपातकालीन हेल्पलाइन" : "24x7 Emergency Helplines"}
            </h4>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <a
                href="tel:108"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/80 hover:border-rose-700/60 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🚑</span>
                  <span className="font-semibold text-white group-hover:text-rose-400 transition-colors">
                    {isHindi ? "एम्बुलेंस सेवा" : "National Ambulance"}
                  </span>
                </div>
                <span className="font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  108
                </span>
              </a>

              <a
                href="tel:1075"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700/80 hover:border-emerald-700/60 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📞</span>
                  <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {isHindi ? "राष्ट्रीय स्वास्थ्य हेल्पलाइन" : "Health Helpline"}
                  </span>
                </div>
                <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  1075
                </span>
              </a>

              <a
                href="tel:104"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-blue-950/40 border border-slate-700/80 hover:border-blue-700/60 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🩺</span>
                  <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {isHindi ? "चिकित्सा परामर्श" : "Medical Advice"}
                  </span>
                </div>
                <span className="font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                  104
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5 mb-5">
          <span className="text-amber-400 text-sm shrink-0">⚠️</span>
          <p className="leading-relaxed">
            <strong className="text-slate-300 font-semibold">{isHindi ? "चिकित्सीय अस्वीकरण: " : "Medical Disclaimer: "}</strong>
            {isHindi
              ? "SwasthyaScan एक AI-सहायित प्राथमिक स्क्रीनिंग उपकरण है और यह डॉक्टर के निदान का विकल्प नहीं है। आपातकाल में तुरंत 108 पर कॉल करें।"
              : "SwasthyaScan is an AI-assisted preliminary screening tool, not a replacement for professional medical diagnosis. In emergencies, dial 108."}
          </p>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} SwasthyaScan. {isHindi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>{isHindi ? "भारत में स्वास्थ्य सशक्तिकरण हेतु समर्पित" : "Dedicated to Community Healthcare Empowerment"}</span>
            <span>🇮🇳</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
