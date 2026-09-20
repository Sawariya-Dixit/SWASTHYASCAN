import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { getDeviceId } from "../deviceId";
import strings from "../i18n";
import { getSymptomIcon } from "../utils/symptomsApi";
import RiskTrendChart from "../components/RiskTrendChart";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/+$/, "");

const riskBadge = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs",
  Medium: "bg-amber-50 text-amber-700 border-amber-300 shadow-2xs",
  High: "bg-rose-50 text-rose-700 border-rose-300 shadow-2xs",
  Urgent: "bg-red-600 text-white border-red-700 shadow-sm",
};

const riskLeftBorder = {
  Low: "border-l-emerald-500",
  Medium: "border-l-amber-500",
  High: "border-l-rose-500",
  Urgent: "border-l-red-600",
};

function DetailModal({ record, onClose, lang }) {
  const isHindi = lang === "hi";
  const risk = record.isUrgent ? "Urgent" : record.aiResult?.riskLevel || "Low";
  const symptoms = record.symptoms || [];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            onClick={onClose}
            className="text-xs sm:text-sm font-bold text-slate-500 hover:text-green-600 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{isHindi ? "वापस जाएं" : "Back to History"}</span>
          </button>
          <span className={`px-3 py-1 rounded-full border text-xs font-extrabold uppercase ${riskBadge[risk] || riskBadge.Low}`}>
            {risk}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            {isHindi ? "स्क्रीनिंग रिपोर्ट विवरण" : "Screening Report Details"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(record.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="w-8 h-8 bg-green-100 text-green-700 rounded-xl flex items-center justify-center font-bold shrink-0">
            👤
          </div>
          <div>
            <span className="font-extrabold">
              {record.screenedFor === "self" ? (isHindi ? "स्वयं (Myself)" : "Myself") : record.name}
            </span>
            <span className="text-slate-400 text-xs ml-2">
              ({record.age}y • {record.gender})
            </span>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📋</span>
            <span>{isHindi ? "जांचे गए लक्षण" : "Symptoms Checked"}</span>
            <span className="text-slate-300 font-normal">({symptoms.length})</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {symptoms.map((s, i) => (
              <span
                key={i}
                className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
              >
                <span>{getSymptomIcon(s)}</span>
                <span>{strings[lang]?.symptoms?.[s] || s}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Vitals */}
        {(record.vitals?.bp || record.vitals?.sugar) && (
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🩺</span>
              <span>{isHindi ? "वाइटल्स" : "Recorded Vitals"}</span>
            </h3>
            <div className="flex gap-2.5 text-xs">
              {record.vitals?.bp && (
                <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-600">
                  BP: <span className="font-extrabold text-slate-900">{record.vitals.bp}</span>
                </span>
              )}
              {record.vitals?.sugar && (
                <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-600">
                  Sugar: <span className="font-extrabold text-slate-900">{record.vitals.sugar}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-4">
          <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>🤖</span>
            <span>{isHindi ? "AI जोखिम विश्लेषण" : "AI Risk Assessment"}</span>
          </h3>
          <ul className="space-y-1.5 mt-2">
            {record.aiResult?.factors?.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                <span className="text-emerald-500 shrink-0">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Advice */}
        {record.aiResult?.advice && (
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
              {isHindi ? "स्वास्थ्य सलाह" : "Recommended Advice"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {record.aiResult.advice}
            </p>
          </div>
        )}

        {/* PDF Download Button */}
        {/* PDF Download Button */}
<div className="pt-2">
  <button
    onClick={() => {
      const url = `${API_BASE}/api/v1/${record._id}/summary?deviceId=${getDeviceId()}`;
      const link = document.createElement("a");
      link.href = url;
      link.rel = "noopener noreferrer";
      // target="_blank" hataya -> naya tab/blank flash nahi aayega
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}
    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:-translate-y-0.5 text-xs cursor-pointer"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    <span>{isHindi ? "पूरी PDF रिपोर्ट डाउनलोड करें" : "Download Full PDF Report"}</span>
  </button>
</div>
      </div>
    </div>
  );
}

export default function History({ _t, lang }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Search & Filters (Direct name search without separate member pills)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [cardFocusedPerson, setCardFocusedPerson] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const isHindi = lang === "hi";

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/v1/history?deviceId=${getDeviceId()}`)
      .then((res) => setRecords(res.data.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  // Filtered & Sorted Screenings List
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        const risk = r.isUrgent ? "Urgent" : r.aiResult?.riskLevel || "Low";

        // Filter by Risk Level Pill
        if (selectedRisk !== "all" && risk.toLowerCase() !== selectedRisk.toLowerCase()) {
          return false;
        }

        // Search match: directly by patient name, symptoms (en/hi), vitals, date
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const pName = (
            r.screenedFor === "self"
              ? isHindi
                ? "स्वयं myself"
                : "myself"
              : r.name || ""
          ).toLowerCase();
          const syms = (r.symptoms || [])
            .map((s) => `${s} ${strings.en?.symptoms?.[s] || ""} ${strings.hi?.symptoms?.[s] || ""}`.toLowerCase())
            .join(" ");
          const vitals = `${r.vitals?.bp || ""} ${r.vitals?.sugar || ""}`.toLowerCase();
          const dStr = new Date(r.createdAt).toLocaleDateString().toLowerCase();

          const combined = `${pName} ${syms} ${vitals} ${dStr} ${risk.toLowerCase()}`;
          if (!combined.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const tA = new Date(a.createdAt).getTime();
        const tB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? tB - tA : tA - tB;
      });
  }, [records, selectedRisk, searchTerm, sortOrder, isHindi]);

  // Smart Active Graph Person Resolver:
  // Directly resolves the graph based on the name searched or card clicked!
  const activeGraphPerson = useMemo(() => {
    // 1. If user typed a search term matching a patient name
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      if ("myself".includes(q) || "स्वयं".includes(q)) {
        return "self";
      }
      // Check if matches any record's name
      const matchedRecord = records.find(
        (r) => r.screenedFor === "other" && r.name && r.name.toLowerCase().includes(q)
      );
      if (matchedRecord) {
        return matchedRecord.name;
      }
    }

    // 2. If filtered records all belong to a single person
    if (filteredRecords.length > 0) {
      const firstId = filteredRecords[0].screenedFor === "self" ? "self" : filteredRecords[0].name;
      const allSame = filteredRecords.every(
        (r) => (r.screenedFor === "self" ? "self" : r.name) === firstId
      );
      if (allSame) return firstId;
    }

    // 3. If user clicked a specific card
    if (cardFocusedPerson) {
      return cardFocusedPerson;
    }

    return "all";
  }, [searchTerm, records, filteredRecords, cardFocusedPerson]);

  const clearAllFilters = () => {
    setSelectedRisk("all");
    setSearchTerm("");
    setSortOrder("desc");
    setCardFocusedPerson(null);
  };

  const hasActiveFilters =
    selectedRisk !== "all" ||
    searchTerm.trim() !== "" ||
    sortOrder !== "desc";

  // Helper to trigger browser download using Blob and ObjectURL
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // 1-Click Excel (.csv spreadsheet) Export
  const handleExportExcel = () => {
    const list = filteredRecords.length > 0 ? filteredRecords : records;
    if (list.length === 0) return;

    const headers = [
      "Sr No",
      "Date",
      "Time",
      "Patient Name",
      "Category",
      "Age",
      "Gender",
      "Risk Level",
      "Symptoms",
      "Blood Pressure",
      "Sugar",
      "AI Risk Factors",
      "Health Advice"
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map((r, i) => {
      const d = new Date(r.createdAt);
      const dateStr = d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      const timeStr = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      });
      const pName = r.screenedFor === "self" ? (isHindi ? "स्वयं (Myself)" : "Myself") : r.name || "N/A";
      const cat = r.screenedFor === "self" ? "Self" : "Other Member";
      const risk = r.isUrgent ? "Urgent" : r.aiResult?.riskLevel || "Low";
      const syms = (r.symptoms || [])
        .map((s) => (strings[lang]?.symptoms?.[s] ? `${strings[lang].symptoms[s]} (${s})` : s))
        .join("; ");
      const bp = r.vitals?.bp || "N/A";
      const sugar = r.vitals?.sugar ? `${r.vitals.sugar} mg/dL` : "N/A";
      const factors = (r.aiResult?.factors || []).join("; ") || "None";
      const advice = r.aiResult?.advice || "N/A";

      return [
        i + 1,
        dateStr,
        timeStr,
        pName,
        cat,
        r.age || "N/A",
        r.gender || "N/A",
        risk,
        syms,
        bp,
        sugar,
        factors,
        advice
      ].map(escapeCSV).join(",");
    });

    // \uFEFF Byte Order Mark allows MS Excel & Google Sheets to display Hindi Unicode characters without corruption
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const dateStamp = new Date().toISOString().slice(0, 10);
    downloadFile(csvContent, `SwasthyaScan-HealthRecords-${dateStamp}.csv`, "text/csv;charset=utf-8;");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center">
      {/* Background glowing orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-green-300/25 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        
        {/* Top Header Bar */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-green-100/90 p-5 sm:p-6 shadow-xl shadow-green-900/5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-2xl shadow-md shadow-green-600/25 shrink-0">
              📋
            </span>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold mb-1 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {isHindi ? "डिजिटल स्वास्थ्य रिकॉर्ड्स" : "Health Records & Insights"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                {isHindi ? (
                  <>स्क्रीनिंग इतिहास <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">व स्वास्थ्य डैशबोर्ड</span></>
                ) : (
                  <>Screening History <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">& Health Dashboard</span></>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {isHindi
                  ? "मरीज़ का नाम सीधे सर्च बार में खोजें और उसका स्वास्थ्य जोखिम ट्रेंड ग्राफ दाईं तरफ देखें।"
                  : "Search directly by patient name to see their screenings and real-time trend graph."}
              </p>
            </div>
          </div>

          {/* Direct 1-Click Excel Export Button */}
          <button
            onClick={handleExportExcel}
            disabled={records.length === 0}
            className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl px-4 py-2.5 transition-all shadow-md shadow-green-600/20 hover:shadow-green-600/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 shrink-0 self-start sm:self-auto cursor-pointer"
            title={isHindi ? "इतिहास डाउनलोड करें" : "Download History"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>
              {exportSuccess
                ? (isHindi ? "✓ डाउनलोड हो गया!" : "✓ Downloaded!")
                : (isHindi ? "इतिहास डाउनलोड करें" : "Download History")}
            </span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* COMPACT HORIZONTAL TOOLBAR: Search + Risk Filters + Newest/Oldest Sort */}
        {/* ==================================================================== */}
        {!loading && records.length > 0 && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-green-100/90 p-3 sm:p-3.5 shadow-sm shadow-green-900/5 mb-6 flex items-center justify-between gap-3 flex-wrap">
            
            {/* Left side: Direct Search Bar + Risk Pills + Newest/Oldest Sort */}
            <div className="flex items-center gap-3 flex-wrap flex-1">
              
              {/* Direct Name & Symptom Search Bar */}
              <div className="relative w-60 sm:w-72 shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isHindi
                      ? "मरीज़ का नाम (उदा. रमेश, स्वयं) या लक्षण..."
                      : "Search patient name (e.g. Ramesh, Myself)..."
                  }
                  className="w-full bg-green-50/30 border border-green-200/80 rounded-xl pl-8 pr-7 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white shadow-2xs placeholder:text-slate-400 text-slate-800 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="h-5 w-[1px] bg-green-200/80 shrink-0 hidden md:block"></div>

              {/* Risk Level Pills */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-bold text-green-700/80 uppercase tracking-wider hidden lg:inline mr-0.5">
                  {isHindi ? "जोखिम:" : "Risk:"}
                </span>
                {[
                  { id: "all", label: isHindi ? "सभी" : "All", activeBg: "bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/20" },
                  { id: "Low", label: isHindi ? "कम" : "Low", activeBg: "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20" },
                  { id: "Medium", label: isHindi ? "मध्यम" : "Medium", activeBg: "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20" },
                  { id: "High", label: isHindi ? "उच्च" : "High", activeBg: "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20" },
                  { id: "Urgent", label: isHindi ? "तत्काल" : "Urgent", activeBg: "bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20" },
                ].map((btn) => {
                  const active = selectedRisk === btn.id;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => setSelectedRisk(btn.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        active
                          ? btn.activeBg
                          : "bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50/40"
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-5 w-[1px] bg-green-200/80 shrink-0 hidden md:block"></div>

              {/* Newest / Oldest Sort Button placed directly with filters */}
              <button
                onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  sortOrder === "asc"
                    ? "bg-green-50 text-green-700 border-green-300 shadow-2xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50/40 shadow-2xs"
                }`}
                title={isHindi ? "तारीख के अनुसार क्रम बदलें" : "Toggle sort order"}
              >
                <span>{sortOrder === "desc" ? "⬇️" : "⬆️"}</span>
                <span>
                  {sortOrder === "desc"
                    ? isHindi
                      ? "नवीनतम (Newest)"
                      : "Newest"
                    : isHindi
                    ? "पुराना (Oldest)"
                    : "Oldest"}
                </span>
              </button>

              {/* Clear Reset Button placed right next to Newest/Oldest */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                  title={isHindi ? "सभी फ़िल्टर हटाएं" : "Clear all filters"}
                >
                  <span>✕</span>
                  <span>{isHindi ? "रीसेट" : "Reset"}</span>
                </button>
              )}
            </div>

            {/* Right side controls: Active target tag */}
            {activeGraphPerson !== "all" && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200/90 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 shadow-2xs">
                  <span>🎯</span>
                  <span>
                    {isHindi
                      ? `ग्राफ: ${activeGraphPerson === "self" ? "स्वयं" : activeGraphPerson}`
                      : `Graph: ${activeGraphPerson === "self" ? "Myself" : activeGraphPerson}`}
                  </span>
                </span>
              </div>
            )}

          </div>
        )}

        {/* ==================================================================== */}
        {/* MAIN 2-COLUMN SPLIT: On mobile, Graph on Top (order-1), List Below (order-2) */}
        {/* On desktop (lg): List on Left (lg:order-1), Graph on Right (lg:order-2) */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SCREENINGS LIST: order-2 on mobile (bottom), lg:order-1 on desktop (left) */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-green-500 gap-3 bg-white rounded-3xl border border-slate-200/80">
                <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xs font-bold text-slate-500">{isHindi ? "लोड हो रहा है..." : "Loading records..."}</p>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                  📂
                </div>
                <p className="text-base font-bold text-slate-700">
                  {isHindi ? "कोई पिछली जांच नहीं मिली।" : "No past screenings found."}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  {isHindi ? "जांच करने के बाद वे यहां दिखाई देंगी।" : "Screening reports will appear here once submitted."}
                </p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6">
                <p className="text-sm font-bold text-slate-700 mb-1">
                  {isHindi ? "कोई मेल खाने वाली जांच नहीं मिली" : "No matching screening records"}
                </p>
                <p className="text-xs text-slate-400 mb-4 font-medium">
                  {isHindi ? "कृपया अपनी खोज या फ़िल्टर हटाकर दोबारा देखें।" : "Try adjusting your search terms or clearing active filters."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {isHindi ? "सभी फ़िल्टर हटाएं" : "Clear All Filters"}
                </button>
              </div>
            ) : (
              <div className="max-h-[580px] overflow-y-auto pr-1.5 space-y-3 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-green-300/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-green-500 transition-colors">
                {filteredRecords.map((r) => {
                  const risk = r.isUrgent ? "Urgent" : r.aiResult?.riskLevel || "Low";
                  const borderClass = riskLeftBorder[risk] || riskLeftBorder.Low;
                  const personKey = r.screenedFor === "self" ? "self" : r.name;
                  const isFocusedInGraph = activeGraphPerson === personKey;

                  return (
                    <div
                      key={r._id}
                      onClick={() => {
                        setCardFocusedPerson(personKey);
                      }}
                      className={`bg-white/95 backdrop-blur-sm rounded-2xl border ${
                        isFocusedInGraph ? "border-green-400 ring-2 ring-green-500/20 shadow-md shadow-green-900/5 bg-green-50/15" : "border-green-100/90 hover:border-green-300 shadow-xs hover:shadow-md hover:shadow-green-900/5"
                      } border-l-4 ${borderClass} p-4 sm:p-4.5 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
                    >
                      {/* Left: Patient Name, Date, Symptoms & Vitals */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-7 h-7 rounded-lg bg-green-50 border border-green-200/80 text-green-700 flex items-center justify-center text-xs shadow-2xs font-bold">
                            {r.screenedFor === "self" ? "👤" : "🧑"}
                          </span>
                          <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                            {r.screenedFor === "self" ? (isHindi ? "स्वयं (Myself)" : "Myself") : r.name}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            ({r.age}y • {r.gender})
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-400">
                            {new Date(r.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Symptoms Tags */}
                        {r.symptoms?.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            {r.symptoms.slice(0, 3).map((s, i) => (
                              <span
                                key={i}
                                className="bg-green-50/70 border border-green-200/70 text-green-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                              >
                                <span>{getSymptomIcon(s)}</span>
                                <span>{strings[lang]?.symptoms?.[s] || s}</span>
                              </span>
                            ))}
                            {r.symptoms.length > 3 && (
                              <span className="text-[10px] text-green-600/80 font-bold">
                                +{r.symptoms.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Vitals */}
                        {(r.vitals?.bp || r.vitals?.sugar) && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-0.5">
                            <span>🩺</span>
                            {r.vitals?.bp && <span>BP: <strong className="text-slate-700">{r.vitals.bp}</strong></span>}
                            {r.vitals?.bp && r.vitals?.sugar && <span>•</span>}
                            {r.vitals?.sugar && <span>Sugar: <strong className="text-slate-700">{r.vitals.sugar}</strong></span>}
                          </div>
                        )}
                      </div>

                      {/* Right: Risk Badge & View Details Action */}
                      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-slate-100 pt-2.5 sm:pt-0 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-extrabold uppercase tracking-wider ${riskBadge[risk] || riskBadge.Low}`}>
                          {risk}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r);
                            setCardFocusedPerson(personKey);
                          }}
                          className="text-xs font-bold text-green-700 hover:text-white bg-green-50 hover:bg-green-600 border border-green-200 hover:border-green-600 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs hover:shadow-green-600/20 hover:-translate-y-0.5"
                        >
                          <span>{isHindi ? "विवरण देखें" : "Details"}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* GRAPH CARD: order-1 on mobile (top), lg:order-2 on desktop (right) */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-6 self-start">
            {!loading && records.length > 0 ? (
              <RiskTrendChart
                records={records}
                activePerson={activeGraphPerson}
                lang={lang}
                isHindi={isHindi}
                onSelectRecord={setSelected}
              />
            ) : null}
          </div>

        </div>
      </div>

      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} lang={lang} />}
    </div>
  );
}
