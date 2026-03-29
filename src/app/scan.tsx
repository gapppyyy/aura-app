import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuraContext } from '@/context/AuraContext';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { COLORS } from '@/constants/theme';
import { LucideX, LucideSparkles } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const SCAN_STEPS_SL = [
  'Vzpostavljam vez z dušo...',
  'Analiziram energijske vzorce obraza...',
  'Preračunavam karmično resonanco...',
  'Kartiranje duhovnih časovnic...',
  'Stabilizacija astralnih scenarijev...',
  'Sinteza duhovnega profila...',
];

const SCAN_STEPS_EN = [
  'Establishing soul connection...',
  'Analysing facial energy patterns...',
  'Calculating karmic resonance...',
  'Mapping spiritual timelines...',
  'Stabilising astral scenarios...',
  'Synthesising spiritual profile...',
];

export default function ScanScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { triggerHaptic } = useAuraContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = i18n.language === 'sl' ? SCAN_STEPS_SL : SCAN_STEPS_EN;
  const totalDuration = 9000; // 9 seconds total
  const stepDuration = totalDuration / steps.length;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalDuration / 100));
      });
    }, 100);

    // Step messages
    const stepTimer = setInterval(() => {
      setStepIndex(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        triggerHaptic('light');
        return prev + 1;
      });
    }, stepDuration);

    // Navigate after total duration
    const navTimer = setTimeout(() => {
      triggerHaptic('success');
      router.replace('/processing');
    }, totalDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepTimer);
      clearTimeout(navTimer);
    };
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#FFF' }}>Vzpostavljam povezavo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front" />

      {/* Dark mystical overlay */}
      <View style={styles.darkOverlay} />

      {/* Pulsing Aura Rings */}
      {[1, 2, 3].map((ring) => (
        <MotiView
          key={ring}
          from={{ opacity: 0.6 - ring * 0.15, scale: 0.7 + ring * 0.1 }}
          animate={{ opacity: 0.0, scale: 1.4 + ring * 0.15 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 2000 + ring * 600,
            delay: ring * 400,
          }}
          style={[styles.auraRing, {
            borderColor: ring === 1 ? COLORS.secondary : ring === 2 ? '#9B59B6' : '#00F5FF',
          }]}
        />
      ))}

      {/* Inner glow */}
      <MotiView
        from={{ opacity: 0.3, scale: 0.95 }}
        animate={{ opacity: 0.7, scale: 1.05 }}
        transition={{ loop: true, type: 'timing', duration: 1800 }}
        style={styles.innerGlow}
      />

      {/* Face guide oval */}
      <MotiView
        from={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}
        animate={{ borderColor: 'rgba(212, 175, 55, 0.9)' }}
        transition={{ loop: true, type: 'timing', duration: 1200 }}
        style={styles.faceGuide}
      />

      {/* Scanning line */}
      <View style={styles.scanFrameWrapper}>
        <MotiView
          from={{ translateY: -220 }}
          animate={{ translateY: 220 }}
          transition={{ loop: true, type: 'timing', duration: 2200 }}
          style={styles.scanLine}
        />

        {/* Corner brackets */}
        {[
          { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 30 },
          { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 30 },
          { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 30 },
          { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 30 },
        ].map((cornerStyle, i) => (
          <View key={i} style={[styles.corner, cornerStyle]} />
        ))}
      </View>

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <LucideX color="#FFF" size={28} />
      </TouchableOpacity>

      {/* Bottom status box */}
      <View style={styles.footer}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 800 }}
          style={styles.statusBox}
        >
          <LucideSparkles color={COLORS.secondary} size={24} style={{ marginBottom: 12 }} />

          <MotiView
            key={stepIndex}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <Text style={styles.scanText}>{steps[stepIndex]}</Text>
          </MotiView>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <MotiView
              animate={{ width: `${progress}%` }}
              transition={{ type: 'timing', duration: 200 }}
              style={styles.progressFill}
            />
          </View>
          <Text style={styles.progressLabel}>{Math.round(progress)}%</Text>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 3, 25, 0.65)',
  },
  auraRing: {
    position: 'absolute',
    width: 340,
    height: 420,
    borderRadius: 210,
    borderWidth: 1.5,
    alignSelf: 'center',
    top: height * 0.12,
  },
  innerGlow: {
    position: 'absolute',
    width: 260,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(155, 89, 182, 0.18)',
    alignSelf: 'center',
    top: height * 0.165,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
  },
  faceGuide: {
    position: 'absolute',
    width: 240,
    height: 310,
    borderWidth: 2,
    borderRadius: 150,
    alignSelf: 'center',
    top: height * 0.178,
    borderStyle: 'dashed',
  },
  scanFrameWrapper: {
    position: 'absolute',
    width: 280,
    height: 360,
    alignSelf: 'center',
    top: height * 0.155,
    overflow: 'hidden',
    borderRadius: 50,
  },
  scanLine: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    opacity: 0.9,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.secondary,
    borderWidth: 3,
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  statusBox: {
    backgroundColor: 'rgba(15, 5, 35, 0.85)',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  scanText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  progressLabel: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
