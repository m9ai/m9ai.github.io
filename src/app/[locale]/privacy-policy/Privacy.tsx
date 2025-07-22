'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'next/navigation';
import remarkGfm from 'remark-gfm';

export default function PrivacyPolicyPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const markdownUrl = locale === 'en' ? '/docs/privacy-policy-en.md' : '/docs/privacy-policy.md';
        const response = await fetch(markdownUrl);
        if (!response.ok) throw new Error('Failed to load privacy policy');
        const content = await response.text();
        setMarkdownContent(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [locale]);

  if (isLoading) return <div className='container mx-auto p-8'>Loading privacy policy...</div>;
  if (error) return <div className='container mx-auto p-8 text-red-500'>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4 md:p-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-8 text-slate-800 dark:text-white'>{locale === 'en' ? 'Privacy Policy' : '隐私政策'}</h1>
      <div className='prose prose-lg max-w-none dark:prose-invert'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
}