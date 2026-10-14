import {
  CurrentWeatherResponse,
  ForecastItem,
  ForecastResponse,
} from './openWeatherApi';
import {
  DailyForecastItem,
  HourlyForecastItem,
  WeatherData,
} from '../types/weather';
import { getUVClassification, getWindDirection } from '../utils/weatherIcons';

const DAY_NAMES = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;
}

function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return `Ngày ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

function formatDayName(timestamp: number, isToday: boolean): string {
  if (isToday) return 'Hôm nay';
  return DAY_NAMES[new Date(timestamp * 1000).getDay()];
}

function capitalize(text?: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function estimateUV(clouds: number = 0, timestamp: number = Date.now() / 1000): number {
  const date = new Date(timestamp * 1000);
  const hour = date.getHours();
  if (hour < 6 || hour > 18) {
    return 0;
  }
  // Max solar irradiance at noon (hour 12)
  const peakFactor = Math.sin(((hour - 6) / 12) * Math.PI);
  const baseUV = peakFactor * 10.5;
  const cloudReduction = (100 - clouds * 0.6) / 100;
  return Math.max(0, Math.round(baseUV * cloudReduction * 10) / 10);
}

function toHourlyItem(item: ForecastItem): HourlyForecastItem {
  return {
    time: formatTime(item.dt),
    timestamp: item.dt,
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    icon: item.weather[0]?.icon || '01d',
    pop: Math.round((item.pop || 0) * 100),
    description: capitalize(item.weather[0]?.description),
    humidity: item.main.humidity,
    windSpeed: Math.round((item.wind.speed || 0) * 3.6),
    windDeg: item.wind.deg || 0,
    pressure: item.main.pressure,
  };
}

function groupByDay(items: ForecastItem[]): Record<string, ForecastItem[]> {
  const groups: Record<string, ForecastItem[]> = {};
  for (const item of items) {
    const date = new Date(item.dt * 1000);
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
  }
  return groups;
}

export function mapWeatherData(
  current: CurrentWeatherResponse,
  forecast: ForecastResponse,
  resolvedLocationName?: string
): WeatherData {
  const now = new Date();
  const currentTemp = Math.round(current.main.temp);
  const currentFeelsLike = Math.round(current.main.feels_like);
  const currentCondition = current.weather[0];
  const windKmH = Math.round((current.wind.speed || 0) * 3.6);
  const windDeg = current.wind.deg || 0;
  const windDirection = getWindDirection(windDeg);
  const clouds = current.clouds?.all ?? 20;
  const uv = estimateUV(clouds, current.dt);
  const uvClassification = getUVClassification(uv);
  const rain1h = current.rain?.['1h'] || current.rain?.['3h'] || 0;
  const visibilityKm = Math.round(((current.visibility || 10000) / 1000) * 10) / 10;

  const sunrise = current.sys?.sunrise
    ? formatTime(current.sys.sunrise)
    : forecast.city.sunrise
    ? formatTime(forecast.city.sunrise)
    : '06:00';
  const sunset = current.sys?.sunset
    ? formatTime(current.sys.sunset)
    : forecast.city.sunset
    ? formatTime(forecast.city.sunset)
    : '18:00';

  // Build 24-hour forecast from first 8-9 items of forecast
  const hourly24h: HourlyForecastItem[] = [
    {
      time: 'Bây giờ',
      timestamp: current.dt,
      temp: currentTemp,
      feelsLike: currentFeelsLike,
      pop: Math.round((forecast.list[0]?.pop || 0) * 100),
      icon: currentCondition?.icon || '01d',
      description: capitalize(currentCondition?.description),
      humidity: current.main.humidity,
      windSpeed: windKmH,
      windDeg,
      pressure: current.main.pressure,
    },
    ...forecast.list.slice(0, 8).map(toHourlyItem),
  ];

  // Group forecast by days
  const groupedDays = groupByDay(forecast.list);
  const todayKey = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  const daily: DailyForecastItem[] = Object.entries(groupedDays).map(
    ([dateKey, items], index) => {
      const isToday = dateKey === todayKey || index === 0;
      const middleItem = items[Math.floor(items.length / 2)] || items[0];

      const maxTemp = Math.max(...items.map((i) => i.main.temp_max));
      const minTemp = Math.min(...items.map((i) => i.main.temp_min));
      const maxPop = Math.max(...items.map((i) => i.pop || 0));
      const avgHumidity = Math.round(
        items.reduce((acc, i) => acc + i.main.humidity, 0) / items.length
      );
      const avgPressure = Math.round(
        items.reduce((acc, i) => acc + i.main.pressure, 0) / items.length
      );
      const avgWindSpeed = Math.round(
        (items.reduce((acc, i) => acc + (i.wind.speed || 0), 0) / items.length) * 3.6
      );
      const dayDeg = middleItem.wind.deg || 0;
      const dayClouds = middleItem.clouds?.all ?? 25;
      const dayUv = estimateUV(dayClouds, middleItem.dt);
      const dayRain = items.reduce((acc, i) => acc + (i.rain?.['3h'] || 0), 0);
      const dayVisibility = Math.round(
        (items.reduce((acc, i) => acc + (i.visibility || 10000), 0) /
          items.length /
          1000) *
          10
      ) / 10;

      return {
        id: dateKey,
        dayName: formatDayName(middleItem.dt, isToday),
        dateStr: formatDate(middleItem.dt),
        fullDate: formatFullDate(middleItem.dt),
        tempMax: Math.round(isToday ? Math.max(currentTemp, maxTemp) : maxTemp),
        tempMin: Math.round(isToday ? Math.min(currentTemp, minTemp) : minTemp),
        feelsLike: Math.round(middleItem.main.feels_like),
        icon: middleItem.weather[0]?.icon || '01d',
        pop: Math.round(maxPop * 100),
        description: capitalize(middleItem.weather[0]?.description),
        humidity: isToday ? current.main.humidity : avgHumidity,
        windSpeed: isToday ? windKmH : avgWindSpeed,
        windDeg: dayDeg,
        windDirection: getWindDirection(dayDeg),
        pressure: isToday ? current.main.pressure : avgPressure,
        clouds: isToday ? clouds : dayClouds,
        uvIndex: isToday ? uv : dayUv,
        uvLevel: isToday ? uvClassification.level : getUVClassification(dayUv).level,
        rainAmount: Math.round(dayRain * 10) / 10,
        visibility: isToday ? visibilityKm : dayVisibility,
        sunrise,
        sunset,
        hourlyDetails: items.map(toHourlyItem),
      };
    }
  );

  const locName = resolvedLocationName || current.name || forecast.city.name || 'Vị trí hiện tại';

  return {
    locationName: locName,
    country: current.sys?.country || forecast.city.country || 'VN',
    latitude: current.coord?.lat || 21.0285,
    longitude: current.coord?.lon || 105.8542,
    updatedAt: `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`,
    temp: currentTemp,
    feelsLike: currentFeelsLike,
    tempMax: daily[0]?.tempMax ?? currentTemp,
    tempMin: daily[0]?.tempMin ?? currentTemp,
    conditionText: capitalize(currentCondition?.description),
    conditionIcon: currentCondition?.icon || '01d',
    humidity: current.main.humidity,
    windSpeed: windKmH,
    windDeg,
    windDirection,
    uvIndex: uv,
    uvLevel: uvClassification.level,
    rainAmount: Math.round(rain1h * 10) / 10,
    rainPop: Math.round((forecast.list[0]?.pop || 0) * 100),
    pressure: current.main.pressure,
    visibility: visibilityKm,
    clouds,
    sunrise,
    sunset,
    hourly: hourly24h,
    daily,
  };
}
