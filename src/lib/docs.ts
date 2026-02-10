import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || '其他',
    tags: data.tags || [],
    updatedAt,
    content,
  };
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
