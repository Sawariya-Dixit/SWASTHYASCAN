import SymptomForm from "../components/SymptomForm";

export default function Home({ lang, t }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-green-700">{t.appName}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {lang === "en"
            ? "Free preliminary health screening — not a substitute for a doctor."
            : "निःशुल्क प्रारंभिक स्वास्थ्य जांच — डॉक्टर का विकल्प नहीं।"}
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SymptomForm lang={lang} t={t} />
      </div>
    </div>
  );
}
