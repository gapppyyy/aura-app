import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuraContext } from '@/context/AuraContext';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { COLORS } from '@/constants/theme';
import { LucideX } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const FACE_W = 220;
const FACE_H = 290;

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

// Simulated energy burst points around the face
const ENERGY_PARTICLES = [
  { top: 0.08, left: 0.15, delay: 0 },
  { top: 0.05, left: 0.55, delay: 300 },
  { top: 0.25, left: 0.92, delay: 600 },
  { top: 0.55, left: 0.95, delay: 200 },
  { top: 0.82, left: 0.78, delay: 900 },
  { top: 0.88, left: 0.38, delay: 400 },
  { top: 0.72, left: 0.04, delay: 700 },
  { top: 0.38, left: 0.02, delay: 100 },
];

export default function ScanScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { triggerHaptic } = useAuraContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanColor, setScanColor] = useState(COLORS.secondary);

  const steps = i18n.language === 'sl' ? SCAN_STEPS_SL : SCAN_STEPS_EN;
  const totalDuration = 9000;
  const stepDuration = totalDuration / steps.length;

  // Cycle aura color during scan for magical feel
  const auraColors = [COLORS.secondary, '#9B59B6', '#00F5FF', '#B06EFF', COLORS.secondary];

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  useEffect(() => {
    // Cycle scan color
    let colorIdx = 0;
    const colorTimer = setInterval(() => {
      colorIdx = (colorIdx + 1) % auraColors.length;
      setScanColor(auraColors[colorIdx]);
    }, 1800);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / (totalDuration / 100)), 100));
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

    const navTimer = setTimeout(() => {
      triggerHaptic('success');
      router.replace('/processing');
    }, totalDuration);

    return () => {
      clearInterval(colorTimer);
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

      {/* Rich dark mystical overlay */}
      <View style={styles.darkOverlay} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <LucideX color="rgba(255,255,255,0.7)" size={24} />
      </TouchableOpacity>

      {/* ── FACE FRAME CENTER ── */}
      <View style={styles.faceFrameCenter}>

        {/* Outer spinning ring */}
        <MotiView
          from={{ rotate: '0deg' }}
          animate={{ rotate: '360deg' }}
          transition={{ loop: true, type: 'timing', duration: 6000, repeatReverse: false }}
          style={[styles.spinRingOuter, { borderColor: `${scanColor}40` }]}
        />

        {/* Middle pulsing ring */}
        <MotiView
          from={{ scale: 0.92, opacity: 0.4 }}
          animate={{ scale: 1.04, opacity: 0.9 }}
          transition={{ loop: true, type: 'timing', duration: 1600 }}
          style={[styles.pulseRingMid, { borderColor: scanColor }]}
        />

        {/* Inner counter-spin */}
        <MotiView
          from={{ rotate: '0deg' }}
          animate={{ rotate: '-360deg' }}
          transition={{ loop: true, type: 'timing', duration: 4000, repeatReverse: false }}
          style={[styles.spinRingInner, { borderColor: `${scanColor}88` }]}
        />

        {/* Face oval guide */}
        <MotiView
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1.0 }}
          transition={{ loop: true, type: 'timing', duration: 1200 }}
          style={[styles.faceOval, { borderColor: scanColor }]}
        />

        {/* Scanning laser line */}
        <View style={styles.scanLineClip}>
          <MotiView
            from={{ translateY: -FACE_H / 2 }}
            animate={{ translateY: FACE_H / 2 }}
            transition={{ loop: true, type: 'timing', duration: 1800 }}
            style={[styles.scanLine, { backgroundColor: scanColor, shadowColor: scanColor }]}
          />
        </View>

        {/* Corner brackets */}
        {[
          { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
          { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
          { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
          { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
        ].map((style, i) => (
          <View key={i} style={[styles.corner, { borderColor: scanColor }, style]} />
        ))}

        {/* Energy particles orbiting around face */}
        {ENERGY_PARTICLES.map((p, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
            transition={{
              loop: true,
              type: 'timing',
              duration: 1400 + i * 200,
              delay: p.delay,
            }}
            style={[
              styles.energyParticle,
              {
                top: `${p.top * 100}%`,
                left: `${p.left * 100}%`,
                backgroundColor: i % 3 === 0 ? scanColor : i % 3 === 1 ? '#9B59B6' : '#00F5FF',
              },
            ]}
          />
        ))}

        {/* Aura glow behind face */}
        <MotiView
          from={{ opacity: 0.2, scale: 0.9 }}
          animate={{ opacity: 0.5, scale: 1.06 }}
          transition={{ loop: true, type: 'timing', duration: 2000 }}
          style={[styles.auraGlow, { backgroundColor: scanColor }]}
        />
      </View>

      {/* ── BOTTOM STATUS ── */}
      <View style={styles.footer}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.statusBox}
        >
          {/* Step text */}
          <MotiView
            key={stepIndex}
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <Text style={styles.scanText}>{steps[stepIndex]}</Text>
          </MotiView>

          {/* Animated dots */}
          <View style={styles.dotsRow}>
            {[0, 1, 2].map((d) => (
              <MotiView
                key={d}
                from={{ opacity: 0.2, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  loop: true,
                  type: 'timing',
                  duration: 700,
                  delay: d * 200,
                }}
                style={[styles.dot, { backgroundColor: scanColor }]}
              />
            ))}
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <MotiView
              animate={{ width: `${progress}%` }}
              transition={{ type: 'timing', duration: 180 }}
              style={[styles.progressFill, { backgroundColor: scanColor, shadowColor: scanColor }]}
            />
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{i18n.language === 'sl' ? 'Analiza' : 'Analysis'}</Text>
            <Text style={[styles.progressPercent, { color: scanColor }]}>{Math.round(progress)}%</Text>
          </View>
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
    backgroundColor: 'rgba(8, 2, 22, 0.72)',
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Face frame
  faceFrameCenter: {
    position: 'absolute',
    top: height * 0.12,
    alignSelf: 'center',
    width: FACE_W + 80,
    height: FACE_H + 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinRingOuter: {
    position: 'absolute',
    width: FACE_W + 80,
    height: FACE_H + 80,
    borderRadius: (FACE_W + 80) / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  pulseRingMid: {
    position: 'absolute',
    width: FACE_W + 44,
    height: FACE_H + 44,
    borderRadius: (FACE_W + 44) / 2,
    borderWidth: 1.5,
  },
  spinRingInner: {
    position: 'absolute',
    width: FACE_W + 20,
    height: FACE_H + 20,
    borderRadius: (FACE_W + 20) / 2,
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  faceOval: {
    position: 'absolute',
    width: FACE_W,
    height: FACE_H,
    borderRadius: FACE_W / 2,
    borderWidth: 2,
  },
  scanLineClip: {
    position: 'absolute',
    width: FACE_W - 10,
    height: FACE_H,
    overflow: 'hidden',
    borderRadius: FACE_W / 2,
  },
  scanLine: {
    width: '100%',
    height: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    opacity: 0.9,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 2.5,
  },
  energyParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  auraGlow: {
    position: 'absolute',
    width: FACE_W - 30,
    height: FACE_H - 30,
    borderRadius: FACE_W / 2,
    opacity: 0.08,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 55,
    left: 20,
    right: 20,
  },
  statusBox: {
    backgroundColor: 'rgba(12, 4, 28, 0.9)',
    paddingVertical: 22,
    paddingHorizontal: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  scanText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '300',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
