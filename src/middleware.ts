import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  // 默认语言
  defaultLocale: 'zh',
  // 始终使用语言前缀
  localePrefix: 'always', 
});

// 仅对匹配的路径应用中间件
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};