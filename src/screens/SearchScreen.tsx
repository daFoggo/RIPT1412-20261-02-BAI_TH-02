import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Card,
  Chip,
  Divider,
  HelperText,
  List,
  Searchbar,
  Text,
} from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { searchLocations } from '../services/weatherService';
import { GeoLocationResult } from '../types/weather';

const POPULAR_CITIES = [
  { name: 'Hà Nội', localName: 'Hà Nội', lat: 21.0285, lon: 105.8542, country: 'VN' },
  { name: 'Ho Chi Minh City', localName: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297, country: 'VN' },
  { name: 'Da Nang', localName: 'Đà Nẵng', lat: 16.0544, lon: 108.2022, country: 'VN' },
  { name: 'Hai Phong', localName: 'Hải Phòng', lat: 20.8449, lon: 106.6881, country: 'VN' },
  { name: 'Can Tho', localName: 'Cần Thơ', lat: 10.0452, lon: 105.7469, country: 'VN' },
  { name: 'Hue', localName: 'Huế', lat: 16.4637, lon: 107.5909, country: 'VN' },
  { name: 'Nha Trang', localName: 'Nha Trang', lat: 12.2388, lon: 109.1967, country: 'VN' },
  { name: 'Da Lat', localName: 'Đà Lạt', lat: 11.9404, lon: 108.4583, country: 'VN' },
];

interface Props {
  navigation: any;
}

export function SearchScreen({ navigation }: Props) {
  const { theme, isDarkMode, toggleTheme } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<GeoLocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setSearching(true);
      const searchRes = await searchLocations(text);
      setResults(searchRes);
      setHasSearched(true);
    } catch (err) {
      console.error('Search location error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCity = (city: {
    name: string;
    localName?: string;
    lat: number;
    lon: number;
    country: string;
  }) => {
    navigation.navigate('Weather', { city });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Content title="Tìm Kiếm Địa Điểm" />
        <Appbar.Action
          icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
          onPress={toggleTheme}
          accessibilityLabel="Chuyển chế độ sáng/tối"
        />
      </Appbar.Header>

      <View style={styles.searchBarContainer}>
        <Searchbar
          placeholder="Tìm kiếm thành phố (vd: Đà Nẵng)..."
          onChangeText={handleSearch}
          value={searchQuery}
          loading={searching}
          elevation={1}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Quick popular city chips */}
        <Card mode="elevated" style={styles.card}>
          <Card.Title
            title="Thành phố phổ biến"
            subtitle="Chạm để xem thời tiết ngay lập tức"
          />
          <Card.Content>
            <View style={styles.chipsContainer}>
              {POPULAR_CITIES.map((city) => (
                <Chip
                  key={`${city.lat}-${city.lon}`}
                  icon="map-marker"
                  mode="outlined"
                  onPress={() => handleSelectCity(city)}
                  style={styles.chip}
                >
                  {city.localName}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Search Results */}
        {searching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Đang tìm kiếm...
            </Text>
          </View>
        )}

        {!searching && hasSearched && results.length === 0 && (
          <HelperText type="info" visible style={styles.emptyText}>
            Không tìm thấy địa điểm nào phù hợp với &quot;{searchQuery}&quot;.
          </HelperText>
        )}

        {results.length > 0 && (
          <Card mode="elevated" style={styles.card}>
            <Card.Title title={`Kết quả tìm kiếm (${results.length})`} />
            <Card.Content style={styles.listContent}>
              {results.map((item, idx) => (
                <React.Fragment key={`${item.lat}-${item.lon}-${idx}`}>
                  <List.Item
                    title={item.localName || item.name}
                    description={`${item.country}${item.state ? ` • ${item.state}` : ''} (Tọa độ: ${item.lat.toFixed(2)}, ${item.lon.toFixed(2)})`}
                    left={(props) => <List.Icon {...props} icon="map-marker-check" />}
                    onPress={() => handleSelectCity(item)}
                  />
                  {idx < results.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    padding: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 0,
  },
});

export default SearchScreen;
