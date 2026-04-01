import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Modal,
  Pressable,
  Alert,
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
  LucideDownload,
  LucideImage,
  LucideX,
  LucideInfo,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuraContext } from '@/context/AuraContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ManifestationCard, CARD_WIDTH, CARD_HEIGHT } from '@/components/ManifestationCard';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');

const AURA_COLOR_MAP: Record<string, string> = {
  green: '#00E5A0',
  jade: '#00E5A0',
  blue: '#5B8AF0',
  indigo: '#4B0082',
  'cosmic blue': '#2E5BFF',
  red: '#FF4D6D',
  ruby: '#E0115F',
  yellow: '#FFD700',
  gold: '#FFD700',
  violet: '#B06EFF',
  'solar orange': '#FF8C00',
  orange: '#FF8C00',
};

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { result, userData } = useAuraContext();
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [tooltip, setTooltip] = useState<{ title: string; plain: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const cardRef = useRef<ViewShot>(null);

  const showTip = (title: string, plain: string) => setTooltip({ title, plain });
  const hideTip = () => setTooltip(null);

  const sl = i18n.language === 'sl';

  const handleSaveManifestCard = async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          sl ? 'Dovoljenje zavrnjeno' : 'Permission denied',
          sl ? 'Prosim dovoli dostop do galerije v nastavitvah.' : 'Please allow gallery access in settings.'
        );
        setSaving(false);
        return;
      }
      // Capture the card as image
      const uri = await (cardRef.current as any)?.capture();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        setShowCardPreview(false);
        Alert.alert(
          sl ? '✨ Shranjeno!' : '✨ Saved!',
          sl
            ? 'Tvoja manifestacijska kartica je shranjena v galerijo. Natisni jo in jo postavi na vidno mesto!'
            : 'Your manifestation card is saved to your gallery. Print it and place it where you can see it!'
        );
      }
    } catch (e) {
      console.error('Save error:', e);
      Alert.alert(sl ? 'Napaka' : 'Error', sl ? 'Shranjevanje ni uspelo.' : 'Failed to save.');
    }
    setSaving(false);
  };

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
            <Text style={styles.readingHeaderText}>
              {i18n.language === 'sl' ? '🌌 Glas vesolja' : '🌌 Voice of the Universe'}
            </Text>
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

        {/* ── FACE SCAN READING ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1050 }}
          style={styles.faceCard}
        >
          <View style={styles.faceCardHeader}>
            <View style={styles.faceCardIcon}>
              <LucideSparkles color={activeColor} size={16} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.faceCardTitle}>
                {sl ? '✦ Svetlobni pečat duše' : '✦ Soul Light Imprint'}
              </Text>
              <Text style={styles.faceCardSubtitle}>
                {sl ? 'Prebrano iz tvojega energijskega polja' : 'Read from your energetic field'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => showTip(
                sl ? '✦ Svetlobni pečat duše' : '✦ Soul Light Imprint',
                sl ? 'Zaznava obraza — podatki prebrani neposredno iz tvojega skeniranja:  raven stresa, energije, ravnovesja in odprtosti.' : 'Face scan data — stress, energy, balance and openness levels read directly from your scan.'
              )}
              style={styles.infoBtn}
            >
              <Text style={styles.infoBtnText}>ⓘ</Text>
            </TouchableOpacity>
          </View>

          {/* Facial metrics bars */}
          <View style={styles.metricsGrid}>
            {[
              { label: sl ? 'Zemeljska obremenitev' : 'Earthly Burden', plain: sl ? 'Raven stresa — koliko napetosti nosi tvoje telo.' : 'Stress level — how much tension your body carries.', value: result?.faceData?.stress ?? 0.35, color: '#FF6B6B', invert: true },
              { label: sl ? 'Vitalna svetloba' : 'Vital Light', plain: sl ? 'Raven energije — kako živahno in polno se tvoje telo trenutno počuti.' : 'Energy level — how vibrant and full your body currently feels.', value: result?.faceData?.energy ?? 0.72, color: '#00E5A0', invert: false },
              { label: sl ? 'Harmonija čaker' : 'Chakra Harmony', plain: sl ? 'Notranje ravnovesje — koliko so tvoje energijske točke usklajene med seboj.' : 'Inner balance — how aligned your energy centres are with each other.', value: result?.faceData?.balance ?? 0.68, color: activeColor, invert: false },
              { label: sl ? 'Duhovna receptivnost' : 'Spiritual Openness', plain: sl ? 'Odprtost duha — koliko si pripravljen/a sprejeti nove energije in spremembe.' : 'Openness of spirit — how ready you are to receive new energies and change.', value: result?.faceData?.openness ?? 0.55, color: '#B06EFF', invert: false },
            ].map((metric, i) => (
              <View key={i} style={styles.metricItem}>
                <View style={styles.metricLabelRow}>
                  <View style={styles.metricLabelInner}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <TouchableOpacity onPress={() => showTip(metric.label, metric.plain)} style={styles.metricInfoBtn}>
                      <Text style={styles.metricInfoText}>ⓘ</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.metricValue, { color: metric.color }]}>
                    {metric.invert
                      ? Math.round((1 - metric.value) * 100)
                      : Math.round(metric.value * 100)}%
                  </Text>
                </View>
                <View style={styles.metricTrack}>
                  <MotiView
                    from={{ width: '0%' }}
                    animate={{ width: `${metric.invert ? (1 - metric.value) * 100 : metric.value * 100}%` }}
                    transition={{ type: 'timing', duration: 1200, delay: 1200 + i * 150 }}
                    style={[styles.metricFill, { backgroundColor: metric.color }]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* AI face interpretation */}
          {result?.face_reading && (
            <View style={styles.faceReadingText}>
              <Text style={styles.faceReadingContent}>{result.face_reading}</Text>
            </View>
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
            <View style={styles.vibLabelRow}>
              <Text style={styles.vibLabel}>
                {sl ? '⚡ Frekvenčna harmonija' : '⚡ Frequency Harmony'}
              </Text>
              <TouchableOpacity
                onPress={() => showTip(
                  sl ? '⚡ Frekvenčna harmonija' : '⚡ Frequency Harmony',
                  sl ? 'Skupna vibracijska resonanca — ocena tvojega celotnega duhovnega stanja od 0 do 100.' : 'Overall vibrational resonance — your total spiritual state score from 0 to 100.'
                )}
                style={styles.metricInfoBtn}
              >
                <Text style={styles.metricInfoText}>ⓘ</Text>
              </TouchableOpacity>
            </View>
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
                <TouchableOpacity
                  onPress={() => showTip(item.label,
                    item.key === 'current'
                      ? (sl ? 'Trenutna pot — kaj se bo zgodilo, če ostaneš na sedanji smeri.' : 'Current path — what happens if you stay on your present course.')
                      : item.key === 'optimized'
                      ? (sl ? 'Optimalna pot — kako doseči najboljšo možno prihodnost.' : 'Optimal path — how to reach your best possible future.')
                      : (sl ? 'Karmična preizkušnja — ovire, ki te čakajo, če ne ukrepaš.' : 'Karmic trial — obstacles that await if you do not act.')
                  )}
                  style={styles.metricInfoBtn}
                >
                  <Text style={styles.metricInfoText}>ⓘ</Text>
                </TouchableOpacity>
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

          {/* Manifestation card export button */}
          <TouchableOpacity
            onPress={() => setShowCardPreview(true)}
            style={styles.manifestBtn}
          >
            <LucideImage color="#C084FC" size={18} />
            <Text style={styles.manifestBtnText}>
              {sl ? 'Shrani manifestacijsko kartico' : 'Save Manifestation Card'}
            </Text>
          </TouchableOpacity>

          {/* New reading button */}
          <TouchableOpacity style={styles.restartBtn} onPress={() => router.replace('/')}>
            <LucideRefreshCw color={COLORS.secondary} size={16} />
            <Text style={styles.restartBtnText}>{t('restart_btn')}</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>

      {/* ── HIDDEN MANIFESTATION CARD (for export) ── */}
      <View style={styles.hiddenCardContainer} pointerEvents="none">
        <ViewShot ref={cardRef} options={{ format: 'png', quality: 1.0 }}>
           {result && (
            <ManifestationCard
              result={result}
              userData={result.userData || (userData || undefined)}
              language={i18n.language}
            />
          )}
        </ViewShot>
      </View>

      {/* ── MANIFESTATION CARD PREVIEW MODAL ── */}
      <Modal
        visible={showCardPreview}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardPreview(false)}
      >
        <Pressable style={styles.previewOverlay} onPress={() => setShowCardPreview(false)}>
          <Pressable style={[styles.previewSheet, { paddingBottom: Math.max(80, insets.bottom + 40) }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.previewHandle} />
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {sl ? '✨ Manifestacijska kartica' : '✨ Manifestation Card'}
              </Text>
              <TouchableOpacity onPress={() => setShowCardPreview(false)} style={styles.previewCloseBtnTop}>
                <LucideX color="rgba(255,255,255,0.5)" size={24} />
              </TouchableOpacity>
            </View>
            <Text style={styles.previewSub}>
              {sl
                ? 'Shrani in natisni za dnevno manifestacijo'
                : 'Save and print for daily manifestation'}
            </Text>

            {/* Card preview wrapped in ScrollView to prevent overflow on small screens */}
            <ScrollView 
              style={{ flexShrink: 1, width: '100%', marginVertical: 12 }}
              contentContainerStyle={{ alignItems: 'center', paddingVertical: 10 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.previewCardWrapper}>
                {result && (
                  <ManifestationCard
                    result={result}
                    userData={result.userData || (userData || undefined)}
                    language={i18n.language}
                  />
                )}
              </View>
            </ScrollView>

            {/* Actions */}
            <TouchableOpacity
              onPress={handleSaveManifestCard}
              style={styles.saveCardBtn}
              disabled={saving}
            >
              <LinearGradient
                colors={['#7C3AED', '#A855F7', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveCardGradient}
              >
                <LucideDownload color="#FFF" size={18} />
                <Text style={styles.saveCardText}>
                  {saving
                    ? (sl ? 'Shranjujem...' : 'Saving...')
                    : (sl ? 'Shrani v galerijo' : 'Save to Gallery')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCardPreview(false)}
              style={styles.previewCloseBtn}
            >
              <Text style={styles.previewCloseTxt}>
                {sl ? 'Zapri' : 'Close'}
              </Text>
            </TouchableOpacity>
            </Pressable>
        </Pressable>
      </Modal>

      {/* ── TOOLTIP MODAL ── */}
      <Modal visible={!!tooltip} transparent animationType="fade" onRequestClose={hideTip}>
        <Pressable style={styles.tooltipOverlay} onPress={hideTip}>
          <MotiView
            from={{ translateY: 40, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.tooltipCard}
          >
            <View style={styles.tooltipHandle} />
            <Text style={styles.tooltipTitle}>{tooltip?.title}</Text>
            <View style={styles.tooltipDivider} />
            <Text style={styles.tooltipPlain}>
              {sl ? '💬 V preprostem jeziku:' : '💬 In plain language:'}
            </Text>
            <Text style={styles.tooltipText}>{tooltip?.plain}</Text>
            <TouchableOpacity onPress={hideTip} style={styles.tooltipClose}>
              <Text style={styles.tooltipCloseText}>{sl ? 'Razumem ✓' : 'Got it ✓'}</Text>
            </TouchableOpacity>
          </MotiView>
        </Pressable>
      </Modal>
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

  // ── FACE SCAN ──
  faceCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    marginBottom: 24,
  },
  faceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  faceCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
  },
  faceCardTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  faceCardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  metricsGrid: {
    gap: 14,
    marginBottom: 16,
  },
  metricItem: {
    gap: 6,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metricTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 2,
  },
  faceReadingText: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 16,
    marginTop: 4,
  },
  faceReadingContent: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // ── INFO BUTTONS ──
  infoBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoBtnText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    fontWeight: '600',
  },
  metricLabelInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricInfoBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricInfoText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  vibLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // ── TOOLTIP MODAL ──
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  tooltipCard: {
    backgroundColor: '#160D2E',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 44,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    borderBottomWidth: 0,
  },
  tooltipHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  tooltipTitle: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  tooltipDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  tooltipPlain: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '300',
    marginBottom: 28,
  },
  tooltipClose: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  tooltipCloseText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  manifestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.35)',
    backgroundColor: 'rgba(124,58,237,0.12)',
    width: '100%',
  },
  manifestBtnText: {
    color: '#C084FC',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  hiddenCardContainer: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    opacity: 0,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  previewSheet: {
    backgroundColor: '#0E0720',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.2)',
    borderBottomWidth: 0,
    maxHeight: '94%',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
    width: '100%',
  },
  previewCloseBtnTop: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  previewHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  previewTitle: {
    color: '#C084FC',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  previewSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  previewCardWrapper: {
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveCardBtn: { borderRadius: 18, overflow: 'hidden' },
  saveCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  saveCardText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  previewCloseBtn: { paddingVertical: 12, alignItems: 'center' },
  previewCloseTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: 1 },
});

