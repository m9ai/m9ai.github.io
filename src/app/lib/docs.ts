import lunr, { Index } from 'lunr';
import fs from 'fs';
import path from 'path';

interface Frontmatter {
  title: string;
 date: string;
 description: string;
 tags?: string[];
 [key: string]: unknown;
}

interface DocData {
 frontmatter: Frontmatter;
 content: string;
 path: string;
}

interface MarkdownTools {
  unified: unknown;
  remarkParse: unknown;
  remarkRehype: unknown;
  rehypeStringify: unknown;
}

declare module 'unified' {
 function unified(): {
    use: (...plugins: unknown[]) => unknown;
    process: (content: string) => Promise<unknown>;
  };
  export default unified;
}
declare module 'remark-parse' {
  const remarkParse: unknown;
  export default remarkParse;
}
declare module 'remark-rehype' {
  const remarkRehype: unknown;
  export default remarkRehype;
}
declare module 'rehype-stringify' {
  const rehypeStringify: unknown;
  export default rehypeStringify;
}

// 文档数据接口定义
export interface DocData {
  id: string;
  path: string;
  title: string;
  content: string;
  [key: string]: any;
}

// 动态导入markdown处理工具并添加类型定义
interface MarkdownTools {
  unified: any;
  remarkParse: any;
  remarkRehype: any;
  rehypeStringify: any;
}

const importMarkdownTools = async (): Promise<MarkdownTools> => {
  try {
    // 使用动态导入并添加类型断言
    const unifiedModule = await import('unified') as { default: any };
    const remarkParseModule = await import('remark-parse') as { default: any };
    const remarkRehypeModule = await import('remark-rehype') as { default: any };
    const rehypeStringifyModule = await import('rehype-stringify') as { default: any };

    return {
      unified: unifiedModule.default,
      remarkParse: remarkParseModule.default,
      remarkRehype: remarkRehypeModule.default,
      rehypeStringify: rehypeStringifyModule.default
    };
  } catch (error) {
    console.error('Failed to import markdown tools:', error);
    throw new Error('Markdown processing tools could not be loaded');
  }
}

// 处理Markdown为HTML
export async function processMarkdown(content: string): Promise<string> {
  const { unified, remarkParse, remarkRehype, rehypeStringify } = await importMarkdownTools();
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);
  return processedContent.toString();
}

// 从API获取所有文档
export async function getDocs(): Promise<DocData[]> {
  try {
    // 实际项目中替换为线上API地址
    const res = await fetch('/api/docs', {
      next: { revalidate: 60 } // 每60秒重新验证数据
    });
    
    if (!res.ok) {
      throw new Error(`获取文档失败: ${res.status}`);
    }
    
    return res.json() as Promise<DocData[]>;
  } catch (error) {
    console.error('获取文档列表失败:', error);
    return [];
  }
}

// 从API获取单个文档内容
export async function getDocById(id: string): Promise<DocData | null> {
  try {
    const res = await fetch('/api/docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`获取文档内容失败: ${res.status}`);
    }
    
    return res.json() as Promise<DocData>;
  } catch (error) {
    console.error(`获取文档 ${id} 失败:`, error);
    return null;
  }
}

// 创建Lunr搜索索引
export async function createSearchIndex(): Promise<Index> {
  const docs = await getDocs();
  return lunr(function (this: Index) {
    this.field('title', { boost: 10 });
    this.field('content');
    this.ref('path');

    docs.forEach((doc) => {
      this.add(doc);
    });
  });
}

// 搜索文档
export async function searchDocs(query: string): Promise<DocData[]> {
  if (!query.trim()) return [];
  const index = await createSearchIndex();
  const results = index.search(query);
  const docs = await getDocs();

  return results.map((result) => {
    return docs.find((doc) => doc.path === result.ref);
  }).filter((doc): doc is DocData => Boolean(doc));
}

function getSortedPosts(): DocData[] {
  const frontmatter: Frontmatter = parsedData.data;
  function getAllTags(): { tag: string; count: number }[] {
  function getPostsByTag(tag: string): DocData[] {
  function getPostBySlug(slug: string): DocData | undefined {