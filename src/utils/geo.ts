import { PakistanCity } from '../types';

/**
 * Calculates distance between two GPS coordinates using the Haversine formula
 * Returns distance in kilometers (km)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance in human readable format
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Find closest Pakistan city from a given coordinate
 */
export function findClosestPakistanCity(
  lat: number,
  lon: number,
  cities: PakistanCity[]
): { city: PakistanCity; distanceKm: number } {
  let closest = cities[0];
  let minDistance = Infinity;

  for (const c of cities) {
    const dist = calculateHaversineDistance(lat, lon, c.latitude, c.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
    }
  }

  return { city: closest, distanceKm: minDistance };
}

/**
 * Live reverse geocoding via OpenStreetMap Nominatim with graceful fallback
 */
export async function reverseGeocodePakistan(
  lat: number,
  lon: number,
  cities: PakistanCity[]
): Promise<{ city: string; area: string; address: string }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`,
      {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(3500),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const detectedCity =
        addr.city || addr.town || addr.municipality || addr.state_district || addr.county || '';
      const detectedArea =
        addr.suburb || addr.neighbourhood || addr.residential || addr.road || 'Current Location';

      // Check if matches known Pakistan city or find closest
      const match = cities.find(
        (c) => c.name.toLowerCase() === detectedCity.toLowerCase()
      );

      const cityName = match ? match.name : (detectedCity || findClosestPakistanCity(lat, lon, cities).city.name);
      return {
        city: cityName,
        area: detectedArea,
        address: data.display_name?.split(',').slice(0, 3).join(',') || `${detectedArea}, ${cityName}`,
      };
    }
  } catch {
    // Network / timeout fallback
  }

  // Pure geometry fallback
  const { city } = findClosestPakistanCity(lat, lon, cities);
  return {
    city: city.name,
    area: city.popularAreas[0] || 'Central Area',
    address: `${city.popularAreas[0] || 'Center'}, ${city.name}`,
  };
}
