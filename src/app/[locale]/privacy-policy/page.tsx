import { getTranslations, setRequestLocale } from 'next-intl/server';
import PrivacyPolicy from './Privacy';
import { Metadata } from 'next';

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('privacyPolicyTitle'),
    description: t('privacyPolicyDescription'),
  };
}

// 添加静态参数生成函数，指定支持的语言
export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' }
  ];
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyPolicy />;
}