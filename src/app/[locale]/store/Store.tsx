'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import AppCard from '@/app/components/AppCard';
import { apps } from '@/data/apps';
import { MagnifyingGlassIcon as SearchIcon, AdjustmentsHorizontalIcon as SlidersHorizontalIcon } from '@heroicons/react/24/outline';

// 国际化分类定义
const APP_TYPES = {
  all: 'types.all',
  miniProgram: 'types.miniProgram',
  h5: 'types.h5',
  app: 'types.app'
};

const CATEGORIES = {
  all: 'categories.all',
  tools: 'categories.tools',
  creativity: 'categories.creativity',
  development: 'categories.development',
  business: 'categories.business'
};

export default function StorePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('Store');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 应用筛选逻辑
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === '全部' || app.type === selectedType;
    const matchesCategory = selectedCategory === '全部' || app.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* 搜索区域 */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="relative max-w-md w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 筛选下拉框 */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t(APP_TYPES.all)}</option>
                <option value="miniProgram">{t(APP_TYPES.miniProgram)}</option>
                <option value="h5">{t(APP_TYPES.h5)}</option>
                <option value="app">{t(APP_TYPES.app)}</option>
              </select>
              <SlidersHorizontalIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t(CATEGORIES.all)}</option>
                <option value="tools">{t(CATEGORIES.tools)}</option>
                <option value="creativity">{t(CATEGORIES.creativity)}</option>
                <option value="development">{t(CATEGORIES.development)}</option>
                <option value="business">{t(CATEGORIES.business)}</option>
              </select>
              <SlidersHorizontalIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 应用列表区域 */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-500 dark:text-slate-400">{t('noAppsFound')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedCategory('all');
              }}
              className="mt-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}