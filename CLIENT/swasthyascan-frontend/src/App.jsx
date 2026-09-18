import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Result from "./pages/Result";
import History from "./pages/History";
import SymptomForm from "./components/SymptomForm";
import strings from "./i18n";

export default function App() {
  const [lang, setLang] = useState("en");
  const t = strings[lang];

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar lang={lang} setLang={setLang} t={t} />
        <Routes>
          <Route path="/" element={<Home lang={lang} t={t} />} />
          <Route path="/screen" element={<SymptomForm lang={lang} t={t} />} />
          <Route path="/result" element={<Result t={t} />} />
          <Route path="/history" element={<History t={t} lang={lang} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
