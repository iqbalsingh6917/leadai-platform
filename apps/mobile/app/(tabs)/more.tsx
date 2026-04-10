import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/colors';

interface MenuItemProps {
  emoji: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ emoji, label, onPress, destructive = false }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuEmoji}>{emoji}</Text>
      <Text style={[styles.menuLabel, destructive && styles.destructiveText]}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>More</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <Avatar name={user?.name ?? 'User'} size="lg" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name ?? 'Demo User'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? 'demo@leadai.io'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role?.toUpperCase() ?? 'ADMIN'}</Text>
            </View>
          </View>
        </View>

        {/* Main navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <MenuItem emoji="📊" label="Analytics" onPress={() => router.push('/analytics')} />
          <MenuItem emoji="🔔" label="Notifications" onPress={() => router.push('/notifications')} />
          <MenuItem emoji="⚙️" label="Settings" onPress={() => router.push('/settings')} />
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <MenuItem emoji="🔗" label="Integrations" onPress={() => {}} />
          <MenuItem emoji="📈" label="Reports" onPress={() => {}} />
          <MenuItem emoji="🏷️" label="White-label" onPress={() => {}} />
          <MenuItem emoji="💳" label="Billing" onPress={() => {}} />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <MenuItem emoji="🚪" label="Logout" onPress={handleLogout} destructive />
        </View>

        <Text style={styles.version}>LeadAI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 16 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: Colors.text },
  profileEmail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef2ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  roleText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  menuEmoji: { fontSize: 18, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
  menuArrow: { fontSize: 18, color: Colors.textSecondary },
  destructiveText: { color: Colors.error },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textSecondary, marginTop: 8 },
});
