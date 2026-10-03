/* 应用目录。
 *
 * 这里只放与语言无关的稳定字段：id / 图标 / 链接 / 评分 / 截图。
 * 名称、描述、功能列表、类型与分类这些会展示的文案，此前直接写死中文导致
 * 英文站整页漏中文（同时对 nearby 的 Store.types / Store.categories 两套
 * 已有文案重复维护）。现在统一收进字典 Store.apps.<id>.* ，
 * type / category 也改成稳定英文 key（`小程序` -> `miniProgram`）。
 */
export interface App {
  id: string;
  icon: string;
  type: 'miniProgram' | 'h5' | 'app';
  category: 'tools' | 'creativity' | 'development' | 'business';
  url: string;
  rating: number;
  screenshotUrls: string[];
}

export const apps: App[] = [
  {
    id: 'ai-assistant',
    icon: '/icons/ai-assistant.svg',
    type: 'miniProgram',
    category: 'tools',
    url: '/apps/ai-assistant',
    rating: 4.8,
    screenshotUrls: ['/screenshots/ai-assistant-1.png', '/screenshots/ai-assistant-2.png'],
  },
  {
    id: 'image-generator',
    icon: '/icons/image-generator.svg',
    type: 'h5',
    category: 'creativity',
    url: '/apps/image-generator',
    rating: 4.7,
    screenshotUrls: ['/screenshots/image-generator-1.png', '/screenshots/image-generator-2.png'],
  },
  {
    id: 'code-helper',
    icon: '/icons/code-helper.svg',
    type: 'app',
    category: 'development',
    url: '/apps/code-helper',
    rating: 4.9,
    screenshotUrls: ['/screenshots/code-helper-1.png', '/screenshots/code-helper-2.png'],
  },
  {
    id: 'data-analyzer',
    icon: '/icons/data-analyzer.svg',
    type: 'h5',
    category: 'business',
    url: '/apps/data-analyzer',
    rating: 4.6,
    screenshotUrls: ['/screenshots/data-analyzer-1.png', '/screenshots/data-analyzer-2.png'],
  },
];
