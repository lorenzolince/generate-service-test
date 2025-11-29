import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import index_en from './locales/en/index.json';
import index_es from './locales/es/index.json';

import common_en from './locales/en/common.json';
import common_es from './locales/es/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      index:index_en,
      common: common_en
      
    },
    es: {
      index:index_es,
      common: common_es
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;