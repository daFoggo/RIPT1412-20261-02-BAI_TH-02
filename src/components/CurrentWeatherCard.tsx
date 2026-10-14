import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Icon, Surface, Text, useTheme } from 'react-native-paper';
import { WeatherData } from '../types/weather';
import { getWeatherIconName } from '../utils/weatherIcons';

interface Props {
  weather: WeatherData;
}

export function CurrentWeatherCard({ weather }: Props) {
  const theme = useTheme();
  const iconName = getWeatherIconName(weather.conditionIcon);

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {/* Top Location & Update time */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text variant="headlineSmall" style={styles.locationTitle}>
              {weather.locationName}
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Cập nhật lúc {weather.updatedAt}
            </Text>
          </View>
          <Avatar.Icon
            size={52}
            icon={iconName}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
          />
        </View>

        {/* Big Temperature & Condition text */}
        <View style={styles.tempContainer}>
          <Text variant="displayLarge" style={styles.tempText}>
            {weather.temp}°
          </Text>
          <View style={styles.tempMeta}>
            <Text variant="titleMedium" style={styles.conditionText}>
              {weather.conditionText}
            </Text>
            <Text variant="bodyMedium" style={styles.feelsLikeText}>
              Cảm nhận: {weather.feelsLike}°C
            </Text>
          </View>
        </View>

        {/* Metric Badges Row */}
        <View style={styles.badgeRow}>
          <Surface style={styles.badge} elevation={1}>
            <Icon source="arrow-up" size={16} color={theme.colors.error} />
            <Text variant="labelMedium" style={styles.badgeText}>
              Cao: {weather.tempMax}°
            </Text>
          </Surface>

          <Surface style={styles.badge} elevation={1}>
            <Icon source="arrow-down" size={16} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.badgeText}>
              Thấp: {weather.tempMin}°
            </Text>
          </Surface>

          <Surface style={styles.badge} elevation={1}>
            <Icon source="water-percent" size={16} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.badgeText}>
              Mưa: {weather.rainPop}%
            </Text>
          </Surface>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardContent: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  locationTitle: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 2,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tempText: {
    fontWeight: 'bold',
    marginRight: 16,
    fontSize: 64,
    lineHeight: 72,
  },
  tempMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  conditionText: {
    fontWeight: '700',
    marginBottom: 4,
  },
  feelsLikeText: {
    opacity: 0.8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
  },
  badgeText: {
    fontWeight: '600',
  },
});
