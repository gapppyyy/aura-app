import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuraContext } from '@/context/AuraContext';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView, AnimatePresence } from 'moti';
import { COLORS } from '@/constants/theme';
import { LucideX } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useAudioPlayer } from 'expo-audio';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Precise magical flow steps
const MAGICAL_STEPS = [
  { time: 0, sl: 'Vzpostavljam povezavo...', en: 'Establishing connection...' },
  { time: 2000, sl: 'Zaznavam tvojo energijo...', en: 'Sensing your energy...' },
  { time: 5000, sl: 'Razkrivam tvojo frekvenco...', en: 'Revealing your frequency...' },
  { time: 8000, sl: 'Usklajujem tvoje energijsko polje...', en: 'Aligning your energy field...' },
  { time: 10500, sl: 'Zbiram energijski pečat...', en: 'Gathering energy imprint...' },
];

const TOTAL_DURATION = 12000;

// 35 soft, slow glowing particles
const PARTICLES = Array.from({ length: 35 }).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height * 1.2,
  size: Math.random() * 3 + 2,
  duration: 6000 + Math.random() * 6000, // Slow motion
  delay: Math.random() * 3000,
  drift: (Math.random() - 0.5) * 60, // left/right drift
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
  const player = useAudioPlayer(require('../../assets/sounds/scan_sound.m4a'));

  const steps = MAGICAL_STEPS;
  
  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  useEffect(() => {
    let isMounted = true;
    
    // Phase and text logic driven by precise timing
    const timers: NodeJS.Timeout[] = [];
    
    steps.forEach((step, index) => {
      if (step.time > 0) {
        const t = setTimeout(() => {
          setStepIndex(index);
          triggerHaptic('light');
        }, step.time);
        timers.push(t);
      }
    });

    // Capture photo at around 75% (9000ms)
    const photoTimer = setTimeout(() => {
      if (!photoTaken && cameraRef.current) {
        setPhotoTaken(true);
        cameraRef.current.takePictureAsync({ base64: true, quality: 0.6, shutterSound: false })
          .then((photo: any) => {
            if (photo?.base64) setCapturedImageBase64(photo.base64);
          })
          .catch((e: any) => console.warn('Photo capture:', e));
      }
    }, 9000);
    timers.push(photoTimer);

    // Final navigation
    const navTimer = setTimeout(() => {
      triggerHaptic('success');
      try { player.pause(); } catch(e) {} // Force stop right before routing
      router.replace('/processing');
    }, TOTAL_DURATION);
    timers.push(navTimer);

    return () => {
      isMounted = false;
      timers.forEach(clearTimeout);
      try {
        player.pause();
      } catch(e) {}
    };
  }, []);

  // Bulletproof fallback: constantly poll the C++ Audio engine until playback actually begins
  useEffect(() => {
    let playPoller: NodeJS.Timeout;

    // Retry sending play command 4 times a second until engine says "I am playing!"
    playPoller = setInterval(() => {
      try {
        if (!player.playing) {
          player.volume = 1;
          player.play();
        } else {
          clearInterval(playPoller); // Stop polling once it starts successfully
        }
      } catch (e) {
        console.warn('Audio retry failed:', e);
      }
    }, 250);

    return () => clearInterval(playPoller);
  }, []);
  
  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Vzpostavljam povezavo...</Text>
      </View>
    );
  }

  // Calculate dynamic aura opacity based on phase
  // Phase 0: 0.1 (fade in starts)
  // Phase 1: 0.4 (particles activate)
  // Phase 2: 0.7 (waves)
  // Phase 3: 0.95 (peak glow)
  // Phase 4: 1.0
  const auraOpacity = stepIndex === 0 ? 0.1 : stepIndex === 1 ? 0.4 : stepIndex === 2 ? 0.65 : stepIndex >= 3 ? 0.95 : 0;
  // Slowly scale aura up to envelop the screen
  const auraScale = 1 + (stepIndex * 0.1);

  return (
    <View style={styles.container}>
      {/* 1. BASE LAYER: Camera */}
      <CameraView ref={cameraRef} style={styles.camera} facing="front" />

      {/* Dimmed background to make magical lights pop */}
      <View style={styles.darkOverlay} />

      {/* Close button */}
      <TouchableOpacity 
        style={styles.closeBtn} 
        onPress={() => {
          try { player.pause(); } catch(e) {} // Force stop if user panics and exits
          router.back();
        }}
      >
        <LucideX color="rgba(255,255,255,0.7)" size={24} />
      </TouchableOpacity>

      {/* 2. AURA LAYER: Soft blur radial gradient (Green -> Yellow -> Purple) */}
      <MotiView
        animate={{ opacity: auraOpacity, scale: auraScale }}
        transition={{ type: 'timing', duration: 2500, easing: Easing.linear }} // removed invalid JS closure
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      >
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="auraGlow" cx="50%" cy="45%" rx="65%" ry="65%">
              <Stop offset="10%" stopColor="#00FA9A" stopOpacity="0.7" />
              <Stop offset="45%" stopColor="#FFD700" stopOpacity="0.45" />
              <Stop offset="75%" stopColor="#8A2BE2" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#0E0720" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#auraGlow)" />
        </Svg>
      </MotiView>

      {/* 3. PARTICLES LAYER */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {stepIndex >= 1 && PARTICLES.map((p, i) => (
          <MotiView
            key={`particle-${i}`}
            from={{ opacity: 0, translateY: p.y, translateX: p.x, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.9, 0], 
              translateY: p.y - 180, 
              translateX: p.x + p.drift, 
              scale: 1.2 
            }}
            transition={{
              loop: true,
              type: 'timing',
              duration: p.duration,
              delay: p.delay,
            }}
            style={[
              styles.energyParticle, 
              { 
                // Mix of magical white and subtle golden particles
                backgroundColor: i % 4 === 0 ? '#FFD700' : '#FFF',
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
              }
            ]}
          />
        ))}
      </View>

      {/* 4. BOTTOM MYSTICAL TEXT STATUS */}
      <View style={styles.footer}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.statusBox}
        >
          {/* Phase text gracefully fading between steps */}
          <AnimatePresence exitBeforeEnter>
            <MotiView
              key={`text-phase-${stepIndex}`}
              from={{ opacity: 0, translateY: 4 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -4 }}
              transition={{ type: 'timing', duration: 600 }}
            >
              <Text style={styles.scanText}>
                {i18n.language === 'sl' ? steps[stepIndex].sl : steps[stepIndex].en}
              </Text>
            </MotiView>
          </AnimatePresence>

          {/* Magical dots instead of progress bar */}
          <View style={styles.dotsRow}>
            {[0, 1, 2].map((d) => (
              <MotiView
                key={d}
                from={{ opacity: 0.1, scale: 0.8 }}
                animate={{ opacity: 0.8, scale: 1.2 }}
                transition={{
                  loop: true,
                  type: 'timing',
                  duration: 800,
                  delay: d * 250,
                }}
                style={styles.dot}
              />
            ))}
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
    backgroundColor: 'rgba(8, 4, 18, 0.45)', // Just slight darkening so aura pops out
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  energyParticle: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  statusBox: {
    backgroundColor: 'rgba(5, 2, 12, 0.5)',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.15)', // Very subtle violet border
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1.2,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C084FC',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});
