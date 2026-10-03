'use client';

import { Service } from '@/data/services';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  ChevronRightIcon,
  SparklesIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  ArrowUpRightIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';

interface ServiceDetailClientProps {
  service: Service;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const t = useTranslations('services');
  const serviceT = t.raw(service.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-800 pt-24 lg:pt-32 pb-20">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-slate-100 to-sky-100 dark:from-primary/20 dark:to-slate-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>

        <div className="relative container mx-auto px-4">
          {/* 返回链接 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/services"
              className="inline-flex items-center text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary mb-8 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 group-hover:bg-primary/10 dark:group-hover:bg-primary/10 transition-colors">
                <ChevronRightIcon className="w-4 h-4 rotate-180" />
              </div>
              {t('backToList')}
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* 左侧内容 */}
            <div>
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary dark:text-primary text-sm font-medium mb-6">
                <SparklesIcon className="w-4 h-4" />
                {t(`categories.${service.category}`)}
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
              >
                {serviceT.title}
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
              >
                {serviceT.details}
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link
                  href="mailto:c@m9ai.work"
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  {t('cta.consultSolution')}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="#details"
                  className="inline-flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  {t('cta.learnMore')}
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            </div>

            {/* 右侧图片 */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                <Image
                  src={service.imageUrl}
                  alt={serviceT.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* 图片遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* 装饰元素 */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-sky-600 to-slate-900 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-sky-500 to-slate-700 rounded-full blur-2xl opacity-50 -z-10" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section id="details" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Core Advantages */}
            <motion.div 
              variants={cardVariants}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-primary/20 dark:hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <CheckCircleIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('sections.coreAdvantages')}</h2>
              <ul className="space-y-5">
                {service.coreAdvantages?.map((feature, index) => (
                  <li key={index} className="flex items-start group/item">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 group-hover/item:bg-primary/10 dark:group-hover/item:bg-primary/50 transition-colors">
                      <CheckCircleIcon className="w-4 h-4 text-primary dark:text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t(`${feature.titleKey}`)}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t(`${feature.descriptionKey}`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Application Scenarios */}
            <motion.div 
              variants={cardVariants}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-primary/20 dark:hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <LightBulbIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('sections.scenarios')}</h2>
              <ul className="space-y-5">
                {service.scenarios?.map((scenario, index) => (
                  <li key={index} className="flex items-start group/item">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t(`${scenario.titleKey}`)}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t(`${scenario.descriptionKey}`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Technical Features */}
            <motion.div 
              variants={cardVariants}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                <WrenchScrewdriverIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('sections.technicalFeatures')}</h2>
              <ul className="space-y-4">
                {service.technicalFeatures?.map((feature, index) => (
                  <li key={index} className="flex items-center group/item">
                    <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mr-4 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                    <span className="text-slate-700 dark:text-slate-300">{t(`${feature.titleKey}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Case Study Section */}
      {service.cases && service.cases.length > 0 && (
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary dark:text-primary text-sm font-medium mb-4">
                  {t('sections.caseStudies')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  客户成功案例
                </h2>
              </motion.div>

              <motion.div 
                variants={cardVariants}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-6 w-fit">
                      <CheckCircleIcon className="w-4 h-4" />
                      已上线项目
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                      {t(`${service.id}.cases.0.title`)}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                      {t(`${service.id}.cases.0.description`)}
                    </p>
                    <Link 
                      href="/contact"
                      className="inline-flex items-center text-primary dark:text-primary font-semibold hover:text-primary dark:hover:text-slate-300 transition-colors group"
                    >
                      了解如何为您实现
                      <ArrowUpRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="relative h-80 lg:h-auto min-h-[400px]">
                    <Image
                      src={service.imageUrl}
                      alt={t(`${service.id}.cases.0.title`)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50/20 dark:from-slate-900/20 to-transparent" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
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
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('cta.readyForAI')}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                {t('cta.readyForAIDescription')}
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:c@m9ai.work"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-primary/10 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t('cta.consultExpert')}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary/30 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-primary/40 transition-all"
                >
                  查看更多方案
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 其他服务推荐 */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              探索其他服务
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              为您提供全方位的AI解决方案
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {[
              { id: 'model-deployment', title: '模型部署', desc: '私有化大模型部署方案', icon: '🔒' },
              { id: 'model-application', title: '大模型应用开发', desc: '企业级AI应用定制', icon: '⚡' },
              { id: 'agent-development', title: '智能体开发', desc: '自动化业务流程', icon: '🤖' }
            ]
              .filter(s => s.id !== service.id)
              .slice(0, 2)
              .map((s) => (
                <motion.div key={s.id} variants={cardVariants}>
                  <Link 
                    href={`/services/${s.id}`}
                    className="group flex items-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/20 dark:hover:border-primary transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-600 to-slate-900 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{s.desc}</p>
                    </div>
                    <ArrowUpRightIcon className="w-5 h-5 text-slate-400 group-hover:text-primary dark:group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              ))
            }
          </motion.div>
        </div>
      </section>
    </div>
  );
}
