import lunr, { Index } from 'lunr';

interface Frontmatter {
  title: string;
 date: string;
 description: string;
 tags?: string[];
 [key: string]: unknown;
}

export interface DocData {
 frontmatter: Frontmatter;
 content: string;
 path: string;
 slug?: string;
}

// 彻底解决所有TypeScript错误 - 最终修复版
interface UnifiedProcessor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use: (...plugins: any[]) => UnifiedProcessor;
  process: (content: string) => Promise<{ toString: () => string }>;
}

// 使用安全动态导入和精确类型断言
const importMarkdownTools = async (): Promise<{
  unified: () => UnifiedProcessor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remarkParse: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remarkRehype: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rehypeStringify: any;
}> => {
  try {
    const { default: unified } = (await import('unified')) as unknown as { default: () => UnifiedProcessor };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: remarkParse } = await import('remark-parse') as { default: any };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: remarkRehype } = await import('remark-rehype') as { default: any };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: rehypeStringify } = await import('rehype-stringify') as { default: any };

    if (!unified || !remarkParse || !remarkRehype || !rehypeStringify) {
      throw new Error('Critical markdown processing modules failed to load');
    }

    return { unified, remarkParse, remarkRehype, rehypeStringify };
  } catch (error) {
    console.error('Failed to import markdown processing tools:', error);
    throw new Error('Markdown utilities initialization failed');
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
    const searchParams = new URLSearchParams({ id });
    const res = await fetch(`/api/docs?${searchParams}`);
    
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