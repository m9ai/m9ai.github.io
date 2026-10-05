/* JSON-LD 结构化数据的集中产地。
 *
 * 之前全站只有 layout 里手写的一段 Organization + WebSite。对传统搜索勉强够用，
 * 但对生成式引擎（GEO）几乎无效：模型要判断「这篇文档讲什么、谁写的、属于哪一类、
 * 与站内其它内容什么关系」，靠的是页面级的 Article / BreadcrumbList / FAQPage 等节点，
 * 而不是站点级的组织信息。
 *
 * 这里所有函数都返回纯对象，由 <JsonLd> 组件序列化进 <head>/<body>。 */

import {
  CONTACT_EMAIL,
  GITHUB_ORG_URL,
  SITE_FOUNDER_ID,
  SITE_ORG_ID,
  SITE_URL,
  SITE_WEBSITE_ID,
  absoluteUrl,
  assetUrl,
  asLocale,
  localizedPath,
  siteDescription,
  siteName,
  HREFLANG,
} from '@/lib/seo';

const ORG_NAME = {
  zh: '水杉智境工作室',
  en: 'Metasequoia AI Studio',
} as const;

const KNOWS_ABOUT = {
  zh: [
    '大模型私有化部署',
    'Agent 工作流编排',
    '智能体开发',
    'MCP 工具集成',
    '检索增强生成（RAG）',
    '多模态文档处理',
    'Prompt 工程',
    '端云一体化应用',
  ],
  en: [
    'private LLM deployment',
    'agent workflow orchestration',
    'agentic engineering',
    'MCP tool integration',
    'retrieval-augmented generation',
    'multimodal document processing',
    'prompt engineering',
    'edge-cloud application delivery',
  ],
} as const;

/** Organization：全站复用同一个 @id，其它节点用引用关联，避免实体重复。 */
export function organizationSchema(locale: string) {
  const resolved = asLocale(locale);
  return {
    '@type': 'Organization',
    '@id': SITE_ORG_ID,
    name: ORG_NAME[resolved],
    alternateName: resolved === 'zh' ? 'Metasequoia AI Studio' : '水杉智境工作室',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: assetUrl('/favicon.jpg'),
      caption: ORG_NAME[resolved],
    },
    image: assetUrl('/og-zh.png'),
    description: siteDescription(resolved),
    email: CONTACT_EMAIL,
    inLanguage: HREFLANG[resolved],
    sameAs: [GITHUB_ORG_URL],
    knowsAbout: [...KNOWS_ABOUT[resolved]],
    founder: { '@id': SITE_FOUNDER_ID },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: CONTACT_EMAIL,
      availableLanguage: ['zh-CN', 'en'],
    },
  };
}

export function founderSchema(locale: string) {
  const resolved = asLocale(locale);
  return {
    '@type': 'Person',
    '@id': SITE_FOUNDER_ID,
    name: resolved === 'zh' ? '张舰' : 'Jian Zhang',
    jobTitle: resolved === 'zh' ? '创始人' : 'Founder',
    worksFor: { '@id': SITE_ORG_ID },
    image: assetUrl('/founder.jpg'),
  };
}

export function websiteSchema(locale: string) {
  const resolved = asLocale(locale);
  return {
    '@type': 'WebSite',
    '@id': SITE_WEBSITE_ID,
    url: absoluteUrl(localizedPath(resolved, '/')),
    name: siteName(resolved),
    description: siteDescription(resolved),
    inLanguage: HREFLANG[resolved],
    publisher: { '@id': SITE_ORG_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** 不含语言前缀的站内路径；最后一项可省略，面包屑末端不需要 @id。 */
  path?: string;
}

/** BreadcrumbList：给爬虫一条明确的层级路径，也让 AI 能复述页面在站内的位置。 */
export function breadcrumbSchema(locale: string, items: BreadcrumbItem[]) {
  const resolved = asLocale(locale);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(localizedPath(resolved, item.path)) } : {}),
    })),
  };
}

export function webPageSchema(locale: string, path: string, name: string, description: string) {
  const resolved = asLocale(locale);
  const url = absoluteUrl(localizedPath(resolved, path));
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': SITE_WEBSITE_ID },
    inLanguage: HREFLANG[resolved],
    about: { '@id': SITE_ORG_ID },
  };
}

export interface ArticleInput {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  updatedAt: string;
}

