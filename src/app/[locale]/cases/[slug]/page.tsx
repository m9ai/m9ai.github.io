import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CaseDetailClient from './CaseDetailClient';
import { caseSlugs, cases } from '@/data/cases';
import { buildPageMetadata, siteName } from '@/lib/seo';
import { breadcrumbSchema, caseStudySchema, webPageSchema } from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';

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
    // 案例不存在时不要输出一个会被索引的死链
    return buildPageMetadata({
      locale,
      path: '/',
      title: t('sectionTitle'),
      description: t('sectionDescription'),
      noindex: true,
    });
  }

  return buildPageMetadata({
    locale,
    path: `/cases/${slug}`,
    title: t(`studies.${slug}.title`),
    description: t(`studies.${slug}.description`),
    keywords: t.raw(`studies.${slug}.technologies`) as string[],
  });
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

  const t = await getTranslations({ locale, namespace: 'cases' });
  const title = t(`studies.${slug}.title`);
  const description = t(`studies.${slug}.description`);
  const study = t.raw(`studies.${slug}`) as {
    category: string;
    outcomes?: string[];
    technologies?: string[];
  };

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageSchema(locale, `/cases/${slug}`, title, description),
            caseStudySchema(locale, {
              slug,
              title,
              description,
              industry: study.category,
              outcomes: study.outcomes,
            }),
            /* 案例没有独立的列表页路由（只在首页成段展示），
               面包屑的上级只能指向首页，否则会产出一个 404 的层级。 */
            breadcrumbSchema(locale, [
              { name: siteName(locale), path: '/' },
              { name: title },
            ]),
          ],
        }}
      />
      <CaseDetailClient slug={slug} />
    </>
  );
}
