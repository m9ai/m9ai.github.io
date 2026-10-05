/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const siteUrl = 'https://m9ai.work';
const locales = ['zh', 'en'];
const defaultLocale = 'zh';

/** 一个语言版本可以挂多个 hreflang：语言码负责宽匹配，地区码负责精确匹配。 */
const hreflangTags = {
  zh: ['zh', 'zh-CN', 'zh-Hans'],
  en: ['en', 'en-US'],
};

/**
 * 文档的 lastmod 用 frontmatter 里的 updatedAt，而不是构建时间。
 *
 * 之前所有 URL 共用同一个 lastmod（而且因为构建机时钟问题是个未来时间），
 * 等于告诉爬虫「全站每天全量更新」——这是典型的低质量信号，
 * 会让爬虫把有限的抓取预算浪费在没变化的页面上。
 */
const docLastmod = (() => {
  const dir = path.join(process.cwd(), 'public', 'docs');
  const map = new Map();
  if (!fs.existsSync(dir)) return map;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!data.updatedAt) continue;
    const slug = file.replace(/\.md$/, '').replace(/-en$/, '');
    const date = new Date(data.updatedAt);
    if (Number.isNaN(date.getTime())) continue;
    const iso = date.toISOString();
    if (!map.has(slug) || map.get(slug) < iso) map.set(slug, iso);
  }
  return map;
})();

/** 首页 > 聚合页 > 详情/文档 > 市集 > 法务页 */
function priorityFor(bare) {
  if (bare === '/') return 1.0;
  if (bare === '/services' || bare === '/docs' || bare === '/store' || bare === '/contact') return 0.9;
  if (bare.startsWith('/services/')) return 0.8;
  if (bare.startsWith('/cases/')) return 0.8;
  if (bare.startsWith('/docs/')) return 0.7;
  if (bare.startsWith('/apps/')) return 0.6;
  if (bare === '/privacy-policy' || bare === '/terms-of-service') return 0.3;
  return 0.5;
}

function changefreqFor(bare) {
  if (bare === '/') return 'daily';
  if (bare.startsWith('/docs/')) return 'weekly';
  if (bare === '/privacy-policy' || bare === '/terms-of-service') return 'yearly';
  return 'weekly';
}

/** 拆出语言前缀与该语言无关的路径，例如 /en/docs/workflow -> { locale:'en', bare:'/docs/workflow' } */
function splitLocale(rawPath) {
  const normalized = rawPath.replace(/\/+$/, '') || '/';
  const match = normalized.match(/^\/(zh|en)(\/.*)?$/);
  if (!match) return { locale: null, bare: normalized || '/' };
  return { locale: match[1], bare: match[2] || '/' };
}

function withTrailingSlash(p) {
  return p === '/' ? '/' : `${p.replace(/\/+$/, '')}/`;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  // 所有 URL 都带尾斜杠（next.config.ts 里 trailingSlash: true），sitemap 必须同形
  trailingSlash: true,
  // 根路径只是一个 meta refresh 跳转页，404 更不该进 sitemap
  exclude: ['/', '/404', '/404.html', '/m9ai-sw.js', '/search-index.json'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      /* GEO：把主流生成式引擎的爬虫显式放行并单独成段。
         不写它们也不会被拦（robots.txt 默认放行），但显式声明有两个作用：
         1) 避免将来有人加了 `Disallow: /` 时误伤；
         2) 便于一眼看出本站对 AI 检索是开放的，需要限流时可以精确定位到某一段。 */
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
  },
  transform: async (config, rawPath) => {
    const { locale, bare } = splitLocale(rawPath);

    // 404 / 根路径等非本地化路由直接跳过，交给上面的 exclude
    if (!locale) return null;

    const docMatch = bare.match(/^\/docs\/(.+)$/);
    const lastmod =
      (docMatch && docLastmod.get(docMatch[1])) ||
      // 其余页面没有可靠的内容修改时间，用构建时间但夹到「不超过此刻」，
      // 防止构建机时钟偏快时写出未来时间。
      new Date(Date.now()).toISOString();

    const alternateRefs = [];
    for (const candidate of locales) {
      for (const tag of hreflangTags[candidate]) {
        alternateRefs.push({
          hreflang: tag,
          href: `${config.siteUrl}/${candidate}${bare === '/' ? '' : bare}/`,
          hrefIsAbsolute: true,
        });
      }
    }
    alternateRefs.push({
      hreflang: 'x-default',
      href: `${config.siteUrl}/${defaultLocale}${bare === '/' ? '' : bare}/`,
      hrefIsAbsolute: true,
    });

    return {
      loc: `${config.siteUrl}/${locale}${bare === '/' ? '' : bare}/`,
      lastmod,
      changefreq: changefreqFor(bare),
      priority: priorityFor(bare),
      alternateRefs,
    };
  },
};
