# Ứng Dụng Dự Báo Thời Tiết (WeatherApp)

Ứng dụng dự báo thời tiết trên thiết bị di động được xây dựng bằng **React Native**, tích hợp giao diện chuẩn Material Design 3 thông qua thư viện [**Callstack React Native Paper**](https://oss.callstack.com/react-native-paper/docs/guides/getting-started) và dữ liệu khí tượng thời gian thực từ API **OpenWeatherMap**.

---

## 1. Giới thiệu & Điểm nổi bật về Kiến trúc

Toàn bộ giao diện người dùng (UI) được thiết kế và xây dựng tuân thủ chặt chẽ chuẩn thư viện **React Native Paper (MD3)**:
- **Tuân thủ Design Tokens & Theme System**: Không lạm dụng styling màu sắc hay ghi đè custom color thủ công. Toàn bộ typography (`headlineSmall`, `titleLarge`, `titleMedium`, `bodyMedium`, `labelMedium`), surface elevation, và bảng màu (color scheme) đều được kế thừa trực tiếp từ tokens của `MD3LightTheme` và `MD3DarkTheme`.
- **Hỗ trợ đầy đủ Dark Mode & Light Mode**: Chuyển đổi linh hoạt giữa chế độ Sáng và Tối ngay trên thanh Appbar, tương thích mượt mà với Android System Navigation & StatusBar.
- **Tuân thủ chuẩn Component Composition của React Native Paper**:
  - `PaperProvider`: Cung cấp theme MD3 toàn cục đồng bộ với React Navigation.
  - `Appbar.Header`, `Appbar.Content`, `Appbar.Action`: Thanh điều hướng trên cùng chuẩn Material Design với nút toggle theme, nút định vị GPS tức thì và làm mới dữ liệu.
  - `Card`, `Card.Title`, `Card.Content`: Các khối hiển thị thông tin thời tiết được phân cấp khoa học.
  - `Surface`: Đổ bóng đa tầng theo chuẩn elevation, không bị cắt viền trên Android.
  - `TouchableRipple`: Tương tác chạm phản hồi mượt mà, hỗ trợ mượt mà trong các `ScrollView` lồng nhau (`nestedScrollEnabled={true}`).
  - `SegmentedButtons`: Bộ lọc góc nhìn nhanh trên màn hình chính (Tất cả, 24 Giờ, 5 Ngày, 8 Chỉ số).
  - `DataTable`: Hiển thị bảng dự báo thời tiết nhiều ngày trực quan, chỉn chu.
  - `ProgressBar`: Trực quan hóa các chỉ số khí quyển định lượng (Độ ẩm, Tia UV, Lượng mưa, Tầm nhìn, Áp suất,...).
  - `Chip`: Phân loại trạng thái, gợi ý các thành phố lớn và hiển thị nhanh thông số.
  - `Dialog` & `Portal`: Hộp thoại tương tác xem chi tiết thời tiết chuyên sâu của từng mốc giờ hoặc ngày.
  - `Banner`: Thông báo và hướng dẫn người dùng khi chưa cấp quyền vị trí GPS.
  - `Snackbar`: Thông báo trạng thái cập nhật dữ liệu.
  - `ActivityIndicator` & `HelperText`: Trực quan hóa trạng thái Loading và xử lý Error.
  - `Searchbar`: Tìm kiếm thành phố bất kỳ theo thời gian thực.

---

## 2. Bảng Đối Chiếu Yêu Cầu Đề Bài & Triển Khai Chức Năng

| STT | Yêu cầu bài tập | Triển khai trong mã nguồn |
|:---:|---|---|
| **1** | **Xem thời tiết hiện tại** | - Hiển thị địa điểm hiện tại (Thành phố, quốc gia).<br>- Hiển thị nhiệt độ hiện tại (font lớn), trạng thái thời tiết và icon minh họa vector.<br>- Hiển thị nhiệt độ cao nhất (`tempMax`), thấp nhất (`tempMin`) và nhiệt độ cảm nhận thực tế (`feelsLike`). |
| **2** | **Xem dự báo theo giờ** | - Thẻ `HourlyForecastCard` dạng cuộn ngang hiển thị các mốc thời gian trong **24 giờ tiếp theo**.<br>- Mỗi thời điểm hiển thị giờ, biểu tượng thời tiết, nhiệt độ và badge tỉ lệ mưa (`pop` %).<br>- Nhấn vào từng giờ để mở hộp thoại xem chi tiết. |
| **3** | **Xem dự báo nhiều ngày** | - Thẻ `DailyForecastCard` sử dụng `DataTable` hiển thị dự báo **5–7 ngày**.<br>- Mỗi ngày hiển thị thứ/ngày, trạng thái thời tiết, dải nhiệt độ cao nhất / thấp nhất và badge khả năng mưa.<br>- Nhấn vào ngày để xem chi tiết đầy đủ. |
| **4** | **Xem thông tin chi tiết về thời tiết** | - **Cách 1 (Quick Dialog)**: Hộp thoại tương tác nhanh `WeatherDetailDialog` ngay trên màn hình chính khi chạm vào một mốc giờ hoặc một ngày.<br>- **Cách 2 (Màn hình chuyên sâu)**: Tab "Chi tiết" (`DetailScreen`) với dải chọn ngày tương tác (Interactive Day Strip), biểu đồ diễn biến theo giờ, tổng quan nhiệt độ và danh sách đầy đủ thông số khí quyển mở rộng. |
| **5** | **Theo dõi các chỉ số thời tiết** | Thẻ `WeatherMetricsCard` hiển thị trực quan 8 chỉ số với thanh tiến trình `ProgressBar` và phân cấp mức độ:<br>1. **Nhiệt độ**: Nhiệt độ thực tế và độ chênh lệch cảm nhận.<br>2. **Độ ẩm**: Tỉ lệ % độ ẩm không khí.<br>3. **Tốc độ gió**: Vận tốc gió (km/h).<br>4. **Hướng gió**: Tên hướng (Bắc, Đông Bắc, Đông, Nam,...) và góc quay độ (°).<br>5. **Chỉ số UV**: Chỉ số tia cực tím kèm phân loại (Thấp, Trung bình, Cao, Rất cao).<br>6. **Lượng mưa**: Lượng mưa (mm) và xác suất mưa (%).<br>7. **Áp suất**: Áp suất khí quyển (hPa).<br>8. **Tầm nhìn**: Khoảng cách tầm nhìn xa (km). |
| **6** | **Sử dụng vị trí hiện tại** | - Xin quyền truy cập vị trí thiết bị (`ACCESS_FINE_LOCATION`) bằng Android Permissions.<br>- Lấy tọa độ GPS thiết bị qua `@react-native-community/geolocation`.<br>- Gọi API thời tiết theo tọa độ thực tế và Reverse Geocoding lấy tên địa danh.<br>- **Xử lý khi không cấp quyền**: Hiển thị `Banner` cảnh báo thân thiện và tự động fallback về tọa độ thủ đô Hà Nội để ứng dụng luôn hoạt động ổn định. |

---

## 3. Cấu Trúc Mã Nguồn (Project Structure)

```
WeatherApp/
├── App.tsx                     # Điểm khởi đầu ứng dụng: PaperProvider, ThemeContext, Safe Area & Bottom Tab Navigation
├── index.js                    # Entrypoint đăng ký ứng dụng React Native
├── babel.config.js             # Cấu hình plugin tối ưu hóa react-native-paper/babel
├── android/                    # Thư mục mã nguồn Native Android (Permissions, Fonts vector-icons, Gradle build)
├── src/
│   ├── components/             # Các Component theo chuẩn Composition của React Native Paper MD3
│   │   ├── CurrentWeatherCard.tsx      # Thẻ thông tin thời tiết hiện tại (nhiệt độ, cảm nhận, cao/thấp)
│   │   ├── HourlyForecastCard.tsx      # Thẻ dự báo 24 giờ cuộn ngang với badge xác suất mưa
│   │   ├── DailyForecastCard.tsx       # Bảng dự báo 5-7 ngày bằng DataTable
│   │   ├── WeatherMetricsCard.tsx      # Lưới 8 chỉ số thời tiết trực quan hóa bằng ProgressBar
│   │   └── WeatherDetailDialog.tsx     # Hộp thoại Modal/Dialog hiển thị chi tiết khi chạm vào giờ/ngày
│   ├── context/
│   │   └── ThemeContext.tsx            # Context quản lý Light/Dark mode đồng bộ giữa Paper và React Navigation
│   ├── screens/                # Các màn hình chính (Bottom Tab Navigation)
│   │   ├── WeatherScreen.tsx           # Màn hình chính dự báo thời tiết (Appbar, Banner, SegmentedButtons, Pull-to-refresh)
│   │   ├── DetailScreen.tsx            # Màn hình dự báo chi tiết theo từng ngày (Day strip & diễn biến theo giờ)
│   │   └── SearchScreen.tsx            # Màn hình tìm kiếm địa điểm, gợi ý thành phố và chuyển vị trí nhanh
│   ├── services/               # Tầng giao tiếp mạng và xử lý bất đồng bộ
│   │   ├── openWeatherApi.ts           # Gọi API OpenWeatherMap (Current Weather, 5-Day/3-Hour Forecast, Geocoding)
│   │   ├── locationService.ts          # Xin quyền GPS & lấy tọa độ vị trí hiện tại của thiết bị
│   │   ├── weatherMapper.ts            # Xử lý, tính toán chỉ số và chuẩn hóa dữ liệu khí tượng sang tiếng Việt
│   │   └── weatherService.ts           # Service tổng hợp kết nối API thời tiết và định vị GPS
│   ├── types/
│   │   └── weather.ts                  # Định nghĩa kiểu dữ liệu TypeScript (WeatherCondition, Forecast, Metrics,...)
│   └── utils/
│       └── weatherIcons.ts             # Ánh xạ mã thời tiết sang MaterialCommunityIcons, hướng gió và phân cấp UV
└── __tests__/                  # Unit tests kiểm thử Mapper và Components
    ├── App.test.tsx
    └── weatherMapper.test.ts
```

---

## 4. Hướng Dẫn Cài Đặt và Chạy Ứng Dụng

### 4.1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18 trở lên (Khuyến nghị Node.js 20 LTS hoặc 22 LTS).
- **JDK (Java Development Kit)**: Java 17.
- **Android Studio**: Đã cài đặt Android SDK (Platform SDK 34, Android Build Tools) và biến môi trường `ANDROID_HOME`.
- **Thiết bị chạy**: Máy ảo Android (Android Emulator) hoặc điện thoại Android thật đã bật chế độ `USB Debugging`.

### 4.2. Các bước cài đặt và khởi chạy

#### Bước 1: Clone hoặc tải mã nguồn
Mở terminal tại thư mục gốc `WeatherApp`:
```bash
npm install
```

#### Bước 2: Khởi động Metro Bundler
```bash
npm start
```

#### Bước 3: Khởi chạy trên thiết bị Android
Mở một tab terminal mới và chạy:
```bash
npm run android
```
Hệ thống sẽ tự động biên dịch ứng dụng, cài đặt lên Emulator/thiết bị đang kết nối và mở ứng dụng.

---

## 5. Hướng Dẫn Build và Vị Trí File Cài Đặt (APK)

### 5.1. Tạo bản cài đặt APK hoàn chỉnh (Release APK)
Để tạo file APK độc lập (đã đóng gói sẵn toàn bộ mã JavaScript, asset hình ảnh, icon và cấu hình release) có thể cài đặt trực tiếp lên bất kỳ thiết bị Android nào mà không cần kết nối máy tính hay chạy Metro bundler:

```bash
cd android
./gradlew assembleRelease
```
*(Trên Windows PowerShell hoặc CMD: `.\gradlew.bat assembleRelease`)*

### 5.2. Vị trí file APK sau khi xuất bản
Sau khi tiến trình build hoàn tất thành công, file APK được lưu tại:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 5.3. Cách cài đặt file APK vào máy ảo hoặc điện thoại
- **Cách 1: Kéo thả**: Kéo file `app-release.apk` và thả trực tiếp vào cửa sổ máy ảo Android Emulator.
- **Cách 2: Qua câu lệnh ADB**:
  ```bash
  adb install android/app/build/outputs/apk/release/app-release.apk
  ```

---

## 6. Chạy Kiểm Thử Tự Động (Unit Tests)

Dự án tích hợp bộ kiểm thử Jest kiểm tra tính toàn vẹn của mã nguồn:
```bash
npm test
```
Bộ kiểm thử thực hiện kiểm tra:
- Ánh xạ chính xác dữ liệu khí tượng OpenWeatherMap sang các thuộc tính chuẩn hóa tiếng Việt.
- Thuật toán chuyển đổi góc la bàn thành 16 hướng gió chuẩn quốc tế.
- Phân cấp mức độ nguy hại của chỉ số tia UV theo chuẩn WHO.
- Khả năng render cây component chính kèm PaperProvider và Navigation không bị lỗi.

---

## 7. Cấu Hình API Key OpenWeatherMap (Tùy Chọn)
Mặc định ứng dụng đã tích hợp sẵn API Key thực nghiệm đang hoạt động tại file [`src/services/openWeatherApi.ts`](file:///src/services/openWeatherApi.ts). Nếu cần thay thế bằng API Key cá nhân của bạn:
1. Đăng ký tài khoản miễn phí tại [OpenWeatherMap](https://openweathermap.org/).
2. Lấy API Key (Default API Key).
3. Mở file `src/services/openWeatherApi.ts` và cập nhật biến:
   ```typescript
   const API_KEY = 'YOUR_NEW_API_KEY_HERE';
   ```
