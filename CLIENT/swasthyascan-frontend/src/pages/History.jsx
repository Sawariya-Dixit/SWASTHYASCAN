import { useEffect, useState } from "react";
import axios from "axios";
import { getDeviceId } from "../deviceId";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const riskBadge = {
  Low:    "bg-green-100 text-green-700 border-green-300 shadow-sm shadow-green-100/50",
  Medium: "bg-amber-100 text-amber-700 border-amber-300 shadow-sm shadow-amber-100/50",
  High:   "bg-rose-100 text-rose-700 border-rose-300 shadow-sm shadow-rose-100/50",
  Urgent: "bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-600/30",
};

function DetailModal({ record, onClose, lang }) {
  const isHindi = lang === "hi";
  const risk = record.isUrgent ? "Urgent" : record.aiResult?.riskLevel;
  const symptoms = record.symptoms || [];
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button onClick={onClose} className="text-sm font-bold text-slate-500 hover:text-green-600 flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            {isHindi ? "इतिहास पर वापस" : "Back to History"}
          </button>
          <span className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase ${riskBadge[risk] || riskBadge.Low}`}>
            {risk}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {isHindi ? "स्क्रीनिंग विवरण" : "Screening Details"}
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1">{new Date(record.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <span className="font-bold text-slate-700">{record.screenedFor === "self" ? (isHindi ? "स्वयं" : "Myself") : record.name}</span>
          <span className="text-slate-300">|</span>
          <span className="font-medium text-slate-500">{symptoms.length} {isHindi ? "लक्षण जांचे" : "symptoms checked"}</span>
        </div>

        {/* Symptoms */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-green-500">📋</span> {isHindi ? "लक्षण" : "Symptoms"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s, i) => (
              <span key={i} className="bg-white border border-slate-200 shadow-sm text-slate-600 font-medium text-xs px-3 py-1.5 rounded-lg">{s}</span>
            ))}
          </div>
        </div>

        {/* Vitals */}
        {(record.vitals?.bp || record.vitals?.sugar) && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-green-500">🩺</span> {isHindi ? "वाइटल्स" : "Vitals"}
            </h3>
            <div className="flex gap-3 text-sm text-slate-600">
              {record.vitals?.bp && <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg font-medium text-xs">BP: <span className="font-bold text-slate-800">{record.vitals.bp}</span></span>}
              {record.vitals?.sugar && <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg font-medium text-xs">Sugar: <span className="font-bold text-slate-800">{record.vitals.sugar}</span></span>}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        <div className="bg-green-50/50 rounded-2xl border border-green-100 p-5">
          <h3 className="text-sm font-bold text-green-900 mb-1 flex items-center gap-2">
            <span className="text-green-600">🤖</span> {isHindi ? "AI विश्लेषण" : "AI Analysis"}
          </h3>
          <p className="text-xs font-semibold text-green-400 mb-3 pb-2 border-b border-green-100/50">{isHindi ? "यह जोखिम क्यों?" : "Why this risk?"}</p>
          <ul className="space-y-2">
            {record.aiResult?.factors?.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                <span className="text-green-500 shrink-0 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Advice */}
        {record.aiResult?.advice && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">{isHindi ? "सलाह" : "Advice"}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">{record.aiResult.advice}</p>
          </div>
        )}

        {/* PDF Download Button */}
        <div className="pt-2">
          <a
            href={`${API_BASE}/api/v1/${record._id}/summary`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            {isHindi ? "PDF डाउनलोड करें" : "Download PDF"}
          </a>
        </div>
        {record.aiResult?.disclaimer && (
          <p className="text-xs text-slate-400 font-medium flex items-start gap-1 border-t border-slate-100 pt-4 mt-2">
            <span className="shrink-0 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
            {record.aiResult.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}

export default function History({ t, lang }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const isHindi = lang === "hi";

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/v1/history?deviceId=${getDeviceId()}`)
      .then((res) => setRecords(res.data.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden flex flex-col items-center">
      {/* Background glowing orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-green-300/20 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-300/15 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-900/5 border border-white p-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {isHindi ? "मेरी स्क्रीनिंग इतिहास" : "My Screening History"}
              </h1>
              <p className="text-sm font-medium text-slate-400 mt-2">
                {isHindi ? "अपनी पिछली स्वास्थ्य जांच और परिणाम देखें।" : "View your past health screenings and results."}
              </p>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 hover:bg-green-600 hover:text-white transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              {isHindi ? "इतिहास निर्यात करें" : "Export History"}
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-green-500 gap-3">
              <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-sm font-bold">{isHindi ? "लोड हो रहा है..." : "Loading..."}</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <p className="text-lg font-bold text-slate-700">{isHindi ? "कोई पिछली जांच नहीं मिली।" : "No past screenings found."}</p>
              <p className="text-sm font-medium text-slate-400 mt-1">{isHindi ? "जांच करने के बाद वे यहां दिखाई देंगे।" : "They will appear here once you complete a screening."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((r) => {
                const risk = r.isUrgent ? "Urgent" : r.aiResult?.riskLevel;
                return (
                  <div key={r._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md hover:border-green-100 hover:-translate-y-0.5 transition-all cursor-pointer group" onClick={() => setSelected(r)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400">{new Date(r.createdAt).toLocaleString()}</p>
                        <p className="font-extrabold text-slate-700 text-base mt-0.5">
                          {r.screenedFor === "self" ? (isHindi ? "स्वयं" : "Myself") : r.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {r.symptoms?.length || 0} {isHindi ? "लक्षण जांचे" : "symptoms checked"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <span className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase ${riskBadge[risk] || riskBadge.Low}`}>
                        {risk}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                        className="text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                      >
                        {isHindi ? "विवरण" : "Details"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} lang={lang} />}
    </div>
  );
}
