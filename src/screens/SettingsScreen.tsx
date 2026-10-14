import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  List,
  Portal,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChat } from '../context/ChatContext';
import { useAppTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types/navigation';

export default function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const {
    currentUser,
    logout,
    notificationsEnabled,
    setNotificationsEnabled,
    activeStatusEnabled,
    setActiveStatusEnabled,
  } = useChat();

  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const confirmLogout = () => {
    setLogoutDialogVisible(false);
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Cài đặt" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card Thông tin người dùng */}
        <Card mode="elevated" style={styles.profileCard}>
          <Card.Title
            title={currentUser.name}
            subtitle={`@${currentUser.username} • ${currentUser.email}`}
            titleVariant="titleLarge"
            subtitleVariant="bodyMedium"
            left={() => (
              <Avatar.Icon
                size={52}
                icon={currentUser.icon || 'account'}
              />
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.bioText}>
              {currentUser.bio}
            </Text>
            <Text variant="labelMedium" style={{ color: theme.colors.outline }}>
              Số điện thoại: {currentUser.phone}
            </Text>
          </Card.Content>
        </Card>

        {/* Cài đặt ứng dụng với Switch */}
        <List.Section>
          <List.Subheader>Tùy chọn hiển thị & Thông báo</List.Subheader>

          <List.Item
            title="Chế độ tối (Dark Mode)"
            description="Chuyển đổi giao diện sáng và tối"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
            )}
          />
          <Divider />

          <List.Item
            title="Thông báo tin nhắn"
            description="Nhận thông báo khi có tin nhắn mới"
            left={(props) => <List.Icon {...props} icon="bell-ring-outline" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          <Divider />

          <List.Item
            title="Trạng thái hoạt động"
            description="Cho phép bạn bè thấy bạn đang online"
            left={(props) => <List.Icon {...props} icon="account-clock-outline" />}
            right={() => (
              <Switch
                value={activeStatusEnabled}
                onValueChange={setActiveStatusEnabled}
              />
            )}
          />
          <Divider />
        </List.Section>

        {/* Thông tin ứng dụng */}
        <List.Section>
          <List.Subheader>Hệ thống & Quyền riêng tư</List.Subheader>

          <List.Item
            title="Quyền riêng tư & Bảo mật"
            left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />

          <List.Item
            title="Phiên bản ứng dụng"
            description="ChatApp v1.0.0 (Bản thực hành)"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
          <Divider />
        </List.Section>

        {/* Nút Đăng xuất */}
        <View style={styles.logoutButtonContainer}>
          <Button
            mode="contained-tonal"
            icon="logout"
            textColor={theme.colors.error}
            onPress={() => setLogoutDialogVisible(true)}
            style={styles.logoutButton}
          >
            Đăng xuất
          </Button>
        </View>
      </ScrollView>

      {/* Dialog xác nhận đăng xuất */}
      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Xác nhận đăng xuất</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản "{currentUser.name}" không?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Hủy</Button>
            <Button textColor={theme.colors.error} onPress={confirmLogout}>
              Đăng xuất
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    marginBottom: 16,
  },
  bioText: {
    marginBottom: 8,
  },
  logoutButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 8,
  },
});
