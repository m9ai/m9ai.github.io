import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CaseDetailClient from './CaseDetailClient';

// 定义所有案例 slug
const caseSlugs = [
  'enterprise-service',
  'healthcare',
  'fintech',
  'education',
  'architecture',
  'manufacturing',
  'law-firm',
  'accounting',
];

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
  
  const caseIndex = caseSlugs.indexOf(slug);
  if (caseIndex === -1) {
    return {
      title: 'Case Study | Metasequoia AI Studio',
    };
  }
  
  return {
    title: `${t(`studies.${caseIndex}.title`)} | Metasequoia AI Studio`,
    description: t(`studies.${caseIndex}.description`),
  };
}

export default async function CaseDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const caseIndex = caseSlugs.indexOf(slug);
  
  if (caseIndex === -1) {
    return <div>Case not found</div>;
  }
  
  return <CaseDetailClient caseIndex={caseIndex} />;
}
