import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];

export function detectLocale() {
  if (typeof window === 'undefined') return 'zh';
  
  const userLang = window.navigator.language.split('-')[0];
  return routing.locales.includes(userLang as Locale) ? userLang : 'zh';
}