import { useEffect, useState } from "react";
import axios from "axios";
import { getDeviceId } from "../deviceId";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const riskBadge = {
  Low:    "bg-green-100 text-green-700 border-green-300",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  High:   "bg-red-100 text-red-700 border-red-300",
  Urgent: "bg-red-600 text-white border-red-700",
};

function DetailModal({ record, onClose, lang }) {
  const isHindi = lang === "hi";
  const risk = record.isUrgent ? "Urgent" : record.aiResult?.riskLevel;
  const symptoms = record.symptoms || [];
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← {isHindi ? "इतिहास पर वापस" : "Back to History"}
          </button>
          <span className={`px-3 py-1 rounded-full border text-xs font-bold ${riskBadge[risk] || riskBadge.Low}`}>
            {risk} Risk
          </span>
        </div>

        <h2 className="text-lg font-bold text-gray-800">
          ← {isHindi ? "स्क्रीनिंग विवरण" : "Screening Details"}
        </h2>

        <p className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleString()}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>👤</span>
          <span>{record.screenedFor === "self" ? (isHindi ? "स्वयं" : "Myself") : record.name}</span>
          <span className="text-gray-300">|</span>
          <span>{symptoms.length} {isHindi ? "लक्षण जांचे" : "symptoms checked"}</span>
        </div>

        {/* Symptoms */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">{isHindi ? "लक्षण" : "Symptoms"}</h3>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* Vitals */}
        {(record.vitals?.bp || record.vitals?.sugar) && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2">{isHindi ? "वाइटल्स" : "Vitals"}</h3>
            <div className="flex gap-4 text-sm text-gray-600">
              {record.vitals?.bp && <span>🩺 BP: {record.vitals.bp}</span>}
              {record.vitals?.sugar && <span>🩸 Sugar: {record.vitals.sugar}</span>}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">{isHindi ? "AI विश्लेषण" : "AI Analysis"}</h3>
          <p className="text-xs text-gray-500 mb-2">{isHindi ? "यह जोखिम क्यों?" : "Why this risk?"}</p>
          <ul className="space-y-1">
            {record.aiResult?.factors?.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-teal-500">✓</span>{f}
              </li>
            ))}
          </ul>
        </div>

        {/* Advice */}
        {record.aiResult?.advice && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-1">{isHindi ? "सलाह" : "Advice"}</h3>
            <p className="text-sm text-gray-600">{record.aiResult.advice}</p>
          </div>
        )}

        {record.aiResult?.disclaimer && (
          <p className="text-xs text-gray-400 flex items-center gap-1 border-t pt-3">
            <span>ℹ️</span>{record.aiResult.disclaimer}
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto px-0 py-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isHindi ? "मेरी स्क्रीनिंग इतिहास" : "My Screening History"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isHindi ? "अपनी पिछली स्वास्थ्य जांच और परिणाम देखें।" : "View your past health screenings and results."}
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition">
            📤 {isHindi ? "इतिहास निर्यात करें" : "Export History"}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-16">{isHindi ? "लोड हो रहा है..." : "Loading..."}</p>
        ) : records.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">{isHindi ? "कोई पिछली जांच नहीं मिली।" : "No past screenings found."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => {
              const risk = r.isUrgent ? "Urgent" : r.aiResult?.riskLevel;
              return (
                <div key={r._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</p>
                      <p className="font-semibold text-gray-800 text-sm mt-0.5">
                        👤 {r.screenedFor === "self" ? (isHindi ? "स्वयं" : "Myself") : r.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {r.symptoms?.length || 0} {isHindi ? "लक्षण जांचे" : "symptoms checked"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${riskBadge[risk] || riskBadge.Low}`}>
                      {risk} Risk
                    </span>
                    <button
                      onClick={() => setSelected(r)}
                      className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
                    >
                      {isHindi ? "विवरण देखें" : "View Details"} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} lang={lang} />}
    </div>
  );
}
