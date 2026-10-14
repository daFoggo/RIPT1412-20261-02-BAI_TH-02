const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = '60af0469c67566cbc9ed6a747b72bd23';

export interface OpenWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherResponse {
  coord?: {
    lat: number;
    lon: number;
  };
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: OpenWeatherCondition[];
  wind: {
    speed: number;
    deg?: number;
  };
  clouds?: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  visibility?: number;
  sys?: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  dt: number;
}

export interface ForecastItem {
  dt: number;
  dt_txt?: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: OpenWeatherCondition[];
  pop?: number;
  wind: {
    speed: number;
    deg?: number;
  };
  clouds?: {
    all: number;
  };
  rain?: {
    '3h'?: number;
  };
  visibility?: number;
}

export interface ForecastResponse {
  city: {
    name: string;
    country: string;
    sunrise?: number;
    sunset?: number;
  };
  list: ForecastItem[];
}

export interface GeocodingItem {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

async function requestJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenWeather API error (${response.status}): ${errorText || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeatherResponse> {
  const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`;
  return requestJson<CurrentWeatherResponse>(url);
}

export function getForecast(lat: number, lon: number): Promise<ForecastResponse> {
  const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`;
  return requestJson<ForecastResponse>(url);
}

export function searchCities(query: string, limit: number = 6): Promise<GeocodingItem[]> {
  const url = `${GEO_BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  return requestJson<GeocodingItem[]>(url);
}

export function reverseGeocode(lat: number, lon: number): Promise<GeocodingItem[]> {
  const url = `${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  return requestJson<GeocodingItem[]>(url);
}
