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
        
        {/* Top Controls */}
        <View style={styles.topControls}>
           <MotiView 
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: 300 }}
              style={styles.langContainer}
           >
              <Text style={styles.langLabel}>{t('choose_language')}</Text>
              <View style={styles.langOptions}>
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
              </View>
           </MotiView>

           <MotiView
             from={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             style={styles.historyBtnWrapper}
           >
              <TouchableOpacity 
                onPress={() => { triggerHaptic('medium'); router.push('/history'); }}
                style={styles.historyBtn}
              >
                  <LucideHistory color={COLORS.secondary} size={24} />
              </TouchableOpacity>
           </MotiView>
        </View>

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

        <View style={styles.content}>
          <MotiText 
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 800, duration: 1000 }}
            style={styles.title}
          >
            {t('welcome')}
          </MotiText>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 1200, duration: 800 }}
          >
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push('/onboarding')}
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
        </View>
      </View>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 30,
    paddingBottom: 80,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  langContainer: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
  },
  historyBtnWrapper: {
    // Spacer handled by justifyContent: 'space-between'
  },
  historyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  langLabel: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.8,
  },
  langOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  langBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  langBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  langBtnText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '700',
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
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 260,
    height: 260,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)', // Thin golden circle border
  },
  content: {
    gap: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 52,
    letterSpacing: 1,
  },
  ctaWrapper: {
    borderRadius: 99,
    overflow: 'hidden',
  },
  cta: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  ctaText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
});
