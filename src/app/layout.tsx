import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'Metasequoia AI Studio',
  description:
    'Agent workflows and agentic engineering — we deliver enterprise agent systems that run in production and stay measurable.',
};

// 这里刻意不渲染 <html>/<body>，让 app/[locale]/layout.tsx 成为唯一的 html 容器。
//
// 原因：本层位于 [locale] 段之上，拿不到当前 locale，写 <html lang={locale}>
// 只会输出没有 lang 属性（locale 恒为 undefined）的标签；若两层都渲染 html，
// 就会产生嵌套 <html>，浏览器只认第一个，导致 [locale] 里正确的 lang 被忽略。
// 让 [locale]/layout.tsx 单独负责 <html lang>，各语言页面的 lang 才能正确。
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
