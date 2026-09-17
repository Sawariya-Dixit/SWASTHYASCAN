import { Link, useLocation } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";

export default function Navbar({ lang, setLang, t }) {
  const { pathname } = useLocation();
  const linkClass = (path) =>
    `text-sm font-medium transition ${pathname === path ? "text-green-700 underline underline-offset-4" : "text-gray-600 hover:text-green-700"}`;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          <span className="font-bold text-green-700 text-lg">{t.appName}</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/" className={linkClass("/")}>{t.home}</Link>
          <Link to="/history" className={linkClass("/history")}>{t.history}</Link>
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </nav>
  );
}
