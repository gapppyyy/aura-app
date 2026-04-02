import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView, AnimatePresence } from 'moti';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import { LucideSparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuraContext } from '@/context/AuraContext';
import { generateAuraReading } from '@/services/aiService';

const { width } = Dimensions.get('window');

export default function ProcessingScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { userData, setResult, triggerHaptic, capturedImageBase64, setCapturedImageBase64, history, scanCount } = useAuraContext();
  const [stepIndex, setStepIndex] = useState(0);
  const [isAiDone, setIsAiDone] = useState(false);
  const isAiDoneRef = React.useRef(false);
  const [areStepsDone, setAreStepsDone] = useState(false);
  
  // Ad State
  const [showAd, setShowAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(5);
  const [canSkipAd, setCanSkipAd] = useState(false);

  const baseSteps = t('scan_steps', { returnObjects: true }) as string[];
  const steps = [...baseSteps, i18n.language.startsWith('sl') ? 'Branje avre se zaključuje...' : 'Finalizing cosmic layout...'];

  const fetchAIResult = async () => {
    if (userData) {
      const faceData = {
        stress: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)),
        energy: parseFloat((Math.random() * 0.4 + 0.5).toFixed(2)),
        balance: parseFloat((Math.random() * 0.5 + 0.4).toFixed(2)),
        openness: parseFloat((Math.random() * 0.6 + 0.3).toFixed(2)),
      };

      const aiResult = await generateAuraReading(
        userData,
        faceData,
        i18n.language,
        capturedImageBase64,
        history
      );

      setCapturedImageBase64(null);

      if (aiResult) {
        setResult({ ...aiResult, faceData });
      }
    }
    isAiDoneRef.current = true;
    setIsAiDone(true);
  };

  useEffect(() => {
    fetchAIResult();

    const timer = setInterval(() => {
      triggerHaptic('light');
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setAreStepsDone(true);
          return prev;
        }
        if (prev === baseSteps.length - 1) {
          setAreStepsDone(true);
          if (!isAiDoneRef.current) return prev + 1;
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAiDone && areStepsDone) {
      // Show ad every 2nd scan
      const shouldShowAd = (scanCount + 1) % 2 === 0;
      
      if (shouldShowAd) {
        setShowAd(true);
        const adTimer = setInterval(() => {
          setAdTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(adTimer);
              setCanSkipAd(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setTimeout(() => {
          triggerHaptic('success');
          router.replace('/results');
        }, 400);
      }
    }
  }, [isAiDone, areStepsDone]);

  if (showAd) {
    return (
      <AuraBackground>
        <View style={styles.container}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.adCard}
          >
            <View style={styles.adBadge}>
               <Text style={styles.adBadgeText}>ADVERTISEMENT / OGLAS</Text>
            </View>
            
            <LucideSparkles color={COLORS.secondary} size={40} style={{ marginVertical: 20 }} />
            
            <Text style={styles.adTitle}>
              {i18n.language === 'sl' ? 'Sinhronizacija z vesoljem...' : 'Synchronizing with cosmos...'}
            </Text>
            <Text style={styles.adDesc}>
              {i18n.language === 'sl' 
                ? 'Analiza je končana. Rezultati se bodo prikazali čez nekaj trenutkov.'
                : 'Analysis complete. Results will be revealed in a few moments.'}
            </Text>

            <View style={styles.timerCircle}>
               <Text style={styles.timerText}>{adTimeLeft > 0 ? adTimeLeft : '✓'}</Text>
            </View>

            {canSkipAd && (
               <MotiView
                 from={{ opacity: 0, translateY: 10 }}
                 animate={{ opacity: 1, translateY: 0 }}
               >
                 <TouchableOpacity 
                   style={styles.skipBtn}
                   onPress={() => {
                     triggerHaptic('success');
                     router.replace('/results');
                   }}
                 >
                   <Text style={styles.skipBtnText}>
                      {i18n.language === 'sl' ? 'PRIKAŽI REZULTATE' : 'REVEAL RESULTS'}
                   </Text>
                 </TouchableOpacity>
               </MotiView>
            )}
          </MotiView>
        </View>
      </AuraBackground>
    );
  }

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
  adCard: {
    backgroundColor: 'rgba(10, 10, 20, 0.98)',
    width: '95%',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  adBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    marginBottom: 10,
  },
  adBadgeText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  adTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  adDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  timerCircle: {
     width: 60,
     height: 60,
     borderRadius: 30,
     borderWidth: 2,
     borderColor: COLORS.secondary,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 30,
  },
  timerText: {
     color: COLORS.secondary,
     fontSize: 24,
     fontWeight: '800',
  },
  skipBtn: {
     backgroundColor: COLORS.secondary,
     paddingHorizontal: 24,
     paddingVertical: 14,
     borderRadius: 25,
  },
  skipBtnText: {
     color: '#000',
     fontSize: 13,
     fontWeight: '800',
     letterSpacing: 1,
  }
});
