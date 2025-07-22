import Docs from "./Docs";
import { Metadata } from 'next';
import { getTranslations } from "next-intl/server";

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'Docs' });
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

export default function Page() {
  return <Docs />
}