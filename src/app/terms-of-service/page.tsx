'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TermsOfServicePage() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch('/docs/terms-of-service.md');
        if (!response.ok) throw new Error('Failed to load terms of service');
        const content = await response.text();
        setMarkdownContent(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, []);

  if (isLoading) return <div className='container mx-auto p-8'>Loading terms of service...</div>;
  if (error) return <div className='container mx-auto p-8 text-red-500'>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4 md:p-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-8 text-slate-800 dark:text-white'>服务条款</h1>
      <div className='prose prose-lg max-w-none dark:prose-invert'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
}