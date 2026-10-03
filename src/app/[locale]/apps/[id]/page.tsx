import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { apps } from '@/data/apps';
import AppDetailClient from './AppDetailClient';

interface AppPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

// 生成静态参数
export async function generateStaticParams() {
  return apps.flatMap(app => [
    { locale: 'zh', id: app.id },
    { locale: 'en', id: app.id },
  ]);
}

// 生成元数据
export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  try {
    const { id, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Store' });
    const app = apps.find(a => a.id === id);

    if (!app) {
      return {
        title: t('detail.notFoundTitle'),
        description: t('detail.notFoundDescription'),
      };
    }

    return {
      title: `${t(`apps.${app.id}.name`)} | ${t('detail.titleSuffix')}`,
      description: t(`apps.${app.id}.description`),
      alternates: {
        canonical: `/${locale}/apps/${id}`,
      },
    };
  } catch {
    // 拿不到 locale 时无法解析任何文案，交给 NotFound 页面处理，
    // 这里只给一段不带任何语言倾向的兜底文案
    return {
      title: 'App',
      description: 'App not available',
    };
  }
}

// 应用详情页面
export default async function AppPage({ params }: AppPageProps) {
  try {
    const { id, locale } = await params;
    setRequestLocale(locale);

    const app = apps.find(a => a.id === id);
    if (!app) {
      notFound();
    }

    return <AppDetailClient app={app} />;
  } catch {
    notFound();
  }
}
