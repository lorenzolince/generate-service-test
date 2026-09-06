import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import index_en from './locales/en/index.json';
import index_es from './locales/es/index.json';
import oracle_en from './locales/en/oracle.json';
import oracle_es from './locales/es/oracle.json';
import mysql_en from './locales/en/mysql.json';
import mysql_es from './locales/es/mysql.json';
import postgres_en from './locales/en/postgres.json';
import postgres_es from './locales/es/postgres.json';
import sqlserver_en from './locales/en/sqlserver.json';
import sqlserver_es from './locales/es/sqlserver.json';

import common_en from './locales/en/common.json';
import common_es from './locales/es/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      index:index_en,
      common: common_en,
      oracle: oracle_en,
      mysql: mysql_en,
      postgres: postgres_en,
      sqlserver: sqlserver_en
      
    },
    es: {
      index:index_es,
      common: common_es,
      oracle: oracle_es,
      mysql: mysql_es,
      postgres: postgres_es,
      sqlserver: sqlserver_es
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;