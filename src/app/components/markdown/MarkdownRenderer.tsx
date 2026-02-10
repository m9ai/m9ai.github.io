'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Components } from 'react-markdown';
import type { Pluggable } from 'unified';
import CodeBlock from './CodeBlock';
import MermaidChart from './MermaidChart';
import VideoPlayer from './VideoPlayer';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 自定义 Markdown 组件
const components: Components = {
  // 代码块/行内代码处理 - 支持 mermaid 和普通代码
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    // 有 language 说明是代码块
    if (className) {
      // Mermaid 流程图
      if (language === 'mermaid') {
        return <MermaidChart code={code} />;
      }

      // 视频嵌入
      if (language === 'video') {
        return <VideoPlayer src={code} />;
      }

      // 普通代码块
      return <CodeBlock language={language} code={code} {...props} />;
    }

    // 无 className 说明是行内代码
    return (
      <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-rose-600 dark:text-rose-400 rounded text-sm font-mono">
        {children}
      </code>
    );
  },

  // 标题
  h1({ children, id }) {
    return (
      <h1 id={id} className="text-3xl font-bold mb-8 text-slate-900 dark:text-white scroll-mt-24">
        {children}
      </h1>
    );
  },

  h2({ children, id }) {
    return (
      <h2
        id={id}
        className="text-2xl font-semibold mt-12 mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3 scroll-mt-24"
      >
        {children}
      </h2>
    );
  },

  h3({ children, id }) {
    return (
      <h3 id={id} className="text-xl font-semibold mt-8 mb-3 text-slate-800 dark:text-slate-200 scroll-mt-24">
        {children}
      </h3>
    );
  },

  // 段落
  p({ children }) {
    return <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{children}</p>;
  },

  // 链接
  a({ children, href }) {
    return (
      <a
        href={href}
        className="text-indigo-600 dark:text-indigo-400 no-underline hover:underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },

  // 列表
  ul({ children }) {
    return <ul className="my-6 space-y-2 list-disc list-inside">{children}</ul>;
  },

  ol({ children }) {
    return <ol className="my-6 space-y-2 list-decimal list-inside">{children}</ol>;
  },

  li({ children }) {
    return <li className="text-slate-600 dark:text-slate-300 marker:text-indigo-500">{children}</li>;
  },

  // 引用块
  blockquote({ children }) {
    return (
      <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 pl-4 py-2 pr-4 rounded-r-lg italic my-6">
        {children}
      </blockquote>
    );
  },

  // 表格
  table({ children }) {
    return (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse">{children}</table>
      </div>
    );
  },

  thead({ children }) {
    return <thead className="bg-slate-50 dark:bg-slate-800">{children}</thead>;
  },

  th({ children }) {
    return (
      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-semibold">
        {children}
      </th>
    );
  },

  td({ children }) {
    return (
      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{children}</td>
    );
  },

  // 分隔线
  hr() {
    return <hr className="border-slate-200 dark:border-slate-700 my-8" />;
  },

  // 强调
  strong({ children }) {
    return <strong className="text-slate-900 dark:text-white font-semibold">{children}</strong>;
  },

  // 图片
  img({ src, alt }) {
    return (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-xl my-6"
        loading="lazy"
      />
    );
  },
};

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const remarkPlugins = useMemo(() => [remarkGfm, remarkDirective], []);
  const rehypePlugins = useMemo<Pluggable[]>(
    () => [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor-link'] } }],
    ],
    []
  );

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
