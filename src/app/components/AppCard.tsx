'use client';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { App } from '@/data/apps';
import { ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
      <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
        <Image
          src={app.icon}
          alt={app.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-6 mix-blend-multiply"
        />
        <div className="absolute top-3 right-3 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
          {app.type}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{app.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <StarIcon className="w-4 h-4 fill-amber-500" />
            <span className="text-sm font-medium">{app.rating}</span>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{app.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {app.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2 py-1 rounded">{feature}</span>
          ))}
        </div>
        <Link
          href={app.url}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <ShoppingBagIcon className="w-4 h-4" />
          立即使用
        </Link>
      </div>
    </div>
  );
}