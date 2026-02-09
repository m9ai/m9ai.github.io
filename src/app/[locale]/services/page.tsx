import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Home from './Home';

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

// 添加静态参数生成函数，指定支持的语言
export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' }
  ];
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  // 设置请求 locale，确保客户端 useLocale() 能获取正确的值
  setRequestLocale(locale);

  return <Home />;
}