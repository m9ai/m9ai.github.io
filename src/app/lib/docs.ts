import {
  getAllDocs,
  getDocById as getDocFromData,
  searchDocs as searchDocsData,
  Doc,
} from '@/data/docs';

// 导出 Doc 类型
export type { Doc };

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

// 使用安全动态导入和精确类型断言
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

// 处理 Markdown 为 HTML
export async function processMarkdown(content: string): Promise<string> {
  try {
    const { unified, remarkParse, remarkRehype, rehypeStringify } = await importMarkdownTools();
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(content);
    return processedContent.toString();
  } catch (error) {
    console.error('Failed to process markdown:', error);
    // 如果处理失败，返回简单的文本转换
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
}

// 从本地数据获取所有文档
export async function getDocs(): Promise<DocData[]> {
  const docs = getAllDocs();
  return docs.map(doc => ({
    frontmatter: {
      title: doc.title,
      date: doc.updatedAt,
      description: doc.description,
      tags: doc.tags,
    },
    content: doc.content,
    path: doc.path,
    slug: doc.id,
  }));
}

// 从本地数据获取单个文档内容
export async function getDocById(id: string): Promise<DocData | null> {
  const doc = getDocFromData(id);
  if (!doc) return null;

  return {
    frontmatter: {
      title: doc.title,
      date: doc.updatedAt,
      description: doc.description,
      tags: doc.tags,
    },
    content: doc.content,
    path: doc.path,
    slug: doc.id,
  };
}

// 搜索文档
export async function searchDocs(query: string): Promise<DocData[]> {
  if (!query.trim()) return [];
  const docs = searchDocsData(query);
  return docs.map(doc => ({
    frontmatter: {
      title: doc.title,
      date: doc.updatedAt,
      description: doc.description,
      tags: doc.tags,
    },
    content: doc.content,
    path: doc.path,
    slug: doc.id,
  }));
}
