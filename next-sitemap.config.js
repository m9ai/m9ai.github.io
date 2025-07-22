/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://m9ai.work',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{
      userAgent: '*',
      allow: '/'
    }]
  },
  // 删除以下配置块
  // locales: ['zh', 'en'],
  // defaultLocale: 'zh',
  // transform: async (config, path) => {
  //   // 为每个页面生成hreflang标签
  //   const hreflangs = config.locales.map(locale => ({
  //     lang: locale,
  //     url: `${config.siteUrl}/${locale}${path === '/' ? '' : path}`
  //   }));
  //
  //   return {
  //     loc: `${config.siteUrl}${path}`,
  //     changefreq: config.changefreq,
  //     priority: config.priority,
  //     lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  //     alternateRefs: hreflangs
  //   };
  // }
};