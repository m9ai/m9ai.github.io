'use client';

import Link from 'next/link';
import ParticleCanvas from './ParticleCanvas';

export default function HeroSection() {
  return (
    <section className='py-20 md:py-32 relative overflow-hidden'>
      <ParticleCanvas />
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight'>
            <span className='block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'>
              水杉智境工作室
            </span>
            <span className='block mt-2 text-slate-700 dark:text-slate-300'>
              低学习成本智能体服务平台
            </span>
          </h1>
          <p className='text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto'>
            为开发者及AIGC爱好者提供大模型私有化部署、应用开发和智能体开发服务，让AI技术落地更简单
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              href='#services'
              className='px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-base font-medium shadow-lg shadow-emerald-500/20'
            >
              探索服务
            </Link>
            <Link
              href='#docs'
              className='px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-base font-medium'
            >
              查看文档
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}