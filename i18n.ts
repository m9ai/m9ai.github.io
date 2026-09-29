import { getRequestConfig, type RequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }): Promise<RequestConfig> => {
  // `requestLocale` 才是随请求变化的那个值（对应被匹配的 [locale] 段）。
  // 注意：不能用 `locale` —— 它仅在显式传参时（如 getTranslations({locale:'en'})）才有值，
  // 正常请求下恒为 undefined，会让所有页面都被钉死在默认的 'zh'。
  // 静态导出（GitHub Pages，无 Node 服务）时，requestLocale 由构建期各页面
  // 调用的 setRequestLocale 提供。
  const requested = await requestLocale;
  const resolvedLocale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`@/messages/${resolvedLocale}.json`)).default
  };
});