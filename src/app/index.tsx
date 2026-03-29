import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView, MotiText } from 'moti';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { useAuraContext } from '@/context/AuraContext';
import { LucideHistory } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HookScreen() {
  const router = useRouter();
  const { t, i18n: i18nBase } = useTranslation();
  const { triggerHaptic } = useAuraContext();

  const changeLanguage = (lng: string) => {
    triggerHaptic('light');
    i18nBase.changeLanguage(lng);
  };

  return (
    <AuraBackground>
      <View style={styles.container}>

        {/* Language switcher - top center, slim */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', delay: 300 }}
          style={styles.langRow}
        >
          <TouchableOpacity
            onPress={() => changeLanguage('sl')}
            style={[styles.langBtn, i18nBase.language === 'sl' && styles.langBtnActive]}
          >
            <Text style={[styles.langBtnText, i18nBase.language === 'sl' && styles.langBtnTextActive]}>SLO</Text>
          </TouchableOpacity>
          <View style={styles.langDivider} />
          <TouchableOpacity
            onPress={() => changeLanguage('en')}
            style={[styles.langBtn, i18nBase.language === 'en' && styles.langBtnActive]}
          >
            <Text style={[styles.langBtnText, i18nBase.language === 'en' && styles.langBtnTextActive]}>ENG</Text>
          </TouchableOpacity>
        </MotiView>

        {/* Logo centered */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 2000 }}
          style={styles.logoWrapper}
        >
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </MotiView>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          <MotiText
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 800, duration: 1000 }}
            style={styles.title}
          >
            {t('welcome')}
          </MotiText>

          {/* Main CTA */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 1200, duration: 800 }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => { triggerHaptic('medium'); router.push('/onboarding'); }}
              style={styles.ctaWrapper}
            >
              <LinearGradient
                colors={['#BF953F', '#FCF6BA', '#AA771C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>{t('start_scan')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* History - secondary link below CTA */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', delay: 1600 }}
            style={styles.historyRow}
          >
            <TouchableOpacity
              onPress={() => { triggerHaptic('light'); router.push('/history'); }}
              style={styles.historyBtn}
            >
              <LucideHistory color={COLORS.secondary} size={16} />
              <Text style={styles.historyText}>{t('history_title')}</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </View>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  langRow: {
    position: 'absolute',
    top: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  langBtn: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 25,
  },
  langBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  langBtnText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  langBtnTextActive: {
    color: '#D4AF37',
  },
  langDivider: {
    width: 1,
    height: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  logoWrapper: {
    position: 'absolute',
    top: '18%',
    alignItems: 'center',
  },
  logoImage: {
    width: 250,
    height: 250,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
    gap: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '300',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: 1,
    marginBottom: 8,
  },
  ctaWrapper: {
    borderRadius: 99,
    overflow: 'hidden',
    width: width - 48,
  },
  cta: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  ctaText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  historyRow: {
    alignItems: 'center',
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  historyText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
