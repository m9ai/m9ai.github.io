'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const t = useTranslations('navbar');
  return (
    <header className='sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-md flex items-center justify-center'>
              <Image src="/favicon.jpg" alt="水杉智境工作室logo" width={32} height={32} className="rounded-md" draggable="false" />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'>
              {t('logo')}
            </span>
          </Link>
          <nav className='hidden md:flex items-center space-x-8'>
            <Link href='/services' className='text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'>
              {t('services')}
            </Link>
            <Link href='/docs' className='text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'>
              {t('docs')}
            </Link>
            <Link
              href='/store'
              className='ml-4 px-4 py-2 bg-emerald-600 dark:bg-slate-900/80 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-2'
            >
              {t('store')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}