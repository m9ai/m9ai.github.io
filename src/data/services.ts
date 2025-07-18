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
    id: 'model-deployment',
    title: '大模型私有化部署',
    description: '提供主流大模型的本地化部署方案，保障数据安全与隐私，支持自定义微调与性能优化',
    imageUrl: '/jiaoyu.jpg',
    category: 'AI服务',
    details: '提供主流大模型的本地化部署方案，保障数据安全与隐私，支持自定义微调与性能优化。我们的解决方案包括模型选型、环境配置、性能调优和持续维护，帮助企业在自有基础设施上安全高效地运行AI模型。',
    features: [
      '多模型支持与适配',
      '数据本地化与隐私保护',
      '性能优化与资源管理',
      '自定义微调与迭代更新'
    ]
  },
  {
    id: 'model-application',
    title: '大模型应用开发',
    description: '基于大模型API构建各类智能应用，包括聊天机器人、内容生成工具、智能分析系统等',
    imageUrl: '/jinrong.jpg',
    category: 'AI服务',
    details: '基于大模型API构建各类智能应用，包括聊天机器人、内容生成工具、智能分析系统等。我们专注于将大模型能力与业务场景深度融合，开发实用、高效的AI应用解决方案。',
    features: [
      '聊天机器人开发',
      '智能内容生成系统',
      '数据分析与可视化',
      '多模态交互界面设计'
    ]
  },
  {
    id: 'agent-development',
    title: '智能体开发',
    description: '开发具备自主决策能力的AI智能体，支持多工具集成、任务规划与长期记忆管理',
    imageUrl: '/yiliao.jpg',
    category: 'AI服务',
    details: '开发具备自主决策能力的AI智能体，支持多工具集成、任务规划与长期记忆管理。我们的智能体解决方案能够理解复杂指令，规划执行步骤，并通过多工具协作完成复杂任务。',
    features: [
      '自主任务规划与执行',
      '多工具集成与调用',
      '长期记忆与上下文理解',
      '人机协作流程设计'
    ]
  }
];