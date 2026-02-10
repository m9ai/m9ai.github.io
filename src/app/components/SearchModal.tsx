'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CommandLineIcon,
  XMarkIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowRightIcon,
  CpuChipIcon,
  BookOpenIcon,
  HomeIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import Fuse from 'fuse.js';

// 搜索项类型
interface SearchItem {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  type: 'service' | 'doc' | 'page';
  category?: string;
  tags?: string[];
}

// 带翻译的搜索项
interface TranslatedSearchItem extends SearchItem {
  translatedTitle: string;
  translatedDescription: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 类型图标映射
const typeIcons = {
  service: SparklesIcon,
  doc: DocumentTextIcon,
  page: HomeIcon,
  case: FolderIcon,
};

// 类型标签映射
const typeLabels = {
  service: '服务',
  doc: '文档',
  page: '页面',
  case: '案例',
};

// 搜索结果项组件
function SearchResultItem({
  item,
  isSelected,
  onSelect,
  query,
}: {
  item: TranslatedSearchItem;
  isSelected: boolean;
  onSelect: () => void;
  query: string;
}) {
  const Icon = typeIcons[item.type];

  // 高亮匹配文本
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-indigo-500/30 text-inherit rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Link
      href={item.url}
      onClick={onSelect}
      className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group ${
        isSelected
          ? 'bg-indigo-500/20 border border-indigo-500/30'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          item.type === 'service'
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
            : item.type === 'doc'
            ? 'bg-gradient-to-br from-green-500 to-teal-600'
            : item.type === 'case'
            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
            : 'bg-gradient-to-br from-slate-500 to-slate-600'
        }`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {highlightText(item.translatedTitle, query)}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {typeLabels[item.type]}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {highlightText(item.translatedDescription, query)}
        </p>
        {item.category && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {item.category}
          </p>
        )}
      </div>
      <ArrowRightIcon
        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-all ${
          isSelected
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
        }`}
      />
    </Link>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations('search');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TranslatedSearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // 加载搜索索引
  useEffect(() => {
    if (!isOpen) return;

    const loadIndex = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();

        // 初始化 Fuse.js
        const fuseInstance = new Fuse<SearchItem>(data, {
          keys: [
            { name: 'title', weight: 0.4 },
            { name: 'description', weight: 0.3 },
            { name: 'content', weight: 0.2 },
            { name: 'tags', weight: 0.1 },
          ],
          threshold: 0.4,
          includeScore: true,
          minMatchCharLength: 1,
        });
        setFuse(fuseInstance);
      } catch (error) {
        console.error('Failed to load search index:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIndex();
  }, [isOpen]);

  // 翻译搜索项（索引已包含翻译后的文本）
  const translateItem = useCallback(
    (item: SearchItem): TranslatedSearchItem => {
      return {
        ...item,
        translatedTitle: item.title,
        translatedDescription: item.description,
      };
    },
    []
  );

  // 执行搜索
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query).slice(0, 8);
    const translatedResults = searchResults.map((result) =>
      translateItem(result.item)
    );
    setResults(translatedResults);
    setSelectedIndex(0);
  }, [query, fuse, translateItem]);

  // 快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            window.location.href = `/${locale}${results[selectedIndex].url}`;
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex, locale]);

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // 重置状态
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 快捷链接
  const quickLinks = [
    { icon: SparklesIcon, label: t('quickLinks.services'), url: '/services' },
    { icon: BookOpenIcon, label: t('quickLinks.docs'), url: '/docs' },
    { icon: ShoppingBagIcon, label: t('quickLinks.store'), url: '/store' },
    { icon: EnvelopeIcon, label: t('quickLinks.contact'), url: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* 搜索模态框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-[10vh] -translate-x-1/2 w-full max-w-2xl z-[70] px-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* 搜索头部 */}
              <div className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
                <MagnifyingGlassIcon className="w-6 h-6 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('placeholder')}
                  className="flex-1 bg-transparent text-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-slate-400" />
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm">
                  <kbd className="font-sans">ESC</kbd>
                </div>
              </div>

              {/* 搜索内容 */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p>{t('loading')}</p>
                  </div>
                ) : query && results.length > 0 ? (
                  <div className="p-2">
                    <p className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('results')} ({results.length})
                    </p>
                    <div className="space-y-1">
                      {results.map((item, index) => (
                        <SearchResultItem
                          key={item.id}
                          item={item}
                          isSelected={index === selectedIndex}
                          onSelect={onClose}
                          query={query}
                        />
                      ))}
                    </div>
                  </div>
                ) : query ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      {t('noResults')}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t('tryDifferentKeywords')}
                    </p>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {t('quickAccess')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickLinks.map((link) => (
                        <Link
                          key={link.url}
                          href={link.url}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <link.icon className="w-5 h-5 text-indigo-500" />
                          <span className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {link.label}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* AI 提示 */}
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CommandLineIcon className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-indigo-900 dark:text-indigo-300">
                          {t('proTip')}
                        </span>
                      </div>
                      <p className="text-sm text-indigo-700 dark:text-indigo-400">
                        {t('proTipContent')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部提示 */}
              <div className="hidden sm:flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                      ↓
                    </kbd>
                    <span>{t('navigate')}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                      ↵
                    </kbd>
                    <span>{t('select')}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CpuChipIcon className="w-4 h-4" />
                  <span>{t('poweredBy')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
