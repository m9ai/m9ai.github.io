import { redirect } from 'next/navigation';

export default function RootPage({params}) {
  // 重定向到默认语言版本
  const {locale} = params;
  return redirect(locale ? `/${locale}` : '/zh');
}

// 静态生成根路径页面
export async function generateStaticParams() {
  return [];
}