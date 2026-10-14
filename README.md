# BÀI TẬP THỰC HÀNH REACT NATIVE - ỨNG DỤNG CHAT

Dự án ứng dụng Chat di động được xây dựng bằng **React Native**, **React Navigation**, **React Native Paper (Material Design 3)**, áp dụng các tiêu chuẩn kiến trúc hiện đại:
- **Vercel Composition Patterns**: Compound Components, Explicit Variants, Slot Composition, loại bỏ boolean prop proliferation.
- **Lazy Routing & Code Splitting**: Tải bất đồng bộ các màn hình qua `React.lazy()` và `React.Suspense` với màn hình chờ `LoadingScreen`.

---

## 📱 5 Màn hình theo yêu cầu bài thực hành

### 1. Màn hình Đăng nhập (`LoginScreen`)
- **Tên ứng dụng**: Hiển thị tên "Chat App" với `Avatar.Icon` biểu tượng Material.
- **Nhập tài khoản & mật khẩu**: Sử dụng `TextInput` (mode outlined) của React Native Paper, có nút ẩn/hiện mật khẩu.
- **Kiểm tra dữ liệu (Validation)**: Kiểm tra không được để trống tài khoản hoặc mật khẩu; hiển thị `HelperText` và `Alert` thông báo lỗi trực quan.
- **Đăng nhập**: Nút bấm đăng nhập chuyển sang màn hình chính. Có nút **"Tài khoản mẫu"** (`user_a / 123456`) để đăng nhập nhanh.

### 2. Màn hình Home (`HomeScreen` - Đoạn chat)
- **Kiến trúc Compound Component (`ConversationItem`)**:
  - `ConversationItem.Root`: Container với hiệu ứng `TouchableRipple` chuẩn Material Design.
  - `ConversationItem.Avatar`: Avatar biểu tượng từ thư viện React Native Paper (`Avatar.Icon`).
  - `ConversationItem.Content`: Tên người dùng và nội dung tin nhắn gần nhất.
  - `ConversationItem.Meta`: Thời gian và `Badge` số lượng tin nhắn chưa đọc.
- **Tìm kiếm cuộc trò chuyện**: Sử dụng `Searchbar` của Paper để tìm kiếm tức thì theo tên người hoặc nội dung tin nhắn.
- **Điều hướng**: Nhấn vào cuộc trò chuyện bất kỳ để mở chi tiết chat.

### 3. Màn hình Danh bạ (`ContactsScreen`)
- **Kiến trúc Compound Component (`ContactItem`)**:
  - `ContactItem.Root`: Item liên hệ có phản hồi chạm.
  - `ContactItem.Avatar`: Icon người dùng (`Avatar.Icon`).
  - `ContactItem.Info`: Tên bạn bè và trạng thái ("Đang hoạt động" hoặc thời gian online gần nhất).
  - `ContactItem.Status`: Chỉ báo online/offline chuẩn Material icon.
  - `ContactItem.Action`: Nút mở nhanh cuộc trò chuyện.
- **Lọc & Tìm kiếm**: `Searchbar` kết hợp `SegmentedButtons` lọc "Tất cả" hoặc "Trực tuyến".

### 4. Màn hình Thông báo (`NotificationsScreen`)
- **Kiến trúc Compound Component (`NotificationItemCard`)**:
  - `NotificationItemCard.Root`: Nền highlight phân biệt rõ ràng giữa thông báo đã đọc và chưa đọc.
  - `NotificationItemCard.Icon`: Biểu tượng phân loại thông báo (tin nhắn, kết bạn, nhóm, hệ thống).
  - `NotificationItemCard.Content`: Tiêu đề, nội dung và thời gian gửi.
  - `NotificationItemCard.Action`: Nút đánh dấu đã đọc kèm chấm `Badge` chỉ báo.
- **Đánh dấu tất cả**: Nút trên thanh `Appbar.Header` cho phép đánh dấu tất cả thông báo là đã đọc.

### 5. Màn hình Cài đặt (`SettingsScreen`)
- **Thông tin tài khoản**: `Card` hiển thị Avatar icon, tên hiển thị (dạng Họ + Ký tự đại diện: *Nguyễn Văn A*), username, email, số điện thoại và tiểu sử.
- **Cài đặt với component `Switch`**:
  - Chuyển đổi Giao diện tối (`Dark Mode`)
  - Bật/tắt Thông báo tin nhắn
  - Bật/tắt Trạng thái hoạt động (Online status)
- **Đăng xuất**: Hộp thoại `Portal` + `Dialog` xác nhận, đăng xuất và điều hướng quay lại màn hình Đăng nhập.

### 6. Màn hình Chi tiết cuộc trò chuyện (`ChatDetailScreen`)
- **Explicit Variants (`MessageBubble`)**: Tách biệt `MessageBubble.Sent` và `MessageBubble.Received` theo quy tắc Vercel Composition Patterns.
- **Compound Component (`ChatComposer`)**: `ChatComposer.Root` và `ChatComposer.Input` với padding chuẩn UI/UX, hỗ trợ gửi tin nhắn và cập nhật danh sách realtime.

---

## 🏗 Cấu trúc thư mục mã nguồn

```
WeatherApp/
├── ChatApp.apk                    # File APK đã đóng gói sẵn
├── App.tsx                        # Root component & providers wrapper
├── src/
│   ├── components/                # Reusable Compound Components
│   │   ├── chat/
│   │   │   ├── ChatComposer.tsx
│   │   │   ├── ConversationItem.tsx
│   │   │   └── MessageBubble.tsx
│   │   ├── common/
│   │   │   ├── EmptyState.tsx
│   │   │   └── LoadingScreen.tsx
│   │   ├── contacts/
│   │   │   └── ContactItem.tsx
│   │   └── notifications/
│   │       └── NotificationItemCard.tsx
│   ├── context/                   # Quản lý trạng thái toàn cục
│   │   ├── ChatContext.tsx
│   │   └── ThemeContext.tsx
│   ├── navigation/                # Module điều hướng & Lazy routes
│   │   ├── AppTabs.tsx
│   │   ├── RootNavigator.tsx
│   │   └── routes.tsx
│   ├── screens/                   # 5 Màn hình chính + Chat detail
│   │   ├── ChatDetailScreen.tsx
│   │   ├── ContactsScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── types/
│   │   ├── chat.ts
│   │   └── navigation.ts
│   └── utils/
│       └── mockData.ts
```

---

## 🚀 Hướng dẫn chạy và cài đặt

### 1. Cài đặt file APK trực tiếp lên thiết bị/máy ảo:
File APK đã được build tại:
- `ChatApp.apk` (thư mục gốc)
- `android/app/build/outputs/apk/debug/app-debug.apk`

Cài đặt bằng lệnh:
```bash
adb install ChatApp.apk
```

### 2. Khởi chạy bằng mã nguồn:
```bash
# Cài đặt dependency (nếu chưa có)
npm install

# Khởi động Metro Bundler
npm start

# Khởi chạy trên Android
npm run android
```

### 3. Kiểm tra chất lượng mã nguồn:
- **Linting**: `npm run lint` *(0 errors, 0 warnings)*
- **TypeScript**: `npx tsc --noEmit` *(0 errors)*
- **Unit Testing**: `npm test` *(PASS)*
