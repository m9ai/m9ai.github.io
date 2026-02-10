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
    description: 'companies.langchain.description'
  },
  {
    id: 2,
    name: 'FastAPI',
    logoUrl: '/logos/fastapi.svg',
    description: 'companies.fastapi.description'
  },
  {
    id: 3,
    name: 'Dify',
    logoUrl: '/logos/dify.svg',
    description: 'companies.dify.description'
  },
  {
    id: 4,
    name: 'Next.js',
    logoUrl: '/logos/next.svg',
    description: 'companies.nextjs.description'
  }
];