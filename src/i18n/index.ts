import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import translations from './translations.json';

const resources = {
  en: { translation: translations.en },
  sl: { translation: translations.sl }
};

const locale = Localization.getLocales()[0].languageCode;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: locale === 'sl' ? 'sl' : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
