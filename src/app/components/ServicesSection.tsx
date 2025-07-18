'use client';

import { CommandLineIcon, CpuChipIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicesSection() {
  return (
    <section id='services' className='py-20 bg-white dark:bg-slate-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>我们的核心服务</h2>
          <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
            提供全方位的 AI 应用开发解决方案，满足不同场景需求
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* 服务卡片 1 */}
          <div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow group'>
            <div className='w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors'>
              <CpuChipIcon className='w-6 h-6' />
            </div>
            <h3 className='text-xl font-semibold mb-3'>大模型私有化部署</h3>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              提供主流大模型的本地化部署方案，保障数据安全与隐私，支持自定义微调与性能优化
            </p>
            <Link href='#deploy' className='text-emerald-600 dark:text-emerald-400 font-medium hover:underline'>
              了解更多 →
            </Link>
          </div>

          {/* 服务卡片 2 */}
          <div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow group'>
            <div className='w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors'>
              <CommandLineIcon className='w-6 h-6' />
            </div>
            <h3 className='text-xl font-semibold mb-3'>大模型应用开发</h3>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              基于大模型API构建各类智能应用，包括聊天机器人、内容生成工具、智能分析系统等
            </p>
            <Link href='#develop' className='text-emerald-600 dark:text-emerald-400 font-medium hover:underline'>
              了解更多 →
            </Link>
          </div>

          {/* 服务卡片 3 */}
          <div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow group'>
            <div className='w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors'>
              <SquaresPlusIcon className='w-6 h-6' />
            </div>
            <h3 className='text-xl font-semibold mb-3'>智能体开发</h3>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              开发具备自主决策能力的AI智能体，支持多工具集成、任务规划与长期记忆管理
            </p>
            <Link href='#agent' className='text-emerald-600 dark:text-emerald-400 font-medium hover:underline'>
              了解更多 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}