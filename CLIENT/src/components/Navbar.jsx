import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ lang, setLang, t }) {
  const { pathname } = useLocation();
  const active = (path) => pathname === path;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md shadow-green-600/20 group-hover:shadow-green-600/40 group-hover:scale-105 transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 text-white" stroke="currentColor" strokeWidth="2">
                <path d="M12 21C12 21 4 13.5 4 8a8 8 0 0116 0c0 5.5-8 13-8 13z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10h6M12 7v6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight">Swasthya<span className="text-green-600">Scan</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`text-sm font-bold transition-all relative ${active("/") ? "text-green-600" : "text-slate-500 hover:text-green-600"}`}
            >
              {t.home}
              {active("/") && <span className="absolute -bottom-5 left-0 w-full h-1 bg-green-600 rounded-t-full"></span>}
            </Link>
            <Link
              to="/history"
              className={`text-sm font-bold transition-all relative ${active("/history") ? "text-green-600" : "text-slate-500 hover:text-green-600"}`}
            >
              {t.history}
              {active("/history") && <span className="absolute -bottom-5 left-0 w-full h-1 bg-green-600 rounded-t-full"></span>}
            </Link>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/50">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang === "en" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang === "hi" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                हिं
              </button>
            </div>


          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-green-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 py-4 space-y-4 absolute w-full shadow-lg animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-bold ${active("/") ? "bg-green-50 text-green-600" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {t.home}
          </Link>
          <Link
            to="/history"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-bold ${active("/history") ? "bg-green-50 text-green-600" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {t.history}
          </Link>
          
          <div className="px-4 py-3 border-t border-slate-100 mt-2 pt-4">
            <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-lg">
              <button
                onClick={() => { setLang("en"); setIsMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${lang === "en" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"}`}
              >
                English
              </button>
              <button
                onClick={() => { setLang("hi"); setIsMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${lang === "hi" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"}`}
              >
                हिंदी
              </button>
            </div>


          </div>
        </div>
      )}
    </nav>
  );
}
