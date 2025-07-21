/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://m9ai.work', // 替换为实际域名
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{
      userAgent: '*',
      allow: '/'
    }]
  },
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  transform: async (config, path) => {
    // 为每个页面生成hreflang标签
    const hreflangs = config.locales.map(locale => ({
      lang: locale,
      url: `${config.siteUrl}/${locale}${path === '/' ? '' : path}`
    }));

    return {
      loc: `${config.siteUrl}${path}`,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: hreflangs
    };
  }
};