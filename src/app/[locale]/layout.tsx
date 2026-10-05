import React from 'react';
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import MotionProvider from '@/app/components/MotionProvider';
import "@/app/globals.css";

// viewport / theme-color 改由 metadata API 输出，避免与 <head> 里手写的标签重复
/* 拉丁字形 self-host：woff2 直接入库（src/app/fonts/），构建期由 next/font
   处理并落到 /_next/static 下 —— 不经过外部 CDN、不产生额外 DNS 连接，
   并自动生成 fallback 度量减少 CLS。
   之所以不用 next/font/google：构建期要连 fonts.googleapis.com，本机与
   部分 CI 出网不稳（已实际踩过三次重试全挂导致构建失败）。
   中文字形不走这里：Noto Sans SC 全量子集有数 MB，会明显拖慢首屏，
   交由 globals.css 里的系统栈（苹方 / 微软雅黑 / Noto Sans CJK）渲染，
   这样在 macOS / Windows / Linux 上都是各自最优的原生中文字体。 */
const jakartaSans = localFont({
  src: [
    { path: '../fonts/plus-jakarta-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/plus-jakarta-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/plus-jakarta-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/plus-jakarta-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-latin',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LayoutClient from '@/app/components/LayoutClient';

export async function generateMetadata(context: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await context.params;
  const messages = await import(`@/messages/${locale}.json`);
  /* 社交平台抓不到 <html lang>，OG 图必须按语言给两份，
     否则中文分享卡片上出现英文文案（或反过来）。 */
  const ogImage = locale === 'en' ? '/og-en.png' : '/og-zh.png';
  return {
    metadataBase: new URL('https://m9ai.work'),
    title: messages.title,
    description: messages.description,
    icons: {
      icon: '/favicon.jpg',
    },
    openGraph: {
      title: messages.title,
      description: messages.description,
      type: 'website',
      url: `/${locale}`,
      locale: locale === 'en' ? 'en_US' : 'zh_CN',
      siteName: locale === 'en' ? enMessages.title : zhMessages.title,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: locale === 'en' ? enMessages.title : zhMessages.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.title,
      description: messages.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en-US': '/en',
        'zh-CN': '/zh',
      },
    },
  };
}

import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // 设置请求locale（必须在使用任何国际化函数前调用）
  setRequestLocale(locale);
  const messages = {
    en: enMessages,
    zh: zhMessages
  }[locale];

  return (
    // suppressHydrationWarning：下面的阻塞脚本会在水合前写入 class/data-theme，
    // 服务端 HTML 与客户端 DOM 的 html 属性必然不同，这是预期行为（next-themes 同做法）
    <html lang={locale} className={jakartaSans.variable} suppressHydrationWarning>
      <head>
        <meta name="author" content={locale === 'zh' ? '水杉智境工作室' : 'Metasequoia AI Studio'} />
        <link rel="manifest" href="/manifest.json" />
        {/* 结构化数据：告诉搜索引擎这是什么主体、什么站点。
            用 @graph 把 Organization 与 WebSite 关联起来，
            站名与描述跟 <html lang> 走，避免英文爬虫抓到中文实体。 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://m9ai.work/#org',
                  name: locale === 'zh' ? '水杉智境工作室' : 'Metasequoia AI Studio',
                  url: 'https://m9ai.work',
                  logo: 'https://m9ai.work/favicon.jpg',
                  description:
                    locale === 'zh'
                      ? zhMessages.description
                      : enMessages.description,
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://m9ai.work/#website',
                  url: `https://m9ai.work/${locale}`,
                  name: locale === 'zh' ? zhMessages.title : enMessages.title,
                  inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
                  publisher: { '@id': 'https://m9ai.work/#org' },
                },
              ],
            }),
          }}
        />
        {/* 阻塞式脚本：在首屏渲染前同步应用已保存的主题，避免暗色模式闪白(FOUC)。
            ThemeContext 挂载后会接管并保持一致。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'system';
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.setAttribute('data-theme', resolved);
  } catch (e) {}
})();
`.trim(),
          }}
        />
      </head>
      <body
        className={`${jakartaSans.className} antialiased`}
      >
        <ThemeProvider>
          {/* 显式传入 locale：这是 translations 切换后客户端 useLocale() 与
              createNavigation 生成的 Link 前缀的唯一权威来源，
              不要依赖 Provider 内部推断。 */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* reducedMotion="user" 让全站动画尊重系统的「减弱动态效果」偏好：
                位移/缩放类变换会被自动降级为直接切换，透明过渡保留。 */}
            <MotionProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main id="main-content" tabIndex={-1} className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        {/* Service Worker 只在 production 注册。dev 下注册到的是上次构建遗留在
            public/ 的旧 sw（next-pwa dest:'public'），它对 JS chunk 采用
            StaleWhileRevalidate——缓存优先返回旧 bundle，改了代码页面却跑旧逻辑。 */}
        {process.env.NODE_ENV === 'production' && (
          <script dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/m9ai-sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }).catch(function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `}} />
        )}
        {process.env.NODE_ENV === 'production' && <LayoutClient />}
      </body>
    </html>
  );
}
