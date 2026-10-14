import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Icon, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { HourlyForecastItem } from '../types/weather';
import { getWeatherIconName } from '../utils/weatherIcons';

interface Props {
  items: HourlyForecastItem[];
  title?: string;
  subtitle?: string;
  onSelectHour?: (item: HourlyForecastItem) => void;
}

export function HourlyForecastCard({
  items,
  title = 'Dự báo 24 giờ tiếp theo',
  subtitle = 'Vuốt ngang để xem chi tiết từng mốc giờ',
  onSelectHour,
}: Props) {
  const theme = useTheme();

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Title
        title={title}
        subtitle={subtitle}
        left={(props) => <Icon {...props} source="clock-outline" size={24} />}
        titleVariant="titleMedium"
        subtitleVariant="bodySmall"
      />
      <Card.Content style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.scrollList}
        >
          {items.map((item, index) => {
            const iconName = getWeatherIconName(item.icon);
            return (
              <TouchableRipple
                key={`${item.timestamp}-${index}`}
                onPress={() => onSelectHour?.(item)}
                borderless
                style={styles.touchableWrapper}
              >
                <Surface style={styles.hourItem} elevation={1}>
                  <Text variant="labelMedium" style={styles.timeText}>
                    {item.time}
                  </Text>
                  <View style={styles.iconContainer}>
                    <Icon source={iconName} size={30} />
                  </View>
                  <Text variant="titleMedium" style={styles.tempText}>
                    {item.temp}°
                  </Text>

                  {/* Clean unclipped Rain Probability Badge */}
                  <View
                    style={[
                      styles.popBadge,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <Icon
                      source="water-percent"
                      size={13}
                      color={theme.colors.onPrimaryContainer}
                    />
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.popLabel,
                        { color: theme.colors.onPrimaryContainer },
                      ]}
                    >
                      {item.pop}%
                    </Text>
                  </View>
                </Surface>
              </TouchableRipple>
            );
          })}
        </ScrollView>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 16,
  },
  scrollList: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  touchableWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  hourItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    minWidth: 80,
  },
  timeText: {
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.85,
  },
  iconContainer: {
    marginVertical: 4,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempText: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  popBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    gap: 2,
  },
  popLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
