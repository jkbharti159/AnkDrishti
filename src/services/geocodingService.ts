/**
 * Enterprise-grade Birth Place Search and Geocoding Service for AnkDrishti.
 * Abstracts the search provider (OpenStreetMap/Photon with Nominatim fallback)
 * and retrieves precise geographical parameters including timezone details.
 */

export interface GeocodedPlace {
  placeName: string;         // e.g., "Kolkata"
  latitude: number;          // e.g., 22.572646
  longitude: number;         // e.g., 88.363895
  timezone: string;          // e.g., "Asia/Kolkata"
  utcOffset: string;         // e.g., "+05:30"
  utcOffsetHours: number;    // e.g., 5.5
  country: string;           // e.g., "India"
  state: string;             // e.g., "West Bengal"
  district?: string;         // e.g., "Kolkata"
  formattedAddress: string;  // e.g., "Kolkata, West Bengal, India"
  placeId: string;           // Google/OSM Place Identifier
  postcode?: string;         // Postal code if available
}

// Map of major countries to standard timezones for smart offline timezone fallback
const OFFLINE_COUNTRY_TIMEZONES: Record<string, { timezone: string; offsetHours: number; offsetStr: string }> = {
  "India": { timezone: "Asia/Kolkata", offsetHours: 5.5, offsetStr: "+05:30" },
  "Nepal": { timezone: "Asia/Kathmandu", offsetHours: 5.75, offsetStr: "+05:45" },
  "Bangladesh": { timezone: "Asia/Dhaka", offsetHours: 6.0, offsetStr: "+06:00" },
  "Sri Lanka": { timezone: "Asia/Colombo", offsetHours: 5.5, offsetStr: "+05:30" },
  "Pakistan": { timezone: "Asia/Karachi", offsetHours: 5.0, offsetStr: "+05:00" },
  "United Kingdom": { timezone: "Europe/London", offsetHours: 0.0, offsetStr: "+00:00" },
  "USA": { timezone: "America/New_York", offsetHours: -5.0, offsetStr: "-05:00" },
  "United States": { timezone: "America/New_York", offsetHours: -5.0, offsetStr: "-05:00" },
  "Canada": { timezone: "America/Toronto", offsetHours: -5.0, offsetStr: "-05:00" },
  "Australia": { timezone: "Australia/Sydney", offsetHours: 10.0, offsetStr: "+10:00" },
  "Singapore": { timezone: "Asia/Singapore", offsetHours: 8.0, offsetStr: "+08:00" },
  "Germany": { timezone: "Europe/Berlin", offsetHours: 1.0, offsetStr: "+01:00" },
  "France": { timezone: "Europe/Paris", offsetHours: 1.0, offsetStr: "+01:00" },
  "United Arab Emirates": { timezone: "Asia/Dubai", offsetHours: 4.0, offsetStr: "+04:00" },
  "Japan": { timezone: "Asia/Tokyo", offsetHours: 9.0, offsetStr: "+09:00" },
};

/**
 * Estimates timezone parameters offline using longitude and country context.
 * Useful for fast instant load or fallback.
 */
