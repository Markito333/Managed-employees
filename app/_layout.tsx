import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../contexts/AuthContext';
import { EmployeeProvider } from '../contexts/EmployeeContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A4A4A',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#4A4A4A',
    border: '#F3F4F6',
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={theme}>
        <EmployeeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </EmployeeProvider>
        <StatusBar style="dark" />
      </ThemeProvider>
    </AuthProvider>
  );
}