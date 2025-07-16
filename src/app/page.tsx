'use client';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import CaseStudySection from './components/CaseStudySection';
import PartnersSection from './components/PartnersSection';
import CollaborationSection from './components/CollaborationSection';

// 主页面组件
export default function Home() {
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
