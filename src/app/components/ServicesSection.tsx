import { CommandLineIcon, CpuChipIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { Link } from '@/lib/navigation';
import { services } from '@/data/services';
import { useTranslations } from 'next-intl';

// 服务图标映射
const serviceIcons = {
  'model-deployment': <CpuChipIcon className='w-6 h-6' />,
  'model-application': <CommandLineIcon className='w-6 h-6' />,
  'agent-development': <SquaresPlusIcon className='w-6 h-6' />
};

export default function ServicesSection() {
  const t = useTranslations('services');
  return (
    <section id='services' className='py-20 bg-white dark:bg-slate-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>{t('sectionTitle')}</h2>
          <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
            {t('sectionDescription')}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {services.map((service) => (
            <div key={service.id} className='bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow group'>
              <div className='w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors'>
                {serviceIcons[service.id as keyof typeof serviceIcons]}
              </div>
              <h3 className='text-xl font-semibold mb-3'>{t(service.title as string)}</h3>
              <p className='text-slate-600 dark:text-slate-400 mb-4'>
                {t(service.description as string)}
              </p>
              <Link href={`/services/${service.id}`} className='text-emerald-600 dark:text-emerald-400 font-medium hover:underline'>
                {t('learnMore')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}