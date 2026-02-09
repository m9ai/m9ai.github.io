'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add('page-transition');
    return () => {
      document.documentElement.classList.remove('page-transition');
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-foreground">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <Image fill sizes='100vw' src="/globe.svg" draggable={false} alt="Globe illustration" className="w-full h-full" />
      </div>

      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">页面未找到</h2>
        <p className="text-muted-foreground mb-8">
          抱歉，页面不存在或已被移动。请检查URL或返回首页。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/zh')}
            className="min-w-[160px] inline-flex items-center justify-center rounded-md border border-input bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            返回首页
          </button>
          <Link href="/zh/contact"
            className="min-w-[160px] inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            联系我们
          </Link>
        </div>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <p>错误代码: 404 - 未找到资源</p>
      </div>
    </div>
  );
}
