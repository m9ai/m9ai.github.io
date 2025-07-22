'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/navigation'; // 新增useRouter导入
// import { routing } from '@/i18n/routing'; // 导入路由配置
// import { setRequestLocale } from 'next-intl/server';

export default function Navbar() {
  // const locale = useLocale();
  const t = useTranslations('navbar');
  // const router = useRouter();
  // const pathname = usePathname();
  // const currentLocale = locale || routing.defaultLocale;

  // 语言切换处理函数
  // const changeLocale = (newLocale: string) => {
  //   setRequestLocale(newLocale);
  //   router.push(pathname, { locale: newLocale });
  // };

  return (
    <header className='sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo和品牌名称 */}
          <Link href='/' className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-md flex items-center justify-center'>
              <Image src="/favicon.jpg" alt="水杉智境工作室logo" width={32} height={32} className="rounded-md" draggable="false" />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'>
              {t('logo')}
            </span>
          </Link>

          <div className='flex items-center gap-4'>
            {/* 现有导航链接 */}
            <nav className='hidden md:flex items-center'>
              <Link
                href='/services'
                className='ml-4 px-4 py-2 transition-colors text-sm font-medium flex items-center'
              >
                {t('services')}
              </Link>
              <Link
                href='/store'
                className='ml-4 px-4 py-2 bg-emerald-600 dark:bg-slate-900/80 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-2'
              >
                {t('store')}
              </Link>
              {/* 语言切换器 */}
              {/* <div className='flex border rounded-md overflow-hidden'>
                {routing.locales.map((locale) => (
                  <button
                    key={locale}
                    onClick={() => changeLocale(locale)}
                    className={`px-3 py-1 text-sm ${currentLocale === locale ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {locale.toUpperCase() === 'ZH' ? '中文' : 'English'}
                  </button>
                ))}
              </div> */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}