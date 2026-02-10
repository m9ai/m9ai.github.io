import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

// 处理 mermaid 代码块
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rehypeMermaid(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visit = (node: any) => {
      if (node.tagName === 'pre') {
        const codeNode = node.children?.find((child: { tagName: string }) => child.tagName === 'code');
        if (codeNode && codeNode.properties?.className?.includes('language-mermaid')) {
          // 获取 mermaid 代码内容
          const textNode = codeNode.children?.[0];
          if (textNode && textNode.value) {
            // 将 pre > code 结构改为 pre.mermaid 包含纯文本
            node.properties = {
              className: ['mermaid'],
            };
            node.children = [{ type: 'text', value: textNode.value }];
          }
        }
      }
      // 递归处理子节点
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  updatedAt: string;
}

export interface Doc extends DocMeta {
  content: string;
  htmlContent: string;
}

// 获取所有文档的 slug
export function getAllDocSlugs(): string[] {
  const docsDirectory = path.join(process.cwd(), 'public/docs');
  
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(docsDirectory);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

// 获取所有文档的元数据
export async function getAllDocs(): Promise<DocMeta[]> {
  const slugs = getAllDocSlugs();

  const docs = await Promise.all(
    slugs.map(async (slug) => {
      const doc = await getDocBySlug(slug);
      return {
        slug: doc.slug,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        tags: doc.tags,
        updatedAt: doc.updatedAt,
      };
    })
  );

  return docs;
}

// 获取单个文档
export async function getDocBySlug(slug: string): Promise<Doc> {
  const docsDirectory = path.join(process.cwd(), 'public/docs');
  const fullPath = path.join(docsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Document not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // 确保 updatedAt 是字符串（YAML 可能将其解析为 Date 对象）
  const updatedAt = data.updatedAt
    ? (data.updatedAt instanceof Date ? data.updatedAt.toISOString().split('T')[0] : String(data.updatedAt))
    : new Date().toISOString().split('T')[0];

  // 处理 Markdown 为 HTML
  const htmlContent = await processMarkdown(content);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || '其他',
    tags: data.tags || [],
    updatedAt,
    content,
    htmlContent,
  };
}

// 处理 Markdown 为 HTML
export async function processMarkdown(content: string): Promise<string> {
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHighlight)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['anchor-link'],
        },
      })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .use(rehypeMermaid)
      .process(content);

    // const html = String(result);
    // console.log('processMarkdown result length:', html.length);
    return String(result);
  } catch (error) {
    console.error('processMarkdown error:', error);
    throw error;
  }
}

// 获取分类列表
export async function getCategories(): Promise<string[]> {
  const docs = await getAllDocs();
  const categories = new Set(docs.map(doc => doc.category));
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
