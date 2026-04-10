import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/colors';
import type { Lead } from '@/types';

interface LeadCardProps {
  lead: Lead;
  onPress: () => void;
  onQuickAction?: (action: 'call' | 'whatsapp' | 'email') => void;
}

function getScoreBadgeColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 80) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}

function getStatusBadgeColor(status: Lead['status']): 'info' | 'warning' | 'success' | 'error' | 'default' {
  switch (status) {
    case 'new': return 'info';
    case 'contacted': return 'warning';
    case 'qualified': return 'success';
    case 'converted': return 'success';
    case 'lost': return 'error';
    default: return 'default';
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function LeadCard({ lead, onPress, onQuickAction }: LeadCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${lead.phone}`);
    onQuickAction?.('call');
  };
  const handleWhatsApp = () => {
    const num = lead.phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${num}`);
    onQuickAction?.('whatsapp');
  };
  const handleEmail = () => {
    Linking.openURL(`mailto:${lead.email}`);
    onQuickAction?.('email');
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Avatar name={lead.name} size="md" />
        <View style={styles.info}>
          <Text style={styles.name}>{lead.name}</Text>
          <Text style={styles.contact}>{lead.email}</Text>
          <Text style={styles.contact}>{lead.phone}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: Colors.leadScore[lead.score >= 80 ? 'high' : lead.score >= 50 ? 'medium' : 'low'] }]}>
            {lead.score}
          </Text>
          <Text style={styles.scoreLabel}>AI Score</Text>
        </View>
      </View>

      <View style={styles.badges}>
        <Badge label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)} color={getStatusBadgeColor(lead.status)} size="sm" />
        <Badge label={lead.source} color="default" size="sm" />
        <Badge label={`Score: ${lead.score}`} color={getScoreBadgeColor(lead.score)} size="sm" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.time}>{timeAgo(lead.createdAt)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleCall} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWhatsApp} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmail} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>✉️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text },
  contact: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  scoreContainer: { alignItems: 'center' },
  score: { fontSize: 22, fontWeight: '800' },
  scoreLabel: { fontSize: 10, color: Colors.textSecondary },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontSize: 11, color: Colors.textSecondary },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: { fontSize: 16 },
});
