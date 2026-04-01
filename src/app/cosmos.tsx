import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import { useAuraContext } from '@/context/AuraContext';
import { LucideChevronLeft, LucideStar, LucideHeart, LucideBriefcase, LucideSparkles } from 'lucide-react-native';
import { MotiView } from 'moti';
import { ZODIAC_SIGNS } from '@/utils/astrology';
import { generateDailyHoroscope } from '@/utils/dailyHoroscope';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ASTROMAP: Record<string, { sl: string, en: string, color: string }> = {
  aries: { sl: 'Tvoja energija je polna pionirske moči.', en: 'Your energy is filled with pioneering power.', color: '#FF4500' },
  taurus: { sl: 'Tvoja avra vibrira s stabilnostjo in zemeljsko toplino.', en: 'Your aura vibrates with stability and earthly warmth.', color: '#228B22' },
  gemini: { sl: 'Tvoja prisotnost prinaša komunikativno in zračno lahkotnost.', en: 'Your presence brings communicative and airy lightness.', color: '#FFD700' },
  cancer: { sl: 'Globoka voda tvoje duše nudi intuitivno zavetje.', en: 'The deep water of your soul offers intuitive shelter.', color: '#C0C0C0' },
  leo: { sl: 'V tvoji avri gori kreativen ogenj in plemenit sijaj.', en: 'A creative fire and noble glow burn within your aura.', color: '#FFA500' },
  virgo: { sl: 'Tvoja naravnanost je zdrava in iskalna popolnosti.', en: 'Your disposition is analytical and seeking perfection.', color: '#8FBC8F' },
  libra: { sl: 'V tebi vlada iskanje harmonije in estetske lepote.', en: 'A search for harmony and aesthetic beauty rules within you.', color: '#FFB6C1' },
  scorpio: { sl: 'Tvoja energija je intenzivna in mistična.', en: 'Your energy is intense, transformative, and mystical.', color: '#8B0000' },
  sagittarius: { sl: 'Tvoj svobodni duh neprestano išče višjo resnico.', en: 'Your free spirit constantly seeks higher truths.', color: '#9370DB' },
  capricorn: { sl: 'Tvoj kozmični zapis prinaša disciplino in vzpon.', en: 'Your cosmic imprint brings discipline and an ambitious ascent.', color: '#8B4513' },
  aquarius: { sl: 'Tvoja frekvenca je napredna in uporniška.', en: 'Your frequency is progressive, rebellious, and highly visionary.', color: '#00CED1' },
  pisces: { sl: 'Si most med domišljijo in duhovnimi dimenzijami.', en: 'You are the bridge between imagination and spiritual dimensions.', color: '#20B2AA' },
};

export default function CosmosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { userData } = useAuraContext();
  
  const sl = i18n.language.startsWith('sl');

  if (!userData || !userData.zodiacSignId) {
    return (
      <AuraBackground>
        <View style={[styles.header, { paddingTop: Math.max(60, insets.top + 10) }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <LucideChevronLeft color="#FFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{sl ? 'Kosmični Pregled' : 'Cosmic Overview'}</Text>
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

  // Generate deterministic horoscopes matching today's date
  const reading = useMemo(() => generateDailyHoroscope(sign.id, i18n.language as 'sl' | 'en'), [sign.id, i18n.language]);

  const todayStr = new Date().toLocaleDateString(sl ? 'sl-SI' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AuraBackground>
      <View style={[styles.header, { paddingTop: Math.max(60, insets.top + 10) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <LucideChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sl ? 'Dnevni Horoskop' : 'Daily Horoscope'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
        >
          {/* Top Profile Banner */}
          <LinearGradient
            colors={[`${description.color}80`, 'rgba(25, 18, 54, 0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.bannerBlock}
          >
            <View style={styles.bannerHeader}>
              <Text style={styles.emojiGiant}>{sign.emoji}</Text>
              <View>
                <Text style={styles.signTitleRaw}>{sl ? sign.sl : sign.en}</Text>
                <Text style={styles.dateTitle}>{todayStr}</Text>
              </View>
            </View>
            <Text style={styles.bannerGreeting}>
              {sl ? 'Kako vibrira tvoja energija danes, ' : 'How is your energy vibrating today, '}{userData.name}?
            </Text>
            
            <View style={styles.vitalStatsBox}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>{sl ? 'Srečna Številka' : 'Lucky Number'}</Text>
                <Text style={[styles.statValue, { color: COLORS.secondary }]}>{reading.luckyNumber}</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>{sl ? 'Energija Dneva' : 'Cosmic Power'}</Text>
                <Text style={[styles.statValue, { color: '#00FA9A' }]}>{reading.powerStat}%</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>{sl ? 'Tvoja Barva' : 'Your Color'}</Text>
                <Text style={[styles.statValue, { color: '#FF69B4', fontSize: 13, textTransform: 'capitalize' }]}>{reading.luckyColor}</Text>
              </View>
            </View>

          </LinearGradient>

          {/* Main Daily Forecast */}
          <View style={styles.cardBlock}>
            <View style={styles.cardHeader}>
               <LucideSparkles color={COLORS.secondary} size={24} />
               <Text style={styles.cardTitle}>{sl ? 'Osrednja Napoved' : 'Main Forecast'}</Text>
            </View>
            <Text style={styles.cardText}>{reading.theme}</Text>
          </View>

          {/* Love Sector */}
          <View style={[styles.cardBlock, { backgroundColor: 'rgba(255, 105, 180, 0.05)', borderColor: 'rgba(255, 105, 180, 0.2)' }]}>
            <View style={styles.cardHeader}>
               <LucideHeart color="#FF69B4" size={24} />
               <Text style={styles.cardTitle}>{sl ? 'Ljubezen & Odnosi' : 'Love & Relationships'}</Text>
            </View>
            <Text style={styles.cardText}>{reading.love}</Text>
          </View>

          {/* Career Sector */}
          <View style={[styles.cardBlock, { backgroundColor: 'rgba(138, 43, 226, 0.05)', borderColor: 'rgba(138, 43, 226, 0.2)' }]}>
            <View style={styles.cardHeader}>
               <LucideBriefcase color="#C084FC" size={24} />
               <Text style={styles.cardTitle}>{sl ? 'Kariera & Finance' : 'Career & Finance'}</Text>
            </View>
            <Text style={styles.cardText}>{reading.career}</Text>
          </View>
          
          <Text style={styles.infoFooterText}>
            {sl 
            ? 'Na tvoje vsakdanje energijsko polje ključno vplivajo asinkroni planetarni premiki glede na tvoje Sončno znamenje. Preveri vsak dan za nov prilagojen Kozmični vpogled.'
            : 'Your daily energy field is heavily influenced by asynchronous planetary movements against your Sun Sign. Check back daily for a new Cosmic Insight.'}
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
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  bannerBlock: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  emojiGiant: {
    fontSize: 50,
  },
  signTitleRaw: {
    color: '#FFF',
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    letterSpacing: 1,
  },
  dateTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    marginTop: 2,
  },
  bannerGreeting: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  vitalStatsBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Outfit-Medium',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
  },
  statDiv: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardBlock: {
    backgroundColor: 'rgba(20, 15, 40, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFF',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 18,
  },
  cardText: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Outfit-Regular',
    fontSize: 15,
    lineHeight: 24,
  },
  infoFooterText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  }
});
