import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Banner,
  Button,
  Card,
  HelperText,
  SegmentedButtons,
  Snackbar,
  Text,
} from 'react-native-paper';
import { CurrentWeatherCard } from '../components/CurrentWeatherCard';
import { DailyForecastCard } from '../components/DailyForecastCard';
import { HourlyForecastCard } from '../components/HourlyForecastCard';
import { WeatherMetricsCard } from '../components/WeatherMetricsCard';
import { WeatherDetailDialog } from '../components/WeatherDetailDialog';
import { useAppTheme } from '../context/ThemeContext';
import {
  DEFAULT_COORDINATES,
  getCurrentCoordinates,
  requestLocationPermission,
} from '../services/locationService';
import { fetchWeatherData } from '../services/weatherService';
import {
  DailyForecastItem,
  HourlyForecastItem,
  WeatherData,
} from '../types/weather';

interface Props {
  navigation: any;
  route?: any;
}

export function WeatherScreen({ navigation, route }: Props) {
  const { theme, isDarkMode, toggleTheme } = useAppTheme();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationBannerMessage, setLocationBannerMessage] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState('all');

  const [selectedDay, setSelectedDay] = useState<DailyForecastItem | null>(null);
  const [selectedHour, setSelectedHour] = useState<HourlyForecastItem | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [snackbarText, setSnackbarText] = useState<string | null>(null);

  const loadWeather = useCallback(
    async (lat?: number, lon?: number, locName?: string) => {
      try {
        setErrorMessage(null);
        let targetLat = lat;
        let targetLon = lon;

        if (targetLat === undefined || targetLon === undefined) {
          const hasPermission = await requestLocationPermission();
          if (hasPermission) {
            const pos = await getCurrentCoordinates();
            if (pos.error) {
              setLocationBannerMessage(pos.error);
            } else {
              setLocationBannerMessage(null);
            }
            targetLat = pos.latitude;
            targetLon = pos.longitude;
          } else {
            setLocationBannerMessage(
              'Quyền truy cập vị trí bị từ chối. Ứng dụng hiển thị thời tiết mặc định tại Hà Nội.'
            );
            targetLat = DEFAULT_COORDINATES.latitude;
            targetLon = DEFAULT_COORDINATES.longitude;
          }
        }

        const data = await fetchWeatherData(targetLat, targetLon, locName);
        setWeatherData(data);
      } catch (err) {
        console.error('Failed to load weather data:', err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Không thể kết nối đến máy chủ thời tiết.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    if (route?.params?.city) {
      const city = route.params.city;
      setLoading(true);
      loadWeather(city.lat, city.lon, city.localName || city.name);
      setSnackbarText(`Đã chuyển vị trí sang: ${city.localName || city.name}`);
    } else {
      loadWeather();
    }
  }, [loadWeather, route?.params?.city]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (weatherData) {
      await loadWeather(
        weatherData.latitude,
        weatherData.longitude,
        weatherData.locationName
      );
    } else {
      await loadWeather();
    }
    setSnackbarText('Đã cập nhật dữ liệu thời tiết mới nhất.');
  }, [loadWeather, weatherData]);

  const handleRequestGPS = async () => {
    setLocationBannerMessage(null);
    setLoading(true);
    setSnackbarText('Đang xác định vị trí qua GPS...');
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setLocationBannerMessage(
        'Bạn chưa cấp quyền vị trí. Vui lòng cấp quyền trong Cài đặt thiết bị.'
      );
      setLoading(false);
      return;
    }
    const pos = await getCurrentCoordinates();
    if (pos.error) {
      setLocationBannerMessage(pos.error);
    }
    await loadWeather(pos.latitude, pos.longitude);
    setSnackbarText('Đã định vị thành công vị trí hiện tại.');
  };

  const handleSelectDay = (day: DailyForecastItem) => {
    setSelectedDay(day);
    setSelectedHour(null);
    setDialogVisible(true);
  };

  const handleSelectHour = (hour: HourlyForecastItem) => {
    setSelectedHour(hour);
    setSelectedDay(null);
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setSelectedDay(null);
    setSelectedHour(null);
  };

  const handleNavigateToDayDetail = (day: DailyForecastItem) => {
    const dayIdx = weatherData?.daily.findIndex((d) => d.id === day.id);
    navigation.navigate('Detail', {
      dayIndex: dayIdx !== undefined && dayIdx >= 0 ? dayIdx : 0,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Appbar Header with Dark Mode, GPS, Search, Refresh */}
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Action
          icon="crosshairs-gps"
          onPress={handleRequestGPS}
          accessibilityLabel="Lấy vị trí GPS"
        />
        <Appbar.Content
          title={weatherData?.locationName || 'Dự Báo Thời Tiết'}
          subtitle={weatherData ? `Cập nhật: ${weatherData.updatedAt}` : undefined}
        />
        <Appbar.Action
          icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
          onPress={toggleTheme}
          accessibilityLabel="Chuyển chế độ sáng/tối"
        />
        <Appbar.Action
          icon="magnify"
          onPress={() => navigation.navigate('Search')}
          accessibilityLabel="Tìm kiếm thành phố"
        />
        <Appbar.Action
          icon="refresh"
          onPress={onRefresh}
          accessibilityLabel="Làm mới"
        />
      </Appbar.Header>

      {/* Location Permission / GPS Error Banner */}
      <Banner
        visible={!!locationBannerMessage}
        actions={[
          {
            label: 'Cấp lại quyền GPS',
            onPress: handleRequestGPS,
          },
          {
            label: 'Đóng',
            onPress: () => setLocationBannerMessage(null),
          },
        ]}
        icon="map-marker-alert-outline"
      >
        {locationBannerMessage}
      </Banner>

      {/* Segmented Buttons for quick view switching */}
      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={activeSegment}
          onValueChange={setActiveSegment}
          buttons={[
            { value: 'all', label: 'Tất cả' },
            { value: 'hourly', label: '24 Giờ' },
            { value: 'daily', label: '5 Ngày' },
            { value: 'metrics', label: '8 Chỉ số' },
          ]}
        />
      </View>

      {/* Main Content Area */}
      {loading ? (
        <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator animating={true} size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Đang tải dữ liệu thời tiết...
          </Text>
        </View>
      ) : errorMessage ? (
        <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
          <Card mode="elevated" style={styles.errorCard}>
            <Card.Title
              title="Không thể tải thời tiết"
              left={(props) => <Appbar.Action {...props} icon="alert-circle-outline" />}
            />
            <Card.Content>
              <HelperText type="error" visible={true}>
                {errorMessage}
              </HelperText>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => loadWeather()}>
                Thử lại
              </Button>
            </Card.Actions>
          </Card>
        </View>
      ) : weatherData ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Current weather summary card */}
          <CurrentWeatherCard weather={weatherData} />

          {/* 24-Hour Forecast */}
          {(activeSegment === 'all' || activeSegment === 'hourly') && (
            <HourlyForecastCard
              items={weatherData.hourly}
              onSelectHour={handleSelectHour}
            />
          )}

          {/* 5-7 Days Forecast */}
          {(activeSegment === 'all' || activeSegment === 'daily') && (
            <DailyForecastCard
              items={weatherData.daily}
              selectedDayId={selectedDay?.id}
              onSelectDay={handleSelectDay}
            />
          )}

          {/* 8 Detailed Weather Metrics */}
          {(activeSegment === 'all' || activeSegment === 'metrics') && (
            <WeatherMetricsCard weather={weatherData} />
          )}
        </ScrollView>
      ) : null}

      {/* Weather Detail Dialog */}
      <WeatherDetailDialog
        visible={dialogVisible}
        day={selectedDay}
        hour={selectedHour}
        onDismiss={handleCloseDialog}
        onViewMoreDetails={handleNavigateToDayDetail}
      />

      {/* Notification Snackbar */}
      <Snackbar
        visible={!!snackbarText}
        onDismiss={() => setSnackbarText(null)}
        duration={3000}
        action={{
          label: 'Đóng',
          onPress: () => setSnackbarText(null),
        }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
  },
});

export default WeatherScreen;
