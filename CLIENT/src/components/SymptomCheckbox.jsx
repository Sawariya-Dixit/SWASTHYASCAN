export default function SymptomCheckbox({ symptomKey, label, redFlag, checked, onChange }) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
        ${checked ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}
        ${redFlag ? "border-l-4 border-l-red-400" : ""}`}
    >
      <input
        type="checkbox"
        className="accent-emerald-600 w-4 h-4"
        checked={checked}
        onChange={() => onChange(symptomKey)}
      />
      <span className="text-sm text-gray-700 flex-1">{label}</span>
      {redFlag && <span className="text-xs text-red-500 font-medium">⚠ Red Flag</span>}
    </label>
  );
}
