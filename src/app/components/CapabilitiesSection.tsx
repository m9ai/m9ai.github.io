'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, useReducedMotion } from 'motion/react';
import {
  QueueListIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  CircleStackIcon,
  CpuChipIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

/**
 * 六项能力与技术 slugs 的映射。
 * key 同时作为 i18n 字典里 `capabilities.items.<key>` 的取值依据，
 * 增删这里一项即可，不必改动 i18n 的读取顺序（不像案例那样靠下标关联）。
 */
const capabilities = [
  { key: 'orchestration', icon: QueueListIcon },
  { key: 'toolUse', icon: WrenchScrewdriverIcon },
  { key: 'documents', icon: DocumentTextIcon },
  { key: 'retrieval', icon: CircleStackIcon },
  { key: 'inference', icon: CpuChipIcon },
  { key: 'evaluation', icon: BeakerIcon },
];

export default function CapabilitiesSection() {
  const t = useTranslations('capabilities');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative py-24 lg:py-32 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
    >
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('sectionTag')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('sectionTitle')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('sectionDescription')}
          </p>
        </motion.div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map(({ key, icon: Icon }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.08 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t(`items.${key}.title`)}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {t(`items.${key}.description`)}
              </p>

              <ul className="flex flex-wrap gap-2">
                {(t.raw(`items.${key}.stack`) as string[]).map((tech) => (
                  <li
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
