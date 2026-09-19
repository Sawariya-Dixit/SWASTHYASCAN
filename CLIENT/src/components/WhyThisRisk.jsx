export default function WhyThisRisk({ factors, label }) {
  if (!factors?.length) return null;
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
      <ul className="space-y-1">
        {factors.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
