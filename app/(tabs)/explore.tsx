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
import { useEmployees } from '../../contexts/EmployeeContext';
import { Employee } from '../../data/employees';

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
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
      </View>
      <View style={[styles.avatarContainer, { backgroundColor: '#F3F4F6' }]}>
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
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#A5B4C4"
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 28, fontWeight: '300', color: '#4A4A4A', letterSpacing: 2 },
  headerSubtitle: { fontSize: 14, color: '#A5B4C4', marginTop: 4 },
  searchContainer: { paddingHorizontal: 24, marginBottom: 16 },
  searchInput: {
    backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 20,
    paddingVertical: 14, fontSize: 16, color: '#4A4A4A',
  },
  filterContainer: { paddingHorizontal: 24, marginBottom: 16 },
  filterButton: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#F8FAFC', marginRight: 10,
  },
  filterButtonActive: { backgroundColor: '#4A4A4A' },
  filterText: { fontSize: 13, color: '#A5B4C4', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },
  listContent: { paddingHorizontal: 24, paddingBottom: 100 },
  employeeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderRadius: 16, padding: 12, marginBottom: 10, position: 'relative',
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
  employeeDepartment: { fontSize: 10, color: '#C9C9C9', marginTop: 2 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#C9C9C9' },
});