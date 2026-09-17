---
title: API 文档
description: 水杉智境 API 接口文档，包含认证方式、基础 URL、接口列表和错误处理说明
category: 技术文档
tags: [API, RESTful, 接口文档, 开发指南]
updatedAt: 2025-02-09
---

# API 文档

## 概述

我们提供 RESTful API 接口，方便您将 AI 能力集成到自己的应用中。

## 认证

所有 API 请求需要在 Header 中包含 API Key：

```bash
Authorization: Bearer YOUR_API_KEY
```

## 基础 URL

```bash
https://api.m9ai.work/v1
```

## 接口列表

### 文本生成

**POST** /chat/completions

请求参数：
```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "你好"}
  ]
}
```

### 嵌入向量

**POST** /embeddings

请求参数：
```json
{
  "model": "text-embedding-ada-002",
  "input": "需要生成嵌入的文本"
}
```

## 错误处理

API 使用标准 HTTP 状态码：

- 200: 成功
- 400: 请求参数错误
- 401: 认证失败
- 429: 请求频率限制
- 500: 服务器内部错误

## 联系我们

如需 API 访问权限，请 [联系我们](/contact)。
