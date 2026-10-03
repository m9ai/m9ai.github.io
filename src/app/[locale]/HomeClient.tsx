'use client';

import HeroSection from '@/app/components/HeroSection';
import PartnersSection from '@/app/components/PartnersSection';
import CapabilitiesSection from '@/app/components/CapabilitiesSection';
import CaseStudySection from '@/app/components/CaseStudySection';
import ServicesSection from '@/app/components/ServicesSection';
import CollaborationSection from '@/app/components/CollaborationSection';

/**
 * 段落顺序遵循 Trust & Authority → Capability → Proof → Offering → CTA：
 * 先看「我们基于什么、能做什么」，再看「做过什么」，最后才是具体服务分层。
 * 技术伙伴（原第 4 屏）上移到 Hero 正下方承担可信背书。
 */
export default function HomeClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <main>
        <HeroSection />
        <PartnersSection />
        <CapabilitiesSection />
        <CaseStudySection />
        <ServicesSection />
        <CollaborationSection />
      </main>
    </div>
  );
}
