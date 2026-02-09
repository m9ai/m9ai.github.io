'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import AppCard from '@/app/components/AppCard';
import { apps } from '@/data/apps';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

// Filter options types
const APP_TYPES = ['all', 'miniProgram', 'h5', 'app'] as const;
const CATEGORIES = ['all', 'tools', 'creativity', 'development', 'business'] as const;
type AppType = typeof APP_TYPES[number];
type Category = typeof CATEGORIES[number];

// Map translation keys to data values
const TYPE_MAP: Record<string, string> = {
  miniProgram: '小程序',
  h5: 'H5',
  app: 'App',
};

const CATEGORY_MAP: Record<string, string> = {
  tools: '工具',
  creativity: '创意',
  development: '开发',
  business: '商务',
};

export default function StorePage() {
  const t = useTranslations('Store');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AppType>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter apps based on criteria
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        selectedType === 'all' || 
        app.type === TYPE_MAP[selectedType];
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        app.category === CATEGORY_MAP[selectedCategory];

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchQuery, selectedType, selectedCategory]);

  // Active filters count
  const activeFiltersCount = 
    (selectedType !== 'all' ? 1 : 0) + 
    (selectedCategory !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-slate-50 dark:from-primary/20 dark:via-primary/10 dark:to-slate-900 pt-32 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              AI Applications
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t('description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filters bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-20 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 shadow-soft border border-slate-200 dark:border-slate-700 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Type filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as AppType)}
                  className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer min-w-[120px]"
                >
                  {APP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`types.${type}`)}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Category filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                  className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer min-w-[120px]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Clear filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  {t('clearFilters')}
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500">
            <span>
              {t('showingResults', { count: filteredApps.length, total: apps.length }) || 
                `Showing ${filteredApps.length} of ${apps.length} apps`}
            </span>
            {(selectedType !== 'all' || selectedCategory !== 'all') && (
              <div className="flex items-center gap-2">
                <span>Active filters:</span>
                <div className="flex gap-2">
                  {selectedType !== 'all' && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {t(`types.${selectedType}`)}
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md text-xs">
                      {t(`categories.${selectedCategory}`)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Apps grid/list */}
        <AnimatePresence mode="wait">
          {filteredApps.length > 0 ? (
            <motion.div
              key={`${viewMode}-${selectedType}-${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredApps.map((app, index) => (
                <AppCard 
                  key={app.id} 
                  app={app} 
                  viewMode={viewMode}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {t('noAppsFound')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {t('tryAdjustingFilters') || 'Try adjusting your search or filters'}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
              >
                {t('clearFilters')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
