import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAllDocSlugs, getDocBySlug, processMarkdown, getAllDocs } from '@/lib/docs';
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
  try {
    const { slug, locale } = await params;
    const doc = getDocBySlug(slug);
    
    return {
      title: `${doc.title} | 文档中心`,
      description: doc.description,
      alternates: {
        canonical: `/${locale}/docs/${slug}`,
      },
    };
  } catch {
    return {
      title: '文档未找到',
      description: '请求的文档不存在',
    };
  }
}

// 文档详情页面
export default async function DocPage({ params }: DocPageProps) {
  try {
    const { slug, locale } = await params;
    setRequestLocale(locale);
    const doc = getDocBySlug(slug);
    const htmlContent = await processMarkdown(doc.content);
    const allDocs = getAllDocs();
    
    return (
      <DocContent 
        doc={{
          ...doc,
          htmlContent,
        }}
        allDocs={allDocs.map(d => ({ slug: d.slug, title: d.title, category: d.category }))}
      />
    );
  } catch {
    notFound();
  }
}
