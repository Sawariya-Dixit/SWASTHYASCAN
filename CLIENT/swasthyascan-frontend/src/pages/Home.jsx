


import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    en: "Simple to use", hi: "सरल उपयोग के लिए"
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
      </svg>
    ),
    en: "Bilingual (Hindi / English)", hi: "द्विभाषी (हिंदी / English)"
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    en: "AI-assisted risk assessment", hi: "AI-सहायित जोखिम आकलन"
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">

        {/* Left content */}
        <div className="flex-1 lg:max-w-[48%]">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-5">
            {isHindi ? (
              <>आपका स्वास्थ्य,<br /><span className="text-teal-600">एक सरल स्कैन में।</span></>
            ) : (
              <>Your Health,<br /><span className="text-teal-600">One Simple Scan.</span></>
            )}
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
            {isHindi
              ? "अपने लक्षणों और मूलभूत संकेतों की जाँच करें ताकि समय पर स्वास्थ्य जोखिम का पता चल सके।"
              : "Check your symptoms and basic vitals for an early health risk signal."}
          </p>

          <button
            onClick={() => navigate("/screen")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition shadow-md"
          >
            {isHindi ? "स्वास्थ्य जांच शुरू करें →" : "Start Health Screening →"}
          </button>

          <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-10">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <span>{isHindi ? f.hi : f.en}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-8 text-xs text-gray-400">
            <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span>
              {isHindi
                ? "AI-संचालित प्रारंभिक स्वास्थ्य स्क्रीनिंग  |  यह कोई चिकित्सा निदान नहीं है।"
                : "AI-powered preliminary screening  |  Not a medical diagnosis."}
            </span>
          </div>
        </div>

        {/* Right — Illustration */}
        <div className="flex-shrink-0 w-full lg:w-[52%] flex justify-center lg:justify-end overflow-visible">
          <img
            src="/image.png"
            alt="Health illustration"
            className="w-full max-w-[900px] h-auto object-contain scale-[1.5] -translate-x-24 translate-y-6 lg:-translate-x-28 lg:translate-y-0"
          />
        </div>
      </div>
    </div>
  );
}