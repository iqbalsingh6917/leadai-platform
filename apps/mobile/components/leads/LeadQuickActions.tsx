import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { Colors } from '@/constants/colors';
import type { Lead } from '@/types';

interface LeadQuickActionsProps {
  lead: Lead;
}

export function LeadQuickActions({ lead }: LeadQuickActionsProps) {
  const handleCall = () => Linking.openURL(`tel:${lead.phone}`);
  const handleWhatsApp = () => {
    const num = lead.phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${num}`);
  };
  const handleEmail = () => Linking.openURL(`mailto:${lead.email}`);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleCall}>
        <Text style={styles.icon}>📞</Text>
        <Text style={styles.label}>Call</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.whatsapp]} onPress={handleWhatsApp}>
        <Text style={styles.icon}>💬</Text>
        <Text style={[styles.label, styles.whatsappText]}>WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEmail}>
        <Text style={styles.icon}>✉️</Text>
        <Text style={styles.label}>Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  whatsapp: { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' },
  icon: { fontSize: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text },
  whatsappText: { color: '#15803d' },
});
