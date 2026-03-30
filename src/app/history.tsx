import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import {
  LucideChevronLeft, LucideHistory, LucideTrash2, LucideSparkles,
  LucideZap, LucideAlertTriangle, LucideTrendingUp, LucideX,
  LucideImage, LucideDownload,
} from 'lucide-react-native';
import { AuraBackground } from '@/components/AuraBackground';
import { useAuraContext, AuraReading } from '@/context/AuraContext';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ManifestationCard } from '@/components/ManifestationCard';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AURA_COLOR_MAP: Record<string, string> = {
  green: '#00E5A0',
  blue: '#5B8AF0',
  red: '#FF4D6D',
  yellow: '#FFD700',
  violet: '#B06EFF',
};

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { history, setResult, clearHistory, triggerHaptic } = useAuraContext();
  const [selected, setSelected] = useState<AuraReading | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const cardRef = useRef<ViewShot>(null);
  const sl = i18n.language === 'sl';

  const handleClear = () => { triggerHaptic('heavy'); clearHistory(); };
  const handleOpen = (item: AuraReading) => { triggerHaptic('light'); setSelected(item); };

  const handleViewFull = () => {
    if (selected) {
      setResult(selected);
      setSelected(null);
      router.push('/results');
    }
  };

  const handleSaveCard = async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          sl ? 'Dovoljenje zavrnjeno' : 'Permission denied',
          sl ? 'Prosim dovoli dostop do galerije.' : 'Please allow gallery access.'
        );
        setSaving(false);
        return;
      }
      const uri = await (cardRef.current as any)?.capture();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        setShowCardPreview(false);
        Alert.alert(
          sl ? '✨ Shranjeno!' : '✨ Saved!',
          sl ? 'Manifestacijska kartica je shranjena v galerijo!' : 'Manifestation card saved to your gallery!'
        );
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const getColor = (color: string) => AURA_COLOR_MAP[color] || '#00E5A0';

  const renderItem = ({ item, index }: { item: AuraReading; index: number }) => {
    const auraColor = getColor(item.color);
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 80 }}
      >
        <TouchableOpacity style={styles.historyCard} onPress={() => handleOpen(item)} activeOpacity={0.75}>
          <View style={[styles.colorBar, { backgroundColor: auraColor }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <View style={[styles.resonancePill, { borderColor: `${auraColor}60` }]}>
                <Text style={[styles.resonanceText, { color: auraColor }]}>{item.resonance}%</Text>
              </View>
            </View>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.cardCta}>{sl ? 'Pritisni za celotno analizo →' : 'Tap for full reading →'}</Text>
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <>
      <AuraBackground>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <LucideChevronLeft color={COLORS.secondary} size={30} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('history_title')}</Text>
          {history.length > 0 ? (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <LucideTrash2 color={COLORS.error} size={22} />
            </TouchableOpacity>
          ) : <View style={{ width: 44 }} />}
        </View>

        <FlatList
          data={history}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 40 }]}
          ListEmptyComponent={
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.emptyState}
            >
              <LucideHistory color="rgba(212,175,55,0.15)" size={80} />
              <Text style={styles.emptyTitle}>
                {sl ? 'Kronike duše so prazne' : 'Soul Chronicles are empty'}
              </Text>
              <Text style={styles.emptyText}>
                {sl
                  ? 'Tvoja duhovna pot se še ni zapisala v kronike.\nOpravi svojo prvo analizo.'
                  : 'Your spiritual journey has not been recorded yet.\nComplete your first reading.'}
              </Text>
              <TouchableOpacity onPress={() => router.replace('/')} style={styles.startBtn}>
                <LinearGradient
                  colors={['#BF953F', '#FCF6BA', '#AA771C']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.startBtnGradient}
                >
                  <Text style={styles.startBtnText}>{sl ? 'Začni analizo' : 'Start Reading'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          }
        />

        {/* Detail modal */}
        <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
          <Pressable style={styles.modalOverlay} onPress={() => setSelected(null)}>
            <Pressable style={[styles.modalCard, { paddingBottom: Math.max(30, insets.bottom + 10) }]} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHandle} />
              <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
                <LucideX color="rgba(255,255,255,0.5)" size={22} />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                {selected && (() => {
                  const color = getColor(selected.color);
                  return (
                    <>
                      <View style={styles.modalOrbRow}>
                        <LinearGradient
                          colors={[color, `${color}55`]}
                          style={[styles.modalOrb, { shadowColor: color }]}
                        />
                        <View style={styles.modalTitleBlock}>
                          <Text style={[styles.modalTitle, { color }]} numberOfLines={2}>{selected.title}</Text>
                          <View style={[styles.modalPill, { borderColor: `${color}60`, backgroundColor: `${color}15` }]}>
                            <LucideSparkles color={color} size={12} />
                            <Text style={[styles.modalPillText, { color }]}>{selected.resonance}%</Text>
                          </View>
                        </View>
                      </View>

                      <Text style={styles.modalDesc}>{selected.description?.slice(0, 300)}...</Text>

                      {selected.scenarios && (
                        <View style={styles.miniScenarios}>
                          {[
                            { key: 'current', icon: <LucideTrendingUp color="#9AA8B8" size={14} />, label: sl ? 'Sedanja pot' : 'Current', text: selected.scenarios.current, color: '#9AA8B8' },
                            { key: 'optimized', icon: <LucideZap color={COLORS.secondary} size={14} />, label: sl ? 'Zvezdni preboj' : 'Optimal', text: selected.scenarios.optimized, color: COLORS.secondary },
                            { key: 'risk', icon: <LucideAlertTriangle color="#FF6B6B" size={14} />, label: sl ? 'Preizkušnja' : 'Risk', text: selected.scenarios.risk, color: '#FF6B6B' },
                          ].map((s) => (
                            <View key={s.key} style={[styles.miniCard, { borderLeftColor: s.color }]}>
                              <View style={styles.miniCardHeader}>
                                {s.icon}
                                <Text style={[styles.miniCardLabel, { color: s.color }]}>{s.label}</Text>
                              </View>
                              <Text style={styles.miniCardText} numberOfLines={3}>{s.text}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Open full reading */}
                      <TouchableOpacity onPress={handleViewFull} style={styles.fullBtn}>
                        <LinearGradient
                          colors={['#BF953F', '#FCF6BA', '#AA771C']}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={styles.fullBtnGradient}
                        >
                          <Text style={styles.fullBtnText}>{sl ? 'Odpri celotno analizo' : 'Open Full Reading'}</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* Export manifestation card */}
                      <TouchableOpacity onPress={() => setShowCardPreview(true)} style={styles.manifestBtn}>
                        <LucideImage color="#C084FC" size={16} />
                        <Text style={styles.manifestBtnText}>
                          {sl ? 'Shrani manifestacijsko kartico' : 'Save Manifestation Card'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  );
                })()}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </AuraBackground>

      {/* Hidden card for capture */}
      <View style={styles.hiddenCard} pointerEvents="none">
        <ViewShot ref={cardRef} options={{ format: 'png', quality: 1.0 }}>
          {selected && <ManifestationCard result={selected} userData={selected.userData} language={i18n.language} />}
        </ViewShot>
      </View>

      {/* Card preview modal */}
      <Modal visible={showCardPreview} transparent animationType="slide" onRequestClose={() => setShowCardPreview(false)}>
        <Pressable style={styles.previewOverlay} onPress={() => setShowCardPreview(false)}>
          <Pressable style={[styles.previewSheet, { paddingBottom: Math.max(30, insets.bottom + 10) }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.previewHandle} />
            
            <View style={styles.previewHeaderFixed}>
              <Text style={styles.previewTitle}>{sl ? '✨ Manifestacijska kartica' : '✨ Manifestation Card'}</Text>
              <TouchableOpacity onPress={() => setShowCardPreview(false)} style={styles.previewCloseBtnTop}>
                <LucideX color="rgba(255,255,255,0.5)" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.previewSub}>{sl ? 'Shrani in natisni za dnevno manifestacijo' : 'Save and print for daily manifestation'}</Text>
            
            <View style={styles.previewCardWrapper}>
              {selected && <ManifestationCard result={selected} userData={selected.userData} language={i18n.language} />}
            </View>
            
            <TouchableOpacity onPress={handleSaveCard} disabled={saving} style={styles.saveCardBtn}>
              <LinearGradient
                colors={['#7C3AED', '#A855F7', '#7C3AED']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.saveCardGradient}
              >
                <LucideDownload color="#FFF" size={18} />
                <Text style={styles.saveCardText}>
                  {saving ? (sl ? 'Shranjujem...' : 'Saving...') : (sl ? 'Shrani v galerijo' : 'Save to Gallery')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowCardPreview(false)} style={styles.previewCloseBtn}>
              <Text style={styles.previewCloseTxt}>{sl ? 'Zapri' : 'Close'}</Text>
            </TouchableOpacity>
            </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: { padding: 10 },
  headerTitle: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  clearBtn: { padding: 10 },
  listContainer: { padding: 20, paddingBottom: 100, gap: 14 },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  colorBar: { width: 5 },
  cardContent: { flex: 1, padding: 16, gap: 6 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  cardTitle: { color: '#FFF', fontSize: 15, fontWeight: '700', flex: 1 },
  resonancePill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  resonanceText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  cardDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 19 },
  cardCta: { color: COLORS.secondary, fontSize: 11, letterSpacing: 1, opacity: 0.7, marginTop: 4 },
  emptyState: { marginTop: 80, alignItems: 'center', paddingHorizontal: 30, gap: 16 },
  emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: '600', letterSpacing: 1, textAlign: 'center', marginTop: 16 },
  emptyText: { color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  startBtn: { width: '80%', borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  startBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  startBtnText: { color: '#1a0a2e', fontWeight: '900', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#130A28',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    borderBottomWidth: 0,
    width: '100%',
  },
  modalHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalClose: { position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center' },
  modalOrbRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20, marginTop: 8 },
  modalOrb: { width: 64, height: 64, borderRadius: 32, opacity: 0.7, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20 },
  modalTitleBlock: { flex: 1, gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', letterSpacing: 0.5, lineHeight: 24 },
  modalPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  modalPillText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  modalDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 23, fontStyle: 'italic', marginBottom: 20 },
  miniScenarios: { gap: 10, marginBottom: 24 },
  miniCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderLeftWidth: 3, gap: 6 },
  miniCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniCardLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  miniCardText: { color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 20 },
  fullBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  fullBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  fullBtnText: { color: '#1a0a2e', fontWeight: '900', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' },
  manifestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 14, borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.35)', backgroundColor: 'rgba(124,58,237,0.12)',
  },
  manifestBtnText: { color: '#C084FC', fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  hiddenCard: { position: 'absolute', top: -9999, left: -9999, opacity: 0 },

  // Card preview modal
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  previewSheet: {
    backgroundColor: '#0E0720', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60,
    borderWidth: 1, borderColor: 'rgba(192,132,252,0.2)', borderBottomWidth: 0,
    maxHeight: '94%', gap: 12,
    width: '100%',
  },
  previewHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  previewHeaderFixed: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' },
  previewCloseBtnTop: { position: 'absolute', right: 0, padding: 10 },
  previewTitle: { color: '#C084FC', fontSize: 18, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
  previewSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginBottom: 4 },
  previewCardWrapper: { alignItems: 'center', borderRadius: 20, overflow: 'hidden' },
  saveCardBtn: { borderRadius: 18, overflow: 'hidden' },
  saveCardGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  saveCardText: { color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  previewCloseBtn: { paddingVertical: 12, alignItems: 'center' },
  previewCloseTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: 1 },
});
