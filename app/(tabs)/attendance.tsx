import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../contexts/EmployeeContext';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/theme';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: 'present' | 'absent' | 'late';
}

const mockAttendance: AttendanceRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'María González', date: 'Hoy', clockIn: '09:00', clockOut: '18:00', status: 'present' },
  { id: '2', employeeId: '2', employeeName: 'Carlos Rodríguez', date: 'Hoy', clockIn: '08:55', clockOut: '18:02', status: 'present' },
  { id: '3', employeeId: '3', employeeName: 'Ana Martínez', date: 'Hoy', clockIn: '09:15', clockOut: '-', status: 'late' },
  { id: '4', employeeId: '4', employeeName: 'Luis Hernández', date: 'Hoy', clockIn: '-', clockOut: '-', status: 'absent' },
  { id: '5', employeeId: '5', employeeName: 'Sofia López', date: 'Hoy', clockIn: '09:00', clockOut: '17:30', status: 'present' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'present': return Colors.light.success;
    case 'late': return Colors.light.warning;
    case 'absent': return Colors.light.danger;
    default: return Colors.light.textTertiary;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'present': return 'check-circle';
    case 'late': return 'alert-circle';
    case 'absent': return 'x-circle';
    default: return 'circle';
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function AttendanceScreen() {
  const { user } = useAuth();
  const { getStats } = useEmployees();
  const stats = getStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Asistencia</Text>
        <Text style={styles.headerSubtitle}>Gestión de asistencia y permisos</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: Colors.light.success + '30' }]}>
          <Feather name="check-circle" size={20} color={Colors.light.accentDark} />
          <Text style={styles.statNumber}>{mockAttendance.filter(a => a.status === 'present').length}</Text>
          <Text style={styles.statLabel}>Presentes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.light.warning + '30' }]}>
          <Feather name="alert-circle" size={20} color="#D97706" />
          <Text style={styles.statNumber}>{mockAttendance.filter(a => a.status === 'late').length}</Text>
          <Text style={styles.statLabel}>Tardanza</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.light.danger + '30' }]}>
          <Feather name="x-circle" size={20} color="#E57373" />
          <Text style={styles.statNumber}>{mockAttendance.filter(a => a.status === 'absent').length}</Text>
          <Text style={styles.statLabel}>Ausentes</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Registros de Hoy</Text>
        <TouchableOpacity style={styles.dateButton}>
          <Feather name="calendar" size={16} color={Colors.light.textSecondary} />
          <Text style={styles.dateText}>Hoy</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {mockAttendance.map((record) => (
          <TouchableOpacity key={record.id} style={styles.attendanceCard}>
            <View style={[styles.avatarContainer, { backgroundColor: Colors.light.accent }]}>
              <Text style={styles.avatarText}>{getInitials(record.employeeName)}</Text>
            </View>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{record.employeeName}</Text>
              <View style={styles.timeRow}>
                <Feather name="clock" size={12} color={Colors.light.textTertiary} />
                <Text style={styles.timeText}>
                  {record.clockIn !== '-' ? `${record.clockIn} - ${record.clockOut}` : 'Sin registro'}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) + '30' }]}>
              <Feather name={getStatusIcon(record.status) as any} size={14} color={getStatusColor(record.status)} />
            </View>
          </TouchableOpacity>
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
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.lg },
  statCard: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center' },
  statNumber: { fontSize: FontSizes.xl, fontFamily: 'Poppins-Bold', color: Colors.light.text, marginTop: 4 },
  statLabel: { fontSize: FontSizes.xs, color: Colors.light.textSecondary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontFamily: 'Poppins-SemiBold', color: Colors.light.text },
  dateButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.md },
  dateText: { fontSize: FontSizes.sm, color: Colors.light.textSecondary },
  list: { paddingHorizontal: Spacing.lg },
  attendanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  avatarContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: FontSizes.sm, fontFamily: 'Poppins-SemiBold', color: Colors.light.text },
  employeeInfo: { flex: 1, marginLeft: Spacing.md },
  employeeName: { fontSize: FontSizes.md, fontFamily: 'Poppins-Medium', color: Colors.light.text },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  timeText: { fontSize: FontSizes.xs, color: Colors.light.textTertiary },
  statusBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});