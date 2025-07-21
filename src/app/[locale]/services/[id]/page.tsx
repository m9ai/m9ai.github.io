import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ServiceDetailClient from './components/ServiceDetailClient';
import { services } from '@/data/services';

// 动态生成元数据
export async function generateMetadata({
  params
}: { 
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({
    locale: locale,
    namespace: 'services'
  });
  const service = services.find(s => s.id === id);

  return {
    title: service ? t(`${service.id}.title`) : t('meta.defaultTitle'),
    description: service ? t(`${service.id}.description`) : t('meta.defaultDescription'),
  };
}

export default async function ServiceDetailPage({
  params
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const service = services.find(s => s.id === id);
  if (!service) return <div>服务不存在</div>;

  return <ServiceDetailClient service={service} />;
}

