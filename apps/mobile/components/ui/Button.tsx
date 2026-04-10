import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/colors';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [styles.base, styles[`variant_${variant}`], styles[`size_${size}`]];
  const textStyle: TextStyle[] = [styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]];

  if (disabled || loading) containerStyle.push(styles.disabled);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#fff' : Colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 6,
  },
  disabled: { opacity: 0.5 },

  variant_primary: { backgroundColor: Colors.primary },
  variant_secondary: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.primary },
  variant_danger: { backgroundColor: Colors.error },
  variant_ghost: { backgroundColor: 'transparent' },

  size_sm: { paddingHorizontal: 12, paddingVertical: 7 },
  size_md: { paddingHorizontal: 18, paddingVertical: 11 },
  size_lg: { paddingHorizontal: 24, paddingVertical: 14 },

  text: { fontWeight: '600' },
  text_primary: { color: '#fff' },
  text_secondary: { color: Colors.primary },
  text_danger: { color: '#fff' },
  text_ghost: { color: Colors.primary },

  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 17 },
});
