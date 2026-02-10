'use client';

import { useState, useEffect } from 'react';
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

// 文档数据类型
interface Doc {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  updatedAt: string;
}

// 示例文档数据
const docsData: Doc[] = [
  {
    id: 'introduction',
    title: '欢迎使用水杉智境',
    description: '了解水杉智境工作室的核心服务和快速开始指南',
    category: '入门',
    tags: ['intro', 'guide'],
    updatedAt: '2025-02-09',
  },
  {
    id: 'model-deployment',
    title: '模型部署指南',
    description: '了解如何在本地或私有云环境中部署大语言模型',
    category: '技术文档',
    tags: ['deployment', 'llm'],
    updatedAt: '2025-02-09',
  },
  {
    id: 'knowledge-base',
    title: '本地知识库搭建',
    description: '学习如何构建企业级本地知识库，实现私有数据的智能检索与问答',
    category: '进阶教程',
    tags: ['knowledge', 'rag', 'vector-db'],
    updatedAt: '2025-02-09',
  },
  {
    id: 'workflow',
    title: 'AI 工作流搭建实战',
    description: '使用可视化工具搭建自动化 AI 工作流，提升业务效率',
    category: '进阶教程',
    tags: ['workflow', 'automation', 'dify'],
    updatedAt: '2025-02-09',
  },
  {
    id: 'prompt-engineering',
    title: '提示词工程最佳实践',
    description: '掌握提示词设计技巧，提升大模型输出质量与可靠性',
    category: '进阶教程',
    tags: ['prompt', 'llm', 'optimization'],
    updatedAt: '2025-02-09',
  },
  {
    id: 'api-integration',
    title: 'API 集成开发指南',
    description: '学习如何将大模型能力集成到您的应用程序中',
    category: '开发指南',
    tags: ['api', 'sdk', 'integration'],
    updatedAt: '2025-02-09',
  },
  {
    id: 'api-reference',
    title: 'API 参考文档',
    description: '查看我们提供的 API 接口文档和示例代码',
    category: '开发指南',
    tags: ['api', 'reference'],
    updatedAt: '2025-02-09',
  },
  {
    id: 'faq',
    title: '常见问题',
    description: '查看用户最常问的问题和解答',
    category: '帮助',
    tags: ['faq', 'help'],
    updatedAt: '2025-02-09',
  },
];

// 获取所有分类
const getCategories = (): string[] => {
  return ['全部', ...Array.from(new Set(docsData.map(doc => doc.category)))];
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [filteredDocs, setFilteredDocs] = useState<Doc[]>(docsData);

  const categories = getCategories();

  // 过滤文档
  useEffect(() => {
    let docs = docsData;

    // 按分类过滤
    if (selectedCategory !== '全部') {
      docs = docs.filter((doc) => doc.category === selectedCategory);
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
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* 头部区域 */}
      <div className="relative bg-slate-50 dark:bg-slate-900 pt-24 pb-16 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
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
              文档中心
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              探索我们的产品文档、使用指南和技术参考
            </p>

            {/* 搜索框 */}
            <div className="relative max-w-xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索文档..."
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
          {categories.map((category) => (
            <CategoryTag
              key={category}
              category={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
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
                未找到文档
              </h3>
              <p className="text-slate-500">
                尝试调整搜索词或选择其他分类
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
