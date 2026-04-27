import { Tabs, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/theme';

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={styles.tabIconContainer}>
    <Feather 
      name={name as any} 
      size={22} 
      color={focused ? Colors.light.text : Colors.light.textTertiary} 
    />
  </View>
);

function TabLayoutWithAuth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.text,
        tabBarInactiveTintColor: Colors.light.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Personal',
          tabBarIcon: ({ focused }) => <TabIcon name="users" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Asistencia',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return <TabLayoutWithAuth />;
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    elevation: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});