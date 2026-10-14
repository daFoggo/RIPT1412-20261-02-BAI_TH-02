import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Icon, ProgressBar, Surface, Text, useTheme } from 'react-native-paper';
import { WeatherData } from '../types/weather';

interface Props {
  weather: WeatherData;
}

export function WeatherMetricsCard({ weather }: Props) {
  const theme = useTheme();

  // Normalized progress values (0 to 1)
  const tempProgress = Math.min(1, Math.max(0, (weather.temp - 10) / 35));
  const humidityProgress = Math.min(1, Math.max(0, weather.humidity / 100));
  const windProgress = Math.min(1, Math.max(0, weather.windSpeed / 60));
  const uvProgress = Math.min(1, Math.max(0, weather.uvIndex / 11));
  const rainPopProgress = Math.min(1, Math.max(0, weather.rainPop / 100));
  const pressureProgress = Math.min(
    1,
    Math.max(0, (weather.pressure - 970) / (1040 - 970))
  );
  const visibilityProgress = Math.min(1, Math.max(0, weather.visibility / 10));

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Title
        title="Theo dõi 8 chỉ số thời tiết"
        subtitle="Hiển thị trực quan các thông số môi trường"
        left={(props) => <Icon {...props} source="chart-box-outline" size={24} />}
        titleVariant="titleMedium"
        subtitleVariant="bodySmall"
      />
      <Card.Content style={styles.gridContainer}>
        {/* Metric 1: Nhiệt độ */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon source="thermometer" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Nhiệt độ
            </Text>
          </View>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {weather.temp}°C
          </Text>
          <ProgressBar progress={tempProgress} style={styles.progressBar} />
          <Text variant="bodySmall" style={styles.metricSub}>
            Cảm nhận {weather.feelsLike}°C
          </Text>
        </Surface>

        {/* Metric 2: Độ ẩm */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon source="water-percent" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Độ ẩm
            </Text>
          </View>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {weather.humidity}%
          </Text>
          <ProgressBar progress={humidityProgress} style={styles.progressBar} />
          <Text variant="bodySmall" style={styles.metricSub}>
            {weather.humidity > 70
              ? 'Ẩm ướt'
              : weather.humidity < 40
              ? 'Khô ráo'
              : 'Dễ chịu'}
          </Text>
        </Surface>

        {/* Metric 3: Tốc độ gió */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon source="weather-windy" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Tốc độ gió
            </Text>
          </View>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {weather.windSpeed}{' '}
            <Text variant="bodySmall" style={styles.unitText}>
              km/h
            </Text>
          </Text>
          <ProgressBar progress={windProgress} style={styles.progressBar} />
          <Text variant="bodySmall" style={styles.metricSub}>
            {weather.windSpeed > 25 ? 'Gió mạnh' : 'Gió nhẹ'}
          </Text>
        </Surface>

        {/* Metric 4: Hướng gió */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon source="compass-outline" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Hướng gió
            </Text>
          </View>
          <Text
            variant="titleMedium"
            numberOfLines={1}
            style={styles.metricValueTight}
          >
            {weather.windDirection}
          </Text>
          <ProgressBar
            progress={Math.min(1, weather.windDeg / 360)}
            style={styles.progressBar}
          />
          <Text variant="bodySmall" style={styles.metricSub}>
            Góc {weather.windDeg}°
          </Text>
        </Surface>

        {/* Metric 5: Chỉ số UV */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon
              source="white-balance-sunny"
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Chỉ số UV
            </Text>
          </View>
          <View style={styles.valueRow}>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {weather.uvIndex}
            </Text>
            {/* Unclipped Badge */}
            <View
              style={[
                styles.levelBadge,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              <Text
                variant="labelSmall"
                style={[
                  styles.levelText,
                  { color: theme.colors.onSecondaryContainer },
                ]}
              >
                {weather.uvLevel}
              </Text>
            </View>
          </View>
          <ProgressBar progress={uvProgress} style={styles.progressBar} />
        </Surface>

        {/* Metric 6: Lượng mưa & Khả năng mưa */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon source="weather-rainy" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Lượng mưa
            </Text>
          </View>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {weather.rainAmount}{' '}
            <Text variant="bodySmall" style={styles.unitText}>
              mm
            </Text>
          </Text>
          <ProgressBar progress={rainPopProgress} style={styles.progressBar} />
          <Text variant="bodySmall" style={styles.metricSub}>
            Xác suất mưa: {weather.rainPop}%
          </Text>
        </Surface>

        {/* Metric 7: Áp suất */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon source="gauge" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Áp suất
            </Text>
          </View>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {weather.pressure}{' '}
            <Text variant="bodySmall" style={styles.unitText}>
              hPa
            </Text>
          </Text>
          <ProgressBar progress={pressureProgress} style={styles.progressBar} />
          <Text variant="bodySmall" style={styles.metricSub}>
            {weather.pressure >= 1013 ? 'Bình thường' : 'Áp suất thấp'}
          </Text>
        </Surface>

        {/* Metric 8: Tầm nhìn */}
        <Surface style={styles.metricItem} elevation={1}>
          <View style={styles.metricHeader}>
            <Icon source="eye-outline" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.metricTitle}>
              Tầm nhìn
            </Text>
          </View>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {weather.visibility}{' '}
            <Text variant="bodySmall" style={styles.unitText}>
              km
            </Text>
          </Text>
          <ProgressBar progress={visibilityProgress} style={styles.progressBar} />
          <Text variant="bodySmall" style={styles.metricSub}>
            {weather.visibility >= 10 ? 'Rõ ràng' : 'Bị hạn chế'}
          </Text>
        </Surface>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  metricItem: {
    width: '48%',
    minHeight: 136,
    padding: 12,
    borderRadius: 14,
    justifyContent: 'space-between',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricTitle: {
    opacity: 0.85,
    fontWeight: '600',
  },
  metricValue: {
    fontWeight: 'bold',
    marginVertical: 2,
  },
  metricValueTight: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  unitText: {
    fontSize: 12,
    fontWeight: 'normal',
    opacity: 0.7,
  },
  metricSub: {
    opacity: 0.75,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginVertical: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
