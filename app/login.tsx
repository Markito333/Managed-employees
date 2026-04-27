import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { Colors, BorderRadius, FontSizes, Spacing } from '../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const success = login(email, password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/login.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Workforce Management</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color={Colors.light.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo"
              placeholderTextColor={Colors.light.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={Colors.light.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={Colors.light.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color={Colors.light.textTertiary} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? '...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>admin@empresa.com / admin123</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logoImage: { width: 130, height: 130, marginBottom: 20 },
  title: { fontSize: FontSizes.xxl, fontFamily: 'Poppins-Light', color: Colors.light.text, letterSpacing: 2 },
  subtitle: { fontSize: FontSizes.sm, color: Colors.light.textSecondary, marginTop: Spacing.sm },
  form: { gap: Spacing.md },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: {
    flex: 1, paddingVertical: Spacing.md, fontSize: FontSizes.md, color: Colors.light.text, fontFamily: 'Poppins-Regular',
  },
  eyeIcon: { padding: Spacing.xs },
  button: {
    backgroundColor: Colors.light.primary, borderRadius: BorderRadius.lg, paddingVertical: Spacing.md,
    alignItems: 'center', marginTop: Spacing.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.light.background, fontSize: FontSizes.md, fontFamily: 'Poppins-Medium' },
  hint: { textAlign: 'center', marginTop: Spacing.xl, fontSize: FontSizes.xs, color: Colors.light.textTertiary },
});