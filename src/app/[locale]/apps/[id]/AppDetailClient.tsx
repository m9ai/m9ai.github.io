'use client';

import { Link } from '@/lib/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  StarIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import type { App } from '@/data/apps';

interface AppDetailClientProps {
  app: App;
}

export default function AppDetailClient({ app }: AppDetailClientProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      {/* Header Navigation */}
      <header className="fixed top-16 lg:top-20 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/store"
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">返回应用商店</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-indigo-600 transition-colors">首页</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <Link href="/store" className="hover:text-indigo-600 transition-colors">应用商店</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-slate-900 dark:text-white font-medium">{app.name}</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* App Icon */}
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
              </div>

              {/* App Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                    {app.category}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm">
                    {app.type}
                  </span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm">
                    <StarIcon className="w-4 h-4" />
                    <span className="font-medium">{app.rating}</span>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {app.name}
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {app.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors">
                    <PlayIcon className="w-5 h-5" />
                    立即体验
                  </button>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    访问应用
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">核心功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {app.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Screenshots Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">应用截图</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {app.screenshotUrls.map((url, index) => (
              <div
                key={index}
                className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden"
              >
                {/* Placeholder for screenshot */}
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span className="text-sm">截图 {index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
