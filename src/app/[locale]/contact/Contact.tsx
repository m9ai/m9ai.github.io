'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'motion/react';
import {
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  SparklesIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import CollaborationSection from '@/app/components/CollaborationSection';

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
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/10 via-primary/5 to-white dark:from-primary/20 dark:via-primary/10 dark:to-slate-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('about.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About & Founder Section */}
      <section ref={sectionRef} className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* About Card */}
            <motion.div variants={itemVariants}>
              <div className="h-full bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 border border-slate-200 dark:border-slate-700 shadow-soft hover:shadow-elevated transition-all duration-300">
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
              <div className="h-full bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 border border-slate-200 dark:border-slate-700 shadow-soft hover:shadow-elevated transition-all duration-300">
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
                  className="group block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated"
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

      {/* Contact Form Section - Reuse CollaborationSection */}
      <CollaborationSection />
    </div>
  );
}
