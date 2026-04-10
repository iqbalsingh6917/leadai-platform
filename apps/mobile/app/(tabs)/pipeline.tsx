import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PipelineColumn } from '@/components/pipeline/PipelineColumn';
import { usePipeline } from '@/hooks/usePipeline';
import { Colors } from '@/constants/colors';
import type { Lead } from '@/types';

export default function PipelineScreen() {
  const router = useRouter();
  const { activePipeline, loading, fetchPipelines } = usePipeline();

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  const handleLeadPress = (lead: Lead) => {
    router.push(`/lead/${lead.id}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Pipeline</Text>
        {activePipeline && (
          <Text style={styles.subtitle}>{activePipeline.name}</Text>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading pipeline…</Text>
        </View>
      ) : !activePipeline ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No pipeline found.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.columnsContainer}
          style={styles.scrollView}
        >
          {activePipeline.stages.map(stage => (
            <PipelineColumn key={stage.id} stage={stage} onLeadPress={handleLeadPress} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  scrollView: { flex: 1 },
  columnsContainer: {
    padding: 16,
    paddingRight: 8,
    alignItems: 'flex-start',
    minHeight: '100%',
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: Colors.textSecondary, fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
});
