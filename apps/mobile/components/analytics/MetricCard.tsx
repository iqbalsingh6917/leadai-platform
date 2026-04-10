import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendColor?: string;
}

export function MetricCard({ title, value, subtitle, trend, trendColor }: MetricCardProps) {
  const trendUp = trend !== undefined && trend >= 0;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {trend !== undefined && (
        <View style={styles.trendRow}>
          <Text style={[styles.trendArrow, { color: trendColor ?? (trendUp ? Colors.success : Colors.error) }]}>
            {trendUp ? '↑' : '↓'}
          </Text>
          <Text style={[styles.trendText, { color: trendColor ?? (trendUp ? Colors.success : Colors.error) }]}>
            {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  title: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', marginBottom: 4 },
  value: { fontSize: 24, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  trendArrow: { fontSize: 13, fontWeight: '700' },
  trendText: { fontSize: 12, fontWeight: '600' },
});
