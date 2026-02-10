'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  SparklesIcon,
  ArrowRightIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

interface CaseDetailClientProps {
  caseIndex: number;
}

// 案例图标映射
const caseIcons: { [key: number]: React.ElementType } = {
  0: LightBulbIcon,      // enterprise-service
  1: RocketLaunchIcon,   // healthcare
  2: CheckCircleIcon,    // fintech
  3: SparklesIcon,       // education
  4: LightBulbIcon,      // architecture
  5: CpuChipIcon,        // manufacturing
  6: CheckCircleIcon,    // law-firm
  7: RocketLaunchIcon,   // accounting
};

// 案例颜色映射
const caseColors: { [key: number]: string } = {
  0: 'from-blue-500 to-cyan-500',
  1: 'from-violet-500 to-purple-500',
  2: 'from-emerald-500 to-teal-500',
  3: 'from-orange-500 to-red-500',
  4: 'from-amber-500 to-orange-500',
  5: 'from-slate-500 to-gray-500',
  6: 'from-indigo-500 to-blue-600',
  7: 'from-green-500 to-emerald-600',
};

// 案例图片映射
const caseImages: { [key: number]: string } = {
  0: '/kefu.svg',
  1: '/yiliao.svg',
  2: '/jinrong.svg',
  3: '/jiaoyu.svg',
  4: '/arch.svg',
  5: '/manufacturing.svg',
  6: '/law.svg',
  7: '/accounting.svg',
};

export default function CaseDetailClient({ caseIndex }: CaseDetailClientProps) {
  const t = useTranslations('cases');
  const Icon = caseIcons[caseIndex] || LightBulbIcon;
  const color = caseColors[caseIndex] || 'from-blue-500 to-cyan-500';
  const imageUrl = caseImages[caseIndex] || '/kefu.svg';

  const title = t(`studies.${caseIndex}.title`);
  const category = t(`studies.${caseIndex}.category`);
  const description = t(`studies.${caseIndex}.description`);
  const challenge = t(`studies.${caseIndex}.challenge`);
  const solution = t(`studies.${caseIndex}.solution`);
  
  // 获取结果列表
  const results: string[] = [];
  for (let i = 0; i < 4; i++) {
    const result = t.raw(`studies.${caseIndex}.results.${i}`);
    if (result) results.push(result);
  }
  
  // 获取技术栈
  const technologies: string[] = [];
  for (let i = 0; i < 4; i++) {
    const tech = t.raw(`studies.${caseIndex}.technologies.${i}`);
    if (tech) technologies.push(tech);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-800 pt-24 pb-20">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4`} />
        </div>

        <div className="relative container mx-auto px-4">
          {/* 返回链接 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/#cases"
              className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" />
              </div>
              返回案例列表
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* 左侧内容 */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6"
              >
                <Icon className="w-4 h-4" />
                {category}
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
              >
                {title}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
              >
                {description}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2"
              >
                {technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* 右侧图片 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* 装饰元素 */}
              <div className={`absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br ${color} rounded-2xl -z-10`} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 案例详情 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 挑战 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6`}>
                <RocketLaunchIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">业务挑战</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {challenge}
              </p>
            </motion.div>

            {/* 解决方案 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6`}>
                <LightBulbIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">解决方案</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {solution}
              </p>
            </motion.div>

            {/* 技术栈 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6`}>
                <CpuChipIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">核心技术</h2>
              <ul className="space-y-3">
                {technologies.map((tech, index) => (
                  <li key={index} className="flex items-center text-slate-600 dark:text-slate-400">
                    <span className={`w-2 h-2 bg-gradient-to-r ${color} rounded-full mr-3`} />
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 成果展示 */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              项目成果
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              数字化转型带来的显著效益
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{result}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${color}`} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative py-16 px-8 md:py-24 md:px-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                也想获得类似的成果？
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                我们的专家团队随时为您提供支持，从需求分析到方案落地，全程陪伴
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:c@m9ai.work"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-all"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  联系我们
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  href="/services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
                >
                  探索服务
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
