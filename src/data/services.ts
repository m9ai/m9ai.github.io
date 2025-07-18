export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  details: string;
  features: string[];
}

export const services: Service[] = [
  {
    id: 'ai-development',
    title: 'AI应用开发',
    description: '定制化人工智能解决方案，从概念到部署的全流程开发服务',
    imageUrl: '/ai-development.jpg',
    category: '开发服务',
    details: '我们提供端到端的AI应用开发服务，包括需求分析、算法选型、模型训练、应用集成和部署优化。无论是自然语言处理、计算机视觉还是预测分析，我们都能为您构建高性能、可扩展的AI系统。',
    features: [
      '定制模型开发与训练',
      '现有系统AI能力集成',
      '云端与边缘端部署优化',
      '持续模型监控与迭代'
    ]
  },
  {
    id: 'web-development',
    title: 'Web应用开发',
    description: '现代化企业级Web应用开发，响应式设计，跨平台兼容',
    imageUrl: '/web-development.jpg',
    category: '开发服务',
    details: '我们专注于构建高性能、用户友好的Web应用，采用最新的前端框架和后端技术栈。从单页应用到复杂的企业系统，我们确保您的Web解决方案具备出色的用户体验和可扩展性。',
    features: [
      '响应式网站设计',
      '前后端分离架构',
      'API设计与集成',
      '性能优化与安全加固'
    ]
  },
  {
    id: 'consulting',
    title: '技术咨询服务',
    description: '专业的技术战略咨询，帮助企业实现数字化转型',
    imageUrl: '/consulting.jpg',
    category: '咨询服务',
    details: '我们的技术咨询团队为企业提供战略指导，帮助您识别数字化转型机会，优化技术架构，并制定可持续的技术发展路线图。无论是技术选型还是流程优化，我们都能提供专业建议。',
    features: [
      '数字化转型战略',
      '技术架构评估',
      '开发流程优化',
      '团队技能提升培训'
    ]
  }
];