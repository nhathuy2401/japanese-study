import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'surface' | 'subtle' | 'elevated';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'surface' }) => {
  const getBg = () => {
    switch (variant) {
      case 'subtle': return colors.dark.bgSubtle;
      case 'elevated': return '#1A2436';
      default: return colors.dark.bgSurface;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getBg() }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
});
