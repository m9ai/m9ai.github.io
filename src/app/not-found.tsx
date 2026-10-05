import Link from 'next/link';
import Image from 'next/image';

/* 404 页面。
 *
 * 之前整页硬编码中文，英文站用户和英文爬虫撞进来看到的是一屏看不懂的文案，
 * 而这个页面本身不带语言前缀，无法从路由判断该用哪种语言 —— 所以直接双语并列。
 *
 * 同样因为在 [locale] 之上（根 layout 不渲染 html），这里要自己输出完整文档。 */
export default function NotFoundPage() {
  return (
    <html lang="zh">
      <head>
        {/* robots 由 src/app/layout.tsx 的 metadata 统一给（noindex,follow），这里不重复输出 */}
        <title>页面未找到 / Page not found</title>
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-foreground">
          <div className="absolute inset-0 overflow-hidden -z-10">
            <Image
              fill
              sizes="100vw"
              src="/globe.svg"
              draggable={false}
              alt="Globe illustration"
              className="w-full h-full"
            />
          </div>

          <div className="text-center max-w-md mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">页面未找到 / Page not found</h2>
            <p className="text-muted-foreground mb-8">
              抱歉，页面不存在或已被移动。请检查 URL 或返回首页。
              <br />
              Sorry, this page does not exist or has moved. Please check the URL or go back home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/zh"
                className="min-w-[160px] inline-flex items-center justify-center rounded-md border border-input bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                返回首页 / Home
              </Link>
              <Link
                href="/zh/contact"
                className="min-w-[160px] inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                联系我们 / Contact
              </Link>
            </div>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p>错误代码: 404 - 未找到资源 / Error 404 - resource not found</p>
          </div>
        </div>
      </body>
    </html>
  );
}
