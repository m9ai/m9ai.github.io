import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Home from './Home';

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'services' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function ServicesPage(){

  return <Home />
}