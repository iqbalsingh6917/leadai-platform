import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  imageUrl?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#22c55e', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const sizeMap: Record<AvatarSize, { container: number; text: number }> = {
  sm: { container: 32, text: 12 },
  md: { container: 42, text: 16 },
  lg: { container: 56, text: 20 },
};

export function Avatar({ name, size = 'md', imageUrl }: AvatarProps) {
  const { container, text } = sizeMap[size];
  const bg = getColorFromName(name);

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.circle, { width: container, height: container, borderRadius: container / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.circle,
        { width: container, height: container, borderRadius: container / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.initials, { fontSize: text }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});
