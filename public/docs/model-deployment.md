---
title: 模型部署指南
description: 提供主流大模型的本地化部署方案，保障数据安全与隐私，支持自定义微调与性能优化
category: 技术文档
tags: [模型部署, 私有化, 大模型, GPU, Docker, Kubernetes]
updatedAt: 2025-02-10
---

# 模型部署指南

## 概述

我们提供主流大模型的本地化部署方案，帮助企业在自有基础设施上运行大语言模型，保障数据安全与隐私，支持自定义微调与性能优化。本指南涵盖从单机部署到分布式集群的完整方案。

## 支持的模型

### 开源模型

| 模型 | 参数量 | 显存需求 | 推荐用途 |
|------|--------|----------|----------|
| LLaMA 2/3 | 7B-70B | 16GB-160GB | 通用对话、文本生成 |
| Qwen (通义千问) | 7B-72B | 16GB-160GB | 中文场景、代码生成 |
| ChatGLM3 | 6B | 14GB | 中文对话、轻量级部署 |
| Baichuan2 | 7B-13B | 16GB-28GB | 中文场景、企业应用 |
| Yi (零一万物) | 6B-34B | 14GB-80GB | 中英文混合场景 |

### 商用模型（需授权）

- GPT 系列（通过 Azure OpenAI 私有化部署）
- 文心一言企业版
- 讯飞星火企业版

## 系统要求

### 最低配置（7B 模型）

- **CPU**: 8 核及以上
- **内存**: 32GB 及以上
- **存储**: 100GB SSD 及以上
- **GPU**: NVIDIA RTX 3090 / A10 / T4（24GB 显存）

### 推荐配置（13B-70B 模型）

- **CPU**: 16 核及以上
- **内存**: 64GB-256GB
- **存储**: 500GB NVMe SSD
- **GPU**: 
  - 13B 模型: A100 40GB 或 RTX 4090
  - 70B 模型: 2x A100 80GB 或 4x A10

### 软件环境

- **操作系统**: Ubuntu 20.04/22.04 LTS, CentOS 7/8
- **CUDA**: 11.8 或 12.1
- **Docker**: 20.10+（推荐）
- **Python**: 3.9-3.11

## 部署方式

### 方式一：Docker 快速部署（推荐）

#### 1. 安装 Docker 和 NVIDIA Docker

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

#### 2. 拉取模型镜像

```bash
# LLaMA 2 7B 示例
docker pull m9ai/llama2-7b:latest

# 通义千问 7B
docker pull m9ai/qwen-7b:latest
```

#### 3. 启动容器

```bash
docker run -d \
  --name llm-server \
  --gpus all \
  -p 8000:8000 \
  -v /data/models:/models \
  -e MODEL_PATH=/models/llama-2-7b \
  -e CUDA_VISIBLE_DEVICES=0 \
  m9ai/llama2-7b:latest
```

#### 4. 验证部署

```bash
curl http://localhost:8000/v1/models

# 测试对话
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-2-7b",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### 方式二：Kubernetes 集群部署

适用于大规模生产环境，支持自动扩缩容。

#### 1. 准备 Kubernetes 集群

确保集群已配置 NVIDIA GPU 设备插件：

```bash
kubectl apply -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.14.0/nvidia-device-plugin.yml
```

#### 2. 部署模型服务

```yaml
# model-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: llm-server
  template:
    metadata:
      labels:
        app: llm-server
    spec:
      containers:
      - name: llm
        image: m9ai/llama2-7b:latest
        resources:
          limits:
            nvidia.com/gpu: 1
        ports:
        - containerPort: 8000
        env:
        - name: MODEL_PATH
          value: "/models/llama-2-7b"
        volumeMounts:
        - name: model-storage
          mountPath: /models
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: llm-service
spec:
  selector:
    app: llm-server
  ports:
  - port: 8000
    targetPort: 8000
  type: LoadBalancer
```

部署：

```bash
kubectl apply -f model-deployment.yaml
```

### 方式三：裸机部署

适用于需要深度定制的场景。

#### 1. 安装依赖

```bash
# 安装 Python 依赖
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install transformers accelerate bitsandbytes
pip install vllm  # 高性能推理引擎
```

#### 2. 下载模型

```python
from huggingface_hub import snapshot_download

# 下载模型到本地
model_path = snapshot_download(
    repo_id="meta-llama/Llama-2-7b-chat-hf",
    local_dir="./models/llama-2-7b",
    token="your_huggingface_token"
)
```

#### 3. 启动服务（使用 vLLM）

```python
from vllm import LLM, SamplingParams

# 初始化模型
llm = LLM(
    model="./models/llama-2-7b",
    tensor_parallel_size=1,  # GPU 数量
    gpu_memory_utilization=0.9,
    max_model_len=4096
)

# 推理示例
sampling_params = SamplingParams(temperature=0.7, max_tokens=512)
prompts = ["你好，请介绍一下自己"]
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(output.outputs[0].text)
```

## 性能优化

### 量化技术

使用 4-bit 或 8-bit 量化可大幅降低显存占用：

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# 4-bit 量化配置
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    "model_path",
    quantization_config=quantization_config,
    device_map="auto"
)
```

**量化效果对比：**

| 模型 | 原始显存 | 8-bit 显存 | 4-bit 显存 | 性能损失 |
|------|----------|------------|------------|----------|
| LLaMA2-7B | 14GB | 8GB | 5GB | <3% |
| LLaMA2-13B | 26GB | 15GB | 9GB | <5% |
| LLaMA2-70B | 140GB | 80GB | 48GB | <5% |

