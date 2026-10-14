import { getUVClassification, getWindDirection, getWeatherIconName } from '../src/utils/weatherIcons';
import { mapWeatherData } from '../src/services/weatherMapper';
import { CurrentWeatherResponse, ForecastResponse } from '../src/services/openWeatherApi';

describe('Weather utilities & mapper', () => {
  it('maps weather icon names correctly', () => {
    expect(getWeatherIconName('01d')).toBe('weather-sunny');
    expect(getWeatherIconName('01n')).toBe('weather-night');
    expect(getWeatherIconName('10d')).toBe('weather-partly-rainy');
    expect(getWeatherIconName('11d')).toBe('weather-lightning-rainy');
    expect(getWeatherIconName('unknown')).toBe('weather-partly-cloudy');
  });

  it('calculates wind directions properly', () => {
    expect(getWindDirection(0)).toBe('Bắc (N)');
    expect(getWindDirection(90)).toBe('Đông (E)');
    expect(getWindDirection(180)).toBe('Nam (S)');
    expect(getWindDirection(270)).toBe('Tây (W)');
  });

  it('classifies UV levels correctly', () => {
    expect(getUVClassification(2).level).toBe('Thấp');
    expect(getUVClassification(4.5).level).toBe('Trung bình');
    expect(getUVClassification(7).level).toBe('Cao');
    expect(getUVClassification(9.5).level).toBe('Rất cao');
    expect(getUVClassification(12).level).toBe('Nguy hại');
  });

  it('maps raw OpenWeather data to comprehensive WeatherData object', () => {
    const mockCurrent: CurrentWeatherResponse = {
      name: 'Hà Nội',
      coord: { lat: 21.0285, lon: 105.8542 },
      main: {
        temp: 30,
        feels_like: 34,
        temp_min: 28,
        temp_max: 32,
        pressure: 1012,
        humidity: 65,
      },
      weather: [{ id: 800, main: 'Clear', description: 'trời quang', icon: '01d' }],
      wind: { speed: 3.5, deg: 180 },
      clouds: { all: 10 },
      visibility: 10000,
      dt: 1700000000,
      sys: { country: 'VN', sunrise: 1699990000, sunset: 1700030000 },
    };

    const mockForecast: ForecastResponse = {
      city: { name: 'Hà Nội', country: 'VN' },
      list: [
        {
          dt: 1700003600,
          main: {
            temp: 29,
            feels_like: 32,
            temp_min: 27,
            temp_max: 31,
            pressure: 1012,
            humidity: 70,
          },
          weather: [{ id: 801, main: 'Clouds', description: 'mây rải rác', icon: '02d' }],
          pop: 0.2,
          wind: { speed: 2.5, deg: 160 },
          clouds: { all: 20 },
        },
      ],
    };

    const result = mapWeatherData(mockCurrent, mockForecast, 'Hà Nội');
    expect(result.locationName).toBe('Hà Nội');
    expect(result.temp).toBe(30);
    expect(result.feelsLike).toBe(34);
    expect(result.humidity).toBe(65);
    expect(result.windSpeed).toBe(13); // 3.5 * 3.6 = 12.6 => 13
    expect(result.windDirection).toBe('Nam (S)');
    expect(result.hourly.length).toBeGreaterThan(0);
    expect(result.daily.length).toBeGreaterThan(0);
  });
});
