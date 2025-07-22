import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix: 'always',
  // 添加根路径重定向配置
  localeDetection: false
});

// 修改匹配规则，允许根路径通过
export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\..*).*)']
};