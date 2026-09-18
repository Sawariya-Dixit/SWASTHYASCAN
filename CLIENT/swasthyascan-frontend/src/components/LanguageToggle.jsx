export default function LanguageToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="px-3 py-1 rounded-full border border-emerald-600 text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition"
    >
      {lang === "en" ? "हिंदी" : "English"}
    </button>
  );
}
