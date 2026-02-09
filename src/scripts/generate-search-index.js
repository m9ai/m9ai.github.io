/**
 * 搜索索引生成脚本
 * 在构建时运行，生成用于客户端搜索的 JSON 索引文件
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 搜索项类型定义

// 获取嵌套对象值
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // 返回原路径如果找不到
    }
  }
  return typeof value === 'string' ? value : path;
}

// 服务数据
const services = [
  {
    id: 'model-deployment',
    category: 'aiService',
  },
  {
    id: 'model-application',
    category: 'aiService',
  },
  {
    id: 'agent-development',
    category: 'aiService',
  }
];

// 生成搜索索引
async function generateSearchIndex() {
  const searchItems = [];
  const docsDir = path.join(process.cwd(), 'public', 'docs');
  
  // 读取翻译文件
  const messagesZh = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'messages', 'zh.json'), 'utf-8'));
  const messagesEn = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'messages', 'en.json'), 'utf-8'));

  // 1. 添加服务页面到索引（合并中英文）
  services.forEach((service) => {
    const titleKey = `services.${service.id}.title`;
    const descKey = `services.${service.id}.description`;
    const detailsKey = `services.${service.id}.details`;
    
    // 获取中英文翻译
    const titleZh = getNestedValue(messagesZh, titleKey);
    const titleEn = getNestedValue(messagesEn, titleKey);
    const descZh = getNestedValue(messagesZh, descKey);
    const descEn = getNestedValue(messagesEn, descKey);
    const detailsZh = getNestedValue(messagesZh, detailsKey);
    const detailsEn = getNestedValue(messagesEn, detailsKey);
    
    // 合并文本以便双语搜索
    const combinedContent = `${detailsZh} ${detailsEn !== detailsZh ? detailsEn : ''}`.trim();
    
    searchItems.push({
      id: `service-${service.id}`,
      title: titleZh, // 显示用中文
      description: descZh,
      content: combinedContent,
      url: `/services/${service.id}`,
      type: 'service',
      category: service.category,
    });
  });

  // 2. 添加文档到索引
  if (fs.existsSync(docsDir)) {
    const docFiles = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md'));

    for (const file of docFiles) {
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      // 提取纯文本（移除 Markdown 标记）
      const plainText = body
        .replace(/#+ /g, '') // 移除标题标记
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
        .replace(/[*_`]/g, '') // 移除粗体、斜体、代码标记
        .replace(/\n+/g, ' ') // 替换换行为空格
        .trim();

      const slug = file.replace('.md', '');
      
      // 跳过隐私政策和服务条款的英文版本（通过 main 版本索引）
      if (slug.endsWith('-en')) continue;

      searchItems.push({
        id: `doc-${slug}`,
        title: data.title || slug,
        description: data.description || '',
        content: plainText.slice(0, 1000), // 限制内容长度
        url: `/docs/${slug}`,
        type: 'doc',
        category: data.category || '文档',
        tags: data.tags || [],
      });
    }
  }

  // 3. 添加其他重要页面
  const staticPages = [
    { id: 'page-home', title: '首页', description: '水杉智境工作室 - 企业级 AI 解决方案', url: '/' },
    { id: 'page-services', title: '服务', description: '探索我们的 AI 服务解决方案', url: '/services' },
    { id: 'page-store', title: '应用商店', description: '发现实用的 AI 应用和工具', url: '/store' },
    { id: 'page-docs', title: '文档', description: '产品文档和使用指南', url: '/docs' },
    { id: 'page-contact', title: '联系我们', description: '与我们取得联系', url: '/contact' },
  ];

  staticPages.forEach((page) => {
    searchItems.push({
      ...page,
      content: page.description,
      type: 'page',
    });
  });

  // 写入索引文件
  const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(searchItems, null, 2));

  console.log(`✅ 搜索索引已生成: ${searchItems.length} 条记录`);
  console.log(`📁 输出路径: ${outputPath}`);
}

// 运行生成
generateSearchIndex().catch((err) => {
  console.error('❌ 生成搜索索引失败:', err);
  process.exit(1);
});
