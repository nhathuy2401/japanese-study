import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../theme/colors';
import { hapticService } from '../services/haptics/hapticService';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      hapticService.light();
      onPress();
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return '#334155';
    switch (variant) {
      case 'primary': return colors.primary;
      case 'accent': return colors.accent;
      case 'danger': return colors.danger;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    switch (variant) {
      case 'outline': return colors.accent;
      case 'ghost': return colors.dark.textPrimary;
      default: return '#FFFFFF';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: 8, paddingHorizontal: 14 };
      case 'lg': return { paddingVertical: 16, paddingHorizontal: 24 };
      default: return { paddingVertical: 12, paddingHorizontal: 18 };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? colors.accent : 'transparent',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});

