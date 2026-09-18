import { Link, useLocation } from "react-router-dom";

export default function Navbar({ lang, setLang, t }) {
  const { pathname } = useLocation();
  const active = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
              <path d="M12 21C12 21 4 13.5 4 8a8 8 0 0116 0c0 5.5-8 13-8 13z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 10h6M12 7v6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-teal-700 text-lg">SwasthyaScan</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium pb-1 transition ${active("/") ? "text-teal-700 border-b-2 border-teal-600" : "text-gray-500 hover:text-teal-700"}`}
          >
            {t.home}
          </Link>
          <Link
            to="/history"
            className={`text-sm font-medium pb-1 transition ${active("/history") ? "text-teal-700 border-b-2 border-teal-600" : "text-gray-500 hover:text-teal-700"}`}
          >
            {t.history}
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded transition font-medium ${lang === "en" ? "text-teal-700 font-semibold" : "text-gray-400 hover:text-gray-600"}`}
            >
              English
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setLang("hi")}
              className={`px-2 py-0.5 rounded transition font-medium ${lang === "hi" ? "text-teal-700 font-semibold" : "text-gray-400 hover:text-gray-600"}`}
            >
              हिंदी
            </button>
          </div>

          {/* User Icon */}
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}
