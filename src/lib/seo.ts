import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';

export type SeoLocale = (typeof routing.locales)[number];

/**
 * 全站唯一的规范域名。
 *
 * CNAME 上同时绑了 m9ai.work / www.m9ai.work / m9ai.cn / www.m9ai.cn 四个域名，
 * 但 canonical、og:url、sitemap、robots Host 一律归一到这一个权威域名。
 * 否则同一份内容会有四个可索引地址，互相稀释权重（AI 检索侧同理：
 * 多个等价 URL 会让模型拼出的引用来源飘忽不定）。
 */
export const SITE_URL = 'https://m9ai.work';

export const SITE_ORG_ID = `${SITE_URL}/#organization`;
export const SITE_WEBSITE_ID = `${SITE_URL}/#website`;
export const SITE_FOUNDER_ID = `${SITE_URL}/#founder`;

export const CONTACT_EMAIL = 'c@m9ai.work';
export const GITHUB_ORG_URL = 'https://github.com/m9ai';

interface SiteMessages {
  title: string;
  description: string;
  meta: { defaultTitle: string; defaultDescription: string };
}

const MESSAGES: Record<SeoLocale, SiteMessages> = {
  zh: zhMessages,
  en: enMessages,
};

/** hreflang / og:locale 用的地区码，与 <html lang> 的语言码保持可对应。 */
export const HREFLANG: Record<SeoLocale, string> = {
  zh: 'zh-CN',
  en: 'en-US',
};

/** 同一个语言版本可以同时声明语言码与地区码，覆盖面更广（Google 允许一个 URL 挂多个 hreflang）。 */
const HREFLANG_ALIASES: Record<SeoLocale, string[]> = {
  zh: ['zh', 'zh-CN', 'zh-Hans'],
  en: ['en', 'en-US'],
};

/** 站点级关键词。只在首页声明即可，子页面各自带更具体的词（文档用 frontmatter tags）。 */
export const KEYWORDS: Record<SeoLocale, string[]> = {
  zh: [
    'AI 智能体',
    'Agent 工作流',
    '智能体工程',
    '大模型私有化部署',
    '企业 AI 解决方案',
    'MCP 工具集成',
    'RAG 知识库',
    '多模态文档处理',
    '水杉智境工作室',
  ],
  en: [
    'AI agents',
    'agent workflows',
    'agentic engineering',
    'private LLM deployment',
    'enterprise AI solutions',
    'MCP tool integration',
    'RAG knowledge base',
    'multimodal document processing',
    'Metasequoia AI Studio',
  ],
};

export const OG_IMAGE: Record<SeoLocale, { url: string; width: number; height: number; alt: string }> = {
  zh: { url: '/og-zh.png', width: 1200, height: 630, alt: '水杉智境工作室' },
  en: { url: '/og-en.png', width: 1200, height: 630, alt: 'Metasequoia AI Studio' },
};

export const DEFAULT_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    // 让搜索结果里可以展示大图与完整摘要，AI 概览同样依赖这两个上限
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

export function asLocale(locale: string): SeoLocale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export function siteName(locale: string): string {
  return MESSAGES[asLocale(locale)].title;
}

export function siteDescription(locale: string): string {
  return MESSAGES[asLocale(locale)].description;
}

/**
 * 统一路径形态。next.config.ts 里开了 trailingSlash: true，
 * 所以站内真实 URL 一定带尾斜杠 —— canonical / hreflang / og:url 必须同形，
 * 否则规范地址与可访问地址不一致，会被当成两个页面各自收录。
 */
export function normalizePath(path: string): string {
  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (!normalized.endsWith('/')) normalized = `${normalized}/`;
  return normalized;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${normalizePath(path)}`;
}

/**
 * 图片/文件类资源用这个：不能套尾斜杠。
 * `/og-en.png/` 会被当成另一个地址，社交平台与 AI 预览取图会直接失败。
 */
export function assetUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 把不含语言前缀的站内路径（如 `/docs/workflow`）拼成 `/zh/docs/workflow/`。 */
export function localizedPath(locale: string, path: string): string {
  const normalized = normalizePath(path);
  return normalized === '/' ? `/${asLocale(locale)}/` : `/${asLocale(locale)}${normalized}`;
}

/**
 * canonical + 全量 hreflang（含 x-default）。
 *
 * 之前的版本只在首页声明了 en-US / zh-CN 两种互指，且缺 x-default；
 * 子页面完全不声明，导致英文站的文章页在 Google 里没有对应的中文版，
 * 两个语言站各自为政。这里每个页面都给完整的一组。
 */
export function languageAlternates(locale: string, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const candidate of routing.locales) {
    for (const tag of HREFLANG_ALIASES[candidate]) {
      languages[tag] = absoluteUrl(localizedPath(candidate, path));
    }
  }
  languages['x-default'] = absoluteUrl(localizedPath(routing.defaultLocale, path));

  return {
    canonical: absoluteUrl(localizedPath(locale, path)),
    languages,
  };
}

/**
 * messages 里不少页面的 meta.title 自带「 | 站名」后缀（历史写法）。
 * 现在站名由 layout 的 title.template 统一补，这里先把旧后缀摘掉，
 * 否则会出现「AI服务 | 水杉智境工作室 | 水杉智境工作室」。
 */
export function pageTitle(locale: string, raw: string): string {
  const suffix = ` | ${siteName(locale)}`;
  return raw.endsWith(suffix) ? raw.slice(0, -suffix.length).trim() : raw;
}

export interface PageMetaInput {
  locale: string;
  /** 不含语言前缀的站内路径，例如 `/docs/workflow`、`/services`（首页传 `/`）。 */
  path: string;
  title: string;
  description: string;
  /** 搜索引擎早已不把 keywords 当排名因素，但对站内检索与部分 AI 抽取仍有微弱作用，低优先级保留。 */
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

/**
 * 页面级 metadata 的唯一出口。
 *
 * 之前每个页面只写 title + description，导致：
 * - 子页面没有 canonical 与 hreflang；
 * - 所有页面的 og:url / og:image 都继承首页，社交分享与 AI 预览区分不出页面。
 * 这里一次性补齐，页面侧只需传文案。
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
}: PageMetaInput): Metadata {
  const resolved = asLocale(locale);
  const image = OG_IMAGE[resolved];
  const url = absoluteUrl(localizedPath(resolved, path));
  const otherLocales = routing.locales
    .filter((candidate) => candidate !== resolved)
    .map((candidate) => HREFLANG[candidate].replace('-', '_'));

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: languageAlternates(resolved, path),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteName(resolved),
      locale: HREFLANG[resolved].replace('-', '_'),
      alternateLocale: otherLocales,
      images: [{ ...image, url: assetUrl(image.url) }],
      ...(publishedTime ? { publishedTime, ...(modifiedTime ? { modifiedTime } : {}) } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [assetUrl(image.url)],
    },
    robots: noindex ? { index: false, follow: true } : DEFAULT_ROBOTS,
  };
}
