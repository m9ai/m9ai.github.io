import { detectLocale } from '@/i18n/routing';
import { redirect } from 'next/navigation';

export default function RootPage() {
  // 重定向到默认语言版本
  const locale = detectLocale();
  return redirect(locale ? `/${locale}` : '/zh');
}