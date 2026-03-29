import React from 'react';
import { View, type ViewProps } from 'react-native';
import { COLORS } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: keyof typeof COLORS;
};

export function ThemedView({ style, type = 'background', ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: COLORS[type] || COLORS.background }, style]} {...otherProps} />;
}
