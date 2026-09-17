---
title: 提示词工程最佳实践
description: 掌握提示词设计技巧，提升大模型输出质量与可靠性
category: 进阶教程
tags: [提示词, Prompt, 提示工程, LLM优化, 角色设定]
updatedAt: 2025-02-09
---

# 提示词工程最佳实践

## 概述

提示词工程（Prompt Engineering）是通过设计和优化输入提示词，引导大语言模型（LLM）生成高质量、符合预期的输出的技术。良好的提示词设计是 AI 应用成功的关键。

## 提示词基本结构

### 标准格式

```markdown
# 角色设定
你是[专业角色]，具备[相关经验/能力]。

# 任务描述
请完成以下任务：[具体任务]

# 输入数据
[需要处理的内容]

# 约束条件
- 条件1
- 条件2
- ...

# 输出格式
请以[格式]输出，包含以下要素：
1. 要素A
2. 要素B
3. ...
```

### 示例：产品文案生成

```markdown
## 角色
你是一位资深的电商文案策划专家，拥有10年文案撰写经验，擅长挖掘产品卖点并转化为吸引人的文案。

## 任务
为以下产品撰写一则朋友圈推广文案。

## 产品信息
- 产品名称：智能颈椎按摩仪
- 核心功能：热敷+脉冲按摩+APP控制
- 目标人群：25-40岁办公室白领
- 价格区间：299-399元
- 卖点：15分钟快速缓解疲劳、静音设计、便携可折叠

## 要求
1. 开头要有吸引力，3秒内抓住注意力
2. 突出解决的具体痛点
3. 加入社会认同元素（如销量、好评）
4. 结尾有明确的行动号召
5. 字数控制在150字以内
6. 语气亲切自然，避免过度营销感

## 输出格式
直接输出文案内容，不需要额外解释。
```

## 核心技巧

### 1. 角色设定（Role Prompting）

通过设定专业角色，激活模型的领域知识：

```markdown
❌ 一般："写一篇关于糖尿病的文章"

✅ 优化："你是一位内分泌科主任医师，拥有20年临床经验。请用通俗语言向糖尿病患者解释血糖控制的重要性，包括：
1. 血糖失控的危害
2. 日常监测要点
3. 饮食控制原则
要求：专业准确但易懂，语气亲切关怀。"
```

### 2. 思维链（Chain-of-Thought）

引导模型展示推理过程，提升复杂任务准确率：

```markdown
请解答以下数学问题，并展示详细的推理步骤：

问题：一个水箱有2个进水管和1个排水管。A管单独注满需要6小时，B管单独注满需要4小时，排水管单独排空需要8小时。如果三管同时打开，需要多久注满水箱？

思考过程：
1. 首先，我需要计算每个管子的工作效率...
2. 然后，计算三管同时工作时的净效率...
3. 最后，根据净效率计算注满时间...

请按以上思路详细解答。
```

### 3. 少样本学习（Few-Shot Learning）

通过示例教模型理解任务模式：

```json
将以下用户评论转换为结构化数据。

示例1：
输入："这款耳机音质很好，但是佩戴不舒服，戴久了耳朵疼。价格299有点贵。"
输出：
{
  "sentiment": "mixed",
  "pros": ["音质好"],
  "cons": ["佩戴不舒适", "价格高"],
  "price_mentioned": 299,
  "purchase_intent": "neutral"
}

示例2：
输入："太棒了！物流超快，昨天买今天到。手机拍照效果惊艳，完全超出预期！"
输出：
{
  "sentiment": "positive",
  "pros": ["物流快", "拍照效果好"],
  "cons": [],
  "price_mentioned": null,
  "purchase_intent": "high"
}

现在请处理：
输入："用了三天就坏了，客服态度还差，退款流程繁琐。再也不买了。"
输出：
```

### 4. 输出格式控制

使用结构化格式规范输出：

```json
# JSON 格式
请以JSON格式返回，包含以下字段：
{
  "title": "文章标题（字符串）",
  "summary": "摘要（50字以内）",
  "keywords": ["关键词数组"],
  "content": "正文内容（Markdown格式）",
  "confidence": 置信度（0-1浮点数）
}

# Markdown 表格
请以表格形式对比以下方案：
| 方案 | 优点 | 缺点 | 适用场景 | 成本 |
|------|------|------|----------|------|
| ... | ... | ... | ... | ... |

# 代码格式
请提供Python代码实现，要求：
1. 包含类型注解
2. 添加docstring
3. 包含3个unittest测试用例
```

## 高级技巧

### 1. 自我一致性（Self-Consistency）

对同一问题多次采样，选择最一致的答案：

```python
from collections import Counter

def self_consistency_prompt(question, n_samples=5):
    answers = []
    for _ in range(n_samples):
        response = llm.generate(
            f"{question}\n请一步步思考并给出答案。",
            temperature=0.7
        )
        answers.append(extract_answer(response))
    
    # 投票选择最常见的答案
    return Counter(answers).most_common(1)[0][0]
```

### 2. 递归提示（Recursive Prompting）

将复杂任务分解为子任务：

```markdown
# 主任务：撰写技术文档
步骤1：请先列出本文档应该包含的章节大纲
步骤2：针对每个章节，简要说明应该覆盖的核心内容
步骤3：基于以上大纲，撰写第一章的详细内容
步骤4：检查第一章内容，确保包含所有要点
步骤5：继续撰写下一章...

当前执行：步骤1
```

### 3. 对抗性提示（Adversarial Prompting）

让模型自我检查和改进：

```markdown
请完成以下翻译任务：

原文：The quick brown fox jumps over the lazy dog.

步骤1：直接翻译
步骤2：检查翻译的准确性、流畅度
步骤3：识别可能的问题
步骤4：基于检查改进翻译
步骤5：输出最终版本

请按以上步骤执行。
```

