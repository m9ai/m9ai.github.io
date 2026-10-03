'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link } from '@/lib/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// 文档卡片用的最终数据形态
interface Doc {
  id: string;
  title: string;
  description: string;
  categoryKey: string;
  category: string;
  tags?: string[];
  updatedAt: string;
}

/* 文档元数据。
   标题 / 描述 / 分类名此前直接写死中文，英文站会漏中文，且与 Docs 命名空间里
   已经存在的 categories 文案重复。这里只保留与语言无关的部分，
   展示文案统一从 Docs.items.<id>.* 取。 */
const docsMeta: Array<Omit<Doc, 'title' | 'description' | 'category'>> = [
  { id: 'introduction', categoryKey: 'gettingStarted', tags: ['intro', 'guide'], updatedAt: '2025-02-09' },
  { id: 'model-deployment', categoryKey: 'technical', tags: ['deployment', 'llm'], updatedAt: '2025-02-09' },
  { id: 'knowledge-base', categoryKey: 'advanced', tags: ['knowledge', 'rag', 'vector-db'], updatedAt: '2025-02-09' },
  { id: 'workflow', categoryKey: 'advanced', tags: ['workflow', 'automation', 'dify'], updatedAt: '2025-02-09' },
  { id: 'prompt-engineering', categoryKey: 'advanced', tags: ['prompt', 'llm', 'optimization'], updatedAt: '2025-02-09' },
  { id: 'api-integration', categoryKey: 'developmentGuide', tags: ['api', 'sdk', 'integration'], updatedAt: '2025-02-09' },
  { id: 'api-reference', categoryKey: 'developmentGuide', tags: ['api', 'reference'], updatedAt: '2025-02-09' },
  { id: 'faq', categoryKey: 'help', tags: ['faq', 'help'], updatedAt: '2025-02-09' },
];

// 分类筛选用 key（'all' 为占位，文案取 Docs.categories.all）
const ALL_CATEGORY = 'all';

// 文档卡片组件
function DocCard({ doc }: { doc: Doc }) {
  return (
    <Link href={`/docs/${doc.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all shadow-card hover:shadow-elevated"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
              {doc.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {doc.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <FolderIcon className="w-3 h-3" />
                {doc.category}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {doc.updatedAt}
              </span>
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
        </div>
      </motion.div>
    </Link>
  );
}

// 分类标签组件
function CategoryTag({
  category,
  isActive,
  onClick,
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {category}
    </button>
  );
}

// 主文档页面组件
export default function DocsHomePage() {
  const t = useTranslations('Docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);

  // 文案按当前 locale 解析。docsData 放进依赖，切换语言时能重新计算而不是沿用旧译文
  const docsData = useMemo<Doc[]>(
    () =>
      docsMeta.map((meta) => ({
        ...meta,
        title: t(`items.${meta.id}.title`),
        description: t(`items.${meta.id}.description`),
        category: t(`categories.${meta.categoryKey}`),
      })),
    [t]
  );

  const categoryKeys = useMemo(
    () => [ALL_CATEGORY, ...Array.from(new Set(docsMeta.map((doc) => doc.categoryKey)))],
    []
  );

  const [filteredDocs, setFilteredDocs] = useState<Doc[]>(docsData);

  // 过滤文档
  useEffect(() => {
    let docs = docsData;

    // 按分类过滤
    if (selectedCategory !== ALL_CATEGORY) {
      docs = docs.filter((doc) => doc.categoryKey === selectedCategory);
    }

    // 按搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      docs = docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredDocs(docs);
  }, [selectedCategory, searchQuery, docsData]);

  return (
    <div className="min-h-screen">
      {/* 头部区域 */}
      <div className="relative bg-slate-50 dark:bg-slate-900 pt-24 pb-16 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-800/10 dark:bg-slate-800/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90 text-sm font-medium mb-4">
              Documentation
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {t('hero.description')}
            </p>

            {/* 搜索框 */}
            <div className="relative max-w-xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 shadow-soft dark:shadow-none"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 分类过滤器 */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categoryKeys.map((key) => (
            <CategoryTag
              key={key}
              category={t(`categories.${key}`)}
              isActive={selectedCategory === key}
              onClick={() => setSelectedCategory(key)}
            />
          ))}
        </div>

        {/* 文档列表 */}
        <AnimatePresence mode="wait">
          {filteredDocs.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDocs.map((doc) => (
                <DocCard key={doc.id} doc={doc} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {t('search.noResults')}
              </h3>
              <p className="text-slate-500">
                {t('search.tryDifferent')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
