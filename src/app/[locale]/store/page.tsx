import { Metadata } from 'next';
import { getTranslations } from "next-intl/server";
import Store from "./Store"

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'Store' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function Page() {
  return <Store />
}