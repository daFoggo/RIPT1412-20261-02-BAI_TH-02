/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  requestAuthorization: jest.fn(),
}));

jest.mock('../src/services/weatherService', () => ({
  fetchWeatherData: jest.fn().mockResolvedValue({
    locationName: 'Hà Nội',
    country: 'VN',
    latitude: 21.0285,
    longitude: 105.8542,
    updatedAt: '12:00',
    temp: 28,
    feelsLike: 31,
    tempMax: 30,
    tempMin: 25,
    conditionText: 'Trời quang đãng',
    conditionIcon: '01d',
    humidity: 60,
    windSpeed: 10,
    windDeg: 180,
    windDirection: 'Nam (S)',
    uvIndex: 5,
    uvLevel: 'Trung bình',
    rainAmount: 0,
    rainPop: 10,
    pressure: 1013,
    visibility: 10,
    clouds: 20,
    sunrise: '06:00',
    sunset: '18:00',
    hourly: [],
    daily: [],
  }),
  searchLocations: jest.fn().mockResolvedValue([]),
}));

import App from '../App';

test('App renders without crashing', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
