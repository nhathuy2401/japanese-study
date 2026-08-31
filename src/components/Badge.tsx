import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'subtle';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: colors.success };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: colors.warning };
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: colors.danger };
      case 'purple':
        return { bg: 'rgba(168, 85, 247, 0.15)', text: colors.jlpt.intro };
      case 'subtle':
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8' };
      default:
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1' };
    }
  };

  const current = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: current.bg }, style]}>
      <Text style={[styles.text, { color: current.text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
