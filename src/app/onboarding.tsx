import React, { useState } from 'react';
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
  LucideZap, 
  LucideMoon, 
  LucideSun, 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STEPS = {
  VALUE: 0,
  PERMISSIONS: 1,
  INPUT: 2,
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { setUserData, triggerHaptic } = useAuraContext();
  const [step, setStep] = useState(STEPS.VALUE);
  const [permission, requestPermission] = useCameraPermissions();

  const [age, setAge] = useState('');
  const [focus, setFocus] = useState('');
  const [goal, setGoal] = useState('');

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
      setUserData({ age, focus, mood: 'Neutral', goal }); // Mood simplified
      router.push('/scan');
    }
  };

  const handleBack = () => {
    if (step === STEPS.VALUE) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

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
            <View>
              <Text style={styles.bulletTitle}>{item.title}</Text>
              <Text style={styles.bulletDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleNext} style={styles.nextBtnWrapper}>
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
  );

  const renderPermissionStep = () => (
    <MotiView 
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.stepContainer}
    >
      <LucideMoon size={100} color={COLORS.secondary} style={{ marginBottom: 20 }} />
      <Text style={styles.title}>{t('permission_title')}</Text>
      <Text style={[styles.bulletDesc, { textAlign: 'center', marginBottom: 40 }]}>
        {t('permission_desc')}
      </Text>

      <TouchableOpacity onPress={handleNext} style={styles.nextBtnWrapper}>
        <LinearGradient
                colors={['#BF953F', '#FCF6BA', '#AA771C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextBtn}
              >
          <Text style={styles.nextBtnText}>{t('grant_camera')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );

  const renderInputStep = () => (
    <ScrollView 
       contentContainerStyle={styles.scrollContainer} 
       showsVerticalScrollIndicator={false}
       keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.stepContainer}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.stepContainer}
        >
          <View style={styles.inputGroup}>
             <Text style={styles.inputTitle}>{t('input_age')}</Text>
             <TextInput
               style={styles.input}
               placeholder="e.g. 28"
               placeholderTextColor="rgba(255,255,255,0.3)"
               keyboardType="numeric"
               value={age}
               onChangeText={setAge}
             />
          </View>

          <View style={styles.inputGroup}>
             <Text style={styles.inputTitle}>{t('input_focus')}</Text>
             <View style={styles.focusContainer}>
               {[
                 { key: 'money', label: t('focus_money'), color: COLORS.secondary },
                 { key: 'relationships', label: t('focus_love'), color: '#FF69B4' },
                 { key: 'career', label: t('focus_career'), color: '#8A2BE2' },
                 { key: 'health', label: t('focus_health'), color: '#00FA9A' }
               ].map((item) => (
                 <TouchableOpacity 
                   key={item.key}
                   onPress={() => { triggerHaptic('light'); setFocus(item.key); }}
                   style={[
                     styles.focusTab, 
                     focus === item.key && { borderColor: item.color, backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                   ]}
                 >
                   <Text style={[styles.focusTabText, focus === item.key && { color: item.color, fontWeight: 'bold' }]}>
                     {item.label}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>
          </View>

          <View style={styles.inputGroup}>
             <Text style={styles.inputTitle}>{t('input_goal')}</Text>
             <Text style={styles.inputHint}>{t('input_goal_hint')}</Text>
             <TextInput
               style={[styles.input, styles.textArea]}
               placeholder={i18n.language === 'sl' ? 'Tvoja želja...' : 'Your wish...'}
               placeholderTextColor="rgba(255,255,255,0.2)"
               multiline
               value={goal}
               onChangeText={setGoal}
             />
          </View>

          <TouchableOpacity 
            style={[styles.nextBtnWrapper, { marginTop: 40, opacity: (age && focus && goal) ? 1 : 0.4 }]} 
            onPress={handleNext}
            disabled={!(age && focus && goal)}
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
      </KeyboardAvoidingView>
    </ScrollView>
  );

  return (
    <AuraBackground>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backBtn: {
    padding: 10,
  },
  scrollContainer: {
    paddingVertical: 100,
    paddingHorizontal: 24,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    color: '#FFF',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 2,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 32,
  },
  inputTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '400',
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  bulletContainer: {
    width: '100%',
    gap: 30,
    marginBottom: 60,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bulletIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  bulletTitle: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bulletDesc: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: width * 0.6,
  },
  nextBtnWrapper: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  nextBtn: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  nextBtnText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 22,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  focusContainer: {
    flexDirection: 'column',
    gap: 10,
    width: '100%',
  },
  focusTab: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  focusTabText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
