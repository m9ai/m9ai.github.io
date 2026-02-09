'use client';

import { Link } from '@/lib/navigation';
import { motion } from 'motion/react';
import {
  ChevronLeftIcon,
  ClockIcon,
  TagIcon,
  FolderIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { Doc } from '@/lib/docs';
import { useEffect, useState } from 'react';

interface DocContentProps {
  doc: Doc;
  allDocs: Array<{ slug: string; title: string; category: string }>;
}

// 从 HTML 内容中提取标题生成目录
function extractHeadings(htmlContent: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');
  return Array.from(headings).map((heading, index) => ({
    id: heading.id || `heading-${index}`,
    text: heading.textContent || '',
    level: heading.tagName === 'H2' ? 2 : 3,
  }));
}

export default function DocContent({ doc, allDocs }: DocContentProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    // 客户端提取目录
    const extracted = extractHeadings(doc.htmlContent);
    setHeadings(extracted);

    // 监听滚动更新当前标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    extracted.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [doc.htmlContent]);

  // 按分类分组文档
  const docsByCategory = allDocs.reduce((acc, d) => {
    if (!acc[d.category]) acc[d.category] = [];
    acc[d.category].push(d);
    return acc;
  }, {} as Record<string, typeof allDocs>);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      {/* Header Navigation - 固定定位在 Navbar 下方 */}
      <header className="fixed top-16 lg:top-20 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/docs"
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">返回文档列表</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-indigo-600 transition-colors">首页</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <Link href="/docs" className="hover:text-indigo-600 transition-colors">文档中心</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-slate-900 dark:text-white font-medium">{doc.category}</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧边栏 - 文档导航 */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-indigo-500" />
                  文档导航
                </h3>
                <nav className="space-y-4">
                  {Object.entries(docsByCategory).map(([category, docs]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {category}
                      </h4>
                      <ul className="space-y-1">
                        {docs.map((d) => (
                          <li key={d.slug}>
                            <Link
                              href={`/docs/${d.slug}`}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                d.slug === doc.slug
                                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {d.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* 中间主要内容 */}
          <main className="lg:col-span-7">
            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                  <FolderIcon className="w-3.5 h-3.5" />
                  {doc.category}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <ClockIcon className="w-4 h-4" />
                  更新于 {doc.updatedAt}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {doc.title}
              </h1>

              {/* Description */}
              {doc.description && (
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {doc.description}
                </p>
              )}

              {/* Tags */}
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <TagIcon className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-wrap gap-2">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div
                className="prose dark:prose-invert max-w-none
                  prose-headings:scroll-mt-24
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-8 prose-h1:text-slate-900 dark:prose-h1:text-white
                  prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-700 prose-h2:pb-3
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-slate-800 dark:prose-h3:text-slate-200
                  prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-code:text-rose-600 dark:prose-code:text-rose-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-5 prose-pre:rounded-xl prose-pre:overflow-x-auto
                  prose-pre:code:text-inherit prose-pre:code:bg-transparent prose-pre:code:p-0
                  prose-ul:my-6 prose-ul:space-y-2
                  prose-ol:my-6 prose-ol:space-y-2
                  prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:marker:text-indigo-500
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-900/20 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
                  prose-hr:border-slate-200 dark:prose-hr:border-slate-700
                  prose-table:w-full prose-table:border-collapse
                  prose-th:border prose-th:border-slate-200 dark:prose-th:border-slate-700 prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
                  prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-700 prose-td:px-4 prose-td:py-2"
                dangerouslySetInnerHTML={{ __html: doc.htmlContent }}
              />
            </motion.article>

            {/* Navigation Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-700"
            >
              <Link
                href="/docs"
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>返回文档列表</span>
              </Link>
            </motion.div>
          </main>

          {/* 右侧边栏 - 目录 */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              {headings.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                    目录
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((heading) => (
                      <Link
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm transition-colors py-1 ${
                          heading.level === 2 ? 'pl-0' : 'pl-4'
                        } ${
                          activeHeading === heading.id
                            ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {heading.text}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
