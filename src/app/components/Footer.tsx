'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-slate-900 text-slate-400 py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-6 md:mb-0'>
            <Link href='/' className='flex items-center gap-2 mb-2'>
              <div className='w-8 h-8 rounded-md flex items-center justify-center'>
                <Image src="/favicon.jpg" alt="水杉智境工作室logo" width={32} height={32} className="rounded-md" draggable="false" />
              </div>
              <span className='text-xl font-bold text-white'>水杉智境工作室</span>
            </Link>
            <p className='text-sm text-slate-500'>© 2025 水杉智境工作室. 保留所有权利.</p>
          </div>
          <div className='flex space-x-6'>
            <Link href='/privacy-policy' className='text-sm hover:text-emerald-400 transition-colors'>隐私政策</Link>
            <Link href='/terms-of-service' className='text-sm hover:text-emerald-400 transition-colors'>服务条款</Link>
            <Link href='#contact' className='text-sm hover:text-emerald-400 transition-colors'>联系我们</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}