import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SymptomCheckbox from "../components/SymptomCheckbox";
import UrgentBanner from "../components/UrgentBanner";
import SYMPTOMS from "../symptomsList";
import { getDeviceId } from "../deviceId";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function SymptomForm({ lang, t }) {
  const navigate = useNavigate();
  const [screenedFor, setScreenedFor] = useState("self");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [bp, setBp] = useState("");
  const [sugar, setSugar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isUrgentLocal = selectedSymptoms.some(
    (s) => SYMPTOMS.find((x) => x.key === s)?.redFlag
  );

  function toggleSymptom(key) {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!age || !gender || selectedSymptoms.length === 0) {
      setError("Please fill age, gender and select at least one symptom.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = {
        deviceId: getDeviceId(),
        screenedFor,
        name: screenedFor === "other" ? name : undefined,
        age: Number(age),
        gender,
        symptoms: selectedSymptoms,
        vitals: { bp: bp || undefined, sugar: sugar ? Number(sugar) : undefined },
        language: lang,
      };
      const { data } = await axios.post(`${API_BASE}/api/screening`, payload);
      navigate("/result", { state: { result: data, payload } });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isUrgentLocal && <UrgentBanner message={t.urgentMessage} />}

      {/* Screened For Toggle */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{t.screeningFor}</p>
        <div className="flex gap-3">
          {["self", "other"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setScreenedFor(opt)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition
                ${screenedFor === opt ? "bg-green-600 text-white border-green-600" : "border-gray-300 text-gray-600 hover:border-green-400"}`}
            >
              {opt === "self" ? t.self : t.other}
            </button>
          ))}
        </div>
      </div>

      {/* Name (only for "other") */}
      {screenedFor === "other" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      )}

      {/* Age & Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.age}</label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.gender}</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="">—</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
            <option value="other">{t.other_gender}</option>
          </select>
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{t.selectSymptoms}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SYMPTOMS.map((s) => (
            <SymptomCheckbox
              key={s.key}
              symptomKey={s.key}
              label={t.symptoms[s.key]}
              redFlag={s.redFlag}
              checked={selectedSymptoms.includes(s.key)}
              onChange={toggleSymptom}
            />
          ))}
        </div>
      </div>

      {/* Vitals */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{t.vitals}</p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t.bp}
            value={bp}
            onChange={(e) => setBp(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder={t.sugar}
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
      >
        {loading ? t.loading : t.submit}
      </button>
    </form>
  );
}
