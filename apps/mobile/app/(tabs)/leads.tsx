import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LeadCard } from '@/components/leads/LeadCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLeads } from '@/hooks/useLeads';
import { Colors } from '@/constants/colors';
import type { Lead } from '@/types';

type FilterType = 'all' | Lead['status'];

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Hot' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'converted', label: 'Converted' },
];

export default function LeadsScreen() {
  const router = useRouter();
  const { leads, loading, refetch } = useLeads();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('Manual');

  const filtered = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);
    const matchesFilter = filter === 'all' || lead.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddLead = () => {
    // In a real app, this calls leadsService.createLead
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  const renderItem = useCallback(
    ({ item }: { item: Lead }) => (
      <LeadCard lead={item} onPress={() => router.push(`/lead/${item.id}`)} />
    ),
    [router],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lead Inbox</Text>
          <Text style={styles.count}>{filtered.length} leads</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setFilter(item.key)}
              style={[styles.chip, filter === item.key && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === item.key && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
          contentContainerStyle={styles.filterContent}
        />

        {/* Leads List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No leads found</Text>
            </View>
          }
        />

        {/* FAB */}
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Add Lead Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Lead</Text>
            <Input label="Full Name" value={newName} onChangeText={setNewName} placeholder="John Doe" />
            <Input
              label="Phone"
              value={newPhone}
              onChangeText={setNewPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
            />
            <Input
              label="Email"
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="john@example.com"
              keyboardType="email-address"
            />
            <View style={styles.modalActions}>
              <Button label="Cancel" variant="secondary" onPress={() => setShowAddModal(false)} />
              <Button label="Add Lead" onPress={handleAddLead} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  count: { fontSize: 14, color: Colors.textSecondary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 15, color: Colors.text },
  filterList: { maxHeight: 44 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },
  listContent: { padding: 16, paddingTop: 8 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: { fontSize: 28, color: '#fff', lineHeight: 32 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
