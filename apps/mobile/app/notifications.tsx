import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { notificationsService } from '@/services/notifications.service';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/colors';
import type { Notification } from '@/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function notifIcon(type: Notification['type']): string {
  switch (type) {
    case 'hot_lead': return '🔥';
    case 'pipeline': return '📋';
    case 'ai_insight': return '🤖';
    default: return '⚙️';
  }
}

export default function NotificationsScreen() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    notificationsService.getNotifications(token).then(data => {
      setNotifications(data);
      setLoading(false);
    });
  }, [token]);

  const handleMarkAllRead = async () => {
    if (!token) return;
    await notificationsService.markAllRead(token);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkRead = async (id: string) => {
    if (!token) return;
    await notificationsService.markAsRead(token, id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Mark all read */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
          <Text style={styles.markAllText}>Mark all as read ({unreadCount})</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.isRead && styles.unreadItem]}
            onPress={() => handleMarkRead(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>{notifIcon(item.type)}</Text>
            <View style={styles.content}>
              <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
                {item.title}
              </Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔔</Text>
              <Text style={styles.emptyText}>All caught up!</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  markAllBtn: {
    padding: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'flex-end',
  },
  markAllText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  listContent: { paddingBottom: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  unreadItem: { backgroundColor: '#f0f4ff' },
  icon: { fontSize: 22, width: 28, textAlign: 'center' },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: Colors.text },
  unreadTitle: { color: Colors.primary },
  body: { fontSize: 13, color: Colors.textSecondary, marginTop: 3, lineHeight: 18 },
  time: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
});
