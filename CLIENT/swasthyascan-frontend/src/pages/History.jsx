import { useEffect, useState } from "react";
import axios from "axios";
import HistoryCard from "../components/HistoryCard";
import { getDeviceId } from "../deviceId";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function History({ t }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/screening/history?userId=${getDeviceId()}`)
      .then((res) => setRecords(res.data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-green-700 mb-5">{t.history}</h2>
      {loading ? (
        <p className="text-gray-400 text-sm text-center py-10">{t.loading}</p>
      ) : records.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">{t.noHistory}</p>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <HistoryCard key={r._id} record={r} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
