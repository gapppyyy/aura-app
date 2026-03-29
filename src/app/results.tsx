import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Share
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView, MotiText } from 'moti';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import { 
  LucideShare2, 
  LucideSparkles, 
  LucideMoon, 
  LucideZap, 
  LucideAlertTriangle, 
  LucideTrendingUp, 
  LucideInfo,
  LucideChevronLeft
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuraContext } from '@/context/AuraContext';

const { width } = Dimensions.get('window');

const getScenarios = (t: any, result: any) => [
  { 
    key: 'current', 
    label: t('path_current'), 
    icon: <LucideTrendingUp color="#AAA" size={24} />, 
    title: t('path_current'),
    desc: result?.scenarios?.current || t('path_current_desc'), 
    color: 'rgba(255,255,255,0.03)' 
  },
  { 
    key: 'optimized', 
    label: t('path_optimized'), 
    icon: <LucideZap color={COLORS.secondary} size={24} />, 
    title: t('path_optimized'),
    desc: result?.scenarios?.optimized || t('path_optimized_desc'), 
    color: 'rgba(212, 175, 55, 0.08)' 
  },
  { 
    key: 'risk', 
    label: t('path_risk'), 
    icon: <LucideAlertTriangle color={COLORS.error} size={24} />, 
    title: t('path_risk'),
    desc: result?.scenarios?.risk || t('path_risk_desc'), 
    color: 'rgba(255, 59, 48, 0.05)' 
  },
];

export default function ResultsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { result } = useAuraContext();
  const scenarios = getScenarios(t, result);

  const auraColorMap: any = {
    'green': '#00FF9C',
    'blue': '#00F5FF',
    'red': '#FF4136',
    'yellow': '#FFD700',
  };

  const activeColor = auraColorMap[result?.color || 'green'] || '#00FF9C';

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `✨ ${result.title} ✨\n\n${result.description}\n\nResonanca: ${result.resonance}%\nSolaura AI 🔮`,
      });
    } catch (e) { console.error(e); }
  };

  return (
    <AuraBackground>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn}>
           <LucideChevronLeft color={COLORS.secondary} size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
           <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 1500 }}
            style={styles.auraGlaze}
          >
             <LinearGradient
                colors={[activeColor, activeColor, 'rgba(0, 0, 0, 0.1)']}
                style={styles.auraDisk}
             />
             <View style={styles.auraIdentity}>
                <Text style={styles.auraTitle}>{result?.title || t('aura_green_title')}</Text>
             </View>
          </MotiView>
          <MotiView 
             from={{ opacity: 0, translateY: 10 }}
             animate={{ opacity: 1, translateY: 0 }}
             transition={{ delay: 1000 }}
             style={styles.auraReadingBox}
          >
             <Text style={styles.auraReadingText}>{result?.description || t('aura_green_desc')}</Text>
          </MotiView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('future_title')}</Text>
          
          {scenarios.map((item: any, index: number) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 300 + (200 * index) }}
              style={[
                styles.scenarioCard, 
                { 
                  backgroundColor: item.color, 
                  borderColor: item.label === t('path_optimized') ? COLORS.secondary : 'rgba(212, 175, 55, 0.15)' 
                }
              ]}
            >
              <View style={styles.scenarioHeader}>
                <View style={styles.scenarioIcon}>{item.icon}</View>
                <Text style={[styles.scenarioLabel, { color: item.label === t('path_optimized') ? COLORS.secondary : '#FFF' }]}>
                  {item.label}
                </Text>
              </View>
              <Text style={styles.scenarioFullTitle}>{item.title}</Text>
              <Text style={styles.scenarioDesc}>{item.desc}</Text>
            </MotiView>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('future_self')}</Text>
          <MotiView 
             from={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             style={styles.evolutionCard}
          >
             <LinearGradient 
                colors={['#2D0B5A', '#FFD700']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.evolutionVis}
             >
                <LucideMoon color="#FFF" size={48} opacity={0.5} />
             </LinearGradient>
             <View style={styles.evolutionLabel}>
                <Text style={styles.evolutionTitle}>{t('future_state_label')}</Text>
                <Text style={styles.evolutionText}>{t('future_self_desc')}</Text>
                <View style={styles.vibrationBar}>
                   <Text style={styles.vibrationLabel}>{t('vibration_label')}</Text>
                   <View style={styles.vibrationTrack}>
                      <View style={[styles.vibrationFill, { width: `${result?.resonance || 85}%`, backgroundColor: activeColor }]} />
                   </View>
                   <Text style={[styles.vibrationPercent, { color: activeColor }]}>{result?.resonance || 85}%</Text>
                </View>
             </View>
          </MotiView>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtnWrapper}>
             <LinearGradient
                colors={['#BF953F', '#FCF6BA', '#AA771C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shareBtn}
              >
                  <LucideShare2 color={COLORS.primary} size={22} />
                  <Text style={styles.shareBtnText}>{t('sharing_text')}</Text>
              </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restartBtn} onPress={() => router.replace('/')}>
             <Text style={styles.restartBtnText}>{t('restart_btn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 120, // More space for top bar
    paddingBottom: 100,
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backBtn: {
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  auraGlaze: {
    width: 260,
    height: 260,
    borderRadius: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 30,
  },
  auraDisk: {
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.4,
    shadowColor: COLORS.auraGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  auraIdentity: {
    position: 'absolute',
    alignItems: 'center',
  },
  auraTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 2,
    width: 220,
    textTransform: 'uppercase',
  },
  auraReadingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  auraReadingText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 60,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 24,
    letterSpacing: 2,
  },
  scenarioCard: {
    padding: 24,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 20,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  scenarioIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  scenarioLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scenarioFullTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  scenarioDesc: {
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontSize: 14,
    fontWeight: '300',
  },
  evolutionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  evolutionVis: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  evolutionLabel: {
    alignItems: 'flex-start',
  },
  evolutionTitle: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  evolutionText: {
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontSize: 15,
    fontWeight: '300',
    marginBottom: 24,
  },
  vibrationBar: {
    width: '100%',
  },
  vibrationLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.6,
  },
  vibrationTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    marginBottom: 4,
  },
  vibrationFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
  vibrationPercent: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '900',
    alignSelf: 'flex-end',
  },
  actions: {
    gap: 20,
  },
  shareBtnWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  shareBtn: {
    flexDirection: 'row',
    paddingVertical: 22,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  shareBtnText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  restartBtn: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  restartBtnText: {
    color: COLORS.secondary,
    fontWeight: '300',
    fontSize: 14,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
});
