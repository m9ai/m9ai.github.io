'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { detectLocale, Locale } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import NotFound from '@/app/components/NotFound';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    const locales = routing.locales;
    
    // 检查路径是否已包含有效的locale前缀
    const hasValidLocale = locales.some(locale => 
      path.startsWith(`/${locale}/`) || path === `/${locale}`
    );
    
    // 如果已包含有效locale，不执行重定向
    if (hasValidLocale) return;
    
    // 检测用户语言偏好
    const userLocale = detectLocale();
    const defaultLocale = routing.defaultLocale as Locale;
    const targetLocale = locales.includes(userLocale as Locale) ? userLocale : defaultLocale;
    
    // 处理根路径特殊情况
    const targetPath = path === '/' ? `/${targetLocale}/` : `/${targetLocale}${path}`;
    
    // 执行重定向
    router.push(targetPath);
  }, [router]);

  return <NotFound />;
}