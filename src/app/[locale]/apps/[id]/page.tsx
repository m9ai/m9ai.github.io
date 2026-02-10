import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
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
    const app = apps.find(a => a.id === id);

    if (!app) {
      return {
        title: '应用未找到',
        description: '请求的应用不存在',
      };
    }

    return {
      title: `${app.name} | 应用详情`,
      description: app.description,
      alternates: {
        canonical: `/${locale}/apps/${id}`,
      },
    };
  } catch {
    return {
      title: '应用未找到',
      description: '请求的应用不存在',
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
