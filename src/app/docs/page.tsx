'use client';

import { useState, useEffect } from 'react';
import { getDocById, processMarkdown } from '@/app/lib/docs';
import { DocData } from '@/app/lib/docs';

export default function DocsHomePage() {
  const [doc, setDoc] = useState<DocData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchDefaultDoc = async () => {
      try {
        setLoading(true);
        // 获取默认文档（介绍）
        const document = await getDocById('introduction');
        if (!document) {
          setError('默认文档不存在');
          return;
        }
        setDoc(document);
        const html = await processMarkdown(document.content);
        setHtmlContent(html);
      } catch (err) {
        setError('获取文档失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultDoc();
  }, []);

  if (loading) return <div className="text-center py-10">加载文档中...</div>;
  if (error) return <div className="text-center py-10 text-red-500">错误: {error}</div>;
  if (!doc) return <div className="text-center py-10">文档未找到</div>;

  return (
    <div className="prose max-w-none">
      <h1>{doc.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}