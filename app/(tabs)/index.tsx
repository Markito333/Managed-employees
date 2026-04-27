import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../contexts/EmployeeContext';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return '#A8D5BA';
    case 'inactive': return '#F5A9A9';
    case 'on_leave': return '#F9D89C';
    default: return '#C4C4C4';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Activo';
    case 'inactive': return 'Inactivo';
    case 'on_leave': return 'Permiso';
    default: return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return '✓';
    case 'inactive': return '✕';
    case 'on_leave': return '∿';
    default: return '●';
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
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#F3F4F6" strokeWidth={strokeWidth} fill="none" />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#A8D5BA" strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${activeLength} ${circumference}`} strokeDashoffset={0}
          />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#F9D89C" strokeWidth={strokeWidth} fill="none"
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
        <View style={[styles.bentoCard, styles.bentoLarge, { backgroundColor: '#E8F5E9' }]}>
          <View style={styles.bentoHeader}>
            <Text style={styles.bentoTitle}>Total</Text>
            <Text style={styles.bentoValue}>{stats.total}</Text>
          </View>
          <DonutChart active={stats.active} inactive={stats.inactive} onLeave={stats.onLeave} />
        </View>
        
        <StatCard title="Activos" value={stats.active} color="#4CAF50" bgColor="#E8F5E9" />
        <StatCard title="Permiso" value={stats.onLeave} color="#FFB300" bgColor="#FFF8E1" />
        <StatCard title="Inactivos" value={stats.inactive} color="#E57373" bgColor="#FFEBEE" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personal</Text>
      </View>

      <View style={styles.employeeList}>
        {employees.slice(0, 5).map((employee) => (
          <TouchableOpacity key={employee.id} style={styles.employeeCard}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(employee.status) }]}>
              <Text style={styles.statusIcon}>{getStatusIcon(employee.status)}</Text>
            </View>
            <View style={[styles.avatarContainer, { backgroundColor: '#F3F4F6' }]}>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20,
  },
  greeting: { fontSize: 24, fontWeight: '300', color: '#4A4A4A', letterSpacing: 1 },
  logoutButton: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center',
  },
  logoutText: { fontSize: 14, color: '#A5B4C4' },
  bentoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12,
  },
  bentoCard: {
    borderRadius: 20, padding: 16, alignItems: 'center', justifyContent: 'center',
  },
  bentoLarge: {
    width: '100%', flexDirection: 'row', justifyContent: 'space-between',
  },
  bentoHeader: { flex: 1 },
  bentoTitle: { fontSize: 14, color: '#4A4A4A', opacity: 0.7 },
  bentoValue: { fontSize: 32, fontWeight: '600', color: '#4A4A4A' },
  statCard: { flex: 1, minWidth: '30%', borderRadius: 20, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '600' },
  statTitle: { fontSize: 12, color: '#4A4A4A', opacity: 0.7, marginTop: 4 },
  chartContainer: { alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { paddingHorizontal: 24, marginTop: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '300', color: '#4A4A4A', letterSpacing: 2 },
  employeeList: { paddingHorizontal: 24, paddingBottom: 100, gap: 10 },
  employeeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderRadius: 16, padding: 12, position: 'relative',
  },
  statusBadge: {
    position: 'absolute', top: 8, right: 8, width: 24, height: 24,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  statusIcon: { fontSize: 12, color: '#4A4A4A' },
  avatarContainer: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#4A4A4A', fontSize: 14, fontWeight: '500' },
  employeeInfo: { flex: 1, marginLeft: 12 },
  employeeName: { fontSize: 14, fontWeight: '500', color: '#4A4A4A' },
  employeePosition: { fontSize: 12, color: '#A5B4C4', marginTop: 2 },
});