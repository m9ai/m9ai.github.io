import { routing } from "@/i18n/routing";
import NotFound from "@/app/components/NotFound";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

export const metadata = {
  title: '404 Not Found',
  description: '页面不存在',
};

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({locale}));
}


export default async function NotFoundPage({params}: {params: Promise<{locale: string}>}) {

  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  return <NotFound />
}