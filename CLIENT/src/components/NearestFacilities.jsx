import { useState, useEffect, useCallback } from "react";
import { fetchNearbyFacilities } from "../utils/facilitiesApi";

// Pre-defined demo cities for quick testing when browser blocks GPS
const DEMO_CITIES = [
  { name: "Bhopal (MP)", lat: 23.2599, lng: 77.4126 },
  { name: "Lucknow (UP)", lat: 26.8467, lng: 80.9462 },
  { name: "Agra (UP)", lat: 27.1767, lng: 78.0081 },
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Patna (Bihar)", lat: 25.6127, lng: 85.1414 },
  { name: "Jaipur (RJ)", lat: 26.9124, lng: 75.7873 },
  { name: "Mumbai (MH)", lat: 19.0760, lng: 72.8777 },
];

function formatDistance(distKm, isHindi) {
  if (distKm == null || isNaN(distKm)) return "";
  const num = Number(distKm);
  // Show 1 decimal place for distances under 100km, round to integer if larger
  const formatted = num < 100 ? num.toFixed(1) : Math.round(num).toString();
  return `${formatted} ${isHindi ? "किमी" : "km"}`;
}

function getTypeBadgeStyle(type) {
  switch (type) {
    case "District Hospital":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Govt Hospital":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "PHC":
    case "CHC":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default function NearestFacilities({ isHindi }) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [currentCityName, setCurrentCityName] = useState("");

  const loadFacilitiesForCoords = useCallback(async (lat, lng, cityName = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNearbyFacilities(lat, lng);
      setFacilities(data || []);
      if (cityName) setCurrentCityName(cityName);
    } catch (err) {
      console.error("Failed to load facilities:", err);
      setError(
        isHindi
          ? "निकटतम स्वास्थ्य केंद्र लोड नहीं हो सके।"
          : "Could not load nearby health facilities."
      );
    } finally {
      setLoading(false);
    }
  }, [isHindi]);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    if (!navigator.geolocation) {
      setPermissionDenied(true);
      setError(
        isHindi
          ? "आपके ब्राउज़र में जीपीएस सपोर्ट उपलब्ध नहीं है।"
          : "Geolocation is not supported by your browser."
      );
      loadFacilitiesForCoords(DEMO_CITIES[0].lat, DEMO_CITIES[0].lng, DEMO_CITIES[0].name);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("📍 [NearestFacilities] Browser Live Location Detected: lat =", pos.coords.latitude, "lng =", pos.coords.longitude);
        loadFacilitiesForCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("Geolocation permission error/timeout:", err.message);
        setPermissionDenied(true);
        loadFacilitiesForCoords(DEMO_CITIES[0].lat, DEMO_CITIES[0].lng, DEMO_CITIES[0].name);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  }, [isHindi, loadFacilitiesForCoords]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <div className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 rounded-3xl border-2 border-rose-200/90 p-6 sm:p-7 shadow-xl shadow-rose-900/5 mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-rose-100 mb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-md shadow-rose-600/25 shrink-0 mt-0.5 sm:mt-0">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                {isHindi ? "निकटतम अस्पताल / प्राथमिक स्वास्थ्य केंद्र" : "Nearest Hospital & Health Facilities"}
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                {isHindi ? "आपातकालीन" : "Urgent Care"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {isHindi
                ? "आपकी लोकेशन के आधार पर सबसे नजदीकी सरकारी स्वास्थ्य केंद्र"
                : "Suggested public hospitals and health centers nearest to your location"}
            </p>
          </div>
        </div>

        {/* Emergency Ambulance dial button */}
        <a
          href="tel:108"
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-rose-600/20 hover:shadow-rose-600/40 transition-all shrink-0 self-start sm:self-center"
        >
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{isHindi ? "एम्बुलेंस 108" : "Ambulance 108"}</span>
        </a>
      </div>

      {/* Permission alert note if GPS is blocked */}
      {permissionDenied && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-900 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📍</span>
            <span>
              {isHindi
                ? `GPS अनुमति न मिलने पर ${currentCityName || "डेमो शहर"} के निकटतम केंद्र दिखाए जा रहे हैं:`
                : `GPS unavailable. Showing nearest centers for ${currentCityName || "demo location"}:`}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={currentCityName}
              onChange={(e) => {
                const sel = DEMO_CITIES.find((c) => c.name === e.target.value);
                if (sel) loadFacilitiesForCoords(sel.lat, sel.lng, sel.name);
              }}
              className="bg-white border border-amber-300 text-amber-900 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            >
              {DEMO_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              onClick={requestLocation}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-700 ml-1"
            >
              {isHindi ? "पुनः प्रयास" : "Retry GPS"}
            </button>
          </div>
        </div>
      )}

      {/* Facility Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 rounded-md w-28"></div>
                <div className="h-5 bg-slate-200 rounded-full w-20"></div>
              </div>
              <div className="h-5 bg-slate-200 rounded w-3/4 mt-2"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
            </div>
          ))}
        </div>
      ) : facilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {facilities.map((fac, idx) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              `${fac.name}, ${fac.district}, ${fac.state}`
            )}`;
            const badgeClass = getTypeBadgeStyle(fac.type);

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Top row: Type Badge & Distance Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-block text-[11px] font-extrabold uppercase tracking-wider border px-2.5 py-0.5 rounded-lg ${badgeClass}`}
                    >
                      {fac.type || "Govt Hospital"}
                    </span>
                    {fac.distanceKm != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/80 whitespace-nowrap shrink-0 shadow-xs">
                        <span>📍</span>
                        <span>{formatDistance(fac.distanceKm, isHindi)}</span>
                      </span>
                    )}
                  </div>

                  {/* Hospital Name */}
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug mb-1 line-clamp-1">
                    {fac.name}
                  </h4>

                  {/* Location subtitle */}
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      {fac.district ? `${fac.district}, ` : ""}
                      {fac.state}
                    </span>
                  </p>
                </div>

                {/* Bottom row: Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-100/90 grid grid-cols-2 gap-2.5">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{isHindi ? "रास्ता देखें" : "Directions"}</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `${fac.name} ${fac.district} hospital phone number contact`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200/90 shadow-sm transition-all hover:-translate-y-0.5"
                    title={isHindi ? "अस्पताल संपर्क विवरण" : "Hospital contact details"}
                  >
                    <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="truncate">{isHindi ? "संपर्क / फोन" : "Contact / Info"}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-white/70 rounded-2xl border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            {error ||
              (isHindi
                ? "निकटतम स्वास्थ्य केंद्र की जानकारी उपलब्ध नहीं है।"
                : "No nearby health facilities found for your area.")}
          </p>
        </div>
      )}
    </div>
  );
}
