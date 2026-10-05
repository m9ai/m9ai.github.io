import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildPageMetadata, pageTitle } from '@/lib/seo';
import { breadcrumbSchema, serviceSchema, webPageSchema } from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';
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

  return buildPageMetadata({
    locale,
    path: `/services/${id}`,
    // 兜底走列表页文案：services.meta 下并没有 defaultTitle/defaultDescription 这两个键
    title: service ? t(`${service.id}.title`) : pageTitle(locale, t('meta.title')),
    description: service ? t(`${service.id}.description`) : t('meta.description'),
  });
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
  const t = await getTranslations({ locale, namespace: 'services' });
  const service = services.find(s => s.id === id);
  if (!service) return <div>{t('errors.notFound')}</div>;

  const title = t(`${service.id}.title`);
  const description = t(`${service.id}.description`);
  const listTitle = pageTitle(locale, t('meta.title'));

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageSchema(locale, `/services/${id}`, title, description),
            serviceSchema(locale, `/services/${id}`, title, description),
            breadcrumbSchema(locale, [
              { name: listTitle, path: '/services' },
              { name: title },
            ]),
          ],
        }}
      />
      <ServiceDetailClient service={service} />
    </>
  );
}
