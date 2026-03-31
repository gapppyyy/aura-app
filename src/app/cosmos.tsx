import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import { useAuraContext } from '@/context/AuraContext';
import { LucideChevronLeft, LucideStar } from 'lucide-react-native';
import { MotiView } from 'moti';
import { ZODIAC_SIGNS } from '@/utils/astrology';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Simple static descriptions for the cosmic dashboard
const ASTROMAP: Record<string, { sl: string, en: string, color: string }> = {
  aries: { sl: 'Tvoja energija je polna pionirske moči in strasti.', en: 'Your energy is filled with pioneering power and passion.', color: '#FF4500' },
  taurus: { sl: 'Tvoja avra vibrira s stabilnostjo in zemeljsko toplino.', en: 'Your aura vibrates with stability and earthly warmth.', color: '#228B22' },
  gemini: { sl: 'Tvoja prisotnost prinaša komunikativno in zračno lahkotnost.', en: 'Your presence brings communicative and airy lightness.', color: '#FFD700' },
  cancer: { sl: 'Globoka voda tvoje duše nudi intuitivno in čustveno zavetje.', en: 'The deep water of your soul offers intuitive and emotional shelter.', color: '#C0C0C0' },
  leo: { sl: 'V tvoji avri gori kreativen ogenj in plemenit sijaj.', en: 'A creative fire and noble glow burn within your aura.', color: '#FFA500' },
  virgo: { sl: 'Tvoja naravnanost je analitična in popolnoma prežeta z iskanjem popolnosti.', en: 'Your disposition is analytical and entirely permeated by a quest for perfection.', color: '#8FBC8F' },
  libra: { sl: 'V tebi vlada iskanje harmonije in estetske lepote.', en: 'A search for harmony and aesthetic beauty rules within you.', color: '#FFB6C1' },
  scorpio: { sl: 'Tvoja energija je intenzivna, transformativna in mistična.', en: 'Your energy is intense, transformative, and mystical.', color: '#8B0000' },
  sagittarius: { sl: 'Tvoj svobodni duh neprestano išče višjo resnico in obzorja.', en: 'Your free spirit constantly seeks higher truths and horizons.', color: '#9370DB' },
  capricorn: { sl: 'Tvoj kozmični zapis prinaša disciplino in ambiciozen vzpon.', en: 'Your cosmic imprint brings discipline and an ambitious ascent.', color: '#8B4513' },
  aquarius: { sl: 'Tvaje frekvenca je napredna, uporniška in izjemno vizionarska.', en: 'Your frequency is progressive, rebellious, and highly visionary.', color: '#00CED1' },
  pisces: { sl: 'Si most med domišljijo in duhovnimi dimenzijami univerzuma.', en: 'You are the bridge between imagination and the spiritual dimensions of the universe.', color: '#20B2AA' },
};

export default function CosmosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { userData, triggerHaptic } = useAuraContext();
  
  const sl = i18n.language.startsWith('sl');

  if (!userData || !userData.zodiacSignId) {
    return (
      <AuraBackground>
        <View style={[styles.header, { paddingTop: Math.max(60, insets.top + 10) }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <LucideChevronLeft color="#FFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{sl ? 'Kozmos' : 'Cosmos'}</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyState}>
          <LucideStar color="rgba(255,255,255,0.4)" size={60} style={{ marginBottom: 20 }} />
          <Text style={styles.emptyText}>
            {sl 
              ? 'Prosim, najprej opravi svoje prvo "Skeniranje avre", da izračunamo tvoj oseben kozmični zapis.'
              : 'Please complete your first "Aura Scan" to calculate your personal cosmic imprint.'}
          </Text>
        </View>
      </AuraBackground>
    );
  }

  const sign = ZODIAC_SIGNS.find(z => z.id === userData.zodiacSignId)!;
  const description = ASTROMAP[sign.id];

  return (
    <AuraBackground>
      <View style={[styles.header, { paddingTop: Math.max(60, insets.top + 10) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <LucideChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sl ? 'Kozmos' : 'Cosmos'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={[styles.astroCard, { borderColor: description.color }]}
        >
          <Text style={styles.emoji}>{sign.emoji}</Text>
          <Text style={styles.signTitle}>
             {sl ? sign.sl : sign.en}
          </Text>
          
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{sl ? 'Element' : 'Element'}: {sl ? sign.element : sign.element === 'ognjeno' ? 'Fire' : sign.element === 'vodno' ? 'Water' : sign.element === 'zračno' ? 'Air' : 'Earth'}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{sl ? 'Rojstvo' : 'Birth'}: {new Date(userData.birthDate).toLocaleDateString()}</Text>
            </View>
          </View>

          <Text style={styles.greetingTitle}>
            {sl ? 'Pozdravljen/a, ' : 'Greetings, '}{userData.name}
          </Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.descText}>
            {sl ? description.sl : description.en}
          </Text>
          
          <Text style={styles.infoText}>
            {sl 
            ? 'Na tvoje trenutno energijsko polje ključno vpliva tvoje Sončno znamenje. Vsakič, ko skeniraš avro, naša AI uporabi to vibracijo za še bolj natančno in personalizirano branje, prirejeno samo tvoji duši.'
            : 'Your current energy field is centrally influenced by your Sun Sign. Every time you scan your aura, our AI uses this vibration for an even more precise and personalized reading tailored exclusively to your soul.'}
          </Text>

        </MotiView>
      </ScrollView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: '#FFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  astroCard: {
    backgroundColor: 'rgba(10,10,30,0.6)',
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 70,
    marginBottom: 10,
  },
  signTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 32,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    color: '#FFF',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  greetingTitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 20,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  descText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
  }
});
