import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSkillById, skills } from '@/data/skills';
import { buildPageMetadata, pageTitle } from '@/lib/seo';
import {
  breadcrumbSchema,
  softwareApplicationSchema,
  webPageSchema,
} from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';
import SkillDetailClient from './SkillDetailClient';

interface SkillPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  return skills.flatMap((skill) => [
    { locale: 'zh', id: skill.id },
    { locale: 'en', id: skill.id },
  ]);
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  try {
    const { id, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Store' });
    const skill = getSkillById(id);

    if (!skill) {
      return buildPageMetadata({
        locale,
        path: '/store',
        title: t('detail.notFoundTitle'),
        description: t('detail.notFoundDescription'),
      });
    }

    const copy = locale === 'en' ? skill.en : skill.zh;

    return buildPageMetadata({
      locale,
      path: `/apps/${id}`,
      title: copy.name,
      description: copy.tagline,
      keywords: copy.capabilities,
    });
  } catch {
    // 拿不到 locale 时无法解析任何文案，交给 NotFound 页面处理
    return {
      title: 'Skill',
      description: 'Skill not available',
    };
  }
}

export default async function SkillPage({ params }: SkillPageProps) {
  try {
    const { id, locale } = await params;
    setRequestLocale(locale);

    const skill = getSkillById(id);
    if (!skill) {
      notFound();
    }

    const t = await getTranslations({ locale, namespace: 'Store' });
    const copy = locale === 'en' ? skill.en : skill.zh;
    const listTitle = pageTitle(locale, t('meta.title'));

    return (
      <>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              webPageSchema(locale, `/apps/${id}`, copy.name, copy.tagline),
              softwareApplicationSchema(locale, {
                id: skill.id,
                name: copy.name,
                description: copy.description,
                tagline: copy.tagline,
                capabilities: copy.capabilities,
                version: skill.version,
                repo: skill.repo,
                categoryLabel: t(`categories.${skill.category}`),
              }),
              breadcrumbSchema(locale, [
                { name: listTitle, path: '/store' },
                { name: copy.name },
              ]),
            ],
          }}
        />
        <SkillDetailClient skill={skill} />
      </>
    );
  } catch {
    notFound();
  }
}
