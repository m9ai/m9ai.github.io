import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** 分类的稳定英文 key，供 i18n 使用（Docs.categories.<key>） */
  categoryKey: string;
  tags?: string[];
  updatedAt: string;
}

export interface Doc extends DocMeta {
  content: string;
}

const DOCS_DIRECTORY = path.join(process.cwd(), 'public/docs');

/* slug -> 分类 key。
   原先分类名直接写在 markdown frontmatter 里（中文），英文站侧边栏会整栏漏中文。
   这里维护一份 slug -> key 的映射，让 Docs.categories.<key> 提供双语的分类名。
   注意：如果新增文档，记得在这里补一行，否则回退到 frontmatter 里的原始值。 */
const SLUG_CATEGORY_KEY: Record<string, string> = {
  'introduction': 'gettingStarted',
  'model-deployment': 'technical',
  'knowledge-base': 'advanced',
  'workflow': 'advanced',
  'prompt-engineering': 'advanced',
  'api-integration': 'developmentGuide',
  'api-reference': 'developmentGuide',
  'faq': 'help',
  'privacy-policy': 'help',
  'terms-of-service': 'help',
};

/* 英文站的文档仓库约定：<slug>.md 是中文正文，<slug>-en.md 是同一篇的英文正文。
   Term / Privacy 页面早就用了这个约定，但 /docs 路由从未遵循它 ——
   英文站一直渲染中文正文，而 -en 文件被当成另一篇独立文档重复列进导航。
   下面两个函数把这个约定收进数据源。 */
const EN_SUFFIX = '-en';

function exists(slug: string): boolean {
  return fs.existsSync(path.join(DOCS_DIRECTORY, `${slug}.md`));
}

/** 该文档是否存在英文正文 */
export function hasEnglishContent(slug: string): boolean {
  return fs.existsSync(path.join(DOCS_DIRECTORY, `${slug}${EN_SUFFIX}.md`));
}

/** 列出所有文档 slug，英文版（-en）不算独立文档 */
export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(DOCS_DIRECTORY)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''))
    .filter(slug => !slug.endsWith(EN_SUFFIX));
}

// 获取所有文档的元数据
export async function getAllDocs(locale?: string): Promise<DocMeta[]> {
  const slugs = getAllDocSlugs();

  const docs = await Promise.all(
    slugs.map(async (slug) => {
      const doc = await getDocBySlug(slug, locale);
      return {
        slug: doc.slug,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        categoryKey: doc.categoryKey,
        tags: doc.tags,
        updatedAt: doc.updatedAt,
      };
    })
  );

  return docs;
}

// 获取单个文档；英文站点优先返回 <slug>-en.md
export async function getDocBySlug(slug: string, locale?: string): Promise<Doc> {
  const requested = locale === 'en' && hasEnglishContent(slug) ? `${slug}${EN_SUFFIX}` : slug;
  const fullPath = path.join(DOCS_DIRECTORY, `${requested}.md`);

  if (!exists(requested)) {
    throw new Error(`Document not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // 确保 updatedAt 是字符串（YAML 可能将其解析为 Date 对象）
  const updatedAt = data.updatedAt
    ? (data.updatedAt instanceof Date ? data.updatedAt.toISOString().split('T')[0] : String(data.updatedAt))
    : new Date().toISOString().split('T')[0];

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || '其他',
    categoryKey: SLUG_CATEGORY_KEY[slug] || '',
    tags: data.tags || [],
    updatedAt,
    content,
  };
}

// 获取分类列表
export async function getCategories(): Promise<string[]> {
  const docs = await getAllDocs();
  const categories = new Set(docs.map(doc => doc.categoryKey || doc.category));
  return Array.from(categories);
}

// 搜索文档
export async function searchDocs(query: string): Promise<DocMeta[]> {
  const docs = await getAllDocs();
  const lowerQuery = query.toLowerCase();

  return docs.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.description.toLowerCase().includes(lowerQuery) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
