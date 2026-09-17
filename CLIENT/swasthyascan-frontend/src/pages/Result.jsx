import { useLocation, useNavigate } from "react-router-dom";
import RiskBadge from "../components/RiskBadge";
import WhyThisRisk from "../components/WhyThisRisk";
import UrgentBanner from "../components/UrgentBanner";

export default function Result({ t }) {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    navigate("/");
    return null;
  }

  const { result } = state;
  const riskLevel = result.isUrgent ? "Urgent" : result.riskLevel;

  const bgMap = {
    Low: "from-green-50 to-white",
    Medium: "from-yellow-50 to-white",
    High: "from-red-50 to-white",
    Urgent: "from-red-100 to-white",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className={`bg-gradient-to-b ${bgMap[riskLevel] || "from-gray-50 to-white"} rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5`}>
        {result.isUrgent && <UrgentBanner message={t.urgentMessage} />}

        {/* Risk Level */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">{t.riskLevel}</span>
          <RiskBadge level={riskLevel} />
        </div>

        {/* Why This Risk */}
        <WhyThisRisk factors={result.factors} label={t.whyThisRisk} />

        {/* Advice */}
        {result.advice && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-700 mb-1">{t.advice}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{result.advice}</p>
          </div>
        )}

        {/* Disclaimer */}
        {result.disclaimer && (
          <p className="text-xs text-gray-400 italic border-t pt-3">{result.disclaimer}</p>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
        >
          {t.newScreening}
        </button>
      </div>
    </div>
  );
}
