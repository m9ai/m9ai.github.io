import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  MapIcon,
  WrenchScrewdriverIcon,
  ScaleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export interface CaseMeta {
  slug: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

/**
 * 案例元数据以 slug 为 key 存储。
 *
 * 此前这些元数据按数组下标维护（同时散落在 CaseStudySection / CaseDetailClient /
 * cases/[slug]/page.tsx 三处），任何一条案例的增删改序都会静默导致图片、
 * 配色与文案错配。改为 slug 关联后，字典侧同样以 slug 为 key，
 * 增删不再影响其余条目。
 */
/* accent：统一收敛到 navy / sky / 中性石板灰三系。
   原来是蓝、绿、橙、红、紫各一条彩虹色，放在企业官网的卡片上显得花，
   也不利于深色模式一致性。现在靠明度而非色相区分。 */
export const cases: Record<string, CaseMeta> = {
  'enterprise-service': {
    slug: 'enterprise-service',
    imageUrl: '/kefu.svg',
    icon: ChatBubbleLeftRightIcon,
    accent: 'from-sky-500 to-sky-700',
  },
  healthcare: {
    slug: 'healthcare',
    imageUrl: '/yiliao.svg',
    icon: DocumentTextIcon,
    accent: 'from-sky-600 to-slate-800',
  },
  fintech: {
    slug: 'fintech',
    imageUrl: '/jinrong.svg',
    icon: ShieldCheckIcon,
    accent: 'from-slate-700 to-slate-900',
  },
  education: {
    slug: 'education',
    imageUrl: '/jiaoyu.svg',
    icon: AcademicCapIcon,
    accent: 'from-teal-600 to-slate-800',
  },
  architecture: {
    slug: 'architecture',
    imageUrl: '/arch.svg',
    icon: MapIcon,
    accent: 'from-slate-600 to-slate-900',
  },
  manufacturing: {
    slug: 'manufacturing',
    imageUrl: '/manufacturing.svg',
    icon: WrenchScrewdriverIcon,
    accent: 'from-slate-500 to-slate-700',
  },
  'law-firm': {
    slug: 'law-firm',
    imageUrl: '/law.svg',
    icon: ScaleIcon,
    accent: 'from-slate-800 to-primary',
  },
  accounting: {
    slug: 'accounting',
    imageUrl: '/accounting.svg',
    icon: BanknotesIcon,
    accent: 'from-sky-700 to-slate-900',
  },
};

export const caseSlugs: string[] = Object.keys(cases);

export const fallbackCase: CaseMeta = {
  slug: 'enterprise-service',
  imageUrl: '/kefu.svg',
  icon: ChatBubbleLeftRightIcon,
  accent: 'from-blue-500 to-cyan-500',
};

export function getCase(slug: string): CaseMeta {
  return cases[slug] ?? fallbackCase;
}
