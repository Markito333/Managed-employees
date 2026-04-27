import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../contexts/EmployeeContext';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/theme';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return Colors.light.success;
    case 'inactive': return Colors.light.danger;
    case 'on_leave': return Colors.light.warning;
    default: return Colors.light.textTertiary;
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const DonutChart = ({ active, inactive, onLeave }: { active: number; inactive: number; onLeave: number }) => {
  const size = 50;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = active + inactive + onLeave;
  
  const activePercent = total > 0 ? active / total : 0;
  const leavePercent = total > 0 ? onLeave / total : 0;
  
  const activeLength = activePercent * circumference;
  const leaveLength = leavePercent * circumference;
  
  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={Colors.light.border} strokeWidth={strokeWidth} fill="none" />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={Colors.light.success} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${activeLength} ${circumference}`} strokeDashoffset={0}
          />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={Colors.light.warning} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${leaveLength} ${circumference}`} strokeDashoffset={-activeLength}
          />
        </G>
      </Svg>
    </View>
  );
};

const StatCard = ({ title, value, color, bgColor }: { title: string; value: number; color: string; bgColor: string }) => (
  <View style={[styles.statCard, { backgroundColor: bgColor }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { employees, getStats } = useEmployees();
  const stats = getStats();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bentoGrid}>
        <View style={[styles.bentoCard, styles.bentoLarge, { backgroundColor: Colors.light.success + '20' }]}>
          <View style={styles.bentoHeader}>
            <Text style={styles.bentoTitle}>Total</Text>
            <Text style={styles.bentoValue}>{stats.total}</Text>
          </View>
          <DonutChart active={stats.active} inactive={stats.inactive} onLeave={stats.onLeave} />
        </View>
        
        <StatCard 
          title="Activos" 
          value={stats.active} 
          color={Colors.light.accentDark} 
          bgColor={Colors.light.success + '20'} 
        />
        <StatCard 
          title="Permiso" 
          value={stats.onLeave} 
          color="#D97706" 
          bgColor={Colors.light.warning + '20'} 
        />
        <StatCard 
          title="Inactivos" 
          value={stats.inactive} 
          color="#E57373" 
          bgColor={Colors.light.danger + '20'} 
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personal</Text>
      </View>

      <View style={styles.employeeList}>
        {employees.slice(0, 5).map((employee) => (
          <TouchableOpacity key={employee.id} style={styles.employeeCard}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(employee.status) + '30' }]}>
              <Text style={[styles.statusIcon, { color: getStatusColor(employee.status) }]}>
                {employee.status === 'active' ? '✓' : employee.status === 'inactive' ? '✕' : '−'}
              </Text>
            </View>
            <View style={[styles.avatarContainer, { backgroundColor: Colors.light.accent }]}>
              <Text style={styles.avatarText}>{getInitials(employee.name)}</Text>
            </View>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeePosition}>{employee.position}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.lg,
  },
  greeting: { fontSize: FontSizes.xl, fontFamily: 'Poppins-Regular', color: Colors.light.text, letterSpacing: 1 },
  logoutButton: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.light.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  logoutText: { fontSize: 14, color: Colors.light.textTertiary },
  bentoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  bentoCard: {
    borderRadius: BorderRadius.xl, padding: Spacing.md, alignItems: 'center', justifyContent: 'center',
  },
  bentoLarge: {
    width: '100%', flexDirection: 'row', justifyContent: 'space-between',
  },
  bentoHeader: { flex: 1 },
  bentoTitle: { fontSize: FontSizes.sm, color: Colors.light.text, opacity: 0.7, fontFamily: 'Poppins-Regular' },
  bentoValue: { fontSize: 32, fontFamily: 'Poppins-Bold', color: Colors.light.text },
  statCard: { flex: 1, minWidth: '30%', borderRadius: BorderRadius.xl, padding: Spacing.md, alignItems: 'center' },
  statValue: { fontSize: 28, fontFamily: 'Poppins-Bold' },
  statTitle: { fontSize: FontSizes.xs, color: Colors.light.text, opacity: 0.7, marginTop: 4, fontFamily: 'Poppins-Regular' },
  chartContainer: { alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontFamily: 'Poppins-SemiBold', color: Colors.light.text, letterSpacing: 2 },
  employeeList: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.sm },
  employeeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg, padding: Spacing.md, position: 'relative',
  },
  statusBadge: {
    position: 'absolute', top: 8, right: 8, width: 24, height: 24,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  statusIcon: { fontSize: 12, fontFamily: 'Poppins-Bold' },
  avatarContainer: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: Colors.light.text, fontSize: FontSizes.sm, fontFamily: 'Poppins-SemiBold' },
  employeeInfo: { flex: 1, marginLeft: Spacing.sm },
  employeeName: { fontSize: FontSizes.sm, fontFamily: 'Poppins-Medium', color: Colors.light.text },
  employeePosition: { fontSize: FontSizes.xs, color: Colors.light.textTertiary, marginTop: 2 },
});