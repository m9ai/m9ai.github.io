'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchModal from './SearchModal';

export default function SearchButton() {
  const t = useTranslations('search');
  const [isOpen, setIsOpen] = useState(false);

  // 监听快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* 桌面端搜索按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all group"
      >
        <MagnifyingGlassIcon className="w-4 h-4" />
        <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
          {t('buttonLabel')}
        </span>
        <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-sans bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* 移动端搜索按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
        aria-label={t('buttonLabel')}
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
