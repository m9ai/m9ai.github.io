"use client";

import ServiceCard from '@/app/components/ServiceCard';
import { services } from '@/data/services';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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

// 服务流程步骤
const processSteps = [
  {
    icon: UserGroupIcon,
    title: '需求沟通',
    description: '深入了解业务场景与痛点',
    step: '01'
  },
  {
    icon: CpuChipIcon,
    title: '方案设计',
    description: '制定定制化AI解决方案',
    step: '02'
  },
  {
    icon: CogIcon,
    title: '开发实施',
    description: '专业团队高效交付',
    step: '03'
  },
  {
    icon: RocketLaunchIcon,
    title: '上线运维',
    description: '持续优化与技术支持',
    step: '04'
  }
];

// 核心优势
const advantages = [
  {
    icon: SparklesIcon,
    title: '技术领先',
    description: '紧跟前沿大模型技术，持续迭代优化'
  },
  {
    icon: ShieldCheckIcon,
    title: '安全可靠',
    description: '企业级数据安全保障，合规可控'
  },
  {
    icon: ClockIcon,
    title: '快速交付',
    description: '标准化流程，缩短项目周期'
  },
  {
    icon: CheckBadgeIcon,
    title: '专业团队',
    description: '资深AI工程师，丰富行业经验'
  }
];

export default function Home() {
  const t = useTranslations('services');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-20 lg:py-32">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              {t('sectionTag')}
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
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
                className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                {t('cta.consultExpert')}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:-translate-y-0.5"
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
              为什么选择我们
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              专业的技术团队，成熟的解决方案，为您的AI转型保驾护航
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
                className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/25">
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
              服务流程
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              标准化的服务流程，确保项目高效高质量交付
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
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 group">
                    {/* 步骤编号 */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/25">
                      {step.step}
                    </div>
                    
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
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
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative py-16 px-8 md:py-24 md:px-16 text-center">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                准备好开启AI转型之旅了吗？
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                我们的专家团队随时为您提供支持，从需求分析到方案落地，全程陪伴
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t('cta.consultExpert')}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="mailto:c@m9ai.work"
                  className="inline-flex items-center justify-center px-8 py-4 bg-indigo-500/30 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-indigo-500/40 transition-all"
                >
                  发送邮件咨询
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
