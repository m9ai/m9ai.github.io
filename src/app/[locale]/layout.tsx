import React from 'react';
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from 'next-intl';


import "@/app/globals.css";

// viewport / theme-color 改由 metadata API 输出，避免与 <head> 里手写的标签重复
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LayoutClient from '@/app/components/LayoutClient';

export async function generateMetadata(context: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await context.params;
  const messages = await import(`@/messages/${locale}.json`);
  return {
    title: messages.title,
    description: messages.description,
    icons: {
      icon: '/favicon.jpg',
    },
    openGraph: {
      title: locale === 'en' ? enMessages.title : zhMessages.title,
      description: locale === 'en' ? enMessages.description : zhMessages.description,
      type: 'website',
      images: [{
        url: '/favicon.jpg',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: locale === 'en' ? enMessages.title : zhMessages.title,
      description: locale === 'en' ? enMessages.description : zhMessages.description,
      images: ['/favicon.jpg'],
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="author" content={locale === 'zh' ? '水杉智境工作室' : 'Metasequoia AI Studio'} />
        <link rel="manifest" href="/manifest.json" />
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
        className="antialiased"
      >
        <ThemeProvider>
          {/* 显式传入 locale：这是 translations 切换后客户端 useLocale() 与
              createNavigation 生成的 Link 前缀的唯一权威来源，
              不要依赖 Provider 内部推断。 */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
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
        {process.env.NODE_ENV === 'production' && <LayoutClient />}
      </body>
    </html>
  );
}
