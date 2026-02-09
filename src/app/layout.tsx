import React from 'react';
import '@/app/globals.css';
import { setRequestLocale } from 'next-intl/server';

export const metadata = {
  title: 'Metasequoia AI Studio',
  description: 'AI Solutions for Enterprise',
};

export default async function RootLayout({ children,
  params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}