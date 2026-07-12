---
title: API 集成开发指南
description: 学习如何将大模型能力集成到您的应用程序中
category: 开发指南
tags: [API, 集成, SDK, RESTful, 开发]
updatedAt: 2025-02-09
---

# API 集成开发指南

## 概述

本文档介绍如何通过 API 将大语言模型能力集成到您的应用程序中，支持多种编程语言和框架。

## 快速开始

### 获取 API 密钥

1. 登录控制台: https://console.m9ai.work
2. 进入「API 管理」页面
3. 点击「创建密钥」，复制生成的 API Key

### 基础请求示例

**cURL**
```bash
curl -X POST "https://api.m9ai.work/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "你好！"}
    ]
  }'
```

**Python**
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.m9ai.work/v1"
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "你好！"}
    ]
)

print(response.choices[0].message.content)
```

**JavaScript**
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.m9ai.work/v1',
});

async function chat() {
  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: '你好！' }],
  });
  
  console.log(response.choices[0].message.content);
}

chat();
```

## API 参考

### 对话补全

**Endpoint**: `POST /v1/chat/completions`

**请求参数**

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| model | string | 是 | 模型名称: gpt-4, gpt-3.5-turbo |
| messages | array | 是 | 消息列表 |
| temperature | float | 否 | 随机性 (0-2), 默认 0.7 |
| max_tokens | integer | 否 | 最大生成 token 数 |
| stream | boolean | 否 | 是否流式输出 |

**响应格式**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "你好！有什么可以帮助你的吗？"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

### 文本嵌入

**Endpoint**: `POST /v1/embeddings`

```python
response = client.embeddings.create(
    model="text-embedding-ada-002",
    input="要嵌入的文本"
)

embedding = response.data[0].embedding
```

### 流式输出

```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "讲个故事"}],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## 高级用法

### 函数调用

```python
def get_weather(location, unit="celsius"):
    # 实际天气查询逻辑
    return {"temperature": 25, "condition": "sunny"}

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "获取指定位置的天气信息",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "城市名称，如北京、上海"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "温度单位"
                }
            },
            "required": ["location"]
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "北京今天天气怎么样？"}],
    tools=tools,
    tool_choice="auto"
)

# 处理函数调用
if response.choices[0].finish_reason == "tool_calls":
    tool_call = response.choices[0].message.tool_calls[0]
    function_name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)
    
    if function_name == "get_weather":
        result = get_weather(**arguments)
        print(result)
```

### 错误处理

```python
from openai import APIError, RateLimitError, AuthenticationError

try:
    response = client.chat.completions.create(...)
except AuthenticationError:
    print("API 密钥无效，请检查配置")
except RateLimitError:
    print("请求过于频繁，请稍后重试")
except APIError as e:
    print(f"API 错误: {e.message}")
```

## 最佳实践

### 1. 连接池配置

```python
import httpx

# 自定义 HTTP 客户端
http_client = httpx.Client(
    limits=httpx.Limits(
        max_connections=100,
        max_keepalive_connections=20
    ),
    timeout=httpx.Timeout(60.0)
)

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.m9ai.work/v1",
    http_client=http_client
)
```

### 2. 重试策略

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def chat_with_retry(messages):
    return client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )
```

### 3. 请求超时设置

```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    timeout=30.0  # 30秒超时
)
```

## SDK 下载

- **Python**: `pip install openai`
- **JavaScript**: `npm install openai`
- **Go**: `go get github.com/sashabaranov/go-openai`
- **Java**: Maven/Gradle 依赖见文档

## 更多资源

- 完整 API 文档: https://docs.m9ai.work/api
- 示例代码: https://github.com/m9ai/examples
- 技术支持: c@m9ai.work
