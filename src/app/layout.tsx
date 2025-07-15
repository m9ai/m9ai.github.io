import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '水杉智境工作室 | Metasequoia AI Studio',
  description: '低学习成本智能体服务平台，提供大模型私有化部署、应用开发和智能体开发等服务',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
      </body>
    </html>
  );
}
