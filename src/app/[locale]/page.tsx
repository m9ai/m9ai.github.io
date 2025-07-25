import { routing } from '@/i18n/routing';
import HomeClient from './HomeClient';
import { setRequestLocale } from 'next-intl/server';

// 静态生成参数
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

// 页面组件（服务器组件）
export default async function HomePage({
  params
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 设置请求locale
  setRequestLocale(locale);
  
  return <HomeClient />;
}
