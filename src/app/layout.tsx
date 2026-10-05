import React from 'react';
import '@/app/globals.css';

export const metadata = {
  /* 这一层只服务于「语言分流页」与 404 —— 两者都不该被索引，
     真正的可索引页面在 [locale]/layout.tsx 里重新声明 robots。 */
  metadataBase: new URL('https://m9ai.work'),
  title: '水杉智境工作室 / Metasequoia AI Studio',
  description:
    '从私有化推理底座到 Agent 工作流上线运行，交付可控、可度量、可运维的企业级智能体系统。 / Agent workflows and agentic engineering — enterprise agent systems that run in production and stay measurable.',
  robots: { index: false, follow: true },
  icons: { icon: '/favicon.jpg' },
};

// 这里刻意不渲染 <html>/<body>，让 app/[locale]/layout.tsx 成为唯一的 html 容器。
//
// 原因：本层位于 [locale] 段之上，拿不到当前 locale，写 <html lang={locale}>
// 只会输出没有 lang 属性（locale 恒为 undefined）的标签；若两层都渲染 html，
// 就会产生嵌套 <html>，浏览器只认第一个，导致 [locale] 里正确的 lang 被忽略。
// 让 [locale]/layout.tsx 单独负责 <html lang>，各语言页面的 lang 才能正确。
// 代价是 src/app/page.tsx 与 not-found.tsx 必须自己输出完整文档。
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
