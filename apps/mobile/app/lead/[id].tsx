import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LeadQuickActions } from '@/components/leads/LeadQuickActions';
import { leadsService } from '@/services/leads.service';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/colors';
import type { Lead } from '@/types';

const STAGES = ['stage1', 'stage2', 'stage3', 'stage4'];
const STAGE_NAMES: Record<string, string> = {
  stage1: 'New Lead',
  stage2: 'Qualified',
  stage3: 'Negotiation',
  stage4: 'Won',
};

const MOCK_TIMELINE = [
  { icon: '📞', text: 'Called — no answer', time: '2 days ago' },
  { icon: '✉️', text: 'Email sent: Proposal', time: '3 days ago' },
  { icon: '💬', text: 'WhatsApp: Interested, call tomorrow', time: '4 days ago' },
  { icon: '🤖', text: 'AI scored: 85 → 92', time: '5 days ago' },
  { icon: '➕', text: 'Lead created from Facebook', time: '8 days ago' },
];

function scoreColor(score: number): string {
  if (score >= 80) return Colors.success;
  if (score >= 50) return Colors.warning;
  return Colors.error;
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

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    leadsService.getLead(token, id).then(data => {
      setLead(data);
      setLoading(false);
    });
  }, [token, id]);

  const handleMoveStage = (stageId: string) => {
    if (!lead) return;
    setLead({ ...lead, pipelineStage: stageId });
  };

  const handleSaveNotes = () => {
    Alert.alert('Saved', 'Notes saved successfully.');
  };

  if (loading || !lead) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingCenter}>
          <Text style={styles.loadingText}>Loading lead…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const color = scoreColor(lead.score);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Lead Header */}
        <Card style={styles.leadHeader}>
          <View style={styles.leadHeaderRow}>
            <Avatar name={lead.name} size="lg" />
            <View style={styles.leadHeaderInfo}>
              <Text style={styles.leadName}>{lead.name}</Text>
              <Badge
                label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                color={getStatusBadgeColor(lead.status)}
              />
            </View>
          </View>
        </Card>

        {/* Score & Status */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 AI Score & Status</Text>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreRing, { borderColor: color }]}>
              <Text style={[styles.scoreNumber, { color }]}>{lead.score}</Text>
              <Text style={styles.scoreLabel}>/ 100</Text>
            </View>
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreDesc}>
                {lead.score >= 80
                  ? '🔥 Hot lead — high conversion probability'
                  : lead.score >= 50
                  ? '☀️ Warm lead — nurture required'
                  : '❄️ Cold lead — low priority'}
              </Text>
              <Button
                label="🤖 Re-score"
                variant="secondary"
                size="sm"
                onPress={() => Alert.alert('Re-scoring', 'AI is re-scoring this lead…')}
              />
            </View>
          </View>
        </Card>

        {/* Contact Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>📇 Contact Info</Text>
          <LeadQuickActions lead={lead} />
          <View style={styles.contactDetails}>
            <Text style={styles.contactLine}>📧 {lead.email}</Text>
            <Text style={styles.contactLine}>📱 {lead.phone}</Text>
            <Text style={styles.contactLine}>🏷️ Source: {lead.source}</Text>
          </View>
        </Card>

        {/* Pipeline Stage */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🗂 Pipeline Stage</Text>
          <View style={styles.stagesRow}>
            {STAGES.map(stageId => (
              <TouchableOpacity
                key={stageId}
                onPress={() => handleMoveStage(stageId)}
                style={[
                  styles.stageChip,
                  lead.pipelineStage === stageId && styles.stageChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.stageChipText,
                    lead.pipelineStage === stageId && styles.stageChipTextActive,
                  ]}
                >
                  {STAGE_NAMES[stageId]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Activity Timeline */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Activity Timeline</Text>
          {MOCK_TIMELINE.map((event, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <Text style={styles.timelineIcon}>{event.icon}</Text>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineText}>{event.text}</Text>
                <Text style={styles.timelineTime}>{event.time}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* AI Insights */}
        <Card style={[styles.section, styles.aiCard]}>
          <Text style={styles.sectionTitle}>🤖 AI Insights</Text>
          <Text style={styles.aiInsight}>
            Based on {lead.name}'s behavior — visiting the pricing page 4 times and opening 3
            emails — they have an 87% probability of converting within 7 days. Best time to call:
            Tuesday–Thursday, 10–11 AM.
          </Text>
        </Card>

        {/* Notes */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this lead…"
            placeholderTextColor={Colors.textSecondary}
            numberOfLines={4}
          />
          <Button label="Save Notes" variant="secondary" size="sm" onPress={handleSaveNotes} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: Colors.textSecondary },
  leadHeader: { marginBottom: 0 },
  leadHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  leadHeaderInfo: { flex: 1, gap: 8 },
  leadName: { fontSize: 20, fontWeight: '800', color: Colors.text },
  section: {},
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  scoreRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  scoreRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: { fontSize: 26, fontWeight: '900' },
  scoreLabel: { fontSize: 11, color: Colors.textSecondary },
  scoreDetails: { flex: 1, gap: 10 },
  scoreDesc: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  contactDetails: { marginTop: 8, gap: 8 },
  contactLine: { fontSize: 14, color: Colors.text },
  stagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stageChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  stageChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stageChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  stageChipTextActive: { color: '#fff' },
  timelineItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timelineIcon: { fontSize: 16, width: 24 },
  timelineContent: { flex: 1 },
  timelineText: { fontSize: 14, color: Colors.text },
  timelineTime: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  aiCard: { backgroundColor: '#fefce8' },
  aiInsight: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  notesInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