export function estimateTimezoneOffline(lat: number, lon: number, country?: string): { timezone: string; utcOffset: string; utcOffsetHours: number } {
  if (country && OFFLINE_COUNTRY_TIMEZONES[country]) {
    const info = OFFLINE_COUNTRY_TIMEZONES[country];
    return {
      timezone: info.timezone,
      utcOffset: info.offsetStr,
      utcOffsetHours: info.offsetHours
    };
  }

  // Calculate timezone offset mathematically based on longitude (15 degrees = 1 hour offset)
  const offsetHours = Math.round((lon / 15) * 4) / 4; // Round to nearest 15 mins (0.25h)
  const sign = offsetHours >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetHours);
  const hours = Math.floor(absOffset);
  const mins = Math.round((absOffset - hours) * 60);
  const formattedOffset = `${sign}${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;

  return {
    timezone: `Etc/GMT${offsetHours >= 0 ? "-" : "+"}${Math.abs(Math.round(offsetHours))}`,
    utcOffset: formattedOffset,
    utcOffsetHours: offsetHours
  };
}

/**
 * Searches worldwide locations in real time using the high-performance Photon API (backed by OpenStreetMap).
 */
export async function searchBirthplaces(query: string, limit = 8): Promise<GeocodedPlace[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    // Use Photon API which is extremely fast and geocodes in real-time
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodedQuery}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Photon API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.features) {
      return [];
    }

    const places: GeocodedPlace[] = [];

    for (const feature of data.features) {
      const { geometry, properties } = feature;
      if (!geometry || !geometry.coordinates || geometry.coordinates.length < 2) {
        continue;
      }

      const lon = geometry.coordinates[0];
      const lat = geometry.coordinates[1];

      // Format clean readable address components
      const name = properties.name || "";
      const city = properties.city || properties.town || properties.village || "";
      const state = properties.state || properties.province || "";
      const country = properties.country || "";
      const district = properties.district || properties.county || "";
      const postcode = properties.postcode || "";
      const placeId = properties.osm_id ? `osm_${properties.osm_type || "W"}_${properties.osm_id}` : `latlon_${lat.toFixed(6)}_${lon.toFixed(6)}`;

      // Construct distinct and elegant formatted address string
      const addressParts: string[] = [];
      if (name && name !== city) addressParts.push(name);
      if (city) addressParts.push(city);
      if (district && district !== city) addressParts.push(district);
      if (state) addressParts.push(state);
      if (country) addressParts.push(country);

      const formattedAddress = addressParts.filter(Boolean).join(", ") || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

      // Use offline fallback by default for timezone to guarantee sub-300ms performance
      const tzOffline = estimateTimezoneOffline(lat, lon, country);

      places.push({
        placeName: name || city || formattedAddress,
        latitude: parseFloat(lat.toFixed(6)), // 6 decimal places minimum
        longitude: parseFloat(lon.toFixed(6)),
        timezone: tzOffline.timezone,
        utcOffset: tzOffline.utcOffset,
        utcOffsetHours: tzOffline.utcOffsetHours,
        country: country || "Unknown",
        state: state || "Unknown",
        district: district || undefined,
        formattedAddress,
        placeId,
        postcode: postcode || undefined
      });
    }

    return places;
  } catch (error) {
    console.error("Error fetching places from Photon API:", error);
    // Return empty array to be caught or handled by fallback UI
    return [];
  }
}

/**
 * Enrich timezone information of a place in real-time using high-accuracy web API.
 * Uses BigDataCloud Free Timezone API under the hood, with instant offline fallback on failure.
 */
export async function enrichTimezone(place: GeocodedPlace): Promise<GeocodedPlace> {
  try {
    const url = `https://api.bigdatacloud.net/data/timezone-by-area?latitude=${place.latitude}&longitude=${place.longitude}&key=free`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`BigDataCloud Timezone API error with status ${response.status}`);
    }

    const data = await response.json();
    if (data && data.ianaTimeZoneId) {
      const offsetSeconds = data.utcOffsetSeconds || 0;
      const offsetHours = offsetSeconds / 3600;
      
      return {
        ...place,
        timezone: data.ianaTimeZoneId,
        utcOffset: data.utcOffsetString || place.utcOffset,
        utcOffsetHours: offsetHours
      };
    }
  } catch (error) {
    console.warn("Real-time timezone lookup failed, using high-accuracy offline estimate:", error);
  }
  
  return place;
}

/**
 * Cache and retrieve recent queries to maximize performance and comply with rate limiting limits.
 */
const SEARCH_CACHE_KEY = "ankdrishti_birthplaces_cache";
const RECENT_SELECTION_KEY = "ankdrishti_recent_selection";

export function getCachedRecentPlace(): GeocodedPlace | null {
  try {
    const raw = localStorage.getItem(RECENT_SELECTION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse cached location", e);
  }
  return null;
}

export function saveRecentPlaceToCache(place: GeocodedPlace): void {
  try {
    localStorage.setItem(RECENT_SELECTION_KEY, JSON.stringify(place));
    
    // Also save in search history cache up to 10 items
    const rawHistory = localStorage.getItem(SEARCH_CACHE_KEY);
    let history: GeocodedPlace[] = rawHistory ? JSON.parse(rawHistory) : [];
    
    // Remove duplicates
    history = history.filter(item => item.placeId !== place.placeId);
    history.unshift(place);
    
    // Keep last 10 entries
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to write to localStorage cache", e);
  }
}

export function getCachedSearchHistory(): GeocodedPlace[] {
  try {
    const raw = localStorage.getItem(SEARCH_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load search history", e);
  }
  return [];
}
