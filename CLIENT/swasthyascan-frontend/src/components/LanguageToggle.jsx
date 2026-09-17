export default function LanguageToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="px-3 py-1 rounded-full border border-green-600 text-green-700 text-sm font-medium hover:bg-green-50 transition"
    >
      {lang === "en" ? "हिंदी" : "English"}
    </button>
  );
}
