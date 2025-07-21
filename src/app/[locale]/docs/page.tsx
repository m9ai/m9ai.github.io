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

export default function Page() {
  return <Docs />
}