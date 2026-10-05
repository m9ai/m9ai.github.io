'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
  CubeIcon,
} from '@heroicons/react/24/outline';
import Fuse from 'fuse.js';

// 搜索项类型
interface SearchItem {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  type: 'service' | 'doc' | 'page' | 'case' | 'skill';
  category?: string;
  /** 英文站展示用。索引里目前只有 Skill 提供，其余条目回退到中文，行为不变。 */
  titleEn?: string;
  descriptionEn?: string;
  categoryEn?: string;
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
  skill: CubeIcon,
};

// 搜索结果项组件
function SearchResultItem({
  item,
  index,
  isSelected,
  onSelect,
  query,
}: {
  item: TranslatedSearchItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  query: string;
}) {
  const t = useTranslations('search');
  const locale = useLocale();
  const Icon = typeIcons[item.type];

  // 高亮匹配文本
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-inherit rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  /* ARIA 组合模式：外层输入框是 combobox，结果项是它控制的 option。
     role="option" 会覆盖 <a> 的 link 语义，但这里本就是列表项；
     上下键由外层统一处理，所以 tabIndex 设 -1，避免 Tab 逐个穿过所有结果。 */
  return (
    <Link
      href={item.url}
      onClick={onSelect}
      id={`search-option-${index}`}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group outline-none ${
        isSelected
          ? 'bg-primary/20 border border-primary/30 ring-2 ring-primary/40'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          item.type === 'service'
            ? 'bg-gradient-to-br from-sky-600 to-slate-900'
            : item.type === 'doc'
            ? 'bg-gradient-to-br from-green-500 to-teal-600'
            : item.type === 'case'
            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
            : item.type === 'skill'
            ? 'bg-gradient-to-br from-violet-500 to-purple-700'
            : 'bg-gradient-to-br from-slate-700 to-slate-900'
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
            {t(`types.${item.type}`)}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {highlightText(item.translatedDescription, query)}
        </p>
        {item.category && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {locale === 'en' && item.categoryEn ? item.categoryEn : item.category}
          </p>
        )}
      </div>
      <ArrowRightIcon
        className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-all ${
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
  const dialogRef = useRef<HTMLDivElement>(null);
  /* 打开弹窗前的焦点元素，关闭后要还给它 —— 否则键盘用户会被丢回页面顶部 */
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // 加载搜索索引
  useEffect(() => {
    if (!isOpen) return;

    const loadIndex = async () => {
      setIsLoading(true);
      try {
        // no-store 绕过 HTTP 缓存，索引更新后立即生效；Service Worker 层
        // 由 m9ai-sw.js 对 json 的 NetworkFirst 策略兜底，同样是网络优先。
        const response = await fetch('/search-index.json', { cache: 'no-store' });
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
          /* 默认会按「距文本开头的距离」惩罚靠后的匹配，导致只出现在长正文里的词
             （例如 Skill 的分类名、能力描述）搜不出来。搜索场景本就该匹配任意位置，
             实测无意义词仍返回 0 条，不会退化成「搜啥都命中」。 */
          ignoreLocation: true,
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
      const isEn = locale === 'en';
      return {
        ...item,
        translatedTitle: (isEn && item.titleEn) || item.title,
        translatedDescription: (isEn && item.descriptionEn) || item.description,
      };
    },
    [locale]
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

  /* 焦点陷阱用的可聚焦元素集合：只统计当前真实可见的（offsetParent 非空），
     否则会把 display:none 的移动端菜单也算进去，Tab 会跳到看不见的地方。 */
  const focusables = useCallback(() => {
    const root = dialogRef.current;
    if (!root) return [] as HTMLElement[];
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.offsetParent !== null);
  }, []);

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
        case 'Tab': {
          // 焦点陷阱：aria-modal 只挡读屏，挡不住 Tab 键跑到背景内容上
          const items = focusables();
          if (items.length === 0) break;
          const first = items[0];
          const last = items[items.length - 1];
          const active = document.activeElement as HTMLElement | null;
          if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex, locale, focusables]);

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

  /* 打开时：记住来源焦点、锁滚动；关闭时：还原。
     aria-modal 只告诉读屏插件「外面不用管」，背景依然能被 Tab 到、
     也依然能滚动，所以这两件事得手动做，否则移动端会在弹窗背后滚页面。 */
  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        lastFocusedRef.current?.focus?.();
      };
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
          {/* 背景遮罩：纯装饰，不进无障碍树；关闭动作由弹窗内的关闭键承担 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            role="presentation"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* 搜索模态框 */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-[10vh] -translate-x-1/2 w-full max-w-2xl z-[70] px-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* 搜索头部 */}
              <div className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
                <MagnifyingGlassIcon className="w-6 h-6 text-slate-500" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('placeholder')}
                  aria-label={t('placeholder')}
                  /* ARIA 组合模式：输入框是 combobox，结果列表是它控制的 listbox，
                     当前高亮项通过 aria-activedescendant 告知读屏，
                     这样上下键移动高亮时读屏会跟着播报。 */
                  role="combobox"
                  aria-expanded={!!query && results.length > 0}
                  aria-controls="search-results"
                  aria-activedescendant={
                    results.length > 0 ? `search-option-${selectedIndex}` : undefined
                  }
                  className="flex-1 bg-transparent text-lg text-slate-900 dark:text-white placeholder:text-slate-500 outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('clear')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-slate-500" aria-hidden="true" />
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
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p>{t('loading')}</p>
                  </div>
                ) : query && results.length > 0 ? (
                  <div className="p-2">
                    <p className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('results')} ({results.length})
                    </p>
                    <div className="space-y-1" role="listbox" id="search-results" aria-label={t('results')}>
                      {results.map((item, index) => (
                        <SearchResultItem
                          key={item.id}
                          item={item}
                          index={index}
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
                          <link.icon className="w-5 h-5 text-primary" />
                          <span className="text-slate-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-primary">
                            {link.label}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* AI 提示 */}
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/10 border border-primary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CommandLineIcon className="w-5 h-5 text-primary" />
                        <span className="font-medium text-primary dark:text-primary">
                          {t('proTip')}
                        </span>
                      </div>
                      <p className="text-sm text-primary dark:text-primary">
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
