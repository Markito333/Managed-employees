import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/theme';

interface SettingItem {
  icon: string;
  title: string;
  subtitle?: string;
  action?: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const settingsSections: SettingItem[][] = [
    [
      { icon: 'user', title: 'Perfil', subtitle: user?.name, action: () => {} },
      { icon: 'bell', title: 'Notificaciones', hasSwitch: true, switchValue: notifications, onSwitchChange: setNotifications },
      { icon: 'moon', title: 'Modo Oscuro', hasSwitch: true, switchValue: darkMode, onSwitchChange: setDarkMode },
    ],
    [
      { icon: 'clock', title: 'Horario de Trabajo', subtitle: '09:00 - 18:00', action: () => {} },
      { icon: 'calendar', title: 'Días Festivos', subtitle: 'Configurar', action: () => {} },
      { icon: 'map-pin', title: 'Ubicación', subtitle: 'Oficina Principal', action: () => {} },
    ],
    [
      { icon: 'users', title: 'Roles y Permisos', action: () => {} },
      { icon: 'shield', title: 'Seguridad', subtitle: 'Autenticación 2FA', action: () => {} },
      { icon: 'database', title: 'Respaldo de Datos', action: () => {} },
    ],
    [
      { icon: 'help-circle', title: 'Ayuda y Soporte', action: () => {} },
      { icon: 'file-text', title: 'Términos y Condiciones', action: () => {} },
      { icon: 'info', title: 'Acerca de', subtitle: 'v1.0.0', action: () => {} },
    ],
  ];

  const renderSettingItem = (item: SettingItem, index: number) => (
    <TouchableOpacity 
      key={index} 
      style={styles.settingItem}
      onPress={item.action}
      disabled={item.hasSwitch}
    >
      <View style={styles.settingIcon}>
        <Feather name={item.icon as any} size={20} color={Colors.light.text} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
      </View>
      {item.hasSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: Colors.light.border, true: Colors.light.accent }}
          thumbColor={item.switchValue ? Colors.light.accentDark : '#f4f3f4'}
        />
      ) : (
        <Feather name="chevron-right" size={20} color={Colors.light.textTertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
        <Text style={styles.headerSubtitle}>Administra tu cuenta y preferencias</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>AD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>Administrador</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={20} color={Colors.light.danger} />
          </TouchableOpacity>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.lg, backgroundColor: Colors.light.background },
  headerTitle: { fontSize: FontSizes.xxl, fontFamily: 'Poppins-SemiBold', color: Colors.light.text },
  headerSubtitle: { fontSize: FontSizes.sm, color: Colors.light.textSecondary, marginTop: 4 },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.lg, padding: Spacing.lg, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, marginBottom: Spacing.lg },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.light.accent, justifyContent: 'center', alignItems: 'center' },
  profileInitials: { fontSize: FontSizes.lg, fontFamily: 'Poppins-SemiBold', color: Colors.light.text },
  profileInfo: { flex: 1, marginLeft: Spacing.md },
  profileName: { fontSize: FontSizes.lg, fontFamily: 'Poppins-SemiBold', color: Colors.light.text },
  profileRole: { fontSize: FontSizes.sm, color: Colors.light.textSecondary },
  logoutButton: { padding: Spacing.sm },
  section: { marginHorizontal: Spacing.lg, marginBottom: Spacing.lg, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  settingIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.accent + '30', justifyContent: 'center', alignItems: 'center' },
  settingContent: { flex: 1, marginLeft: Spacing.md },
  settingTitle: { fontSize: FontSizes.md, fontFamily: 'Poppins-Medium', color: Colors.light.text },
  settingSubtitle: { fontSize: FontSizes.sm, color: Colors.light.textSecondary, marginTop: 2 },
});