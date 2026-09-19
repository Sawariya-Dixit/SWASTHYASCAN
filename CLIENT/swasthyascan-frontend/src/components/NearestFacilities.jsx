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
    <div className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 rounded-2xl border-2 border-rose-200/80 p-6 shadow-lg shadow-rose-900/5 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-md shadow-rose-600/30">
            🏥
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
              {isHindi ? "निकटतम अस्पताल / प्राथमिक स्वास्थ्य केंद्र (PHC)" : "Nearest Hospital / Health Facility"}
              <span className="text-[10px] uppercase font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                {isHindi ? "तुरंत सहायता" : "Immediate Care"}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHindi
                ? "उच्च जोखिम की स्थिति में तुरंत नजदीकी सरकारी अस्पताल या स्वास्थ्य केंद्र से संपर्क करें"
                : "Suggested public health facilities near your location for urgent consultation"}
            </p>
          </div>
        </div>

        {/* Emergency Ambulance dial button */}
        <a
          href="tel:108"
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-rose-600/20 hover:shadow-rose-600/40 transition-all shrink-0"
        >
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{isHindi ? "एम्बुलेंस 108" : "Ambulance 108"}</span>
        </a>
      </div>

      {/* Permission alert note if GPS is blocked */}
      {permissionDenied && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>
              {isHindi
                ? `लोकेशन अनुमति न मिलने पर डिफ़ॉल्ट रूप से ${currentCityName || "डेमो शहर"} के निकटतम केंद्र दिखाए जा रहे हैं:`
                : `GPS access was unavailable. Showing nearest facilities for ${currentCityName || "demo location"}:`}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={currentCityName}
              onChange={(e) => {
                const sel = DEMO_CITIES.find((c) => c.name === e.target.value);
                if (sel) loadFacilitiesForCoords(sel.lat, sel.lng, sel.name);
              }}
              className="bg-white border border-amber-300 text-amber-900 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {DEMO_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              onClick={requestLocation}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-700"
            >
              {isHindi ? "पुनः प्रयास" : "Retry GPS"}
            </button>
          </div>
        </div>
      )}

      {/* Facility Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/90 rounded-xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-3"
            >
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded mt-3"></div>
            </div>
          ))}
        </div>
      ) : facilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {facilities.map((fac, idx) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              `${fac.name}, ${fac.district}, ${fac.state}`
            )}`;

            return (
              <div
                key={idx}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {fac.type || "Govt Hospital"}
                    </span>
                    {fac.distanceKm != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shrink-0">
                        <span>📍</span>
                        <span>
                          {fac.distanceKm} {isHindi ? "किमी" : "km"}
                        </span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-tight mb-1">
                    {fac.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {fac.district ? `${fac.district}, ` : ""}
                    {fac.state}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{isHindi ? "दिशा-निर्देश (Maps)" : "Get Directions"}</span>
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `${fac.name} ${fac.district} phone number contact`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                    title={isHindi ? "अस्पताल विवरण व फोन नंबर" : "Hospital details & phone"}
                  >
                    <span>📞</span>
                    <span>{isHindi ? "संपर्क" : "Contact"}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-white/70 rounded-xl border border-slate-100">
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
