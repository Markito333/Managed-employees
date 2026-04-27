import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEmployees } from '../../contexts/EmployeeContext';
import { Employee } from '../../data/employees';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/theme';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return Colors.light.success;
    case 'inactive': return Colors.light.danger;
    case 'on_leave': return Colors.light.warning;
    default: return Colors.light.textTertiary;
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
    case 'active': return 'check';
    case 'inactive': return 'x';
    case 'on_leave': return 'minus';
    default: return 'circle';
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

type FilterType = 'all' | 'active' | 'inactive' | 'on_leave';

export default function EmployeesScreen() {
  const { employees } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || employee.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'on_leave', label: 'Permiso' },
    { key: 'inactive', label: 'Inactivos' },
  ];

  const renderEmployee = ({ item }: { item: Employee }) => (
    <TouchableOpacity style={styles.employeeCard}>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '30' }]}>
        <Text style={[styles.statusIcon, { color: getStatusColor(item.status) }]}>
          {item.status === 'active' ? '✓' : item.status === 'inactive' ? '✕' : '−'}
        </Text>
      </View>
      <View style={[styles.avatarContainer, { backgroundColor: Colors.light.accent }]}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeePosition}>{item.position}</Text>
        <Text style={styles.employeeDepartment}>{item.department}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personal</Text>
        <Text style={styles.headerSubtitle}>{employees.length} empleados</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.light.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor={Colors.light.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                activeFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredEmployees}
        renderItem={renderEmployee}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sin resultados</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.lg, backgroundColor: Colors.light.background },
  headerTitle: { fontSize: FontSizes.xxl, fontFamily: 'Poppins-SemiBold', color: Colors.light.text, letterSpacing: 2 },
  headerSubtitle: { fontSize: FontSizes.sm, color: Colors.light.textSecondary, marginTop: 4 },
  searchContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  searchIcon: { position: 'absolute', left: Spacing.lg, top: 16, zIndex: 1 },
  searchInput: {
    backgroundColor: Colors.light.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md, fontSize: FontSizes.md, color: Colors.light.text, fontFamily: 'Poppins-Regular',
  },
  filterContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  filterButton: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface, marginRight: Spacing.sm,
  },
  filterButtonActive: { backgroundColor: Colors.light.primary },
  filterText: { fontSize: FontSizes.sm, color: Colors.light.textSecondary, fontFamily: 'Poppins-Medium' },
  filterTextActive: { color: Colors.light.background },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  employeeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, position: 'relative',
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
  employeeName: { fontSize: FontSizes.md, fontFamily: 'Poppins-Medium', color: Colors.light.text },
  employeePosition: { fontSize: FontSizes.sm, color: Colors.light.textSecondary, marginTop: 2 },
  employeeDepartment: { fontSize: FontSizes.xs, color: Colors.light.textTertiary, marginTop: 2 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: FontSizes.md, color: Colors.light.textTertiary },
});