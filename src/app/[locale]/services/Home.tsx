"use client";

import ServiceCard from '@/app/components/ServiceCard';
import { services } from '@/data/services';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  UserGroupIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  CogIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { Link } from '@/lib/navigation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

// 服务流程步骤：文案取 services.home.process.steps.*，这里只保留图标与序号
const processStepKeys = [
  { icon: UserGroupIcon, key: 'discovery', step: '01' },
  { icon: CpuChipIcon, key: 'design', step: '02' },
  { icon: CogIcon, key: 'build', step: '03' },
  { icon: RocketLaunchIcon, key: 'operate', step: '04' },
];

// 核心优势：同样只保留 key 与图标
const advantageKeys = [
  { icon: SparklesIcon, key: 'techEdge' },
  { icon: ShieldCheckIcon, key: 'reliability' },
  { icon: ClockIcon, key: 'speed' },
  { icon: CheckBadgeIcon, key: 'team' },
];

export default function Home() {
  const t = useTranslations('services');

  const processSteps = processStepKeys.map((step) => ({
    ...step,
    title: t(`home.process.steps.${step.key}.title`),
    description: t(`home.process.steps.${step.key}.description`),
  }));

  const advantages = advantageKeys.map((item) => ({
    ...item,
    title: t(`home.advantages.items.${item.key}.title`),
    description: t(`home.advantages.items.${item.key}.description`),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-20 lg:py-32">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-sky-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-slate-400/20 to-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary dark:text-primary text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              {t('sectionTag')}
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-900 bg-clip-text text-transparent"
            >
              {t('pageTitle')}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('sectionDescription')}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                {t('cta.consultExpert')}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/20 dark:hover:border-primary transition-all hover:-translate-y-0.5"
              >
                {t('viewAllServices')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 服务卡片区域 */}
      <section id="services" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard service={service} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 核心优势区域 */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              {t('home.advantages.title')}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home.advantages.description')}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {advantages.map((advantage, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/20 dark:hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-sky-600 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                  <advantage.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{advantage.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{advantage.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 服务流程区域 */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              {t('home.process.title')}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home.process.description')}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="relative"
          >
            {/* 连接线 */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-primary/20 dark:hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group">
                    {/* 步骤编号 */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-sky-600 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/25">
                      {step.step}
                    </div>
                    
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-primary dark:text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-900" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative py-16 px-8 md:py-24 md:px-16 text-center">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t('cta.readyForAI')}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                {t('cta.readyForAIDescription')}
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-primary/10 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t('cta.consultExpert')}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="mailto:c@m9ai.work"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary/30 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-primary/40 transition-all"
                >
                  {t('cta.emailUs')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