### 推理加速

#### vLLM 加速

vLLM 使用 PagedAttention 算法，可提升 2-4 倍吞吐量：

```bash
python -m vllm.entrypoints.openai.api_server \
  --model /models/llama-2-7b \
  --tensor-parallel-size 1 \
  --max-num-seqs 256 \
  --max-model-len 4096
```

#### TensorRT-LLM 加速

NVIDIA TensorRT-LLM 可提供极致性能：

```bash
# 构建 TensorRT 引擎
trtllm-build --checkpoint_dir ./model \
             --output_dir ./trt_engines/llama-7b \
             --gemm_plugin float16

# 运行推理
python3 run.py --engine_dir=./trt_engines/llama-7b \
               --max_output_len=512
```

### 缓存策略

启用 KV Cache 可加速多轮对话：

```python
# vLLM 自动管理 KV Cache
llm = LLM(
    model="model_path",
    enable_prefix_caching=True,  # 前缀缓存
    max_num_batched_tokens=4096
)
```

## API 使用指南

### OpenAI 兼容接口

我们的部署方案提供与 OpenAI API 兼容的接口：

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"  # 本地部署可不设置
)

# 对话 completion
response = client.chat.completions.create(
    model="llama-2-7b",
    messages=[
        {"role": "system", "content": "你是一个专业的 AI 助手"},
        {"role": "user", "content": "解释一下量子计算"}
    ],
    temperature=0.7,
    max_tokens=1024
)

print(response.choices[0].message.content)
```

### 流式响应

```python
stream = client.chat.completions.create(
    model="llama-2-7b",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## 监控与日志

### 启用 Prometheus 监控

```bash
docker run -d \
  --name llm-monitor \
  -p 8000:8000 \
  -e ENABLE_METRICS=true \
  -e PROMETHEUS_PORT=8080 \
  m9ai/llama2-7b:latest
```

监控指标：

- `vllm:gpu_cache_usage_perc` - GPU 缓存使用率
- `vllm:num_requests_running` - 正在处理的请求数
- `vllm:time_to_first_token_seconds` - 首 token 延迟
- `vllm:time_per_output_token_seconds` - 每个 token 生成时间

### 日志配置

```yaml
# logging.yaml
logging:
  level: INFO
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
  handlers:
    - file: /var/log/llm-server.log
    - console
```

## 安全与合规

### 网络安全

- 使用 HTTPS/TLS 加密通信
- 配置防火墙规则，限制访问 IP
- 启用 API 密钥认证

```bash
# 生成 API 密钥
export API_KEY=$(openssl rand -hex 32)

# 启动时启用认证
docker run -e API_KEY=$API_KEY m9ai/llama2-7b:latest
```

### 数据保护

- 所有数据保留在本地，不传输到外部
- 支持磁盘加密
- 定期安全审计

## 故障排查

### 常见问题

#### 1. CUDA Out of Memory

**原因**：显存不足
**解决**：
- 启用量化（4-bit/8-bit）
- 减小 `max_model_len`
- 使用 ZeRO  offload 到 CPU

```python
llm = LLM(
    model="model_path",
    gpu_memory_utilization=0.85,  # 降低显存占用比例
    max_model_len=2048  # 减小最大序列长度
)
```

#### 2. 模型加载缓慢

**原因**：磁盘 I/O 瓶颈
**解决**：
- 使用 NVMe SSD
- 预加载模型到内存
- 启用模型并行

#### 3. 推理速度慢

**原因**：批处理大小不合适
**解决**：
- 调整 `max_num_seqs`
- 启用连续批处理
- 使用更快的推理引擎（vLLM/TensorRT-LLM）

### 诊断命令

```bash
# 检查 GPU 状态
nvidia-smi

# 查看容器日志
docker logs llm-server -f

# 测试 API 连通性
curl -v http://localhost:8000/health

# 监控 GPU 利用率
watch -n 1 nvidia-smi
```

## 高级配置

### 多模型负载均衡

使用 Nginx 实现多模型实例负载均衡：

```nginx
upstream llm_backend {
    server localhost:8000;
    server localhost:8001;
    server localhost:8002;
}

server {
    listen 80;
    location /v1/ {
        proxy_pass http://llm_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 自动扩缩容

使用 KEDA 基于队列长度自动扩缩容：

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: llm-scaler
spec:
  scaleTargetRef:
    name: llm-deployment
  triggers:
  - type: metrics-api
    metadata:
      targetValue: "10"
      url: "http://prometheus:9090/api/v1/query?query=vllm:num_requests_waiting"
```

## 最佳实践

1. **生产环境必须使用量化模型**，显存占用降低 50-70%
2. **启用连续批处理**，提升吞吐量 3-5 倍
3. **配置适当的 max_model_len**，避免内存浪费
4. **使用 SSD 存储模型**，减少加载时间
5. **定期监控 GPU 温度和利用率**，防止过热
6. **启用日志轮转**，防止磁盘占满
7. **配置健康检查**，实现故障自动恢复

## 获取支持

遇到部署问题？我们提供：

- **免费技术咨询**：[预约咨询](/contact)
- **企业部署服务**：包含环境搭建、模型优化、运维培训
- **7x24 小时支持**：专属技术支持团队

如需了解更多详情或定制部署方案，请 [联系我们](/contact)。