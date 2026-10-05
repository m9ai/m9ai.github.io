import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSkillById, skills } from '@/data/skills';
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
      return {
        title: t('detail.notFoundTitle'),
        description: t('detail.notFoundDescription'),
      };
    }

    const copy = locale === 'en' ? skill.en : skill.zh;

    return {
      title: `${copy.name} | ${t('detail.titleSuffix')}`,
      description: copy.tagline,
      alternates: {
        canonical: `/${locale}/apps/${id}`,
      },
    };
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

    return <SkillDetailClient skill={skill} />;
  } catch {
    notFound();
  }
}
