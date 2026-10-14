import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  DataTable,
  Dialog,
  Divider,
  Icon,
  List,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { DailyForecastItem, HourlyForecastItem } from '../types/weather';
import { getWeatherIconName } from '../utils/weatherIcons';

interface Props {
  visible: boolean;
  day?: DailyForecastItem | null;
  hour?: HourlyForecastItem | null;
  onDismiss: () => void;
  onViewMoreDetails?: (day: DailyForecastItem) => void;
}

export function WeatherDetailDialog({
  visible,
  day,
  hour,
  onDismiss,
  onViewMoreDetails,
}: Props) {
  const theme = useTheme();
  if (!day && !hour) return null;

  const isDaily = !!day;
  const title = isDaily
    ? `${day.dayName} (${day.dateStr})`
    : `Chi tiết lúc ${hour?.time}`;
  const iconName = getWeatherIconName(isDaily ? day.icon : hour?.icon);
  const description = isDaily ? day.description : hour?.description;
  const tempText = isDaily
    ? `Thấp: ${day.tempMin}°C • Cao: ${day.tempMax}°C`
    : `Nhiệt độ: ${hour?.temp}°C (Cảm nhận: ${hour?.feelsLike}°C)`;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Overview header */}
            <View style={styles.headerRow}>
              <Icon source={iconName} size={46} />
              <View style={styles.headerInfo}>
                <Text variant="titleMedium" style={styles.conditionText}>
                  {description}
                </Text>
                <Text variant="bodyMedium">{tempText}</Text>
                <View
                  style={[
                    styles.rainBadge,
                    { backgroundColor: theme.colors.primaryContainer },
                  ]}
                >
                  <Icon
                    source="water-percent"
                    size={14}
                    color={theme.colors.onPrimaryContainer}
                  />
                  <Text
                    variant="labelSmall"
                    style={{
                      color: theme.colors.onPrimaryContainer,
                      fontWeight: '700',
                    }}
                  >
                    Khả năng mưa: {isDaily ? day.pop : hour?.pop}%
                  </Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Metrics List */}
            <List.Section title="Thông số khí quyển">
              {isDaily && (
                <>
                  <List.Item
                    title="Nhiệt độ cảm nhận"
                    description={`${day.feelsLike}°C`}
                    left={(props) => (
                      <List.Icon {...props} icon="thermometer" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Độ ẩm không khí"
                    description={`${day.humidity}%`}
                    left={(props) => (
                      <List.Icon {...props} icon="water-percent" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Gió & Hướng gió"
                    description={`${day.windSpeed} km/h • ${day.windDirection}`}
                    left={(props) => (
                      <List.Icon {...props} icon="weather-windy" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Chỉ số tia UV"
                    description={`Mức ${day.uvIndex} (${day.uvLevel})`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="white-balance-sunny"
                        color={theme.colors.primary}
                      />
                    )}
                  />
                  <List.Item
                    title="Lượng mưa dự kiến"
                    description={`${day.rainAmount} mm`}
                    left={(props) => (
                      <List.Icon {...props} icon="weather-rainy" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Áp suất khí quyển"
                    description={`${day.pressure} hPa`}
                    left={(props) => (
                      <List.Icon {...props} icon="gauge" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Tầm nhìn xa"
                    description={`${day.visibility} km`}
                    left={(props) => (
                      <List.Icon {...props} icon="eye-outline" color={theme.colors.primary} />
                    )}
                  />
                </>
              )}

              {!isDaily && hour && (
                <>
                  <List.Item
                    title="Nhiệt độ"
                    description={`${hour.temp}°C (Cảm nhận ${hour.feelsLike}°C)`}
                    left={(props) => (
                      <List.Icon {...props} icon="thermometer" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Độ ẩm"
                    description={`${hour.humidity}%`}
                    left={(props) => (
                      <List.Icon {...props} icon="water-percent" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Tốc độ gió"
                    description={`${hour.windSpeed} km/h`}
                    left={(props) => (
                      <List.Icon {...props} icon="weather-windy" color={theme.colors.primary} />
                    )}
                  />
                  <List.Item
                    title="Áp suất"
                    description={`${hour.pressure} hPa`}
                    left={(props) => (
                      <List.Icon {...props} icon="gauge" color={theme.colors.primary} />
                    )}
                  />
                </>
              )}
            </List.Section>

            {/* If daily, show hourly progression table */}
            {isDaily && day.hourlyDetails && day.hourlyDetails.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Text variant="titleSmall" style={styles.subHeading}>
                  Mốc giờ trong ngày:
                </Text>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Giờ</DataTable.Title>
                    <DataTable.Title>Thời tiết</DataTable.Title>
                    <DataTable.Title numeric>Nhiệt độ</DataTable.Title>
                    <DataTable.Title numeric>Mưa</DataTable.Title>
                  </DataTable.Header>
                  {day.hourlyDetails.map((h, idx) => (
                    <DataTable.Row key={`${h.time}-${idx}`}>
                      <DataTable.Cell>{h.time}</DataTable.Cell>
                      <DataTable.Cell>
                        <Icon source={getWeatherIconName(h.icon)} size={20} />
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{h.temp}°C</DataTable.Cell>
                      <DataTable.Cell numeric>{h.pop}%</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </>
            )}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          {isDaily && onViewMoreDetails && (
            <Button
              mode="text"
              onPress={() => {
                onDismiss();
                onViewMoreDetails(day);
              }}
            >
              Mở toàn màn hình
            </Button>
          )}
          <Button onPress={onDismiss}>Đóng</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '85%',
  },
  scrollArea: {
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  headerInfo: {
    flex: 1,
  },
  conditionText: {
    fontWeight: 'bold',
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    gap: 4,
  },
  divider: {
    marginVertical: 10,
  },
  subHeading: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
});
