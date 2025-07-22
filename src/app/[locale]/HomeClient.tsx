'use client';

import HeroSection from '@/app/components/HeroSection';
import ServicesSection from '@/app/components/ServicesSection';
import CaseStudySection from '@/app/components/CaseStudySection';
import PartnersSection from '@/app/components/PartnersSection';
import CollaborationSection from '@/app/components/CollaborationSection';
import { useTranslations } from 'next-intl';

export default function HomeClient() {
  const t = useTranslations('home');
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100'>
      <main>
        <HeroSection />
        <ServicesSection />
        <CaseStudySection />
        <PartnersSection />
        <CollaborationSection />
      </main>
    </div>
  );
}