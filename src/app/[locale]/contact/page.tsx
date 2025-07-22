import { Metadata } from 'next';
import Contact from './Contact';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: '联系我们 | 水杉智境工作室',
  description: '联系水杉智境团队，了解更多关于我们的信息',
};

// 添加静态参数生成函数，指定支持的语言
 export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}


export default function Page() {
  return (
    <Contact />
  )
}