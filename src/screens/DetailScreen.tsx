import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Card,
  Divider,
  Icon,
  List,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { HourlyForecastCard } from '../components/HourlyForecastCard';
import { fetchWeatherData } from '../services/weatherService';
import { DailyForecastItem, WeatherData } from '../types/weather';
import { getWeatherIconName } from '../utils/weatherIcons';

interface Props {
  route?: any;
}

export function DetailScreen({ route }: Props) {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    fetchWeatherData()
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load detail weather:', err);
        setLoading(false);
      });
  }, []);

  // If navigated with target day index
  useEffect(() => {
    if (route?.params?.dayIndex !== undefined) {
      setSelectedDayIndex(route.params.dayIndex);
    }
  }, [route?.params?.dayIndex]);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Đang tải dữ liệu chi tiết...
        </Text>
      </View>
    );
  }

  if (!weatherData || !weatherData.daily.length) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleMedium">Không có dữ liệu thời tiết.</Text>
      </View>
    );
  }

  const selectedDay: DailyForecastItem =
    weatherData.daily[selectedDayIndex] || weatherData.daily[0];
  const iconName = getWeatherIconName(selectedDay.icon);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Content
          title="Dự Báo Chi Tiết"
          subtitle={weatherData.locationName}
        />
        <Appbar.Action
          icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
          onPress={toggleTheme}
          accessibilityLabel="Chuyển chế độ sáng/tối"
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Interactive Calendar Day Strip */}
        <Surface style={styles.dayStripContainer} elevation={1}>
          <Text variant="labelMedium" style={styles.stripTitle}>
            CHỌN NGÀY DỰ BÁO:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.stripScroll}
          >
            {weatherData.daily.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              const dayIcon = getWeatherIconName(day.icon);

              return (
                <TouchableRipple
                  key={day.id}
                  onPress={() => setSelectedDayIndex(idx)}
                  style={[
                    styles.dayStripItem,
                    isSelected && {
                      backgroundColor: theme.colors.primaryContainer,
                      borderColor: theme.colors.primary,
                      borderWidth: 1.5,
                    },
                  ]}
                  borderless
                >
                  <View style={styles.dayStripInner}>
                    <Text
                      variant="labelMedium"
                      style={[
                        styles.stripDayName,
                        isSelected && {
                          color: theme.colors.onPrimaryContainer,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      {day.dayName}
                    </Text>
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.stripDate,
                        isSelected && { color: theme.colors.onPrimaryContainer },
                      ]}
                    >
                      {day.dateStr}
                    </Text>
                    <View style={styles.stripIconBox}>
                      <Icon source={dayIcon} size={26} />
                    </View>
                    <Text
                      variant="labelMedium"
                      style={[
                        styles.stripTemp,
                        isSelected && {
                          color: theme.colors.onPrimaryContainer,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      {day.tempMax}°
                    </Text>
                  </View>
                </TouchableRipple>
              );
            })}
          </ScrollView>
        </Surface>

        {/* Selected Day Hero Overview Card */}
        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <View style={styles.heroRow}>
              <View style={styles.heroTextContainer}>
                <Text variant="headlineSmall" style={styles.boldText}>
                  {selectedDay.dayName}
                </Text>
                <Text variant="bodySmall" style={styles.subText}>
                  {selectedDay.fullDate}
                </Text>
                <Text variant="titleMedium" style={styles.conditionText}>
                  {selectedDay.description}
                </Text>
              </View>
              <View style={styles.heroIconBox}>
                <Icon source={iconName} size={56} />
              </View>
            </View>

            {/* High/Low Temperature Badges */}
            <View style={styles.heroStatsRow}>
              <Surface style={styles.heroStatItem} elevation={1}>
                <View style={styles.statHeader}>
                  <Icon source="arrow-up" size={16} color={theme.colors.error} />
                  <Text variant="labelSmall">Cao nhất</Text>
                </View>
                <Text variant="titleLarge" style={styles.boldText}>
                  {selectedDay.tempMax}°C
                </Text>
              </Surface>

              <Surface style={styles.heroStatItem} elevation={1}>
                <View style={styles.statHeader}>
                  <Icon source="arrow-down" size={16} color={theme.colors.primary} />
                  <Text variant="labelSmall">Thấp nhất</Text>
                </View>
                <Text variant="titleLarge" style={styles.boldText}>
                  {selectedDay.tempMin}°C
                </Text>
              </Surface>

              <Surface style={styles.heroStatItem} elevation={1}>
                <View style={styles.statHeader}>
                  <Icon
                    source="water-percent"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text variant="labelSmall">Tỉ lệ mưa</Text>
                </View>
                <Text variant="titleLarge" style={styles.boldText}>
                  {selectedDay.pop}%
                </Text>
              </Surface>
            </View>
          </Card.Content>
        </Card>

        {/* Hourly progression for this specific selected day */}
        {selectedDay.hourlyDetails && selectedDay.hourlyDetails.length > 0 && (
          <HourlyForecastCard
            items={selectedDay.hourlyDetails}
            title="Diễn biến theo giờ"
            subtitle="Nhiệt độ và thời tiết từng mốc trong ngày"
          />
        )}

        {/* Comprehensive Environmental Metrics List */}
        <Card mode="elevated" style={styles.card}>
          <Card.Title
            title="Các chỉ số khí quyển chi tiết"
            left={(props) => <Icon {...props} source="tune-vertical" size={24} />}
            titleVariant="titleMedium"
          />
          <Card.Content style={styles.listContent}>
            <List.Item
              title="Độ ẩm không khí"
              description={`${selectedDay.humidity}% (${
                selectedDay.humidity > 70
                  ? 'Độ ẩm cao'
                  : selectedDay.humidity < 40
                  ? 'Khô ráo'
                  : 'Dễ chịu'
              })`}
              left={(props) => (
                <List.Icon {...props} icon="water-percent" color={theme.colors.primary} />
              )}
            />
            <Divider />
            <List.Item
              title="Gió & Hướng di chuyển"
              description={`${selectedDay.windSpeed} km/h • Hướng ${selectedDay.windDirection} (${selectedDay.windDeg}°)`}
              left={(props) => (
                <List.Icon {...props} icon="weather-windy" color={theme.colors.primary} />
              )}
            />
            <Divider />
            <List.Item
              title="Chỉ số tia UV"
              description={`Mức ${selectedDay.uvIndex} (${selectedDay.uvLevel})`}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="white-balance-sunny"
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Lượng mưa dự kiến"
              description={`${selectedDay.rainAmount} mm`}
              left={(props) => (
                <List.Icon {...props} icon="weather-rainy" color={theme.colors.primary} />
              )}
            />
            <Divider />
            <List.Item
              title="Áp suất khí quyển"
              description={`${selectedDay.pressure} hPa`}
              left={(props) => (
                <List.Icon {...props} icon="gauge" color={theme.colors.primary} />
              )}
            />
            <Divider />
            <List.Item
              title="Tầm nhìn xa"
              description={`${selectedDay.visibility} km`}
              left={(props) => (
                <List.Icon {...props} icon="eye-outline" color={theme.colors.primary} />
              )}
            />
            {selectedDay.sunrise && (
              <>
                <Divider />
                <List.Item
                  title="Mặt trời mọc & lặn"
                  description={`Bình minh: ${selectedDay.sunrise} • Hoàng hôn: ${selectedDay.sunset}`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="weather-sunset-up"
                      color={theme.colors.primary}
                    />
                  )}
                />
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  dayStripContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    paddingVertical: 12,
    borderRadius: 16,
  },
  stripTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  stripScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dayStripItem: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  dayStripInner: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 70,
  },
  stripDayName: {
    fontWeight: '600',
  },
  stripDate: {
    opacity: 0.7,
    marginBottom: 4,
  },
  stripIconBox: {
    marginVertical: 4,
  },
  stripTemp: {
    marginTop: 2,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
  subText: {
    opacity: 0.7,
    marginTop: 2,
  },
  conditionText: {
    marginTop: 6,
    fontWeight: '700',
  },
  heroIconBox: {
    padding: 4,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  heroStatItem: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  listContent: {
    paddingHorizontal: 0,
  },
});

export default DetailScreen;
