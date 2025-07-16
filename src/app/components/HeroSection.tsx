'use client';

import Link from 'next/link';
import TechGridBackground from './TechGridBackground';

export default function HeroSection() {
  return (
    <section className='py-20 md:py-32 relative overflow-hidden'>
  <TechGridBackground gridSize={30} lineWidth={0.8} pointSize={2.5} animationSpeed={0.8} density={0.03} />
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight'>
            <span className='block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'>
              水杉智境工作室
            </span>
            <span className='block mt-2 text-slate-400 font-semibold'>
              低成本智能体服务平台
            </span>
          </h1>
          <p className='text-lg md:text-xl text-slate-400 font-medium mb-8 max-w-3xl mx-auto'>
            为AI爱好者提供大模型私有化部署、大模型及智能体开发服务，让AI技术落地更简单
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