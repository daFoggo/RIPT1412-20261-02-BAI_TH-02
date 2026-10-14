import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChat } from '../context/ChatContext';
import { RootStackParamList } from '../types/navigation';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { login } = useChat();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError('Tài khoản không được để trống!');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!password.trim()) {
      setPasswordError('Mật khẩu không được để trống!');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) {
      Alert.alert('Thông báo', 'Vui lòng kiểm tra lại tài khoản và mật khẩu!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = login(username, password);
      if (res.success) {
        navigation.replace('Main');
      } else {
        Alert.alert('Lỗi đăng nhập', res.message || 'Đăng nhập không thành công');
      }
    }, 400);
  };

  const fillDemoAccount = () => {
    setUsername('admin');
    setPassword('123456');
    setUsernameError('');
    setPasswordError('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card mode="elevated" style={styles.card}>
          <Card.Title
            title="Chat App"
            subtitle="Đăng nhập để kết nối với bạn bè"
            titleVariant="headlineMedium"
            subtitleVariant="bodyMedium"
            left={(props) => <Avatar.Icon {...props} icon="chat" />}
          />
          <Card.Content>
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Tài khoản"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) setUsernameError('');
                }}
                left={<TextInput.Icon icon="account" />}
                error={!!usernameError}
                autoCapitalize="none"
                placeholder="Nhập tên tài khoản"
              />
              <HelperText type="error" visible={!!usernameError}>
                {usernameError}
              </HelperText>

              <TextInput
                mode="outlined"
                label="Mật khẩu"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!passwordError}
                placeholder="Nhập mật khẩu"
              />
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="text" onPress={fillDemoAccount} icon="flash">
              Tài khoản mẫu
            </Button>
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              icon="login"
            >
              Đăng nhập
            </Button>
          </Card.Actions>
        </Card>

        <Text
          variant="bodySmall"
          style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}
        >
          Bài tập thực hành React Native - Ứng dụng Chat
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    marginBottom: 24,
  },
  inputContainer: {
    marginTop: 8,
  },
  footerText: {
    textAlign: 'center',
  },
});
