"use client"

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation'; // 添加路由参数钩子
import * as  motion from 'motion/react-client';



// 动画效果配置
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ContactPage() {
  const params = useParams(); // 获取路由参数
  const locale = params.locale as string; // 提取语言参数
  const t = useTranslations('Contact'); // 使用翻译钩子
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.h1 
    className="text-3xl font-bold mb-12 text-center tracking-tight"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {t('title')}
  </motion.h1>
      
      <motion.section 
        className="mb-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">{t('about.title')}</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          <p>{t('about.description')}</p>
        </div>
      </motion.section>
      
      <motion.section 
        className="mb-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">{t('founder.title')}</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="md:w-1/3">
            <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center overflow-hidden shadow-sm bg-cover" style={{backgroundImage: 'url(/founder.jpg)'}} />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-medium mb-3 text-gray-800">{t('founder.name')}</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">{t('founder.description')}</p>
            <Link 
              href="https://zhangjianzy.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {t('founder.viewProfile')}
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">{t('contact.title')}</h2>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <p className="mb-6 text-gray-700">{t('contact.description')}</p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('contact.emailLabel')}</p>
                <a href="mailto:c@m9ai.work" className="text-gray-800 font-medium hover:text-blue-600 transition-colors">c@m9ai.work</a>
              </div>
            </li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}