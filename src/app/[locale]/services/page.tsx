import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Home from './Home';
import { routing } from '@/i18n/routing';

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'services' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

// 添加静态参数生成函数，指定支持的语言
 export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default function ServicesPage(){

  return <Home />
}