### 4. 多模态提示

结合文本和图像的提示：

```markdown
分析以下UI设计图，并给出改进建议：

[图片]

请从以下维度分析：
1. 视觉层次：信息层级是否清晰？
2. 色彩运用：配色是否协调？是否符合品牌调性？
3. 布局合理性：元素间距、对齐方式
4. 可用性：交互元素是否易于识别和操作？
5. 改进建议：给出3-5条具体优化建议

输出格式：
## 整体评价
[总体评价]

## 详细分析
### 1. 视觉层次
[分析内容]

### 2. 色彩运用
[分析内容]
...

## 改进建议
1. [建议1]
2. [建议2]
...
```

## 场景化模板

### 场景1：代码生成

```markdown
你是一位{语言}开发专家。请编写代码实现以下功能：

功能描述：
{功能详细描述}

要求：
- 遵循{代码规范}
- 包含完整的错误处理
- 添加详细的注释
- 时间复杂度控制在{要求}
- 提供3个测试用例

输入示例：
{示例输入}

预期输出：
{示例输出}

请只返回代码，不要包含解释。
```

### 场景2：数据分析报告

```markdown
你是一位数据分析师。请基于以下数据生成分析报告。

数据：
{数据内容}

分析维度：
1. 趋势分析：关键指标的变化趋势
2. 异常检测：指出异常数据点及可能原因
3. 相关性分析：各指标间的关联关系
4. 业务洞察：3-5条可落地的业务建议

输出要求：
- 使用专业但易懂的语言
- 关键数据需要标注
- 适当使用图表描述（以Markdown表格呈现）
- 报告控制在1000字以内
```

### 场景3：客户服务回复

```markdown
你是一位客服专员，负责处理客户咨询。请根据以下信息回复客户。

客户信息：
- 姓名：{客户名}
- 会员等级：{等级}
- 历史订单：{订单数}笔

客户问题：
{问题内容}

相关知识：
{知识库内容}

回复要求：
1. 称呼客户姓名
2. 先表达理解和共情
3. 清晰解答问题
4. 如涉及问题，提供解决方案
5. 结尾询问是否还有其他需要帮助
6. 整体语气：{语气要求}

回复字数：150-200字
```

## 调试与优化

### 1. A/B 测试框架

```python
def test_prompt_variants(task, variants, eval_criteria):
    results = []
    for name, prompt in variants.items():
        output = llm.generate(prompt.format(task=task))
        score = eval_criteria(output)
        results.append({
            "variant": name,
            "output": output,
            "score": score
        })
    return sorted(results, key=lambda x: x["score"], reverse=True)

# 使用示例
variants = {
    "v1": "翻译以下内容为中文：{task}",
    "v2": "你是专业翻译，请将以下内容翻译成地道的中文：{task}",
    "v3": "请将以下英文翻译成中文，要求：\n1. 准确传达原意\n2. 符合中文表达习惯\n3. 保持专业术语一致\n\n内容：{task}"
}

def eval_translation(output):
    # 使用BLEU score或其他指标评估
    pass

best = test_prompt_variants("Hello world", variants, eval_translation)
```

### 2. 提示词版本管理

```yaml
# prompts.yaml
version: "1.2.0"
prompts:
  customer_service:
    name: "客户服务回复"
    template: |
      你是一位{role}...
    parameters:
      role:
        type: string
        default: "资深客服专员"
    examples:
      - input: "我想退货"
        expected_output: "..."
    metrics:
      - response_time
      - satisfaction_score
```

### 3. 常见错误与解决

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 输出过长 | 未限制长度 | 明确指定字数限制 |
| 格式不符 | 格式描述不清 | 提供输出示例 |
| 回答偏离 | 任务描述模糊 | 细化任务要求 |
| 创意不足 | 温度设置过低 | 提高 temperature |
| 出现幻觉 | 缺乏约束 | 增加"基于提供信息"等约束 |

## 工具推荐

### 提示词开发工具

- **LangSmith**: OpenAI 出品的提示词调试平台
- **PromptLayer**: 提示词版本管理与性能追踪
- **Weight & Biases**: 机器学习实验追踪，支持提示词优化
- **Pezzo**: 开源提示词管理和优化平台

### 提示词库

- **Prompt Engineering Guide**: https://www.promptingguide.ai/
- **Awesome ChatGPT Prompts**: GitHub 上的提示词合集
- **FlowGPT**: 社区驱动的提示词分享平台

## 安全与伦理

### 1. 提示注入防护

```python
def sanitize_input(user_input):
    # 移除潜在的注入指令
    dangerous_patterns = [
        r"ignore previous instructions",
        r"disregard (the|your) (prompt|instructions)",
        r"system prompt",
        r"you are now",
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, user_input, re.IGNORECASE):
            raise ValueError("Potential prompt injection detected")
    
    return user_input
```

### 2. 输出过滤

```python
from transformers import pipeline

# 内容安全检查
safety_checker = pipeline("text-classification", model="distilbert-base-unsafe")

def check_safety(text):
    result = safety_checker(text)[0]
    if result["label"] == "UNSAFE" and result["score"] > 0.8:
        return False, "Content flagged as potentially unsafe"
    return True, text
```

## 总结

提示词工程是一门结合语言学、心理学和工程学的艺术。核心原则：

1. **清晰明确**: 避免模糊表述，使用具体指令
2. **结构完整**: 包含角色、任务、约束、格式等要素
3. **迭代优化**: 基于反馈持续改进
4. **安全可控**: 防范提示注入，确保输出合规

掌握这些技巧，可以显著提升 AI 应用的效果和用户体验。

如需专业支持，请联系我们：
- 邮箱：c@m9ai.work
- 官网：https://m9ai.work
