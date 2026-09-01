import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '../stores/StoreContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'surface' | 'subtle' | 'elevated';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'surface' }) => {
  const theme = useAppTheme();

  const getBg = () => {
    switch (variant) {
      case 'subtle':
        return theme.bgSubtle;
      case 'elevated':
        return theme.mode === 'light' ? '#FFFFFF' : '#1A2436';
      default:
        return theme.bgSurface;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBg(),
          borderColor: theme.borderSubtle,
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
