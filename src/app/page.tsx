// GitHub Pages 是纯静态托管，没有服务端也没有 middleware 可执行 redirect()。
// 静态导出时 redirect() 会输出 "__next_error__" 空白页（实测 out/index.html 即为此），
// 导致访问域名根目录是白屏。这里改用标准的 meta refresh 重定向，无需服务端。
// 兜底链接用 Link：静态导出后仍渲染为原生 <a>，禁用 meta refresh 时也能手动跳转。
import Link from 'next/link';

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/zh" />
      <link rel="canonical" href="/zh" />
      <p>
        正在跳转到 <Link href="/zh">首页</Link>…
      </p>
    </>
  );
}
