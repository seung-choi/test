'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../public/locales/en/common.json';
import ko from '../../public/locales/ko/common.json';
import ja from '../../public/locales/ja/common.json';
import th from '../../public/locales/th/common.json';

const detectLanguage = () => {
  if (typeof window !== 'undefined') {
    const lang = window.navigator.language;
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('th')) return 'th';
    return 'en';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // 서버에서 항상 en으로 초기화
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
      th: { translation: th },
    },
    interpolation: {
      escapeValue: false,
    },
  });

// 클라이언트에서만 언어 변경
if (typeof window !== 'undefined') {
  const userLang = detectLanguage();
  (async () => {
    try {
      await i18n.changeLanguage(userLang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  })();
}

export default i18n;