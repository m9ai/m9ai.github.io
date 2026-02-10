'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'motion/react';
import {
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import FreeConsultation from '@/app/components/FreeConsultation';

// 动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function ContactPage() {
  const t = useTranslations('Contact');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section - 突出免费AI咨询 */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              限时免费开放
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              免费AI应用咨询顾问
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              不确定业务如何AI化？我们的专家为您提供30分钟免费咨询，
              帮您梳理场景、评估可行性、规划实施路径
            </p>

            {/* Value props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              {[
                { icon: CheckCircleIcon, text: '0元免费咨询' },
                { icon: ClockIcon, text: '2小时内响应' },
                { icon: LightBulbIcon, text: '专业顾问1对1' },
                { icon: ShieldCheckIcon, text: '无任何附加条件' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <a
                href="#free-consultation"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                立即预约免费咨询
                <ArrowRightIcon className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" className="dark:fill-slate-900"/>
          </svg>
        </div>
      </section>

      {/* Free Consultation Section */}
      <FreeConsultation />

      {/* About & Founder Section */}
      <section ref={sectionRef} className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* About Card */}
            <motion.div variants={itemVariants}>
              <div className="h-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 lg:p-10 border border-slate-200 dark:border-slate-700 shadow-soft hover:shadow-elevated transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BuildingOffice2Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {t('about.title')}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {t('about.description')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    AI Solutions
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    Enterprise
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    Innovation
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Founder Card */}
            <motion.div variants={itemVariants}>
              <div className="h-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 lg:p-10 border border-slate-200 dark:border-slate-700 shadow-soft hover:shadow-elevated transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {t('founder.title')}
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Founder Image */}
                  <div className="sm:w-40 flex-shrink-0">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src="/founder.jpg"
                        alt={t('founder.name')}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                  </div>

                  {/* Founder Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {t('founder.name')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm">
                      {t('founder.description')}
                    </p>
                    <Link
                      href="https://zhangjianzy.github.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary font-medium hover:underline group"
                    >
                      {t('founder.viewProfile')}
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            {[
              {
                icon: <EnvelopeIcon className="w-6 h-6" />,
                label: t('contact.emailLabel'),
                value: 'c@m9ai.work',
                href: 'mailto:c@m9ai.work',
                color: 'bg-blue-500',
              },
              {
                icon: <PhoneIcon className="w-6 h-6" />,
                label: t('contact.phoneLabel') || '电话',
                value: '+86 176-0213-5810',
                href: 'tel:+8617602135810',
                color: 'bg-green-500',
              },
              {
                icon: <MapPinIcon className="w-6 h-6" />,
                label: t('contact.locationLabel') || '地址',
                value: '中国 · 上海',
                href: '#',
                color: 'bg-orange-500',
              },
              {
                icon: <QrCodeIcon className="w-6 h-6" />,
                label: t('contact.wechatLabel') || '微信',
                value: '扫码添加',
                href: '#wechat',
                color: 'bg-emerald-500',
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  href={item.href}
                  className="group block bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} bg-opacity-10 flex items-center justify-center mb-4 text-${item.color.replace('bg-', '')}`}>
                    {item.icon}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {item.value}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
