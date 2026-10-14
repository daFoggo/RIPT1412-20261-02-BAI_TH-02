import {
  getCurrentWeather,
  getForecast,
  reverseGeocode,
  searchCities,
} from './openWeatherApi';
import { mapWeatherData } from './weatherMapper';
import { GeoLocationResult, WeatherData } from '../types/weather';

export const DEFAULT_LAT = 21.0285;
export const DEFAULT_LON = 105.8542;
export const DEFAULT_LOCATION_NAME = 'Hà Nội';

export async function fetchWeatherData(
  lat: number = DEFAULT_LAT,
  lon: number = DEFAULT_LON,
  customLocationName?: string
): Promise<WeatherData> {
  const [current, forecast, reverseGeo] = await Promise.all([
    getCurrentWeather(lat, lon),
    getForecast(lat, lon),
    reverseGeocode(lat, lon).catch(() => []),
  ]);

  let resolvedName = customLocationName;
  if (!resolvedName) {
    if (reverseGeo && reverseGeo.length > 0) {
      resolvedName =
        reverseGeo[0].local_names?.vi ||
        reverseGeo[0].local_names?.en ||
        reverseGeo[0].name;
    } else {
      resolvedName = current.name || DEFAULT_LOCATION_NAME;
    }
  }

  return mapWeatherData(current, forecast, resolvedName);
}

export async function searchLocations(query: string): Promise<GeoLocationResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }
  const results = await searchCities(query.trim());
  return results.map((item) => ({
    name: item.name,
    localName: item.local_names?.vi || item.local_names?.en || item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
    state: item.state,
  }));
}
