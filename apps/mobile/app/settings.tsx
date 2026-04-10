import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/colors';

interface SectionRowProps {
  emoji: string;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  destructive?: boolean;
}

function SectionRow({ emoji, label, onPress, right, destructive = false }: SectionRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && right !== undefined}
    >
      <Text style={styles.rowEmoji}>{emoji}</Text>
      <Text style={[styles.rowLabel, destructive && styles.destructiveText]}>{label}</Text>
      {right ?? <Text style={styles.rowArrow}>›</Text>}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Avatar name={user?.name ?? 'User'} size="lg" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name ?? 'Demo User'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? 'demo@leadai.io'}</Text>
            <Text style={styles.profileRole}>{user?.role?.toUpperCase() ?? 'ADMIN'}</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <SectionRow
            emoji="🔔"
            label="Push Notifications"
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ true: Colors.primary, false: Colors.border }}
                thumbColor="#fff"
              />
            }
          />
          <SectionRow emoji="🌐" label="Language" onPress={() => {}} />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <SectionRow
            emoji="🔑"
            label="Change Password"
            onPress={() => Alert.alert('Coming Soon', 'Password change available in full version.')}
          />
          <SectionRow
            emoji="💎"
            label="Subscription"
            onPress={() => Alert.alert('Plan', 'You are on the Pro plan. Billing managed via web dashboard.')}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About</Text>
          <SectionRow
            emoji="ℹ️"
            label="Version"
            right={<Text style={styles.versionText}>1.0.0</Text>}
          />
          <SectionRow
            emoji="🔒"
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Available at https://leadai.io/privacy')}
          />
          <SectionRow
            emoji="📜"
            label="Terms of Service"
            onPress={() => Alert.alert('Terms', 'Available at https://leadai.io/terms')}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Danger Zone</Text>
          <SectionRow emoji="🚪" label="Logout" onPress={handleLogout} destructive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 16, paddingBottom: 40 },
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
  profileName: { fontSize: 18, fontWeight: '700', color: Colors.text },
  profileEmail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  profileRole: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
    backgroundColor: '#eef2ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  rowEmoji: { fontSize: 18, marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
  rowArrow: { fontSize: 18, color: Colors.textSecondary },
  versionText: { fontSize: 14, color: Colors.textSecondary },
  destructiveText: { color: Colors.error },
});
