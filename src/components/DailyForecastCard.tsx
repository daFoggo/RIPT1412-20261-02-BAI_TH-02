import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, DataTable, Icon, Text, useTheme } from 'react-native-paper';
import { DailyForecastItem } from '../types/weather';
import { getWeatherIconName } from '../utils/weatherIcons';

interface Props {
  items: DailyForecastItem[];
  selectedDayId?: string;
  onSelectDay: (day: DailyForecastItem) => void;
}

export function DailyForecastCard({ items, selectedDayId, onSelectDay }: Props) {
  const theme = useTheme();

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Title
        title="Dự báo 5–7 ngày tới"
        subtitle="Chạm vào một ngày để xem chi tiết đầy đủ"
        left={(props) => <Icon {...props} source="calendar-range" size={24} />}
        titleVariant="titleMedium"
        subtitleVariant="bodySmall"
      />
      <Card.Content style={styles.content}>
        <DataTable>
          <DataTable.Header style={styles.header}>
            <DataTable.Title style={styles.dayCol}>Ngày</DataTable.Title>
            <DataTable.Title style={styles.conditionCol}>Thời tiết</DataTable.Title>
            <DataTable.Title numeric style={styles.rainCol}>Mưa</DataTable.Title>
            <DataTable.Title numeric style={styles.tempCol}>Thấp / Cao</DataTable.Title>
          </DataTable.Header>

          {items.map((day) => {
            const iconName = getWeatherIconName(day.icon);
            const isSelected = selectedDayId === day.id;

            return (
              <DataTable.Row
                key={day.id}
                onPress={() => onSelectDay(day)}
                style={[styles.row, isSelected && styles.selectedRow]}
              >
                <DataTable.Cell style={styles.dayCol}>
                  <View style={styles.dayColInner}>
                    <Text variant="labelLarge" style={styles.dayName}>
                      {day.dayName}
                    </Text>
                    <Text variant="labelSmall" style={styles.dateStr}>
                      {day.dateStr}
                    </Text>
                  </View>
                </DataTable.Cell>

                <DataTable.Cell style={styles.conditionCol}>
                  <View style={styles.conditionContainer}>
                    <Icon source={iconName} size={22} />
                    <Text
                      variant="bodySmall"
                      numberOfLines={1}
                      style={styles.conditionText}
                    >
                      {day.description}
                    </Text>
                  </View>
                </DataTable.Cell>

                <DataTable.Cell numeric style={styles.rainCol}>
                  <View
                    style={[
                      styles.rainBadge,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <Icon
                      source="water-percent"
                      size={12}
                      color={theme.colors.onPrimaryContainer}
                    />
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.rainBadgeText,
                        { color: theme.colors.onPrimaryContainer },
                      ]}
                    >
                      {day.pop}%
                    </Text>
                  </View>
                </DataTable.Cell>

                <DataTable.Cell numeric style={styles.tempCol}>
                  <Text variant="labelMedium" style={styles.tempRange}>
                    {day.tempMin}° / <Text style={styles.boldTemp}>{day.tempMax}°</Text>
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
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
    paddingBottom: 4,
  },
  header: {
    paddingHorizontal: 12,
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  dayCol: {
    flex: 1.3,
  },
  dayColInner: {
    justifyContent: 'center',
  },
  conditionCol: {
    flex: 2.1,
  },
  rainCol: {
    flex: 1.1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tempCol: {
    flex: 1.4,
    justifyContent: 'flex-end',
  },
  dayName: {
    fontWeight: 'bold',
  },
  dateStr: {
    opacity: 0.65,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conditionText: {
    flex: 1,
    fontSize: 12,
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  rainBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tempRange: {
    opacity: 0.85,
  },
  boldTemp: {
    fontWeight: 'bold',
  },
  selectedRow: {
    opacity: 0.75,
  },
});
