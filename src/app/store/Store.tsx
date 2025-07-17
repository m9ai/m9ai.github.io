'use client';

import { useState } from 'react';
import AppCard from '../components/AppCard';
import { apps } from '@/data/apps';
import { MagnifyingGlassIcon as SearchIcon, AdjustmentsHorizontalIcon as SlidersHorizontalIcon } from '@heroicons/react/24/outline';

const APP_TYPES = ['全部', '小程序', 'H5', 'App'] as const;
const CATEGORIES = ['全部', '工具', '创意', '开发', '商务'] as const;

type AppType = typeof APP_TYPES[number];
type Category = typeof CATEGORIES[number];

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AppType>('全部');
  const [selectedCategory, setSelectedCategory] = useState<Category>('全部');

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
            水杉智境应用商店
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            探索我们开发的AI应用，提升您的工作效率和创造力
          </p>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="relative max-w-md w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索应用..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AppType)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {APP_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <SlidersHorizontalIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <SlidersHorizontalIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 应用列表 */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-500 dark:text-slate-400">未找到匹配的应用</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('全部');
                setSelectedCategory('全部');
              }}
              className="mt-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </main>
    </div>
  );
}