export interface Doc {
  id: string;
  title: string;
  description: string;
  content: string;
  path: string;
  category: string;
  tags?: string[];
  updatedAt: string;
}

// 文档数据 - 静态数据用于静态导出
export const docsData: Doc[] = [
  {
    id: 'introduction',
    title: '文档中心',
    description: '水杉智境工作室文档中心，提供产品介绍、使用指南和技术文档',
    path: '/docs/introduction',
    category: '入门',
    tags: ['intro', 'guide'],
    updatedAt: '2025-02-09',
    content: `
# 欢迎使用水杉智境工作室

## 简介

水杉智境工作室（Metasequoia AI Studio）是一家专注于企业级 AI 解决方案的技术团队。我们提供大模型私有化部署、应用开发和智能体定制服务。

## 核心服务

### 1. 模型部署
在客户自有服务器环境中部署大语言模型，确保数据安全与隐私保护。

### 2. 大模型应用开发
基于大语言模型构建企业级应用，实现智能客服、内容生成等场景。

### 3. 智能体开发
开发具备自主决策能力的 AI 智能体，自动化复杂业务流程。

## 快速开始

访问我们的 [服务页面](/services) 了解更多详情，或通过 [应用商店](/store) 探索现成的 AI 应用。

## 联系我们

如有任何问题，请通过以下方式联系我们：

- 邮箱：c@m9ai.work
- 微信：扫码添加（见官网底部）
    `
  },
  {
    id: 'model-deployment',
    title: '模型部署指南',
    description: '了解如何在本地或私有云环境中部署大语言模型',
    path: '/docs/model-deployment',
    category: '技术文档',
    tags: ['deployment', 'llm', 'guide'],
    updatedAt: '2025-02-09',
    content: `
# 模型部署指南

## 概述

我们提供主流大模型的本地化部署方案，保障数据安全与隐私，支持自定义微调与性能优化。

## 支持的模型

- GPT 系列
- LLaMA 及其衍生模型
- 文心一言
- 讯飞星火
- 以及更多...

## 部署流程

### 1. 需求评估
联系我们进行需求评估，确定最适合的模型和硬件配置。

### 2. 环境准备
根据评估结果准备服务器环境，包括：
- GPU 配置
- 存储空间
- 网络环境

### 3. 模型部署
我们的工程师将协助完成模型部署和配置。

### 4. 测试验收
进行功能测试和性能调优，确保满足业务需求。

## 核心优势

- **支持主流大模型全覆盖**：包含 GPT 系列、LLaMA、文心一言、讯飞星火等 10+ 主流大模型的本地化适配
- **数据安全与隐私保护**：模型部署在客户自有服务器，数据不出本地网络，满足合规要求
- **深度定制与微调**：基于客户业务数据进行模型微调，提升特定场景下的响应质量
- **性能优化与资源管理**：针对不同硬件环境优化模型推理速度，降低显存占用

## 联系我们

如需了解更多详情，请 [联系我们](/contact)。
    `
  },
  {
    id: 'api-reference',
    title: 'API 文档',
    description: '查看我们提供的 API 接口文档和示例代码',
    path: '/docs/api-reference',
    category: '技术文档',
    tags: ['api', 'reference', 'development'],
    updatedAt: '2025-02-09',
    content: `
# API 文档

## 概述

我们提供 RESTful API 接口，方便您将 AI 能力集成到自己的应用中。

## 认证

所有 API 请求需要在 Header 中包含 API Key：

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## 基础 URL

\`\`\`
https://api.m9ai.work/v1
\`\`\`

## 接口列表

### 文本生成

**POST** /chat/completions

请求参数：
\`\`\`json
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "你好"}
  ]
}
\`\`\`

### 嵌入向量

**POST** /embeddings

请求参数：
\`\`\`json
{
  "model": "text-embedding-ada-002",
  "input": "需要生成嵌入的文本"
}
\`\`\`

## 错误处理

API 使用标准 HTTP 状态码：

- 200: 成功
- 400: 请求参数错误
- 401: 认证失败
- 429: 请求频率限制
- 500: 服务器内部错误

## 联系我们

如需 API 访问权限，请 [联系我们](/contact)。
    `
  },
  {
    id: 'faq',
    title: '常见问题',
    description: '查看用户最常问的问题和解答',
    path: '/docs/faq',
    category: '帮助',
    tags: ['faq', 'help'],
    updatedAt: '2025-02-09',
    content: `
# 常见问题

## 一般问题

### Q: 你们提供哪些服务？

A: 我们提供三大核心服务：
1. **模型部署** - 在私有环境部署大语言模型
2. **应用开发** - 基于大模型构建企业级应用
3. **智能体开发** - 开发具备自主决策能力的 AI 智能体

### Q: 如何开始合作？

A: 您可以通过以下方式开始：
1. 访问 [服务页面](/services) 了解详情
2. 填写 [联系表单](/contact) 描述您的需求
3. 直接发送邮件至 c@m9ai.work

### Q: 支持哪些大模型？

A: 我们支持主流的大语言模型，包括：
- OpenAI GPT 系列
- Meta LLaMA 系列
- 百度文心一言
- 讯飞星火
- 以及其他开源模型

## 技术问题

### Q: 私有化部署是否安全？

A: 是的，私有化部署将模型和数据保存在您自己的服务器上，数据不会离开您的网络环境，满足各类合规要求。

### Q: 需要什么样的硬件配置？

A: 硬件需求取决于具体的模型和使用场景。一般来说：
- 小型模型：单张消费级显卡（如 RTX 4090）
- 中型模型：单张/多张专业显卡（如 A100）
- 大型模型：多卡集群

我们会在需求评估阶段提供具体的硬件建议。

### Q: 是否提供技术支持？

A: 是的，我们提供 7×24 小时技术支持，确保您的业务正常运行。

## 其他问题

如有其他问题，请随时 [联系我们](/contact)。
    `
  }
];

// 获取所有文档
export function getAllDocs(): Doc[] {
  return docsData;
}

// 根据 ID 获取文档
export function getDocById(id: string): Doc | null {
  return docsData.find(doc => doc.id === id) || null;
}

// 根据分类获取文档
export function getDocsByCategory(category: string): Doc[] {
  return docsData.filter(doc => doc.category === category);
}

// 搜索文档
export function searchDocs(query: string): Doc[] {
  const lowerQuery = query.toLowerCase();
  return docsData.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.description.toLowerCase().includes(lowerQuery) ||
    doc.content.toLowerCase().includes(lowerQuery) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// 获取所有分类
export function getCategories(): string[] {
  return [...new Set(docsData.map(doc => doc.category))];
}
