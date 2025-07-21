'use client';

import { useState, useEffect } from 'react';
import { getDocById, processMarkdown } from '@/app/lib/docs';
import { DocData } from '@/app/lib/docs';
import { useTranslations } from 'next-intl';

export default function DocsHomePage() {
  const t = useTranslations('Docs');
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
          setError(t('errors.notFound'));
          return;
        }
        setDoc(document);
        const html = await processMarkdown(document.content);
        setHtmlContent(html);
      } catch (err) {
        setError(t('errors.loadFailed'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultDoc();
  }, [t]);

  if (loading) return <div className="text-center py-10">{t('loading')}</div>;
  if (error) return <div className="text-center py-10 text-red-500">{t('errors.title')}: {error}</div>;
  if (!doc) return <div className="text-center py-10">{t('errors.notFound')}</div>;

  return (
    <div className="prose max-w-none">
      <h1>{doc.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}