import RiskBadge from "./RiskBadge";

const riskBorder = {
  Low: "border-l-green-400",
  Medium: "border-l-yellow-400",
  High: "border-l-red-400",
  Urgent: "border-l-red-600",
};

export default function HistoryCard({ record, t }) {
  const risk = record.isUrgent ? "Urgent" : record.aiResult?.riskLevel;
  return (
    <div className={`bg-white rounded-xl border-l-4 ${riskBorder[risk] || "border-l-gray-300"} shadow-sm p-4`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">
            {t.screenedFor}: {record.screenedFor === "self" ? t.self : record.name || t.other}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t.date}: {new Date(record.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t.age}: {record.age} | {record.gender}
          </p>
        </div>
        <RiskBadge level={risk} />
      </div>
      {record.aiResult?.advice && (
        <p className="text-sm text-gray-600 mt-3 border-t pt-2">{record.aiResult.advice}</p>
      )}
    </div>
  );
}
