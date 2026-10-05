'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import SkillCard from '@/app/components/SkillCard';
import {
  skillCategories,
  skillRoles,
  skillStatuses,
  skills,
} from '@/data/skills';
import type { SkillCategory, SkillRole, SkillStatus } from '@/data/skills';
import { motion, AnimatePresence } from 'motion/react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

type CategoryFilter = 'all' | SkillCategory;
type RoleFilter = 'all' | SkillRole;
type StatusFilter = 'all' | SkillStatus;

export default function StorePage() {
  const t = useTranslations('Store');
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 中英两套文案都参与匹配，否则在英文站搜中文原名会永远搜不到
  const filteredSkills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return skills.filter((skill) => {
      const haystack = [skill.zh, skill.en]
        .flatMap((c) => [c.name, c.tagline, c.description, ...c.capabilities, ...c.scenarios])
        .join(' ')
        .toLowerCase();

      return (
        haystack.includes(query) &&
        (selectedCategory === 'all' || skill.category === selectedCategory) &&
        (selectedRole === 'all' || skill.roles.includes(selectedRole)) &&
        (selectedStatus === 'all' || skill.status === selectedStatus)
      );
    });
  }, [searchQuery, selectedCategory, selectedRole, selectedStatus]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedRole !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRole('all');
    setSelectedStatus('all');
  };

  // select 的通用样式
  const selectClass =
    'appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer min-w-[120px]';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
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
              {t('badge')}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">{t('description')}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索与筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-20 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 shadow-soft border border-slate-200 dark:border-slate-700 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* 分类 */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
                  className={selectClass}
                >
                  <option value="all">{t('categories.all')}</option>
                  {skillCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* 适用角色 */}
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as RoleFilter)}
                  className={selectClass}
                >
                  <option value="all">{t('roles.all')}</option>
                  {skillRoles.map((role) => (
                    <option key={role} value={role}>
                      {t(`roles.${role}`)}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* 交付状态 */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
                  className={selectClass}
                >
                  <option value="all">{t('status.all')}</option>
                  {skillStatuses.map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* 视图切换 */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label={t('view.grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-600'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label={t('view.list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-600'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

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

          {/* 结果统计 */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500">
            <span>{t('showingResults', { count: filteredSkills.length, total: skills.length })}</span>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span>{t('activeFilters')}</span>
                <div className="flex gap-2 flex-wrap">
                  {selectedCategory !== 'all' && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {t(`categories.${selectedCategory}`)}
                    </span>
                  )}
                  {selectedRole !== 'all' && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {t(`roles.${selectedRole}`)}
                    </span>
                  )}
                  {selectedStatus !== 'all' && (
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md text-xs">
                      {t(`status.${selectedStatus}`)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 列表 */}
        <AnimatePresence mode="wait">
          {filteredSkills.length > 0 ? (
            <motion.div
              key={`${viewMode}-${selectedCategory}-${selectedRole}-${selectedStatus}-${searchQuery}`}
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
              {filteredSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} viewMode={viewMode} index={index} />
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
                {t('noSkillsFound')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {t('tryAdjustingFilters')}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
              >
                {t('clearFilters')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 说明：避免「市集」被误读为交易货架 */}
        <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          {t('footnote')}
        </p>
      </div>
    </div>
  );
}
