import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type BadgeColor = 'success' | 'warning' | 'error' | 'info' | 'default';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  size?: BadgeSize;
}

const colorMap: Record<BadgeColor, { bg: string; text: string }> = {
  success: { bg: '#dcfce7', text: Colors.success },
  warning: { bg: '#fef3c7', text: Colors.warning },
  error: { bg: '#fee2e2', text: Colors.error },
  info: { bg: '#dbeafe', text: Colors.info },
  default: { bg: '#f1f5f9', text: Colors.textSecondary },
};

export function Badge({ label, color = 'default', size = 'md' }: BadgeProps) {
  const { bg, text } = colorMap[color];
  return (
    <View style={[styles.base, { backgroundColor: bg }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color: text }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 7, paddingVertical: 2 },
  text: { fontSize: 13, fontWeight: '600' },
  textSm: { fontSize: 11 },
});
