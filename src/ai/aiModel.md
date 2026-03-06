---
title: 大语言模型
lang: zh-CN
date: 2025-02-27
publish: true
author:  azrng
isOriginal: true
category:
  - ai
  - llm
tag:
  - 大模型
---

## 模型平台

### 在线模型平台

[GitHub Models](https://github.com/marketplace/models)

[硅基流动](https://cloud.siliconflow.cn/models)

###  Hugging Face

是一个综合性AI平台，提供了大量的预训练模型，还支持模型训练、微调、部署等功能。适合开发者或研究人员，需要对模型进行深度定制和优化，或者需要使用丰富的工具和库进行开发。

[https://huggingface.co/](https://huggingface.co/)  

国内镜像站：[https://hf-mirror.com/](https://hf-mirror.com/)  、[https://www.modelscope.cn/](https://www.modelscope.cn/models)

如果想下载GGUF文件搜索的时候记得带上GGUF，例如deepseek-r1-8b-gguf

### Ollama library

提供了大量的预训练模型，专注于模型的部署和使用，适用于希望快速使用预训练模型进行实际应用的用户，降低了使用门槛。适合普通用户或小型团队，希望快速部署和使用预训练模型，而不需要复杂的配置和开发。

网站：[https://ollama.com/library](https://ollama.com/library)

### 中转服务商

LLM中转服务可用性：[https://relaypulse.top/](https://relaypulse.top/)

## 阿里云

qwen2.5-7b(通义千问)

## 智谱

官网地址：https://open.bigmodel.cn/

ANTHROPIC接口地址：https://open.bigmodel.cn/api/anthropic

## llama

llama3.2：由 Meta 开发的开源人工智能模型系列，向量维度值为3072

## DeepSeek

* **DeepSeek-R1**：专注于逻辑推理、问题解决和教育工具，教育平台、研究工具
* **DeepSeek-Coder**：IDE集成、编程平台，专注于编程辅助，包括代码生成、调试和优化

DeepSeek生态全家桶来：https://github.com/deepseek-ai/awesome-deepseek-integration

### 模型命名解读

以下是对“DeepSeek-R1-Distill-Qwen-1.5B-GGUF”和“DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M”模型名称的详细解释：

##### 1. **DeepSeek-R1-Distill-Qwen-1.5B**

- **DeepSeek-R1**：这是 DeepSeek 团队开发的模型系列，R1 表示模型版本。
- **Distill**：表示该模型是通过知识蒸馏技术从更大的模型（如 DeepSeek-R1）中蒸馏而来。蒸馏过程使模型体积更小，但保留了大部分性能。
- **Qwen-1.5B**：表示该模型基于 Qwen 架构，参数量为 15 亿。这种架构在推理任务中表现出色。

##### 2. **DeepSeek-R1-Distill-Qwen-1.5B-GGUF**

- **GGUF**：表示模型采用了 GGUF 格式（General GPU Format），这是一种高效的模型存储格式，支持多种量化方式。
- **适用场景**：这种格式的模型适合在资源受限的环境中运行，例如低配硬件设备。

##### 3. **DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M**

- **Q4_K_M**：表示模型采用了 4-bit 量化技术（Q4），并通过 K-Means 聚类优化。这种量化方式显著降低了模型的显存占用，同时保持较高的性能。
- **适用场景**：这种量化版本适合在显存有限的设备上运行，例如仅使用核显的设备

## 嵌入模型

如何查找中文嵌入模型：[https://blog.csdn.net/2401_85378759/article/details/144737938](https://blog.csdn.net/2401_85378759/article/details/144737938)

### bge-m3

向量维度1024

```shell
ollama pull bge-m3
```

### text-embedding-3-large

OpenAI的大型嵌入模型，输出维度为3072

### mxbai-embed-large

mxbai-embed-large:335m： 嵌入模型

- 适用于高精度短文本处理、文本分类、情感分析、问答系统等。
- 是 RAG 应用的理想选择，适合结合生成模型构建高效的检索增强系统

### nomic-embed-text

`nomic-embed-text` 模型的嵌入向量维度是可变的。该模型支持自定义维度，范围从 **64 到 768**

### all-MiniLM

文本生成嵌入变量（Text Embedding with Variables）是一种将文本数据转换为数值向量（嵌入向量）的技术，通常用于自然语言处理（NLP）任务。嵌入变量的原理基于将文本中的单词、短语或句子映射到高维空间中的点（向量），使得语义相似的文本在向量空间中距离更近。

**适用任务**：广泛应用于语义搜索、文本聚类、句子相似度计算、信息检索等

- 适合需要快速推理和低资源消耗的场景，如实时搜索和推荐系统。
- 由于其较小的模型尺寸，适合在边缘设备或移动设备上部署。

#### 1. **all-MiniLM-L6-v2**

- **特点**：这是一个轻量级模型，具有6层Transformer结构，输出384维的嵌入向量。
- **优点**：
  - **速度快**：模型较小，适合资源受限的场景。
  - **推理效率高**：适合快速开发和部署。
- **适用场景**：
  - 需要快速原型开发的项目。
  - 对计算资源有限制（如在边缘设备或低配置服务器上运行）。
  - 任务对精度要求不高，但对速度要求高。

#### 2.**all-MiniLM-L12-v2**

- **特点**：具有12层Transformer结构，输出384维的嵌入向量。
- **优点**：
  - **精度更高**：相比L6版本，L12版本在语义相似性任务上表现更好。
  - **适合复杂任务**：能够更好地捕捉语义信息。
- **适用场景**：
  - 需要更高精度的语义搜索或文本相似性任务。
  - 有足够的计算资源来支持稍大的模型。

#### 嵌入接口说明

##### 请求参数

调用 `all-MiniLM` 模型的嵌入接口时，通常需要以下参数：

- **`model`**：指定使用的模型名称，例如 `"all-MiniLM-L6-v2"` 或 `"all-MiniLM-L12-v2"`。
- **`input`**：需要嵌入的文本或文本列表。可以是单个字符串，也可以是字符串数组。
- **`truncate`**（可选）：是否截断输入文本以适应模型的最大上下文长度。默认值为 `true`。
- **`options`**（可选）：其他模型参数，具体参数需参考模型文档。
- **`keep_alive`**（可选）：控制模型在请求完成后保持加载到内存中的时间，默认为 `5m`。

#### 调用示例

url示例：`http://localhost:1234/v1/embeddings`

##### 单个文本嵌入

```json
{
  "model": "all-MiniLM-L6-v2",
  "input": "This is a sample sentence for embedding."
}
```

多个文本嵌入

```json
{
  "model": "all-MiniLM-L6-v2",
  "input": ["This is a sample sentence.", "Another sentence for embedding."]
}
```

## 模型部署

### 1、本地部署

本地部署是指将大语言模型直接部署在本地服务器或设备上，适合对数据隐私和安全性要求较高的场景。

#### 常见工具：

- **Ollama**：简化本地部署和运行过程，支持多种预构建模型，可自定义模型。
- **LangChain**：结合检索增强生成（RAG）技术，从文档数据库中检索信息后输入到大语言模型，提升生成内容的准确性和相关性。
- 使用 LMDeploy 或 TRT-LLM 部署：-企业级推荐
  * LMDeploy 提供企业级部署方案，支持离线处理和在线服务。 -推荐
  * TRT-LLM 支持 BF16 和 INT4/INT8 权重，优化推理速度。

#### 优势：

- 数据隐私和安全性高。
- 可根据需求进行模型微调和优化

### 2、云平台部署

通过云服务提供商部署大语言模型，适合需要高可扩展性和灵活性的场景。

#### 常见工具：

- **Hugging Face Text Generation Inference**：支持在云环境中高效运行大语言模型，提供监控和优化功能。
- **DeepSpeed-MII**：支持多副本负载均衡，适合处理大量用户请求。

#### 优势：

- 可按需扩展资源。
- 提供丰富的监控和管理工具

### 3、容器化部署

使用 Docker 或 Kubernetes 等容器化技术部署大语言模型，适合需要快速部署和灵活管理的场景。

#### 常见工具：

- **Docker**：通过 Docker 容器快速部署和运行大语言模型。
- **Kubernetes**：支持大规模集群管理和弹性扩展。

#### 优势：

- 部署速度快，环境隔离性强。
- 易于扩展和管理
