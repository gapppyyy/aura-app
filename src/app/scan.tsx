import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuraContext } from '@/context/AuraContext';
import { LucideChevronLeft, LucideZap, LucideWaves, LucideMoon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView, MotiText } from 'moti';
import { COLORS } from '@/constants/theme';
import { LucideX, LucideSparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { triggerHaptic } = useAuraContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [countdown, setCountdown] = useState(3);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Move side effects to next tick
          setTimeout(() => {
            triggerHaptic('success');
            router.replace('/processing');
          }, 0);
          return 0;
        }
        triggerHaptic('medium');
        return prev - 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#FFF' }}>Awaiting Divine Connection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front">
        <View style={styles.overlay}>
          <MotiView
            from={{ opacity: 0.2, scale: 0.9 }}
            animate={{ opacity: 0.5, scale: 1.1 }}
            transition={{ loop: true, type: 'timing', duration: 2000 }}
            style={styles.auraGlow}
          />
          <View style={styles.scannerLine} />
          <View style={styles.faceGuide} />
        </View>
      </CameraView>
      
      {/* Mystical Overlay */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <LucideX color="#FFF" size={32} />
          </TouchableOpacity>
        </View>

        <View style={styles.scanFrame}>
          {/* Scanning Line - Gold */}
          <MotiView
            from={{ translateY: 0 }}
            animate={{ translateY: 380 }}
            transition={{
              type: 'timing',
              duration: 2500,
              loop: true,
            }}
            style={styles.scanLine}
          />
          
          {/* Celestial Corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.footer}>
          <MotiView 
             from={{ opacity: 0, translateY: 10 }}
             animate={{ opacity: 1, translateY: 0 }}
             transition={{ duration: 1000 }}
             style={styles.statusBox}
          >
             <LucideSparkles color={COLORS.secondary} size={30} style={{ marginBottom: 15 }} />
             <Text style={styles.scanText}>{t('scan_analyzing')}</Text>
             <Text style={styles.subText}>{t('scan_subtext')}</Text>
          </MotiView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 5, 29, 0.4)', // Violet tint
    justifyContent: 'space-between',
    paddingVertical: 70,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'flex-start',
  },
  scanFrame: {
    width: 320,
    height: 420,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    overflow: 'hidden',
    borderRadius: 60,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  auraGlow: {
    position: 'absolute',
    top: '30%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(155, 89, 182, 0.4)', // Mystical violet
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 100,
    alignSelf: 'center',
  },
  scannerLine: {
    position: 'absolute',
    top: '45%',
    width: '100%',
    height: 3,
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  faceGuide: {
    position: 'absolute',
    top: '30%',
    width: 260,
    height: 340,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 130,
    alignSelf: 'center',
    borderStyle: 'dashed',
  },
  scanLine: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    opacity: 0.9,
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: COLORS.secondary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 60,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 60,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 60,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 60,
  },
  footer: {
    alignItems: 'center',
  },
  statusBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
  },
  scanText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});
