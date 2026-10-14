import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  isGPS: boolean;
  error?: string;
}

export const DEFAULT_COORDINATES: LocationCoordinates = {
  latitude: 21.0285,
  longitude: 105.8542,
  isGPS: false,
};

/**
 * Requests location permission from the user
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    try {
      Geolocation.requestAuthorization();
      return true;
    } catch {
      return false;
    }
  }

  if (Platform.OS === 'android') {
    try {
      // Check first if already granted to avoid flashing dialog
      const alreadyGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (alreadyGranted) {
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Quyền truy cập vị trí',
          message:
            'Ứng dụng Thời Tiết cần quyền vị trí để tự động cập nhật thời tiết tại nơi bạn đứng.',
          buttonNeutral: 'Để sau',
          buttonNegative: 'Từ chối',
          buttonPositive: 'Đồng ý',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      return false;
    }
  }

  return false;
}

/**
 * Gets the current GPS location coordinates with safe timeout fallback
 */
export function getCurrentCoordinates(): Promise<LocationCoordinates> {
  return new Promise((resolve) => {
    let resolved = false;

    // Hard fallback timeout so the app NEVER hangs on loading
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({
          ...DEFAULT_COORDINATES,
          error: 'Không thể kết nối GPS. Đang dùng vị trí mặc định (Hà Nội).',
        });
      }
    }, 4000);

    try {
      Geolocation.getCurrentPosition(
        (position) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              isGPS: true,
            });
          }
        },
        (error) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            let msg = 'Không thể lấy vị trí hiện tại.';
            if (error.code === 1) {
              msg = 'Quyền truy cập vị trí bị từ chối. Đang dùng vị trí mặc định.';
            } else if (error.code === 2) {
              msg = 'Không tìm thấy tín hiệu vị trí GPS.';
            } else if (error.code === 3) {
              msg = 'Hết thời gian chờ lấy vị trí GPS.';
            }
            resolve({
              ...DEFAULT_COORDINATES,
              error: msg,
            });
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 3500,
          maximumAge: 10000,
        }
      );
    } catch (err) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({
          ...DEFAULT_COORDINATES,
          error: 'Module GPS chưa được nạp. Đang dùng vị trí mặc định.',
        });
      }
    }
  });
}
