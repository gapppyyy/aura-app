import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
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
  'Berem tvojo svetlobno frekvenco...',
  'Zaznavam prvo plast avre...',
  'Odpiram energetske poti...',
  'Sinhroniziram karmično resonanco...',
  'Materializiram duhovni pečat...',
];

const SCAN_STEPS_EN = [
  'Establishing soul connection...',
  'Reading your light frequency...',
  'Sensing the primary aura layer...',
  'Opening energetic pathways...',
  'Synchronising karmic resonance...',
  'Materialising spiritual imprint...',
];

// Magical floating energy particles
const ENERGY_PARTICLES = Array.from({ length: 15 }).map((_, i) => ({
  top: Math.random() * 1.2 - 0.1,  // spread wider
  left: Math.random() * 1.2 - 0.1,
  delay: Math.random() * 2000,
  duration: 3000 + Math.random() * 3000,
  scale: 0.5 + Math.random() * 1.5,
}));

export default function ScanScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { triggerHaptic, setCapturedImageBase64 } = useAuraContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanColor, setScanColor] = useState(COLORS.secondary);
  const [photoTaken, setPhotoTaken] = useState(false);
  const cameraRef = useRef<any>(null);

  const steps = i18n.language === 'sl' ? SCAN_STEPS_SL : SCAN_STEPS_EN;
  const totalDuration = 9000;
  const stepDuration = totalDuration / steps.length;

  // Electric, cosmic plasma colors matching Kirlian photography references
  const auraColors = ['#1E90FF', '#8A2BE2', '#9400D3', '#00FCFF', '#1E90FF'];

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

    // Progress bar + capture photo at 75%
    const progressInterval = setInterval(async () => {
      setProgress(prev => {
        const next = Math.min(prev + (100 / (totalDuration / 100)), 100);
        // Capture face photo at ~75% progress
        if (next >= 75 && !photoTaken && cameraRef.current) {
          setPhotoTaken(true);
          cameraRef.current.takePictureAsync({ base64: true, quality: 0.6, skipProcessing: true })
            .then((photo: any) => {
              if (photo?.base64) setCapturedImageBase64(photo.base64);
            })
            .catch((e: any) => console.warn('Photo capture:', e));
        }
        return next;
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
      <CameraView ref={cameraRef} style={styles.camera} facing="front" />

      {/* Rich dark mystical overlay */}
      <View style={styles.darkOverlay} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <LucideX color="rgba(255,255,255,0.7)" size={24} />
      </TouchableOpacity>

      {/* ── MAGICAL AURA EFFECTS ── */}
      <View style={styles.faceFrameCenter} pointerEvents="none">

        {/* Darkening center to make face mysterious and focus on the plasma light */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2000 }}
          style={styles.mysticalFaceMask}
        />

        {/* --- ELECTRIC PLASMA AURAS --- */}
        {/* Layer 1: Wide electric blue outer wave */}
        <MotiView
          from={{ rotate: '0deg', scale: 0.95 }}
          animate={{ rotate: '360deg', scale: 1.1 }}
          transition={{ loop: true, type: 'timing', duration: 7000 }}
          style={[styles.plasmaBlob, { borderColor: '#1E90FF', borderTopLeftRadius: 180, borderBottomRightRadius: 210, opacity: 0.7 }]}
        />
        
        {/* Layer 2: Deep violet counter-rotating energy */}
        <MotiView
          from={{ rotate: '360deg', scale: 1.05 }}
          animate={{ rotate: '0deg', scale: 1 }}
          transition={{ loop: true, type: 'timing', duration: 5500 }}
          style={[styles.plasmaBlob, { borderColor: '#8A2BE2', borderTopRightRadius: 150, borderBottomLeftRadius: 190, opacity: 0.85 }]}
        />

        {/* Layer 3: Cyan fast inner ripple */}
        <MotiView
          from={{ rotate: '0deg', scale: 0.9 }}
          animate={{ rotate: '360deg', scale: 1.05 }}
          transition={{ loop: true, type: 'timing', duration: 3500 }}
          style={[styles.plasmaBlob, { borderColor: '#00FCFF', borderTopLeftRadius: 120, borderBottomLeftRadius: 170, opacity: 0.6 }]}
        />

        {/* Layer 4: Soft background cosmic blooming */}
        <MotiView
          from={{ scale: 0.8, opacity: 0.2 }}
          animate={{ scale: 1.5, opacity: 0.6 }}
          transition={{ loop: true, type: 'timing', duration: 3000, repeatReverse: true }}
          style={[styles.auraGlowLayer, { backgroundColor: scanColor }]}
        />

        {/* Inner intense glowing core */}
        <MotiView
          from={{ scale: 0.9, opacity: 0.2 }}
          animate={{ scale: 1.15, opacity: 0.5 }}
          transition={{ loop: true, type: 'timing', duration: 2500 }}
          style={[styles.auraGlowCore, { backgroundColor: scanColor }]}
        />

        {/* Floating ethereal energy particles */}
        {ENERGY_PARTICLES.map((p, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 40, scale: p.scale * 0.5 }}
            animate={{ opacity: [0, 0.8, 0], translateY: -100, scale: [p.scale * 0.5, p.scale, p.scale * 0.2] }}
            transition={{
              loop: true,
              type: 'timing',
              duration: p.duration,
              delay: p.delay,
            }}
            style={[
              styles.energyParticle,
              {
                top: `${p.top * 100}%`,
                left: `${p.left * 100}%`,
                backgroundColor: i % 3 === 0 ? '#FFF' : i % 2 === 0 ? scanColor : '#FFD700',
                shadowColor: scanColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 10,
              },
            ]}
          />
        ))}

        {/* High intensity focal ring simulating energy connection */}
        <MotiView
          from={{ scale: 0.95, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.9 }}
          transition={{ loop: true, type: 'timing', duration: 2000, repeatReverse: true }}
          style={[styles.etherealRing, { borderColor: scanColor, shadowColor: scanColor }]}
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

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{i18n.language === 'sl' ? 'Duhovna faza' : 'Spiritual Phase'}</Text>
            <Text style={[styles.progressPercent, { color: scanColor }]}>
              {stepIndex + 1} / {steps.length}
            </Text>
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
    backgroundColor: 'rgba(5, 0, 15, 0.85)', // Very dark to make neon true-plasma pop
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
  mysticalFaceMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: FACE_W,
  },
  plasmaBlob: {
    position: 'absolute',
    width: FACE_W * 1.3,
    height: FACE_H * 1.2,
    borderWidth: 10,
    borderRadius: 150,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 35,
    elevation: 20, // High elevation for intense android glow
  },
  auraGlowLayer: {
    position: 'absolute',
    width: FACE_W * 1.4,
    height: FACE_H * 1.4,
    borderRadius: (FACE_W * 1.4) / 2,
    opacity: 0.3,
  },
  auraGlowCore: {
    position: 'absolute',
    width: FACE_W * 1.1,
    height: FACE_H * 1.1,
    borderRadius: (FACE_W * 1.1) / 2,
    opacity: 0.6,
  },
  etherealRing: {
    position: 'absolute',
    width: FACE_W + 10,
    height: FACE_H + 30,
    borderRadius: (FACE_W + 10) / 2,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  energyParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
