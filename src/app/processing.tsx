import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView, AnimatePresence } from 'moti';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import { LucideSparkles, LucideMoon, LucideSun } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuraContext } from '@/context/AuraContext';
import { generateAuraReading } from '@/services/aiService';

const { width } = Dimensions.get('window');

export default function ProcessingScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { userData, setResult, triggerHaptic } = useAuraContext();
  const [stepIndex, setStepIndex] = useState(0);
  const steps = t('scan_steps', { returnObjects: true }) as string[];

  useEffect(() => {
    const fetchAIResult = async () => {
      if (userData) {
        const mockFaceData = { stress: Math.random(), energy: Math.random(), balance: Math.random() };
        const result = await generateAuraReading(userData, mockFaceData, i18n.language);
        if (result) {
          setResult(result);
        }
      }
    };
    
    fetchAIResult();

    const timer = setInterval(() => {
      triggerHaptic('light');
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          // Run side effects on next tick for stability
          setTimeout(() => {
            triggerHaptic('success');
            router.replace('/results');
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <AuraBackground>
      <View style={styles.container}>
        <MotiView
          from={{ rotate: '0deg', scale: 0.8 }}
          animate={{ rotate: '360deg', scale: 1 }}
          transition={{
            type: 'timing',
            duration: 8000,
            loop: true,
            repeatReverse: false,
          }}
          style={styles.sacredOrb}
        >
          <LinearGradient
            colors={['#BF953F', '#FCF6BA', '#AA771C']}
            style={styles.orbCore}
          />
        </MotiView>

        <View style={styles.content}>
          <AnimatePresence>
            <MotiView
              key={stepIndex}
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -15 }}
              style={styles.stepBox}
            >
              <Text style={styles.stepText}>{steps[stepIndex]}</Text>
            </MotiView>
          </AnimatePresence>

          <View style={styles.trackWrapper}>
             <View style={styles.progressTrack}>
                <MotiView 
                   animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                   transition={{ type: 'timing', duration: 1500 }}
                   style={styles.progressBar}
                />
             </View>
          </View>
        </View>
      </View>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  sacredOrb: {
    marginBottom: 80,
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: 110,
    padding: 20,
  },
  orbCore: {
    width: 140,
    height: 140,
    borderRadius: 70,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    opacity: 0.7,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  stepBox: {
    height: 60,
    justifyContent: 'center',
  },
  stepText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 1,
  },
  trackWrapper: {
    marginTop: 40,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  progressTrack: {
    width: width * 0.7,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
});
