"use client";

import ServiceCard from '@/app/components/ServiceCard';
import { services } from '@/data/services';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('services');

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-12 text-center">{t('pageTitle')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service}
          />
        ))}
      </div>
    </div>
  );
}