import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuraReading } from '@/context/AuraContext';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width - 32;
export const CARD_HEIGHT = CARD_WIDTH * 1.6; // ~A4 portrait ratio

const AURA_COLORS: Record<string, { primary: string; secondary: string; gradient: string[] }> = {
  green:  { primary: '#00E5A0', secondary: '#00A86B', gradient: ['#0A1F14', '#0D2E1C', '#061510'] },
  blue:   { primary: '#6C9FFF', secondary: '#3D6FD4', gradient: ['#080D20', '#0D1530', '#050A1A'] },
  red:    { primary: '#FF6B8A', secondary: '#CC3355', gradient: ['#1F0810', '#2E0D18', '#150508'] },
  yellow: { primary: '#FFD700', secondary: '#D4AF37', gradient: ['#1A1400', '#28200A', '#0F0C00'] },
  violet: { primary: '#C084FC', secondary: '#8B3DFF', gradient: ['#120A20', '#1A0D30', '#080515'] },
};

const STAR_POSITIONS = [
  { top: '8%', left: '12%', size: 3 },
  { top: '15%', right: '8%', size: 2 },
  { top: '5%', left: '55%', size: 4 },
  { top: '22%', left: '80%', size: 2 },
  { top: '35%', left: '5%', size: 3 },
  { top: '70%', right: '6%', size: 2 },
  { top: '80%', left: '15%', size: 3 },
  { top: '88%', left: '60%', size: 2 },
];

interface Props {
  result: AuraReading;
  userData?: { age?: string; focus?: string; goal?: string };
  language?: string;
}

export const ManifestationCard = React.forwardRef<View, Props>(
  ({ result, userData, language = 'sl' }, ref) => {
    const theme = AURA_COLORS[result.color] || AURA_COLORS.violet;
    const sl = language === 'sl';
    const today = new Date().toLocaleDateString(sl ? 'sl-SI' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Short optimized path for manifestation (most important)
    const manifestText = result.scenarios?.optimized || result.description?.slice(0, 180);

    return (
      <View ref={ref} style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]} collapsable={false}>
        <LinearGradient
          colors={theme.gradient as [string, string, string]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Decorative stars */}
        {STAR_POSITIONS.map((s, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: s.top as any,
                left: s.left as any,
                right: s.right as any,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
                backgroundColor: theme.primary,
                opacity: 0.4 + (i % 3) * 0.2,
              },
            ]}
          />
        ))}

        {/* Top decorative ring */}
        <View style={[styles.topRing, { borderColor: `${theme.primary}30` }]} />
        <View style={[styles.topRingInner, { borderColor: `${theme.primary}20` }]} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.primary }]}>SOLAURA AI</Text>
          <Text style={[styles.headerSub, { color: `${theme.primary}80` }]}>
            {sl ? 'Manifestacijska kartica' : 'Manifestation Card'}
          </Text>
        </View>

        {/* Aura orb */}
        <View style={styles.orbSection}>
          <View style={[styles.orbRing2, { borderColor: `${theme.primary}15` }]} />
          <View style={[styles.orbRing1, { borderColor: `${theme.primary}25` }]} />
          <LinearGradient
            colors={[theme.primary, theme.secondary, `${theme.secondary}00`]}
            style={[styles.orb]}
          />
          <Text style={[styles.resonanceNum, { color: theme.primary }]}>{result.resonance}%</Text>
          <Text style={[styles.resonanceLabel, { color: `${theme.primary}70` }]}>
            {sl ? 'resonanca' : 'resonance'}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.auraTitle, { color: '#FFF' }]} numberOfLines={2}>
            {result.title}
          </Text>
          {result.evolution_state && (
            <View style={[styles.evolutionPill, { borderColor: `${theme.primary}50`, backgroundColor: `${theme.primary}15` }]}>
              <Text style={[styles.evolutionText, { color: theme.primary }]}>✦ {result.evolution_state} ✦</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: `${theme.primary}30` }]} />

        {/* Manifestation text */}
        <View style={styles.manifestSection}>
          <Text style={[styles.manifestLabel, { color: `${theme.primary}90` }]}>
            {sl ? '🌟 MOJA MANIFESTACIJSKA POT' : '🌟 MY MANIFESTATION PATH'}
          </Text>
          <Text style={styles.manifestText} numberOfLines={6}>
            {manifestText}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: `${theme.primary}20` }]} />

        {/* User info row */}
        {userData && (
          <View style={styles.userRow}>
            {userData.focus && (
              <View style={styles.userTag}>
                <Text style={[styles.userTagLabel, { color: `${theme.primary}60` }]}>
                  {sl ? 'Fokus' : 'Focus'}
                </Text>
                <Text style={[styles.userTagValue, { color: '#FFF' }]}>
                  {sl ? 
                    ({ 'money': 'Finance', 'love': 'Ljubezen', 'career': 'Uspeh', 'health': 'Zdravje', 'spirit': 'Duhovnost' }[userData.focus] || userData.focus) 
                    : userData.focus
                  }
                </Text>
              </View>
            )}
            {userData.goal && (
              <View style={styles.userTag}>
                <Text style={[styles.userTagLabel, { color: `${theme.primary}60` }]}>
                  {sl ? 'Namen' : 'Intention'}
                </Text>
                <Text style={[styles.userTagValue, { color: '#FFF' }]} numberOfLines={2}>{userData.goal}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.dateText, { color: `${theme.primary}50` }]}>{today}</Text>
          <Text style={[styles.footerBrand, { color: `${theme.primary}40` }]}>solaura.ai ✦</Text>
        </View>

        {/* Bottom glow */}
        <LinearGradient
          colors={[`${theme.primary}00`, `${theme.primary}12`]}
          style={styles.bottomGlow}
        />

        {/* Border */}
        <View style={[styles.cardBorder, { borderColor: `${theme.primary}25` }]} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    padding: 28,
    justifyContent: 'space-between',
  },
  cardBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 28,
    borderWidth: 1,
  } as any,
  star: {
    position: 'absolute',
  },
  topRing: {
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
  },
  topRingInner: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  header: {
    alignItems: 'center',
    marginTop: 4,
  },
  appName: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 4,
  },
  headerSub: {
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 3,
  },
  orbSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  orbRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
  },
  orbRing1: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
  },
  orb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    opacity: 0.6,
    marginBottom: 6,
  },
  resonanceNum: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  resonanceLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  titleSection: {
    alignItems: 'center',
    gap: 10,
  },
  auraTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  evolutionPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  evolutionText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  manifestSection: {
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  manifestLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
  },
  manifestText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  userRow: {
    flexDirection: 'row',
    gap: 16,
  },
  userTag: {
    flex: 1,
    gap: 2,
  },
  userTagLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  userTagValue: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  footerBrand: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
});
