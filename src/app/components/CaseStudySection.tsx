'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { motion, useInView, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOffice2Icon,
  ScaleIcon,
  CalculatorIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
  BanknotesIcon,
  HomeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

// Case studies data with icons
const caseStudies = [
  {
    id: 'enterprise-service',
    slug: 'enterprise-service',
    imageUrl: '/kefu.svg',
    icon: BuildingOffice2Icon,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    imageUrl: '/yiliao.svg',
    icon: AcademicCapIcon,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    id: 'fintech',
    slug: 'fintech',
    imageUrl: '/jinrong.svg',
    icon: BanknotesIcon,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    id: 'education',
    slug: 'education',
    imageUrl: '/jiaoyu.svg',
    icon: ShoppingBagIcon,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    id: 'architecture',
    slug: 'architecture',
    imageUrl: '/arch.svg',
    icon: HomeIcon,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing',
    imageUrl: '/manufacturing.svg',
    icon: Cog6ToothIcon,
    color: 'from-slate-500 to-gray-500',
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
  },
  {
    id: 'law-firm',
    slug: 'law-firm',
    imageUrl: '/law.svg',
    icon: ScaleIcon,
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
  },
  {
    id: 'accounting',
    slug: 'accounting',
    imageUrl: '/accounting.svg',
    icon: CalculatorIcon,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
];

function CaseCard({ study, index, isActive }: { study: typeof caseStudies[0]; index: number; isActive: boolean }) {
  const t = useTranslations('cases');
  const Icon = study.icon;
  
  return (
    <motion.div
      layout
      className={`relative flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${isActive ? 'z-10' : 'z-0'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5, 
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/cases/${study.slug}`}>
        <div className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-elevated transition-all duration-500">
          {/* Image container */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src={study.imageUrl}
              alt={t(`studies.${index}.title`)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-sm`}>
                <Icon className="w-3.5 h-3.5" />
                {t(`studies.${index}.category`)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {t(`studies.${index}.title`)}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
              {t(`studies.${index}.description`)}
            </p>
            
            <div className="inline-flex items-center gap-2 text-primary font-medium text-sm group/btn">
              <span>{t('viewDetails')}</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </div>
          </div>

          {/* Hover glow effect */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${study.color} opacity-5`} />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CaseStudySection() {
  const t = useTranslations('cases');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % caseStudies.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16"
        >
          <div className="max-w-2xl mb-8 lg:mb-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {t('sectionTag') || 'Success Stories'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t('sectionTitle')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t('sectionDescription')}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary transition-all shadow-card hover:shadow-soft"
              aria-label="Previous case"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary transition-all shadow-card hover:shadow-soft"
              aria-label="Next case"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Cases carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="flex gap-6 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {caseStudies.map((study, index) => {
                // Calculate if this card should be visible
                const isVisible = index >= activeIndex && index < activeIndex + 3;
                if (!isVisible) return null;
                
                return (
                  <CaseCard 
                    key={study.id} 
                    study={study} 
                    index={index}
                    isActive={index === activeIndex}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to case ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
