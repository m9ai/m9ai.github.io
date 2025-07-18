import ServiceDetailClient from './components/ServiceDetailClient';
import { services, Service } from '@/data/services';
import { notFound } from 'next/navigation';

type ServiceDetailParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  await Promise.resolve();
  return services.map((service) => ({
    id: service.id,
  }));
}

export default async function ServiceDetailPage({ params }: ServiceDetailParams) {
  const { id } = await params;
  const service = services.find((s) => s.id === id) as Service;

  if (!service) {
    notFound();
  }

  return (
    <ServiceDetailClient service={service} />
  );
}

