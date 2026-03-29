import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView, AnimatePresence } from 'moti';
import { AuraBackground } from '@/components/AuraBackground';
import { COLORS } from '@/constants/theme';
import { useCameraPermissions } from 'expo-camera';
import { useAuraContext } from '@/context/AuraContext';
import {
  LucideChevronLeft,
  LucideCompass,
  LucideMoon,
  LucideSun,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STEPS = { VALUE: 0, PERMISSIONS: 1, INPUT: 2 };

export default function OnboardingScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { setUserData, triggerHaptic } = useAuraContext();
  const [step, setStep] = useState(STEPS.VALUE);
  const [permission, requestPermission] = useCameraPermissions();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<any>(null);
  const [focus, setFocus] = useState('');
  const [goal, setGoal] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = async () => {
    if (step === STEPS.VALUE) {
      setStep(STEPS.PERMISSIONS);
    } else if (step === STEPS.PERMISSIONS) {
      if (!permission?.granted) {
        const resp = await requestPermission();
        if (resp.granted) setStep(STEPS.INPUT);
      } else {
        setStep(STEPS.INPUT);
      }
    } else {
      setUserData({ age, focus, mood: 'Neutral', goal, gender });
      router.push('/scan');
    }
  };

  const handleBack = () => {
    if (step === STEPS.VALUE) router.back();
    else setStep(step - 1);
  };

  const focusOptions = [
    { key: 'money', label: t('focus_money'), color: COLORS.secondary },
    { key: 'relationships', label: t('focus_love'), color: '#FF69B4' },
    { key: 'career', label: t('focus_career'), color: '#8A2BE2' },
    { key: 'health', label: t('focus_health'), color: '#00FA9A' },
  ];

  const renderValueStep = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      style={styles.stepContainer}
    >
      <Text style={styles.title}>{t('onboarding_1_title')}</Text>

      <View style={styles.bulletContainer}>
        {[
          { icon: <LucideMoon color={COLORS.secondary} size={28} />, title: t('onboarding_1_title'), desc: t('onboarding_1_desc') },
          { icon: <LucideSun color="#FF8C00" size={28} />, title: t('onboarding_2_title'), desc: t('onboarding_2_desc') },
          { icon: <LucideCompass color="#FFF" size={28} />, title: t('onboarding_3_title'), desc: t('onboarding_3_desc') },
        ].map((item, index) => (
          <View key={index} style={styles.bulletItem}>
            <View style={styles.bulletIcon}>{item.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bulletTitle}>{item.title}</Text>
              <Text style={styles.bulletDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleNext} style={styles.nextBtnWrapper}>
        <LinearGradient colors={['#BF953F', '#FCF6BA', '#AA771C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>{t('start_scan')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );

  const renderPermissionStep = () => (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.stepContainer}>
      <LucideMoon size={80} color={COLORS.secondary} style={{ marginBottom: 24 }} />
      <Text style={styles.title}>{t('permission_title')}</Text>
      <Text style={[styles.bulletDesc, { textAlign: 'center', marginBottom: 40 }]}>{t('permission_desc')}</Text>

      <TouchableOpacity onPress={handleNext} style={styles.nextBtnWrapper}>
        <LinearGradient colors={['#BF953F', '#FCF6BA', '#AA771C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>{t('grant_camera')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );

  const renderInputStep = () => (
    <KeyboardAvoidingView
      style={{ flex: 1, width: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.inputForm}
        >
          {/* Age */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>{t('input_age')}</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. 28"
              placeholderTextColor="rgba(255,255,255,0.25)"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              returnKeyType="done"
            />
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>{t('input_gender')}</Text>
            <View style={styles.genderRow}>
              {[
                { key: 'male', label: t('gender_male') },
                { key: 'female', label: t('gender_female') },
                { key: 'other', label: t('gender_other') },
              ].map((g) => (
                <TouchableOpacity
                  key={g.key}
                  onPress={() => { triggerHaptic('light'); setGender(g.key); }}
                  style={[
                    styles.genderTab,
                    gender === g.key && styles.genderTabActive,
                  ]}
                >
                  <Text style={[
                    styles.genderTabText,
                    gender === g.key && styles.genderTabTextActive
                  ]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Focus */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>{t('input_focus')}</Text>
            <View style={styles.focusGrid}>
              {focusOptions.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => { triggerHaptic('light'); setFocus(item.key); }}
                  style={[
                    styles.focusTab,
                    focus === item.key && { borderColor: item.color, backgroundColor: `${item.color}18` },
                  ]}
                >
                  <Text style={[
                    styles.focusTabText,
                    focus === item.key && { color: item.color, fontWeight: '700' },
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Goal */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>{t('input_goal')}</Text>
            <Text style={styles.inputHint}>{t('input_goal_hint')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={i18n.language === 'sl' ? 'Opiši svojo manifestacijo...' : 'Describe your manifestation...'}
              placeholderTextColor="rgba(255,255,255,0.2)"
              multiline
              numberOfLines={4}
              value={goal}
              onChangeText={setGoal}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.nextBtnWrapper, { opacity: (age && focus && goal && gender) ? 1 : 0.4, marginBottom: 20 }]}
            onPress={handleNext}
            disabled={!(age && focus && goal && gender)}
          >
            <LinearGradient
              colors={['#BF953F', '#FCF6BA', '#AA771C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>{t('start_scan')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <AuraBackground>
      {/* Back button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <LucideChevronLeft color={COLORS.secondary} size={30} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <AnimatePresence>
          {step === STEPS.VALUE && renderValueStep()}
          {step === STEPS.PERMISSIONS && renderPermissionStep()}
          {step === STEPS.INPUT && renderInputStep()}
        </AnimatePresence>
      </View>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  topBar: {
    position: 'absolute',
    top: 58,
    left: 16,
    zIndex: 10,
  },
  backBtn: {
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  inputForm: {
    width: '100%',
    gap: 0,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    color: '#FFF',
    marginBottom: 36,
    textAlign: 'center',
    letterSpacing: 2,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 28,
  },
  inputTitle: {
    fontSize: 19,
    color: '#FFF',
    fontWeight: '400',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  bulletContainer: {
    width: '100%',
    gap: 28,
    marginBottom: 56,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 18,
  },
  bulletIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    flexShrink: 0,
  },
  bulletTitle: {
    color: COLORS.secondary,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bulletDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  nextBtnWrapper: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
  },
  nextBtn: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  nextBtnText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 18,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  focusGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  focusTab: {
    width: '47%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  focusTabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  genderTab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  genderTabActive: {
    borderColor: COLORS.secondary,
    backgroundColor: 'rgba(212,175,55,0.15)',
  },
  genderTabText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '500',
  },
  genderTabTextActive: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
});
