import i18n from 'i18next';
import translation_en from './en/translation.json';
import translation_zh from './zh/translation.json';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const resources = {
  en: {
    translation: translation_en,
  },
  zh: {
    translation: translation_zh,
  }
} as const;
i18n.use(LanguageDetector) //嗅探当前浏览器语言 zh-CN
  .use(initReactI18next).init({
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
  detection: {
    caches: ['localStorage', 'sessionStorage', 'cookie'],
  },
});

export default i18n;
