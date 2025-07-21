import { getRequestConfig, type RequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: { locale?: string } = {}): Promise<RequestConfig> => {
  const resolvedLocale = locale ?? 'zh';
  return {
    locale: resolvedLocale,
    messages: (await import(`@/messages/${resolvedLocale}.json`)).default
  };
});