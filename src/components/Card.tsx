import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'surface' | 'subtle' | 'elevated';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'surface' }) => {
  const getBg = () => {
    switch (variant) {
      case 'subtle':
        return colors.dark.bgSubtle;
      case 'elevated':
        return '#1A2436';
      default:
        return colors.dark.bgSurface;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBg(),
          borderColor: colors.dark.borderSubtle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
});
