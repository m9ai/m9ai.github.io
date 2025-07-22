import { getTranslations } from 'next-intl/server';
import PrivacyPolicy from './Privacy';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'meta' });
  return {
    title: t('privacyPolicyTitle'),
    description: t('privacyPolicyDescription'),
  };
}

// 添加静态参数生成函数，指定支持的语言
 export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default function PrivacyPolicyPage() {
  
  return <PrivacyPolicy />
}