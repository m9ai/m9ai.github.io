import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllDocSlugs, getDocBySlug, getAllDocs, hasEnglishContent } from '@/lib/docs';
import { buildPageMetadata, pageTitle } from '@/lib/seo';
import {
  breadcrumbSchema,
  faqSchema,
  parseFaqFromMarkdown,
  techArticleSchema,
  webPageSchema,
} from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';
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

    /* 站名由 layout 的 title.template 补齐，这里只给文档本身的名字，
       否则会出现「xxx | 文档中心 | 水杉智境工作室」的重复后缀。 */
    return buildPageMetadata({
      locale,
      path: `/docs/${slug}`,
      title: doc.title,
      description: doc.description,
      type: 'article',
      publishedTime: doc.updatedAt,
      modifiedTime: doc.updatedAt,
      keywords: doc.tags,
    });
  } catch {
    return buildPageMetadata({
      locale,
      path: '/docs',
      title: t('detail.notFoundTitle'),
      description: t('detail.notFoundDescription'),
    });
  }
}

// 文档详情页面
export default async function DocPage({ params }: DocPageProps) {
  try {
    const { slug, locale } = await params;
    setRequestLocale(locale);
    const doc = await getDocBySlug(slug, locale);
    const allDocs = await getAllDocs(locale);
    const t = await getTranslations({ locale, namespace: 'Docs' });
    const listTitle = pageTitle(locale, t('meta.title'));

    /* FAQ 文档里一直是 `### Q: …` / `A: …` 的写法，直接抽出来生成 FAQPage。
       这是生成式引擎最容易引用的结构化类型之一，值得单独供一份。 */
    const faqEntries = slug === 'faq' ? parseFaqFromMarkdown(doc.content) : [];

    return (
      <>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              webPageSchema(locale, `/docs/${slug}`, doc.title, doc.description),
              techArticleSchema(locale, doc),
              breadcrumbSchema(locale, [
                { name: listTitle, path: '/docs' },
                { name: doc.title },
              ]),
              ...(faqEntries.length ? [faqSchema(faqEntries)] : []),
            ],
          }}
        />
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
      </>
    );
  } catch {
    notFound();
  }
}
