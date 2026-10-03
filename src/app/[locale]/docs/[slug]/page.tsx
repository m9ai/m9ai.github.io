import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllDocSlugs, getDocBySlug, getAllDocs, hasEnglishContent } from '@/lib/docs';
import DocContent from './DocContent';

interface DocPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// 生成静态参数
export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  
  return slugs.flatMap(slug => [
    { locale: 'zh', slug },
    { locale: 'en', slug }
  ]);
}

// 生成元数据
export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Docs' });

  try {
    const { slug } = await params;
    const doc = await getDocBySlug(slug, locale);

    return {
      title: `${doc.title} | ${t('detail.titleSuffix')}`,
      description: doc.description,
      alternates: {
        canonical: `/${locale}/docs/${slug}`,
      },
    };
  } catch {
    return {
      title: t('detail.notFoundTitle'),
      description: t('detail.notFoundDescription'),
    };
  }
}

// 文档详情页面
export default async function DocPage({ params }: DocPageProps) {
  try {
    const { slug, locale } = await params;
    setRequestLocale(locale);
    const doc = await getDocBySlug(slug, locale);
    const allDocs = await getAllDocs(locale);

    return (
      <DocContent
        doc={doc}
        allDocs={allDocs.map(d => ({
          slug: d.slug,
          title: d.title,
          category: d.category,
          categoryKey: d.categoryKey,
        }))}
        hasEnglishVersion={hasEnglishContent(slug)}
      />
    );
  } catch {
    notFound();
  }
}
