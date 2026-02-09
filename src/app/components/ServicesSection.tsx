'use client';

import { useRef } from 'react';
import { Link } from '@/lib/navigation';
import { services } from '@/data/services';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'motion/react';
import { 
  CpuChipIcon, 
  CommandLineIcon, 
  SquaresPlusIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// Service icons mapping with gradient backgrounds
const serviceConfig = {
  'model-deployment': {
    icon: CpuChipIcon,
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  'model-application': {
    icon: CommandLineIcon,
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  'agent-development': {
    icon: SquaresPlusIcon,
    gradient: 'from-pink-500 to-rose-600',
    lightBg: 'bg-pink-50 dark:bg-pink-950/30',
  },
};

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const t = useTranslations('services');
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  
  const config = serviceConfig[service.id as keyof typeof serviceConfig];
  const Icon = config.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 card-hover overflow-hidden">
        {/* Background gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Icon */}
        <div className={`relative w-16 h-16 rounded-2xl ${config.lightBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
          {t(`${service.id}.title`)}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {t(`${service.id}.description`)}
        </p>

        {/* Features preview */}
        <ul className="space-y-2 mb-6">
          {service.coreAdvantages.slice(0, 3).map((advantage, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{t(advantage.titleKey)}</span>
            </li>
          ))}
        </ul>

        {/* CTA Link */}
        <Link
          href={`/services/${service.id}`}
          className="inline-flex items-center gap-2 text-primary font-semibold group/link"
        >
          <span>{t('cta.learnMore')}</span>
          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="relative py-24 lg:py-32 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('sectionTag') || 'Our Services'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('sectionTitle')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('sectionDescription')}
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-2xl hover:shadow-elevated transition-all duration-300 group"
          >
            {t('viewAllServices') || 'View All Services'}
            <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
