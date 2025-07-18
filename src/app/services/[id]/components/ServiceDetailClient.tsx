'use client';

import { Service } from '@/data/services';
import Image from 'next/image';
import Link from 'next/link';

interface ServiceDetailClientProps {
  service: Service;
}

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  return (
    <div className="container mx-auto py-16 px-4">
      <Link href="/services" className="inline-block text-blue-600 mb-8">← 返回服务列表</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-80 w-full rounded-lg overflow-hidden">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <div className="text-sm font-medium text-blue-600 mb-2">{service.category}</div>
          <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
          <div className="prose max-w-none text-gray-700 mb-8">
            <p>{service.details}</p>
          </div>

          <h2 className="text-xl font-semibold mb-3">服务特点</h2>
          <ul className="space-y-2">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}