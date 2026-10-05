import Link from 'next/link';

/* 站点根路径只是一个「分流页」。
 *
 * GitHub Pages 是纯静态托管，没有服务端也没有 middleware 可执行 redirect()，
 * 静态导出时 redirect() 会输出 "__next_error__" 空白页。
 *
 * 这里同时给三种兜底，保证任何环境都能落到正确的语言页：
 *   1. <link rel="canonical"> —— 告诉爬虫权威地址是 /zh/，本页不参与排名竞争；
 *   2. <meta http-equiv="refresh"> —— 不执行 JS 的爬虫/浏览器也能走；
 *   3. 一小段内联脚本 —— 按 navigator.language 把英文用户直接送到 /en/，
 *      省掉一次「先落到中文再手动切」的跳转。
 *
 * 另外：本层在 [locale] 之上，根 layout 刻意不渲染 <html>/<body>，
 * 所以这里必须自己输出完整文档，否则导出结果是一段没有 html/body 的碎片 HTML。
 */
export default function RootPage() {
  const redirect = `
(function () {
  try {
    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      if (/^en/i.test(langs[i])) { location.replace('/en/'); return; }
    }
  } catch (e) {}
  location.replace('/zh/');
})();
`.trim();

  return (
    <html lang="zh">
      <head>
        {/* robots 由 src/app/layout.tsx 的 metadata 统一给（noindex,follow），这里不重复输出 */}
        <link rel="canonical" href="https://m9ai.work/zh/" />
        <link rel="alternate" hrefLang="zh" href="https://m9ai.work/zh/" />
        <link rel="alternate" hrefLang="zh-CN" href="https://m9ai.work/zh/" />
        <link rel="alternate" hrefLang="en" href="https://m9ai.work/en/" />
        <link rel="alternate" hrefLang="en-US" href="https://m9ai.work/en/" />
        <link rel="alternate" hrefLang="x-default" href="https://m9ai.work/zh/" />
        <meta httpEquiv="refresh" content="0; url=/zh/" />
        <script dangerouslySetInnerHTML={{ __html: redirect }} />
      </head>
      <body>
        <p>
          正在跳转到 <Link href="/zh/">首页</Link> / <Link href="/en/">Home</Link>…
        </p>
      </body>
    </html>
  );
}
