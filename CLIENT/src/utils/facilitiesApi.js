import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/+$/, "");

/**
 * Fetches 1-2 nearest healthcare facilities directly from the backend API.
 * Calls backend GET /api/v1/facilities/nearby?lat=...&lng=...
 * All facility data is stored and calculated in the backend (MongoDB / Facilitiesdata.js).
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Array<{ name: string, type: string, state: string, district: string, distanceKm: number }>>}
 */
export async function fetchNearbyFacilities(lat, lng) {
  if (lat == null || lng == null) {
    throw new Error("Latitude and longitude are required");
  }

  try {
    const res = await axios.get(`${API_BASE}/api/v1/facilities/nearby`, {
      params: { lat, lng },
      timeout: 5000,
    });
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (err) {
    // Try alternate route alias if needed
    try {
      const altRes = await axios.get(`${API_BASE}/api/facilities/nearby`, {
        params: { lat, lng },
        timeout: 8000,
      });
      if (Array.isArray(altRes.data)) {
        return altRes.data;
      }
    } catch {
      // Re-throw original error so UI knows backend was unreachable
      throw new Error(err.response?.data?.error || err.message || "Failed to fetch from backend");
    }
    return [];
  }
}
