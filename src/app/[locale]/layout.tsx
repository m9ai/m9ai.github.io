import React from 'react';
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from 'next-intl';


import "@/app/globals.css";
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
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content={locale === 'zh' ? '水杉智境工作室' : 'Metasequoia AI Studio'} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className="antialiased"
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
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
