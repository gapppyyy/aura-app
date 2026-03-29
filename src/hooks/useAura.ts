import { useTranslation } from 'react-i18next';

export const useAura = () => {
  const { t } = useTranslation();

  const generateReading = (userData: any, cameraData: { stress: number; energy: number }) => {
    const focus = userData.focus;
    const stress = cameraData.stress;
    
    // Rule Logic Matrix
    let auraKey = 'green';
    let resonance = 85;

    if (stress > 0.6) {
      auraKey = 'red';
      resonance = 100 - (stress * 50);
    } else if (focus === 'career') {
      auraKey = 'blue';
      resonance = 90 + (cameraData.energy * 10);
    } else if (focus === 'money') {
      auraKey = 'yellow';
      resonance = 88;
    }

    const title = t(`aura_${auraKey}_title`);
    const description = t(`aura_${auraKey}_desc`);

    // Scenarios built based on focus + stress
    const scenarios = {
      current: t('path_current_desc'),
      optimized: t('path_optimized_desc'),
      risk: t('path_risk_desc'),
    };

    return {
      color: auraKey,
      title,
      description,
      resonance: Math.round(resonance),
      scenarios
    };
  };

  return { generateReading };
};
