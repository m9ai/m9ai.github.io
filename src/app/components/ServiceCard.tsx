import Image from 'next/image';
import { Link } from '@/lib/navigation';
import type { Service } from '../../data/services';
import { useTranslations } from 'next-intl';

interface ServiceCardProps {
  service: Service; 
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const t = useTranslations('services');
  const serviceT = t.raw(service.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        <Image
          src={service.imageUrl}
          alt={serviceT.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="text-sm font-medium text-blue-600 mb-2">{t(`categories.${service.category}`)}</div>
        <h2 className="text-xl font-bold mb-2">{serviceT.title}</h2>
        <p className="text-gray-600 mb-4">{serviceT.description}</p>
        <Link
          href={`/services/${service.id}`}
          className="inline-block text-blue-600 font-medium hover:text-blue-800"
        >
          {t('learnMore')} →
        </Link>
      </div>
    </div>
  );
}