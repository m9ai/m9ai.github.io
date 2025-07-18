import type { StaticImageData } from 'next/image';

/**
 * 技术支持伙伴接口定义
 * 确保所有伙伴数据格式一致，提供类型安全
 */
export interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
}

/**
 * 技术支持伙伴数据
 * 集中管理所有技术伙伴信息，便于维护和更新
 */
export const partners: Partner[] = [
  {
    id: 1,
    name: 'LangChain',
    logoUrl: '/logos/langchain.svg',
    description: '领先的大语言模型应用开发框架'
  },
  {
    id: 2,
    name: 'FastAPI',
    logoUrl: '/logos/fastapi.svg',
    description: '高性能 API 开发框架'
  },
  {
    id: 3,
    name: 'Dify',
    logoUrl: '/logos/dify.svg',
    description: '低代码/零代码 AI 应用开发平台'
  },
  {
    id: 4,
    name: 'Next.js',
    logoUrl: '/logos/next.svg',
    description: 'SEO 友好型全栈应用开发框架'
  }
];