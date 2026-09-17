const colours = {
  Low: "bg-green-100 text-green-800 border-green-400",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-400",
  High: "bg-red-100 text-red-800 border-red-400",
  Urgent: "bg-red-600 text-white border-red-700",
};

export default function RiskBadge({ level }) {
  return (
    <span className={`px-4 py-1 rounded-full border font-bold text-lg ${colours[level] || colours.Low}`}>
      {level}
    </span>
  );
}
