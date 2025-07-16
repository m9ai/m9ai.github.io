export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: '小程序' | 'H5' | 'App';
  category: string;
  url: string;
  rating: number;
  features: string[];
  screenshotUrls: string[];
}

export const apps: App[] = [
  {
    id: 'ai-assistant',
    name: '智能AI助手',
    description: '基于大语言模型的智能对话助手，支持多轮对话和复杂任务处理',
    icon: '/icons/ai-assistant.svg',
    type: '小程序',
    category: '工具',
    url: '/apps/ai-assistant',
    rating: 4.8,
    features: ['自然语言理解', '多轮对话', '任务自动化', '知识库集成'],
    screenshotUrls: ['/screenshots/ai-assistant-1.png', '/screenshots/ai-assistant-2.png']
  },
  {
    id: 'image-generator',
    name: '图像生成大师',
    description: 'AI驱动的图像生成工具，支持文本转图像和图像风格迁移',
    icon: '/icons/image-generator.svg',
    type: 'H5',
    category: '创意',
    url: '/apps/image-generator',
    rating: 4.7,
    features: ['文本生成图像', '风格迁移', '高清分辨率', '批量处理'],
    screenshotUrls: ['/screenshots/image-generator-1.png', '/screenshots/image-generator-2.png']
  },
  {
    id: 'code-helper',
    name: '代码助手',
    description: '智能代码生成和优化工具，支持多种编程语言和框架',
    icon: '/icons/code-helper.svg',
    type: 'App',
    category: '开发',
    url: '/apps/code-helper',
    rating: 4.9,
    features: ['代码生成', '错误修复', '性能优化', '文档生成'],
    screenshotUrls: ['/screenshots/code-helper-1.png', '/screenshots/code-helper-2.png']
  },
  {
    id: 'data-analyzer',
    name: '数据分析专家',
    description: 'AI驱动的数据分析工具，支持数据可视化和预测分析',
    icon: '/icons/data-analyzer.svg',
    type: 'H5',
    category: '商务',
    url: '/apps/data-analyzer',
    rating: 4.6,
    features: ['数据可视化', '预测分析', '异常检测', '报告生成'],
    screenshotUrls: ['/screenshots/data-analyzer-1.png', '/screenshots/data-analyzer-2.png']
  }
];