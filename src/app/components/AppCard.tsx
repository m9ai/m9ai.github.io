'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { App } from '@/data/apps';
import { 
  StarIcon,
  ArrowTopRightOnSquareIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Link } from '@/lib/navigation';

interface AppCardProps {
  app: App;
  viewMode?: 'grid' | 'list';
  index?: number;
}

// Category colors
const categoryColors: Record<string, string> = {
  tools: 'bg-sky-100 text-primary dark:bg-sky-900/30 dark:text-sky-300',
  creativity: 'bg-slate-100 text-primary dark:bg-slate-800/30 dark:text-primary',
  development: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  business: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
};

// Type colors
const typeColors: Record<string, string> = {
  miniProgram: 'bg-sky-100 text-primary dark:bg-sky-900/30 dark:text-sky-300',
  h5: 'bg-slate-100 text-primary dark:bg-slate-800/30 dark:text-primary',
  app: 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary',
};

// Render star rating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative">
          <StarIcon className="w-4 h-4 text-slate-200 dark:text-slate-700" />
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${Math.max(0, Math.min(100, (rating - star + 1) * 100))}%` }}
          >
            <StarIconSolid className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      ))}
      <span className="ml-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function AppCard({ app, viewMode = 'grid', index = 0 }: AppCardProps) {
  const t = useTranslations('Store');
  const features = t.raw(`apps.${app.id}.features`) as string[];
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all shadow-card hover:shadow-soft"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
            <RocketLaunchIcon className="w-8 h-8 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {t(`apps.${app.id}.name`)}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[app.type] || 'bg-slate-100 text-slate-600'}`}>
                {t(`types.${app.type}`)}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[app.category] || 'bg-slate-100 text-slate-600'}`}>
                {t(`categories.${app.category}`)}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
              {t(`apps.${app.id}.description`)}
            </p>
            <StarRating rating={app.rating} />
          </div>

          {/* Action */}
          <Link
            href={app.url}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl font-medium text-sm transition-all"
          >
            <span className="hidden sm:inline">{t('card.view')}</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated">
        {/* Image/Screenshot area */}
        <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <RocketLaunchIcon className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${typeColors[app.type] || 'bg-white/80 text-slate-700'}`}>
              {t(`types.${app.type}`)}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${categoryColors[app.category] || 'bg-white/80 text-slate-700'}`}>
              {t(`categories.${app.category}`)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
              {t(`apps.${app.id}.name`)}
            </h3>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-10">
            {t(`apps.${app.id}.description`)}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between mb-4">
            <StarRating rating={app.rating} />
            <span className="text-xs text-slate-400">
              {t('card.featureCount', { count: features.length })}
            </span>
          </div>

          {/* Features preview */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {features.slice(0, 2).map((feature, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg"
              >
                {feature}
              </span>
            ))}
            {features.length > 2 && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-400 text-xs rounded-lg">
                +{features.length - 2}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={app.url}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-medium text-sm hover:bg-primary transition-colors group/btn"
          >
            <span>{t('card.details')}</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
