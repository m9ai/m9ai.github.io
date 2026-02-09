'use client';

import HeroSection from '@/app/components/HeroSection';
import ServicesSection from '@/app/components/ServicesSection';
import CaseStudySection from '@/app/components/CaseStudySection';
import PartnersSection from '@/app/components/PartnersSection';
import CollaborationSection from '@/app/components/CollaborationSection';

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
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