/** 文档页：用 TechArticle 而非普通 Article，技术文档的语义更贴合。 */
export function techArticleSchema(locale: string, doc: ArticleInput) {
  const resolved = asLocale(locale);
  const url = absoluteUrl(localizedPath(resolved, `/docs/${doc.slug}`));
  return {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: doc.title,
    name: doc.title,
    description: doc.description,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    isPartOf: { '@id': SITE_WEBSITE_ID },
    inLanguage: HREFLANG[resolved],
    datePublished: doc.updatedAt,
    dateModified: doc.updatedAt,
    articleSection: doc.category,
    ...(doc.tags?.length ? { keywords: doc.tags.join(', ') } : {}),
    author: { '@id': SITE_ORG_ID },
    publisher: { '@id': SITE_ORG_ID },
    proficiencyLevel: 'Beginner',
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqSchema(entries: FaqEntry[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 从文档正文里抽出 `### Q: …` / `A: …` 结构的问答对。
 * public/docs/faq.md 一直是这个写法，与其再维护一份问答数据，不如直接解析。
 */
export function parseFaqFromMarkdown(markdown: string): FaqEntry[] {
  const entries: FaqEntry[] = [];
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    if (!question) return;
    const text = stripMarkdown(answer.join(' ').replace(/^A[:：]\s*/i, ''));
    if (text) entries.push({ question: stripMarkdown(question), answer: text });
    question = null;
    answer = [];
  };

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    const heading = line.match(/^#{2,6}\s*Q[:：]\s*(.+)$/);
    if (heading) {
      flush();
      question = heading[1].trim();
      continue;
    }
    if (!question) continue;
    // 遇到下一个任意层级的标题说明这组问答结束了
    if (/^#{1,6}\s/.test(line)) {
      flush();
      continue;
    }
    if (line) answer.push(line);
  }
  flush();

  return entries;
}

export function serviceSchema(locale: string, path: string, name: string, description: string) {
  const resolved = asLocale(locale);
  const url = absoluteUrl(localizedPath(resolved, path));
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    url,
    serviceType: name,
    provider: { '@id': SITE_ORG_ID },
    areaServed: { '@type': 'Country', name: resolved === 'zh' ? '中国' : 'China' },
    inLanguage: HREFLANG[resolved],
    isPartOf: { '@id': SITE_WEBSITE_ID },
  };
}

export interface SoftwareApplicationInput {
  id: string;
  name: string;
  description: string;
  tagline: string;
  capabilities: string[];
  version?: string;
  repo?: string;
  categoryLabel?: string;
}

export function softwareApplicationSchema(locale: string, input: SoftwareApplicationInput) {
  const resolved = asLocale(locale);
  const url = absoluteUrl(localizedPath(resolved, `/apps/${input.id}`));
  return {
    '@type': 'SoftwareApplication',
    '@id': `${url}#app`,
    name: input.name,
    description: input.description || input.tagline,
    url,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: input.categoryLabel || 'AI Agent Skill',
    operatingSystem: 'Node.js',
    inLanguage: HREFLANG[resolved],
    ...(input.version ? { softwareVersion: input.version } : {}),
    ...(input.repo
      ? { codeRepository: `https://github.com/m9ai/m9ai-skills/tree/main/${input.repo}` }
      : {}),
    ...(input.capabilities.length ? { featureList: input.capabilities } : {}),
    author: { '@id': SITE_ORG_ID },
    publisher: { '@id': SITE_ORG_ID },
    isPartOf: { '@id': SITE_WEBSITE_ID },
  };
}

export interface CaseStudyInput {
  slug: string;
  title: string;
  description: string;
  industry: string;
  outcomes?: string[];
}

/** 案例页：用 Article（行业案例不是软件产品，套 SoftwareApplication 会语义错位）。 */
export function caseStudySchema(locale: string, input: CaseStudyInput) {
  const resolved = asLocale(locale);
  const url = absoluteUrl(localizedPath(resolved, `/cases/${input.slug}`));
  return {
    '@type': 'Article',
    '@id': `${url}#case-study`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    isPartOf: { '@id': SITE_WEBSITE_ID },
    inLanguage: HREFLANG[resolved],
    articleSection: input.industry,
    ...(input.outcomes?.length ? { abstract: input.outcomes.join('；') } : {}),
    author: { '@id': SITE_ORG_ID },
    publisher: { '@id': SITE_ORG_ID },
  };
}
