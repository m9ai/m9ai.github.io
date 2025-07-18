import ServiceDetailClient from './components/ServiceDetailClient';
import { services, Service } from '@/data/services';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return services.map((service) => ({
    id: service.id,
  }));
}

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = services.find((s) => s.id === params.id) as Service;

  if (!service) {
    notFound();
  }

  return (
    <ServiceDetailClient service={service} />
  );
}

