import { useState, useMemo, useRef } from "react";
import { getSymptomIcon } from "../utils/symptomsApi";
import strings from "../i18n";

const RISK_CONFIG = {
  1: { level: "Low", labelEn: "Low Risk", labelHi: "कम जोखिम", color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
  2: { level: "Medium", labelEn: "Medium Risk", labelHi: "मध्यम जोखिम", color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
  3: { level: "High", labelEn: "High Risk", labelHi: "उच्च जोखिम", color: "#f43f5e", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-300" },
  4: { level: "Urgent", labelEn: "Urgent", labelHi: "तत्काल", color: "#e11d48", bg: "bg-red-500", text: "text-white", border: "border-red-600" },
};

function getRiskValue(r) {
  if (r.isUrgent) return 4;
  const lvl = r.aiResult?.riskLevel;
  if (lvl === "Urgent") return 4;
  if (lvl === "High") return 3;
  if (lvl === "Medium") return 2;
  return 1;
}

export default function RiskTrendChart({
  records = [],
  activePerson = "all",
  lang = "en",
  isHindi = false,
  onSelectRecord,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const hideTimerRef = useRef(null);

  // Timeline data for the resolved person
  const timelineData = useMemo(() => {
    let filtered = records;
    if (activePerson === "self") {
      filtered = records.filter((r) => r.screenedFor === "self");
    } else if (activePerson !== "all") {
      filtered = records.filter((r) => r.screenedFor === "other" && r.name === activePerson);
    }
    return [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [records, activePerson]);

  // SVG Chart Metrics (Responsive viewBox: 440 x 180)
  const svgWidth = 440;
  const svgHeight = 180;
  const padding = { top: 25, bottom: 35, left: 60, right: 25 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const getY = (val) => {
    return padding.top + (4 - val) * (chartHeight / 3);
  };

  const getX = (idx, total) => {
    if (total <= 1) return padding.left + chartWidth / 2;
    return padding.left + (idx / (total - 1)) * chartWidth;
  };

  const points = useMemo(() => {
    return timelineData.map((r, idx) => {
      const val = getRiskValue(r);
      return {
        idx,
        x: getX(idx, timelineData.length),
        y: getY(val),
        val,
        record: r,
      };
    });
  }, [timelineData]);

  // Trend insight
  const trendInsight = useMemo(() => {
    if (timelineData.length < 2) return null;
    const latestVal = getRiskValue(timelineData[timelineData.length - 1]);
    const prevVal = getRiskValue(timelineData[timelineData.length - 2]);

    if (latestVal < prevVal) {
      return {
        type: "improving",
        label: isHindi ? "सुधार हो रहा है" : "Risk Improving",
        icon: "📉",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      };
    }
    if (latestVal > prevVal) {
      return {
        type: "worsening",
        label: isHindi ? "ध्यान देने योग्य" : "Needs Attention",
        icon: "⚠️",
        badge: "bg-rose-100 text-rose-800 border-rose-300",
      };
    }
    return {
      type: "stable",
      label: isHindi ? "जोखिम स्थिर है" : "Risk Stable",
      icon: "➡️",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
    };
  }, [timelineData, isHindi]);

  const pathD =
    points.length > 1
      ? points.reduce((acc, pt, i) => {
          if (i === 0) return `M ${pt.x} ${pt.y}`;
          const prev = points[i - 1];
          const cx = (prev.x + pt.x) / 2;
          return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
        }, "")
      : "";

  const areaD =
    points.length > 1
      ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${
          padding.top + chartHeight
        } Z`
      : "";

  const handlePointEnter = (pt) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setHoveredPoint(pt);
  };

  const handlePointLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setHoveredPoint(null);
    }, 300);
  };

  const handleTooltipEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handleTooltipLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setHoveredPoint(null);
    }, 150);
  };

  // Compute safe tooltip position so it never overflows or clips
  const tooltipStyle = useMemo(() => {
    if (!hoveredPoint) return {};

    const style = {};
    const percentX = (hoveredPoint.x / svgWidth) * 100;

    // Horizontal placement
    if (hoveredPoint.x < 120) {
      style.left = "8px";
      style.transform = "none";
    } else if (hoveredPoint.x > svgWidth - 120) {
      style.right = "8px";
      style.left = "auto";
      style.transform = "none";
    } else {
      style.left = `${percentX}%`;
      style.transform = "translateX(-50%)";
    }

    // Vertical placement (if point is in upper half, display tooltip below it; otherwise above it)
    if (hoveredPoint.val >= 3) {
      // High or Urgent (near top of chart) -> show below
      style.top = `${Math.min(hoveredPoint.y + 16, 85)}px`;
    } else {
      // Low or Medium (near bottom of chart) -> show above
      style.bottom = `${Math.max(svgHeight - hoveredPoint.y + 14, 45)}px`;
    }

    return style;
  }, [hoveredPoint]);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-green-100/90 p-4 sm:p-5 shadow-xl shadow-green-900/5 flex flex-col justify-between relative">
      {/* 1. Header */}
      <div>
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-green-100/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-base shadow-md shadow-green-600/20 shrink-0">
                📈
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
                {isHindi ? (
                  <>स्वास्थ्य जोखिम <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">ट्रेंड ग्राफ</span></>
                ) : (
                  <>Health Risk <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Trend Graph</span></>
                )}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {activePerson === "all"
                ? isHindi
                  ? "सभी जांचों का ट्रेंड ग्राफ (बिंदु पर माउस ले जाएं)"
                  : "All screenings timeline (hover dot to inspect)"
                : isHindi
                ? `${activePerson === "self" ? "स्वयं (Myself)" : activePerson} का व्यक्तिगत ग्राफ`
                : `Health trend for ${activePerson === "self" ? "Myself" : activePerson}`}
            </p>
          </div>

          {/* Trend Badge */}
          {trendInsight && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border shadow-2xs shrink-0 ${trendInsight.badge}`}>
              <span>{trendInsight.icon}</span>
              <span>{trendInsight.label}</span>
            </span>
          )}
        </div>

        {/* 2. Chart Area (Without overflow-hidden so tooltips never clip!) */}
        {timelineData.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-3">
            {isHindi ? "इस सदस्य के लिए कोई स्क्रीनिंग रिकॉर्ड नहीं मिला।" : "No screening records found."}
          </div>
        ) : (
          <div className="relative w-full bg-gradient-to-b from-green-50/30 to-white rounded-2xl p-2 border border-green-100/80 mt-3">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="riskAreaGradClean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                  <stop offset="60%" stopColor="#059669" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="riskLineGradClean" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[
                { val: 4, label: isHindi ? "तत्काल" : "Urgent", color: "#e11d48" },
                { val: 3, label: isHindi ? "उच्च" : "High", color: "#f43f5e" },
                { val: 2, label: isHindi ? "मध्यम" : "Medium", color: "#f59e0b" },
                { val: 1, label: isHindi ? "कम" : "Low", color: "#10b981" },
              ].map((lvl) => {
                const y = getY(lvl.val);
                return (
                  <g key={lvl.val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="9"
                      fontWeight="700"
                      fill={lvl.color}
                    >
                      {lvl.label}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              {areaD && <path d={areaD} fill="url(#riskAreaGradClean)" />}

              {/* Line path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#riskLineGradClean)"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                />
              )}

              {/* Single record fallback line */}
              {points.length === 1 && (
                <line
                  x1={padding.left}
                  y1={points[0].y}
                  x2={svgWidth - padding.right}
                  y2={points[0].y}
                  stroke={RISK_CONFIG[points[0].val].color}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
              )}

              {/* Vertical Guide Line on Hover */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={padding.top}
                  x2={hoveredPoint.x}
                  y2={padding.top + chartHeight}
                  stroke={RISK_CONFIG[hoveredPoint.val].color}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  opacity={0.8}
                />
              )}

              {/* Data points */}
              {points.map((pt, idx) => {
                const cfg = RISK_CONFIG[pt.val];
                const isHovered = hoveredPoint?.idx === idx;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => handlePointEnter(pt)}
                    onMouseLeave={handlePointLeave}
                    onClick={() => {
                      handlePointEnter(pt);
                      if (onSelectRecord) onSelectRecord(pt.record);
                    }}
                    onTouchStart={() => handlePointEnter(pt)}
                  >
                    {/* Pulsing ring on hover */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={12}
                        fill={cfg.color}
                        opacity={0.3}
                        className="animate-ping"
                      />
                    )}

                    {/* Outer border ring */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7.5 : 5}
                      fill="#ffffff"
                      stroke={cfg.color}
                      strokeWidth={isHovered ? 3 : 2.2}
                      className="transition-all duration-150"
                    />

                    {/* Inner core dot */}
                    <circle cx={pt.x} cy={pt.y} r={isHovered ? 3.5 : 2} fill={cfg.color} />

                    {/* Date label at bottom */}
                    <text
                      x={pt.x}
                      y={padding.top + chartHeight + 16}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight={isHovered ? "800" : "600"}
                      fill={isHovered ? "#0f172a" : "#94a3b8"}
                    >
                      {new Date(pt.record.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* 3. ROCK-SOLID HOVER TOOLTIP BOX (ONLY VISIBLE ON HOVER) */}
            {hoveredPoint && (
              <div
                onMouseEnter={handleTooltipEnter}
                onMouseLeave={handleTooltipLeave}
                className="absolute z-30 bg-slate-900/95 text-white rounded-2xl p-3 shadow-2xl border border-slate-700/80 backdrop-blur-md text-xs transition-all duration-200 pointer-events-auto"
                style={{
                  ...tooltipStyle,
                  width: "210px",
                  maxWidth: "92vw",
                }}
              >
                {/* Header: Date + Risk Badge */}
                <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-700/80 mb-2">
                  <span className="font-bold text-slate-300 text-[10.5px]">
                    {new Date(hoveredPoint.record.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase ${
                      RISK_CONFIG[hoveredPoint.val].bg
                    } ${
                      hoveredPoint.val === 4 ? "text-white" : RISK_CONFIG[hoveredPoint.val].text
                    }`}
                  >
                    {isHindi
                      ? RISK_CONFIG[hoveredPoint.val].labelHi
                      : RISK_CONFIG[hoveredPoint.val].labelEn}
                  </span>
                </div>

                {/* Patient Name */}
                <p className="font-bold text-xs text-white mb-1.5 flex items-center gap-1">
                  <span>👤</span>
                  <span className="truncate">
                    {hoveredPoint.record.screenedFor === "self"
                      ? isHindi
                        ? "स्वयं (Myself)"
                        : "Myself"
                      : hoveredPoint.record.name}
                  </span>
                </p>

                {/* Symptoms Preview */}
                {hoveredPoint.record.symptoms?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {isHindi ? "लक्षण:" : "Symptoms:"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {hoveredPoint.record.symptoms.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1"
                        >
                          <span>{getSymptomIcon(s)}</span>
                          <span>{strings[lang]?.symptoms?.[s] || s}</span>
                        </span>
                      ))}
                      {hoveredPoint.record.symptoms.length > 3 && (
                        <span className="text-slate-400 text-[9.5px] self-center">
                          +{hoveredPoint.record.symptoms.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Vitals Preview */}
                {(hoveredPoint.record.vitals?.bp || hoveredPoint.record.vitals?.sugar) && (
                  <div className="mb-2.5 py-1 px-2 rounded-lg bg-slate-800/80 flex items-center gap-2 text-[10.5px] text-slate-300 font-semibold">
                    <span>🩺</span>
                    {hoveredPoint.record.vitals?.bp && (
                      <span>BP: {hoveredPoint.record.vitals.bp}</span>
                    )}
                    {hoveredPoint.record.vitals?.bp && hoveredPoint.record.vitals?.sugar && (
                      <span>•</span>
                    )}
                    {hoveredPoint.record.vitals?.sugar && (
                      <span>Sugar: {hoveredPoint.record.vitals.sugar}</span>
                    )}
                  </div>
                )}

                {/* Details Button inside Hover Box */}
                <button
                  onClick={() => {
                    if (onSelectRecord) onSelectRecord(hoveredPoint.record);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-green-600/30 cursor-pointer hover:shadow-green-600/40"
                >
                  <span>{isHindi ? "पूरी डिटेल्स देखें" : "View Full Details"}</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Footer tip */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>
          💡 {isHindi ? "बिंदु पर माउस ले जाकर डिटेल्स देखें" : "Hover dot to view screening details"}
        </span>
        <span className="text-slate-500 font-bold">
          {timelineData.length} {isHindi ? "जांचें" : "records"}
        </span>
      </div>
    </div>
  );
}
