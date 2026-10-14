/**
 * Utility to map weather codes and OpenWeather icon strings to MaterialCommunityIcons
 */
export function getWeatherIconName(iconCode?: string): string {
  if (!iconCode) return 'weather-partly-cloudy';

  switch (iconCode) {
    case '01d':
      return 'weather-sunny';
    case '01n':
      return 'weather-night';
    case '02d':
      return 'weather-partly-cloudy';
    case '02n':
      return 'weather-night-partly-cloudy';
    case '03d':
    case '03n':
      return 'weather-cloudy';
    case '04d':
    case '04n':
      return 'weather-cloudy-alert';
    case '09d':
    case '09n':
      return 'weather-pouring';
    case '10d':
      return 'weather-partly-rainy';
    case '10n':
      return 'weather-rainy';
    case '11d':
    case '11n':
      return 'weather-lightning-rainy';
    case '13d':
    case '13n':
      return 'weather-snowy-heavy';
    case '50d':
    case '50n':
      return 'weather-fog';
    default:
      return 'weather-partly-cloudy';
  }
}

/**
 * Calculate cardinal wind direction from degrees
 */
export function getWindDirection(deg: number): string {
  const directions = [
    'Bắc (N)',
    'Đông Bắc (NE)',
    'Đông (E)',
    'Đông Nam (SE)',
    'Nam (S)',
    'Tây Nam (SW)',
    'Tây (W)',
    'Tây Bắc (NW)',
  ];
  const index = Math.round(((deg % 360) / 45)) % 8;
  return directions[index];
}

/**
 * Calculate UV index classification
 */
export function getUVClassification(uv: number): { level: string; color?: string } {
  if (uv < 3) {
    return { level: 'Thấp' };
  } else if (uv < 6) {
    return { level: 'Trung bình' };
  } else if (uv < 8) {
    return { level: 'Cao' };
  } else if (uv < 11) {
    return { level: 'Rất cao' };
  } else {
    return { level: 'Nguy hại' };
  }
}
