import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { MetricCard } from '@/components/analytics/MetricCard';
import { analyticsService } from '@/services/analytics.service';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/colors';
import type { Analytics } from '@/types';

export default function AnalyticsScreen() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [trends, setTrends] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      analyticsService.getDashboardAnalytics(token),
      analyticsService.getLeadTrends(token, 7),
    ]).then(([a, t]) => {
      setAnalytics(a);
      setTrends(t);
    });
  }, [token]);

  const maxCount = Math.max(...trends.map(t => t.count), 1);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Analytics Overview</Text>

        {/* KPIs */}
        <View style={styles.metricsRow}>
          <MetricCard
            title="Leads This Month"
            value={analytics?.totalLeads ?? '—'}
            trend={8}
          />
          <MetricCard
            title="Converted"
            value={analytics?.convertedLeads ?? '—'}
            trend={14}
            trendColor={Colors.success}
          />
        </View>
        <View style={[styles.metricsRow, styles.mt12]}>
          <MetricCard
            title="Revenue (MRR)"
            value={analytics ? `₹${(analytics.revenueThisMonth / 1000).toFixed(0)}K` : '—'}
            trend={12}
            trendColor={Colors.success}
          />
          <MetricCard
            title="AI Automation"
            value={analytics ? `${analytics.aiAutomationRate}%` : '—'}
            subtitle="of tasks automated"
          />
        </View>

        {/* Lead Trends (7 days) */}
        <Text style={styles.sectionTitle}>📈 Lead Trend (7 days)</Text>
        <View style={styles.chartCard}>
          {trends.map((t, idx) => (
            <View key={idx} style={styles.barGroup}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(8, (t.count / maxCount) * 80) },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>
                {new Date(t.date).toLocaleDateString('en', { weekday: 'short' })}
              </Text>
              <Text style={styles.barValue}>{t.count}</Text>
            </View>
          ))}
        </View>

        {/* Top Stages */}
        <Text style={styles.sectionTitle}>🗂 Top Stages</Text>
        <View style={styles.stagesCard}>
          {(analytics?.topStages ?? []).map((stage, idx) => {
            const pct = Math.round((stage.count / (analytics?.totalLeads ?? 1)) * 100);
            return (
              <View key={idx} style={styles.stageRow}>
                <Text style={styles.stageName}>{stage.name}</Text>
                <View style={styles.stageBarOuter}>
                  <View style={[styles.stageBarInner, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.stageCount}>{stage.count}</Text>
              </View>
            );
          })}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>🕐 Recent Activity</Text>
        <View style={styles.activityCard}>
          {(analytics?.recentActivity ?? []).map((item, idx) => (
            <View key={idx} style={styles.activityRow}>
              <Text style={styles.activityDot}>•</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityLabel}>{item.label}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Sources */}
        <Text style={styles.sectionTitle}>📡 Top Sources</Text>
        <View style={styles.sourcesCard}>
          {[
            { name: 'Facebook', count: 42, color: '#3b82f6' },
            { name: 'Google', count: 35, color: '#ef4444' },
            { name: 'WhatsApp', count: 28, color: '#22c55e' },
            { name: 'Referral', count: 15, color: '#f59e0b' },
            { name: 'Manual', count: 7, color: '#8b5cf6' },
          ].map((src, idx) => {
            const total = 127;
            const pct = Math.round((src.count / total) * 100);
            return (
              <View key={idx} style={styles.sourceRow}>
                <View style={[styles.sourceDot, { backgroundColor: src.color }]} />
                <Text style={styles.sourceName}>{src.name}</Text>
                <View style={styles.sourceBarOuter}>
                  <View style={[styles.sourceBarInner, { width: `${pct}%`, backgroundColor: src.color }]} />
                </View>
                <Text style={styles.sourceCount}>{src.count}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 16 },
  metricsRow: { flexDirection: 'row', gap: 12 },
  mt12: { marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginTop: 20, marginBottom: 12 },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 130,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  barGroup: { alignItems: 'center', flex: 1 },
  barContainer: { justifyContent: 'flex-end', height: 80 },
  bar: {
    width: 24,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    opacity: 0.85,
  },
  barLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 4 },
  barValue: { fontSize: 11, fontWeight: '700', color: Colors.text },
  stagesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stageName: { width: 90, fontSize: 13, color: Colors.text },
  stageBarOuter: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  stageBarInner: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  stageCount: { width: 28, fontSize: 13, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  activityRow: { flexDirection: 'row', gap: 8, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.border },
  activityDot: { color: Colors.primary, fontSize: 16 },
  activityContent: { flex: 1 },
  activityLabel: { fontSize: 13, color: Colors.text },
  activityTime: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  sourcesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sourceDot: { width: 10, height: 10, borderRadius: 5 },
  sourceName: { width: 72, fontSize: 13, color: Colors.text },
  sourceBarOuter: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  sourceBarInner: { height: '100%', borderRadius: 4 },
  sourceCount: { width: 24, fontSize: 13, fontWeight: '700', color: Colors.text, textAlign: 'right' },
});
