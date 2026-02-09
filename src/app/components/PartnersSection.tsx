'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { partners } from '@/data/partners';
import { 
  LinkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { Link } from '@/lib/navigation';

// Partner card with hover effects
function PartnerCard({ partner, index }: { partner: typeof partners[0]; index: number }) {
  const t = useTranslations('partners');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated overflow-hidden">
        {/* Subtle gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative">
          {/* Logo container */}
          <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-3 group-hover:scale-110 transition-transform duration-300">
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              width={40}
              height={40}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>

          {/* Name */}
          <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
            {partner.name}
          </h3>

          {/* Description */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t(partner.description)}
          </p>

          {/* Link indicator */}
          <div className="flex justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <LinkIcon className="w-3 h-3" />
              {t('learnMore') || 'Learn more'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PartnersSection() {
  const t = useTranslations('partners');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            {t('sectionTag') || 'Our Partners'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('sectionTitle')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('sectionDescription')}
          </p>
        </motion.div>

        {/* Partners grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {partners.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {t('joinPartners') || 'Want to become a partner?'}
          </p>
          <Link
            href="mailto:c@m9ai.work" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            {t('contactUs') || 'Contact us'}
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
