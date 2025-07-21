'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className='bg-slate-900 text-slate-400 py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-6 md:mb-0'>
            <Link href='/' className='flex items-center gap-2 mb-2'>
              <div className='w-8 h-8 rounded-md flex items-center justify-center'>
                <Image src="/favicon.jpg" alt={t('footer.logoAlt')} width={32} height={32} className="rounded-md" draggable="false" />
              </div>
              <span className='text-xl font-bold text-white'>{t('footer.logoText')}</span>
            </Link>
            <p className='text-sm text-slate-500'>{t('footer.copyright')}</p>
          </div>
          <div className='flex space-x-6'>
            <Link href='/privacy-policy' className='text-sm hover:text-emerald-400 transition-colors'>{t('footer.privacyPolicy')}</Link>
            <Link href='/terms-of-service' className='text-sm hover:text-emerald-400 transition-colors'>{t('footer.termsOfService')}</Link>
            <Link href='/contact' className='text-sm hover:text-emerald-400 transition-colors'>{t('footer.contactUs')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}