import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MetricCard } from '@/components/analytics/MetricCard';
import { LeadCard } from '@/components/leads/LeadCard';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { analyticsService } from '@/services/analytics.service';
import { leadsService } from '@/services/leads.service';
import { Colors } from '@/constants/colors';
import type { Analytics, Lead } from '@/types';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      analyticsService.getDashboardAnalytics(token),
      leadsService.getHotLeads(token),
    ]).then(([a, leads]) => {
      setAnalytics(a);
      setHotLeads(leads);
    }).finally(() => setLoading(false));
  }, [token]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋</Text>
            <Text style={styles.subGreeting}>Here's your pipeline overview</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Metrics */}
        <View style={styles.metricsRow}>
          <MetricCard title="Total Leads" value={analytics?.totalLeads ?? '—'} trend={8} />
          <MetricCard title="Hot Leads 🔥" value={hotLeads.length} trend={15} trendColor={Colors.error} />
        </View>
        <View style={[styles.metricsRow, styles.mt8]}>
          <MetricCard
            title="Conversion Rate"
            value={analytics ? `${analytics.conversionRate}%` : '—'}
            trend={2.3}
          />
          <MetricCard
            title="MRR"
            value={analytics ? `₹${(analytics.revenueThisMonth / 1000).toFixed(0)}K` : '—'}
            trend={12}
            trendColor={Colors.success}
          />
        </View>

        {/* AI Insight Banner */}
        <Card style={styles.insightCard}>
          <Text style={styles.insightTitle}>🤖 AI Insight</Text>
          <Text style={styles.insightBody}>
            3 leads haven't been contacted in 7 days — follow up now to prevent churn.
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/leads')}>
            <Text style={styles.insightAction}>View leads →</Text>
          </TouchableOpacity>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {[
            { label: '+ Add Lead', emoji: '➕' },
            { label: '📥 Import', emoji: '📥' },
            { label: '🤖 AI Score', emoji: '⚡' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.quickBtn} onPress={() => router.push('/(tabs)/leads')}>
              <Text style={styles.quickBtnText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hot Leads */}
        <Text style={styles.sectionTitle}>🔥 Hot Leads</Text>
        {hotLeads.length === 0 && !loading ? (
          <Text style={styles.emptyText}>No hot leads right now.</Text>
        ) : (
          <FlatList
            horizontal
            data={hotLeads.slice(0, 5)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.hotLeadItem}>
                <LeadCard
                  lead={item}
                  onPress={() => router.push(`/lead/${item.id}`)}
                />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            scrollEnabled
            style={styles.hotLeadsList}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.text },
  subGreeting: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bellIcon: { fontSize: 18 },
  metricsRow: { flexDirection: 'row', gap: 12 },
  mt8: { marginTop: 12 },
  insightCard: {
    backgroundColor: '#eef2ff',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginTop: 16,
  },
  insightTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginBottom: 6 },
  insightBody: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  insightAction: { fontSize: 13, color: Colors.primary, fontWeight: '700', marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginTop: 20, marginBottom: 12 },
  quickActions: { flexDirection: 'row', gap: 10 },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  hotLeadsList: { marginHorizontal: -16 },
  hotLeadItem: { width: 300, marginLeft: 16 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
});
