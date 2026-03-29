import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';

interface AuraBackgroundProps {
  children?: React.ReactNode;
}

export const AuraBackground: React.FC<AuraBackgroundProps> = ({ children }) => {
  return (
    <LinearGradient
      colors={['#0F051D', '#1A0033', '#2D0B5A']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.blurTop} />
      <View style={styles.blurBottom} />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurTop: {
    position: 'absolute',
    top: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.accent,
    opacity: 0.25,
  },
  blurBottom: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.secondary,
    opacity: 0.15,
  },
});
