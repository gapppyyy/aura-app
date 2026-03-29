import React from 'react';
import { Text, StyleSheet, type TextProps } from 'react-native';
import { COLORS } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'caption';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  return (
    <Text
      style={[
        styles.base,
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'subtitle' && styles.subtitle,
        type === 'caption' && styles.caption,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: COLORS.text,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
