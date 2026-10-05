import { getTranslations, setRequestLocale } from 'next-intl/server';
import TermsOfService from './Term';
import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildPageMetadata({
    locale,
    path: '/terms-of-service',
    title: t('termsOfServiceTitle'),
    description: t('termsOfServiceDescription'),
  });
}

// 添加静态参数生成函数，指定支持的语言
export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' }
  ];
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsOfService />;
}
