import React from 'react';
import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClarityInit from './components/ClarityInit';

export const metadata: Metadata = {
  title: '水杉智境工作室 | Metasequoia AI Studio',
  description: '低成本智能体服务平台，提供大模型私有化部署、应用开发和智能体开发等服务',
  icons: {
    icon: '/favicon.jpg',
  },
  openGraph: {
    title: '水杉智境工作室 | Metasequoia AI Studio',
    description: '低学习成本智能体服务平台，提供大模型私有化部署、应用开发和智能体开发等服务',
    type: 'website',
    images: [
      {
        url: '/favicon.jpg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '水杉智境工作室 | Metasequoia AI Studio',
    description: '低学习成本智能体服务平台，提供大模型私有化部署、应用开发和智能体开发等服务',
    images: ['/favicon.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="zh-CN">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="水杉智境工作室" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <body
        className="antialiased"
      >
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
              }).catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
              });
            });
          }
        `}} />
        {process.env.NODE_ENV === 'production' && <ClarityInit />}
      </body>
    </html>
  );
}
