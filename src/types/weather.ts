export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface HourlyForecastItem {
  time: string;
  timestamp: number;
  temp: number;
  feelsLike: number;
  pop: number; // Probability of precipitation (0-100%)
  icon: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  pressure: number;
}

export interface DailyForecastItem {
  id: string;
  dayName: string;
  dateStr: string;
  fullDate: string;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  icon: string;
  pop: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  windDirection: string;
  pressure: number;
  clouds: number;
  uvIndex: number;
  uvLevel: string;
  rainAmount: number;
  visibility: number;
  sunrise?: string;
  sunset?: string;
  hourlyDetails: HourlyForecastItem[];
}

export interface WeatherData {
  locationName: string;
  country: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
  temp: number;
  feelsLike: number;
  tempMax: number;
  tempMin: number;
  conditionText: string;
  conditionIcon: string;
  humidity: number;
  windSpeed: number; // km/h
  windDeg: number;
  windDirection: string;
  uvIndex: number;
  uvLevel: string;
  rainAmount: number; // mm
  rainPop: number; // %
  pressure: number; // hPa
  visibility: number; // km
  clouds: number; // %
  sunrise: string;
  sunset: string;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export interface GeoLocationResult {
  name: string;
  localName?: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
