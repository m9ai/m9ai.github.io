import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
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

// 添加静态参数生成函数，指定支持的语言
export async function generateStaticParams() {
  return services.flatMap(service => [
    { locale: 'zh', id: service.id },
    { locale: 'en', id: service.id }
  ]);
}

export default async function ServiceDetailPage({
  params
}: { 
  params: Promise<{ locale: string; id: string }>
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const service = services.find(s => s.id === id);
  if (!service) return <div>服务不存在</div>;

  return <ServiceDetailClient service={service} />;
}

