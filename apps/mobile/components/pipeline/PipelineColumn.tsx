import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/colors';
import type { PipelineStage, Lead } from '@/types';

interface PipelineColumnProps {
  stage: PipelineStage;
  onLeadPress: (lead: Lead) => void;
}

function getScoreColor(score: number): string {
  if (score >= 80) return Colors.leadScore.high;
  if (score >= 50) return Colors.leadScore.medium;
  return Colors.leadScore.low;
}

function daysInStage(updatedAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(updatedAt).getTime()) / 86400000));
}

export function PipelineColumn({ stage, onLeadPress }: PipelineColumnProps) {
  return (
    <View style={styles.column}>
      <View style={[styles.header, { borderTopColor: stage.color }]}>
        <Text style={styles.stageName}>{stage.name}</Text>
        <View style={[styles.countBadge, { backgroundColor: stage.color }]}>
          <Text style={styles.countText}>{stage.leads.length}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {stage.leads.map(lead => (
          <TouchableOpacity
            key={lead.id}
            style={styles.leadCard}
            onPress={() => onLeadPress(lead)}
            activeOpacity={0.8}
          >
            <View style={styles.leadRow}>
              <Text style={styles.leadName} numberOfLines={1}>{lead.name}</Text>
              <Text style={[styles.scoreText, { color: getScoreColor(lead.score) }]}>
                {lead.score}
              </Text>
            </View>
            <View style={styles.leadMeta}>
              <Badge label={lead.source} color="default" size="sm" />
              <Text style={styles.daysText}>{daysInStage(lead.updatedAt)}d</Text>
            </View>
          </TouchableOpacity>
        ))}
        {stage.leads.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No leads</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 200,
    marginRight: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 3,
  },
  stageName: { fontSize: 14, fontWeight: '700', color: Colors.text, flex: 1 },
  countBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  list: { flex: 1, padding: 8 },
  leadCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  leadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  leadName: { fontSize: 13, fontWeight: '600', color: Colors.text, flex: 1 },
  scoreText: { fontSize: 14, fontWeight: '800', marginLeft: 4 },
  leadMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  daysText: { fontSize: 11, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { color: Colors.textSecondary, fontSize: 13 },
});
