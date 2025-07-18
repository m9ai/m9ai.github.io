import Image from 'next/image';
import Link from 'next/link';
import { Service } from '../../data/services';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="text-sm font-medium text-blue-600 mb-2">{service.category}</div>
        <h2 className="text-xl font-bold mb-2">{service.title}</h2>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <Link
          href={`/services/${service.id}`}
          className="inline-block text-blue-600 font-medium hover:text-blue-800"
        >
          了解更多 →
        </Link>
      </div>
    </div>
  );
}