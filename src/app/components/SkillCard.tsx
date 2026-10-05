'use client';

import { motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import type { Skill, SkillCategory } from '@/data/skills';
import { cliInstallCommand, isInstallable } from '@/data/skills';
import CommandLine from '@/app/components/CommandLine';
import {
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CommandLineIcon,
  DocumentIcon,
  FolderIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@/lib/navigation';

interface SkillCardProps {
  skill: Skill;
  viewMode?: 'grid' | 'list';
  index?: number;
}

/** 每个分类一个图标，取代旧版所有卡片共用同一个火箭图标的做法。 */
export const categoryIcons: Record<SkillCategory, typeof FolderIcon> = {
  finance: BanknotesIcon,
  legal: ScaleIcon,
  data: ChartBarIcon,
  content: ShieldCheckIcon,
  files: FolderIcon,
  document: DocumentIcon,
  devops: CommandLineIcon,
  travel: PaperAirplaneIcon,
  life: SparklesIcon,
};

const categoryColors: Record<SkillCategory, string> = {
  finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  legal: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  data: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  content: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  files: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  document: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  devops: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  travel: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  life: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
};

const statusColors: Record<Skill['status'], string> = {
  available: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  developing: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  planned: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
};

export default function SkillCard({ skill, viewMode = 'grid', index = 0 }: SkillCardProps) {
  const t = useTranslations('Store');
  const locale = useLocale();
  const copy = locale === 'en' ? skill.en : skill.zh;
  const Icon = categoryIcons[skill.category];

  // 未发布的条目不展示安装命令，避免给出跑不通的指令
  const installable = isInstallable(skill);
  const cliCommand = cliInstallCommand(skill);

  const StatusBadge = ({ className = '' }: { className?: string }) => (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[skill.status]} ${className}`}
    >
      {t(`status.${skill.status}`)}
    </span>
  );

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all shadow-card hover:shadow-soft"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {copy.name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[skill.category]}`}
              >
                {t(`categories.${skill.category}`)}
              </span>
              <StatusBadge />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
              {copy.tagline}
            </p>
            {installable && (
              <div className="mt-2 max-w-xl">
                <CommandLine command={cliCommand} variant="compact" />
              </div>
            )}
          </div>

          <Link
            href={`/apps/${skill.id}`}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl font-medium text-sm transition-all"
          >
            <span className="hidden sm:inline">{t('card.details')}</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated">
        {/* 图标区 */}
        <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>

          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${categoryColors[skill.category]}`}
            >
              {t(`categories.${skill.category}`)}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <StatusBadge className="backdrop-blur-sm" />
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {copy.name}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 min-h-[2.5rem]">
            {copy.tagline}
          </p>

          {/* 场景标签 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {copy.scenarios.map((scenario) => (
              <span
                key={scenario}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg"
              >
                {scenario}
              </span>
            ))}
          </div>

          {/* 可验证的结构性信号，取代原先编造的评分 */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <span className="inline-flex items-center gap-1">
              <LockClosedIcon className="w-3.5 h-3.5" />
              {t('privacy.localOnly')}
            </span>
            <span className="inline-flex items-center gap-1">
              <WifiIcon className="w-3.5 h-3.5" />
              {t(`offline.${skill.offline}`)}
            </span>
            <span>{t(`runtime.${skill.runtime}`)}</span>
          </div>

          {/* 这一行对已发布与未发布条目都占同样高度，避免网格里只有一张卡片带命令、密度不齐 */}
          <div className="mb-3">
            {installable ? (
              <CommandLine command={cliCommand} variant="compact" />
            ) : (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <ClockIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {t('card.installPending')}
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto">
            <Link
              href={`/apps/${skill.id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-medium text-sm hover:bg-primary transition-colors group/btn"
            >
              <span>{t('card.details')}</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
