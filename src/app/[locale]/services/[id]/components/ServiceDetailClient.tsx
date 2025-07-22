'use client';

import { Service } from '@/data/services';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { ArrowRightIcon, CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

interface ServiceDetailClientProps {
  service: Service;
}

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const t = useTranslations('services');
  const serviceT = t.raw(service.id);
  const globalT = t.raw('global');

  return (
    <div className="container mx-auto py-16 px-4">
      <Link 
        href="/services"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
      >
        <ChevronRightIcon className="w-4 h-4 mr-1 rotate-180" />
        {t('backToList')}
      </Link>
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-500">
          <Image
            src={service.imageUrl}
            alt={serviceT.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div data-aos="fade-left">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            {t(`categories.${service.category}`)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            {serviceT.title}
          </h1>
          <div className="prose prose-lg max-w-none text-gray-700 mb-8">
            <p>{serviceT.details}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:c@m9ai.work"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
            >
              {t('cta.consultSolution')}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </a>
            <Link
              href="#details"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-all"
            >
              {t('cta.learnMore')}
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div id="details" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {/* Core Advantages */}
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('sections.coreAdvantages')}</h2>
          <ul className="space-y-4">
            {service.coreAdvantages?.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">{t(`${feature.titleKey}`)}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t(`${feature.descriptionKey}`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Application Scenarios */}
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('sections.scenarios')}</h2>
          <ul className="space-y-4">
            {service.scenarios?.map((scenario, index) => (
              <li key={index} className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm mr-3 flex-shrink-0">{index + 1}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{t(`${scenario.titleKey}`)}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t(`${scenario.descriptionKey}`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical Features */}
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('sections.technicalFeatures')}</h2>
          <ul className="space-y-3">
            {service.technicalFeatures?.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {t(`${feature.titleKey}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Case Study Section */}
      {service.cases && service.cases.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">{t('sections.caseStudies')}</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-blue-600 font-medium mb-2">{t('sections.caseStudies')}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t(`${service.id}.cases.0.title`)}</h3>
                <p className="text-gray-700 mb-6">{t(`${service.id}.cases.0.description`)}</p>
              </div>
              <div className="relative h-64 md:h-auto min-h-[300px]">
                <Image
                  src={service.imageUrl}
                  alt={t(`${service.id}.cases.0.title`)}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">{t('cta.readyForAI')}</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          {t('cta.readyForAIDescription')}
        </p>
        <a
          href="mailto:c@m9ai.work"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
        >
          {t('cta.consultExpert')}
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </a>
      </div>
    </div>
  );
}