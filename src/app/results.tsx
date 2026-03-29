import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import {
  LucideShare2,
  LucideSparkles,
  LucideMoon,
  LucideZap,
  LucideAlertTriangle,
  LucideTrendingUp,
  LucideChevronLeft,
  LucideRefreshCw,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuraContext } from '@/context/AuraContext';

const { width } = Dimensions.get('window');

const AURA_COLOR_MAP: Record<string, string> = {
  green: '#00E5A0',
  blue: '#5B8AF0',
  red: '#FF4D6D',
  yellow: '#FFD700',
  violet: '#B06EFF',
};

export default function ResultsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { result } = useAuraContext();
  const [expandedDesc, setExpandedDesc] = useState(false);

  const activeColor = AURA_COLOR_MAP[result?.color || 'green'];

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `✨ ${result.title} ✨\n\n${result.description?.slice(0, 200)}...\n\nResonanca: ${result.resonance}%\n\nSolaura AI 🔮`,
      });
    } catch (e) { console.error(e); }
  };

  const scenarios = [
    {
      key: 'current',
      icon: <LucideTrendingUp color="#9AA8B8" size={20} />,
      label: t('path_current'),
      desc: result?.scenarios?.current || t('path_current_desc'),
      accentColor: '#9AA8B8',
      bg: 'rgba(154, 168, 184, 0.06)',
    },
    {
      key: 'optimized',
      icon: <LucideZap color={COLORS.secondary} size={20} />,
      label: t('path_optimized'),
      desc: result?.scenarios?.optimized || t('path_optimized_desc'),
      accentColor: COLORS.secondary,
      bg: 'rgba(212, 175, 55, 0.07)',
    },
    {
      key: 'risk',
      icon: <LucideAlertTriangle color="#FF6B6B" size={20} />,
      label: t('path_risk'),
      desc: result?.scenarios?.risk || t('path_risk_desc'),
      accentColor: '#FF6B6B',
      bg: 'rgba(255, 107, 107, 0.06)',
    },
  ];

  const shortDesc = result?.description
    ? result.description.slice(0, 220) + (result.description.length > 220 ? '...' : '')
    : '';

  return (
    <AuraBackground>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn}>
          <LucideChevronLeft color="rgba(255,255,255,0.6)" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareIconBtn}>
          <LucideShare2 color={COLORS.secondary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO: Aura Orb ── */}
        <View style={styles.heroSection}>
          <MotiView
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 1200 }}
            style={styles.orbWrapper}
          >
            {/* Outer glow ring */}
            <MotiView
              from={{ opacity: 0.3, scale: 0.9 }}
              animate={{ opacity: 0.6, scale: 1.05 }}
              transition={{ loop: true, type: 'timing', duration: 2200 }}
              style={[styles.orbRing, { borderColor: activeColor }]}
            />
            {/* Orb */}
            <LinearGradient
              colors={[activeColor, `${activeColor}88`, 'rgba(0,0,0,0.1)']}
              style={styles.orb}
            />
            {/* Center icon */}
            <View style={styles.orbIcon}>
              <LucideMoon color="#FFF" size={36} opacity={0.7} />
            </View>
          </MotiView>

          {/* Aura title */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600, duration: 800 }}
            style={styles.titleBlock}
          >
            <Text style={styles.auraTitle}>{result?.title || t('aura_green_title')}</Text>

            {/* Stats pills row */}
            <View style={styles.statsRow}>
              <View style={[styles.statPill, { borderColor: `${activeColor}60` }]}>
                <Text style={[styles.statValue, { color: activeColor }]}>{result?.resonance || 85}%</Text>
                <Text style={styles.statLabel}>{t('vibration_label')}</Text>
              </View>
              <View style={[styles.statPill, { borderColor: 'rgba(212,175,55,0.3)' }]}>
                <LucideSparkles color={COLORS.secondary} size={16} />
                <Text style={[styles.statValue, { color: COLORS.secondary, fontSize: 13 }]}>
                  {result?.evolution_state || t('future_state_label')}
                </Text>
              </View>
            </View>
          </MotiView>
        </View>

        {/* ── READING DESCRIPTION ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 900 }}
          style={styles.readingCard}
        >
          <View style={styles.readingHeader}>
            <View style={[styles.readingDot, { backgroundColor: activeColor }]} />
            <Text style={styles.readingHeaderText}>Tvoje duhovno branje</Text>
          </View>
          <Text style={styles.readingText}>
            {expandedDesc ? result?.description : shortDesc}
          </Text>
          {result?.description && result.description.length > 220 && (
            <TouchableOpacity onPress={() => setExpandedDesc(!expandedDesc)} style={styles.readMoreBtn}>
              <Text style={[styles.readMoreText, { color: activeColor }]}>
                {expandedDesc ? '▲ Manj' : '▼ Preberi več'}
              </Text>
            </TouchableOpacity>
          )}
        </MotiView>

        {/* ── VIBRATION BAR ── */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1100 }}
          style={styles.vibSection}
        >
          <View style={styles.vibHeader}>
            <Text style={styles.vibLabel}>{t('vibration_label')}</Text>
            <Text style={[styles.vibPercent, { color: activeColor }]}>{result?.resonance || 85}%</Text>
          </View>
          <View style={styles.vibTrack}>
            <MotiView
              from={{ width: '0%' }}
              animate={{ width: `${result?.resonance || 85}%` }}
              transition={{ type: 'timing', duration: 1500, delay: 1200 }}
              style={[styles.vibFill, { backgroundColor: activeColor }]}
            />
          </View>
        </MotiView>

        {/* ── SCENARIO CARDS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('future_title')}</Text>

          {scenarios.map((item, index) => (
            <MotiView
              key={item.key}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 1300 + index * 180 }}
              style={[styles.scenarioCard, { backgroundColor: item.bg, borderLeftColor: item.accentColor }]}
            >
              <View style={styles.scenarioHeader}>
                <View style={[styles.scenarioIconBg, { backgroundColor: `${item.accentColor}20` }]}>
                  {item.icon}
                </View>
                <Text style={[styles.scenarioLabel, { color: item.accentColor }]}>{item.label}</Text>
              </View>
              <Text style={styles.scenarioDesc}>{item.desc}</Text>
            </MotiView>
          ))}
        </View>

        {/* ── ACTIONS ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1900 }}
          style={styles.actionsSection}
        >
          {/* Share button */}
          <TouchableOpacity onPress={handleShare} style={styles.shareBtnWrapper}>
            <LinearGradient
              colors={['#BF953F', '#FCF6BA', '#AA771C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shareBtn}
            >
              <LucideShare2 color={COLORS.primary} size={18} />
              <Text style={styles.shareBtnText}>{t('sharing_text')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* New reading button */}
          <TouchableOpacity style={styles.restartBtn} onPress={() => router.replace('/')}>
            <LucideRefreshCw color={COLORS.secondary} size={16} />
            <Text style={styles.restartBtnText}>{t('restart_btn')}</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 110,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  topBar: {
    position: 'absolute',
    top: 58,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  backBtn: { padding: 10 },
  shareIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── HERO ──
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  orbWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  orbRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  orb: {
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.5,
  },
  orbIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    alignItems: 'center',
    gap: 16,
  },
  auraTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  statValue: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── READING ──
  readingCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    marginBottom: 24,
  },
  readingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  readingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  readingHeaderText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  readingText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  readMoreBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ── VIBRATION ──
  vibSection: {
    marginBottom: 32,
  },
  vibHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vibLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  vibPercent: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  vibTrack: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  vibFill: {
    height: '100%',
    borderRadius: 3,
  },

  // ── SCENARIOS ──
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 18,
    letterSpacing: 1.5,
  },
  scenarioCard: {
    padding: 20,
    borderRadius: 20,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 14,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  scenarioIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scenarioLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scenarioDesc: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  // ── ACTIONS ──
  actionsSection: {
    gap: 16,
    alignItems: 'center',
  },
  shareBtnWrapper: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  shareBtn: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  shareBtnText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  restartBtnText: {
    color: COLORS.secondary,
    fontWeight: '400',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
