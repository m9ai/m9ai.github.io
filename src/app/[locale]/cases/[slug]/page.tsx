import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CaseDetailClient from './CaseDetailClient';
import { caseSlugs, cases } from '@/data/cases';

// 生成静态参数
export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  
  for (const locale of ['en', 'zh']) {
    for (const slug of caseSlugs) {
      params.push({ locale, slug });
    }
  }
  
  return params;
}

// 动态生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'cases' });
  
  if (!cases[slug]) {
    return {
      title: 'Metasequoia AI Studio',
    };
  }
  
  return {
    title: `${t(`studies.${slug}.title`)} | Metasequoia AI Studio`,
    description: t(`studies.${slug}.description`),
  };
}

export default async function CaseDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  if (!cases[slug]) {
    notFound();
  }
  
  return <CaseDetailClient slug={slug} />;
}
