'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDocById, processMarkdown } from '@/app/lib/docs';
import { DocData } from '@/app/lib/docs';

export default function DocPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [doc, setDoc] = useState<DocData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const document = await getDocById(slug);
        if (!document) {
          setError('文档不存在');
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

    fetchDoc();
  }, [slug]);

  if (loading) return <div className="text-center py-10">加载中...</div>;
  if (error) return <div className="text-center py-10 text-red-500">错误: {error}</div>;
  if (!doc) return <div className="text-center py-10">文档不存在</div>;

  return (
    <div className="prose max-w-none">
      <h1>{doc.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}