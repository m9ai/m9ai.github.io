import { Metadata } from 'next';
import Contact from './Contact';

export const metadata: Metadata = {
  title: '联系我们 | 水杉智境工作室',
  description: '联系水杉智境团队，了解更多关于我们的信息',
};


export default function Page() {
  return (
    <Contact />
  )
}