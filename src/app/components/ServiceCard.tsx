import Image from 'next/image';
import { Link } from '@/lib/navigation';
import type { Service } from '../../data/services';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface ServiceCardProps {
  service: Service;
  index?: number;
}

const gradients = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-orange-500 to-amber-400',
];

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const t = useTranslations('services');
  const serviceT = t.raw(service.id);
  const gradient = gradients[index % gradients.length];

  return (
    <Link href={`/services/${service.id}`}>
      <motion.div 
        className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-800 h-full flex flex-col"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* 图片区域 */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={service.imageUrl}
            alt={serviceT.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          
          {/* 分类标签 */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-full">
              {t(`categories.${service.category}`)}
            </span>
          </div>

          {/* 悬浮箭头 */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <ArrowUpRightIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {serviceT.title}
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            {serviceT.description}
          </p>

          {/* 底部装饰线 */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className={`text-xs font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {t('learnMore')}
            </span>
            <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
          </div>
        </div>

        {/* 悬停边框光效 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>
    </Link>
  );
}
