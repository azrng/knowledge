# C# + AI（LLM方向）工程师完整学习计划

**针对岗位要求：AI/大语言模型（LLM）应用开发工程师 / .Net方向AI项目开发工程师**

---

## 招聘要求解析

### 必备条件

| 要求 | 说明 | 对应学习阶段 |
|------|------|--------------|
| **1.5年以上.Net C#经验** | 精通.NET C#及ASP.NET (Core)框架，构建高性能、高可用、可维护的Web API及后端服务 | 阶段1 |
| **1年以上AI项目（LLM方向）经验** | 直接参与AI项目的开发与落地 | 阶段3-7 |
| **完整AI项目周期经验** | 从需求分析到线上部署的全流程 | 阶段7 |
| **Python能力** | 能够使用Python进行AI模型相关的脚本编写、实验和集成 | 阶段2 |

### AI技术能力要求

| 技术领域 | 具体要求 | 优先级 |
|----------|----------|--------|
| **LLM API应用** | OpenAI GPT、Anthropic Claude、国内主流模型等API调用 | ⭐⭐⭐⭐⭐ |
| **AI Agent开发** | Semantic Kernel、Microsoft Agent Framework、LangChain、LlamaIndex等框架 | ⭐⭐⭐⭐⭐ |
| **RAG技术栈** | 向量数据库（ElasticSearch、Pinecone、Milvus、PgVector等）、文本分块、检索排序优化 | ⭐⭐⭐⭐⭐ |
| **MCP协议** | Model Context Protocol或类似模型扩展协议 | ⭐⭐⭐⭐ |

### 综合能力要求

- **问题解决能力**：出色的分析和解决复杂问题的能力
- **沟通协作能力**：良好的沟通能力和团队协作精神，能清晰向非技术同事阐述技术方案
- **学习与热情**：强烈的自驱力和对AI技术的热情，乐于学习并快速掌握新技术
- **优先条件**：HR相关行业（HCM、招聘、人才管理、绩效评估等）软件开发经验

---

## 分阶段学习计划

**总学习时间：12-16周（按每天2-3小时学习计算）**

---

### 阶段1：.NET 9 & ASP.NET Core 深度强化（2.5周）

**核心考察内容**：
- ASP.NET Core架构设计能力
- 依赖注入、中间件、管道机制理解
- 性能优化（缓存、异步、GC调优）
- 单元测试与CI/CD流程

#### 学习要点

1. **.NET 9新特性与AI能力**
   - **TensorPrimitives增强**：.NET 9中显著扩展和改进的TensorPrimitives，提供高效的数学运算
   - **新AI命名空间**：`Microsoft.Extensions.AI`、`Microsoft.Extensions.VectorData`、`System.Numerics.Tensors`
   - **性能优化**：更好的Span参数重载，减少各种基元类型操作的开销
   - **跨平台部署**：在Windows、Linux、macOS及云环境的一键部署

2. **ASP.NET Core深度开发**
   - 深入理解ASP.NET Core请求生命周期与中间件链
   - 掌握`IHostedService`实现后台任务
   - 使用`Microsoft.Extensions.Caching.*`实现分布式缓存
   - 通过`BenchmarkDotNet`进行性能压测
   - 用`xUnit`+`Moq`编写高质量单元测试
   - Clean Architecture架构设计，为AI项目打下基础

#### 2025年最优学习资料

- **官方必读**：[.NET 9 What's New](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
- **B站必看**：[ASP.NET Core 8.0零基础教程55P，2024版](https://www.bilibili.com/video/BV1Xg4y1p7Yq) - 可作为基础参考
- **微软官方**：[ASP.NET Core Web API](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/?view=aspnetcore-9.0)
- **AI开发工具**：[AI Dev Gallery - Gateway to local AI development](https://devblogs.microsoft.com/dotnet/introducing-ai-dev-gallery-gateway-to-local-ai-development/)
- **性能提升**：[Performance Improvements in .NET 9](https://ricomariani.medium.com/performance-improvements-in-net-9-d32afb4febca)
- **项目实战**：[WaterCloud快速开发框架](https://github.com/iamoldli/WaterCloud) - 基于ASP.NET 9.0 MVC + API + SqlSugar

---

### 阶段2：Python AI开发能力速成（1.5周）

**核心考察内容**：

- Python基础语法与数据结构
- 常用AI库（NumPy/Pandas）操作
- 与LLM模型的交互脚本开发
- Python与C#的互操作

#### 学习要点

1. **Python基础与异步编程**
   - 掌握Python异步编程（`async/await`）
   - 使用`requests`调用REST API与模型交互
   - 用`pandas`处理结构化数据

2. **AI库与框架**
   - 用`langchain`快速构建原型
   - 理解Python与C#的互操作（如`Python.NET`）
   - LangChain最新版本的学习

#### 最优学习资料

- **官方文档**：[Python官方教程](https://docs.python.org/3/tutorial/)
- **B站教程**：[Python数据分析与AI实战](https://www.bilibili.com/video/BV1Wv411h7kN)
- **C#互操作**：[C#调用Python脚本实战](https://www.cnblogs.com/edisonchou/p/15026017.html)

---

### 阶段3：LLM API 应用开发实战（2周）

**核心考察内容**：
- OpenAI/Anthropic/国产模型API调用
- 令牌管理、流式响应处理
- 错误重试机制与限流控制

#### 学习要点

1. **多模型API集成**
   - 用`OpenAI API`实现对话历史管理
   - 通过`Anthropic`的`Claude`进行多模态开发
   - 国产模型（通义千问/文心一言）的私有化部署调用
   - 实现`RetryPolicy`处理API限流

2. **.NET官方SDK**
   - 掌握.NET官方OpenAI库，最稳定的C#集成方案
   - 用`Azure Cognitive Services`集成企业级方案
   - 提示工程最佳实践

#### 2025年最优学习资料

- **官方SDK**：[适用于.NET的官方OpenAI库](https://github.com/openai/openai-dotnet)
- **C#专项**：[面向C#开发者的OpenAI大模型集成指南](https://learn.microsoft.com/zh-cn/azure/ai-services/openai/)
- **提示工程**：[OpenAI API最佳提示工程实践](https://platform.openai.com/docs/guides/prompt-engineering)
- **最佳实践**：[Anthropic：如何构建有效的Agent](https://www.anthropic.com/news/building-effective-agents)
- **GitHub**：[LLM API封装示例库](https://github.com/llm-api-examples)

---

### 阶段4：AI Agent 开发框架精研（3周）

**核心考察内容**：
- Semantic Kernel/Microsoft Agent Framework使用（C#首选）
- LangChain/LlamaIndex工作流设计
- 工具调用（Tool Calling）与规划能力

#### 学习要点

1. **Semantic Kernel深度实战**
   - Semantic Kernel H1 2025最新特性
   - 多Agent系统构建，实现Agent间通信与协作
   - 企业级工具集成（ERP、CRM、HR系统等）
   - 自适应记忆管理
   - 安全合规设计

2. **其他Agent框架**
   - 通过`Microsoft Agent Framework`构建多Agent协作
   - 用`LangChain`实现RetrievalQA流水线
   - 掌握`LlamaIndex`的索引构建与查询优化
   - 实现Agent的自我修正（Self-Correction）机制

#### 2025年最优学习资料

- **官方路线图**：[Semantic Kernel Roadmap H1 2025](https://devblogs.microsoft.com/semantic-kernel/semantic-kernel-roadmap-h1-2025-accelerating-agents-processes-and-integration/)
- **官方文档**：[Microsoft Semantic Kernel文档](https://learn.microsoft.com/zh-cn/semantic-kernel/)
- **GitHub**：[microsoft/semantic-kernel](https://github.com/microsoft/semantic-kernel)
- **NuGet**：[Microsoft.SemanticKernel 1.70.0](https://www.nuget.org/packages/Microsoft.SemanticKernel)
- **视频教程**：[Global AI Bootcamp 2025 - Intro to Semantic Kernel in C#](https://www.youtube.com/watch?v=BeAJZAURlUo)
- **入门指南**：[Getting Started with Semantic Kernel and C#](https://accessibleai.dev/post/introtosemantickernel/)
- **实战项目**：[Microsoft Agent Framework企业级应用开发](https://github.com/microsoft/agent-framework)

---

### 阶段5：BotSharp 企业级AI框架（2.5周）

**核心考察内容**：
- BotSharp框架应用与部署
- 业务系统集成
- 多模态处理
- 私有化部署

#### 学习要点

1. **BotSharp 5.0 MCP**
   - BotSharp 5.0于2025年4月发布，定位为"更开放的AI Agent框架"
   - 基于插件化和管道执行设计
   - 完全解耦的插件系统

2. **企业级能力**
   - 业务系统深度集成（HR SaaS等）
   - 多模态AI助手（NLP + CV + 音频处理）
   - 私有化大模型部署与优化
   - 性能监控与调优策略

#### 2025年最优学习资料

- **张善友博客**：[BotSharp 5.0 MCP：迈向更开放的AI Agent框架](https://www.cnblogs.com/shanyou/p/18809988)
- **GitHub**：[odroe/BotSharp](https://github.com/odroe/BotSharp)
- **架构设计**：[BotSharp企业级架构设计模式](https://github.com/botsharp-enterprise-patterns)
- **技术分析**：[.NET的5大AI超能力：BotSharp如何让C#开发者逆袭](https://blog.csdn.net/2401_88677290/article/details/147192173)

---

### 阶段6：RAG技术栈与向量数据库（3周）

**核心考察内容**：
- 文本分块策略
- 向量数据库选型与优化
- 检索排序优化（Hybrid Search）

#### 学习要点

1. **文本分块与嵌入**
   - 用`LangChain`实现文本分块与嵌入生成
   - 递归分块策略（RecursiveCharacterTextSplitter）
   - 分块大小与重叠参数调优

2. **向量数据库实战**
   - 部署`Milvus`向量数据库并优化索引
   - 通过`ElasticSearch`实现混合检索（关键词+向量）
   - 使用`PgVector`在PostgreSQL中集成向量搜索
   - Pinecone企业级方案应用

3. **检索优化**
   - 实现RAG的重排序（Re-Ranking）优化
   - 混合检索（Hybrid Search）策略
   - Milvus vs Pinecone vs Chroma选型对比

#### 最优学习资料

- **官方文档**：[Milvus中文文档](https://milvus.io/cn/docs)
- **实战教程**：[Pinecone入门指南](https://www.pinecone.io/learn/)
- **混合检索**：[ElasticSearch混合检索方案](https://www.cnblogs.com/softidea/p/17502708.html)
- **B站教程**：[RAG实操教程langchain+Milvus向量数据库](https://www.bilibili.com/video/BV1Q84y1X7nJ)

---

### 阶段7：MCP协议与智能体通信（1.5周）

**核心考察内容**：
- MCP协议核心设计理念
- 模型上下文扩展技术实现
- Agent间安全通信

#### 学习要点

1. **MCP协议理解**
   - 理解MCP作为AI的"USB-C接口"的核心价值
   - 掌握MCP解决的"上下文长度限制"问题
   - 掌握`Model Context Protocol`的通信流程

2. **外部工具集成**
   - 重点掌握外部工具集成，这是MCP解决的核心问题
   - 学习数据安全考量，企业级应用的关键要素
   - 通过`LangChain`实现上下文扩展方案

#### 最优学习资料

- **官方文档**：[MCP协议官方文档](https://github.com/modelcontextprotocol)
- **实战指南**：[实战Model Context Protocol](https://aneasystone.com/blog/2024/11/mcp-practice/)
- **企业应用**：[详解AI Agent系列| 一文读懂Model Context Protocol](https://www.bilibili.com/video/BV1Q84y1X7nJ)

---

### 阶段8：AI项目全流程实战（2.5周）

**核心考察内容**：
- 需求分析与技术方案设计
- 代码质量与可维护性
- 线上部署与监控

#### 学习要点

1. **项目开发流程**
   - 用`Azure DevOps`实现CI/CD流水线
   - 通过`Application Insights`监控API性能
   - 实现`Docker`容器化部署
   - 编写技术方案文档并进行非技术宣讲
   - 模拟需求变更并快速迭代

2. **企业级部署**
   - 私有化部署方案设计
   - 大模型调用的成本控制与优化策略
   - 用户体验设计优化
   - DevOps for AI流水线设计

#### 最优学习资料

- **部署文档**：[ASP.NET Core 部署到Docker](https://learn.microsoft.com/zh-cn/aspnet/core/host-and-deploy/docker/)
- **运维监控**：[AI应用运维监控最佳实践](https://learn.microsoft.com/zh-cn/azure/ai-services/monitoring)
- **项目模板**：[AI项目模板库](https://github.com/ai-project-templates)
- **全流程**：[LLM应用全流程开发：多案例实战+私有化部署](https://keyouit.xyz/15028/)

---

## 关键能力强化建议

### 1. 沟通能力强化
- 每周参与1次技术分享（可用腾讯会议模拟向非技术人员讲解方案）
- 练习将AI技术概念用通俗易懂的语言解释

### 2. 问题解决能力
- 在LeetCode刷**系统设计类题目**（重点看分布式系统设计）
- 参与开源项目Issue讨论

### 3. 行业经验积累
- 研究HR领域SaaS产品（如SAP SuccessFactors），理解业务逻辑
- 了解HCM、招聘、人才管理、绩效评估等HR业务场景

---

## 核心竞争力路径

### 技术优先级

| 优先级 | 技术领域 | 理由 |
|--------|----------|------|
| ⭐⭐⭐⭐⭐ | Semantic Kernel | 微软官方框架，C#原生支持，企业级应用首选 |
| ⭐⭐⭐⭐⭐ | BotSharp | 2025年最活跃的C# LLM框架，企业级AI开发利器 |
| ⭐⭐⭐⭐⭐ | RAG技术栈 | 招聘核心考察点，企业级AI应用必备 |
| ⭐⭐⭐⭐ | LLM API集成 | 基础技能，必须掌握 |
| ⭐⭐⭐⭐ | MCP协议 | 前沿技术，2024年11月推出，企业应用关注点 |
| ⭐⭐⭐ | LangChain | Python生态重要参考，C#开发者可理解其原理 |
| ⭐⭐ | .NET 9新特性 | 性能优化，锦上添花 |

### 学习路径建议

**快速通道（13.5周）**：

1. 阶段1（2.5周）+ 阶段4（3周）+ 阶段5（2.5周）+ 阶段6（3周）+ 阶段8（2.5周）
2. 重点关注Semantic Kernel + BotSharp + RAG

**完整通道（16周）**：
1. 按顺序完成全部8个阶段
2. 每个阶段产出GitHub代码仓库

---

## 每周产出清单

| 周次 | 产出内容 | 考核标准 |
|------|----------|----------|
| 1-2 | ASP.NET Core Web API项目 | 可部署、有单元测试 |
| 3 | Python + LangChain原型 | 能调用LLM API |
| 4-5 | 多模型集成Demo | OpenAI + Claude + 国产模型 |
| 6-8 | Semantic Kernel Agent项目 | 多Agent协作、工具调用 |
| 9-10 | BotSharp企业级Demo | 业务系统集成、私有化部署 |
| 11-13 | RAG完整项目 | 文本分块、向量检索、重排序 |
| 14 | MCP协议Demo | 外部工具集成 |
| 15-16 | 完整AI项目 | CI/CD、监控、部署 |

---

## 面试准备清单

### 技术问答准备

| 类别 | 核心问题 |
|------|----------|
| .NET基础 | ASP.NET Core请求生命周期、依赖注入原理、异步编程 |
| LLM API | 对话历史管理、流式响应处理、API限流策略 |
| Agent框架 | Semantic Kernel核心概念、多Agent协作模式 |
| RAG技术 | 文本分块策略、向量数据库选型、混合检索 |
| MCP协议 | 协议核心价值、外部工具集成 |

### 项目经验准备

- 准备2-3个完整AI项目案例（包含需求、技术选型、难点、成果）
- 准备技术方案演讲稿（针对非技术人员）
- 准备GitHub代码仓库（面试时现场演示）

### 行业经验准备（优先项）

- 了解HR SaaS行业特点
- 理解HCM、招聘、绩效评估等业务场景
- 思考AI技术在HR领域的应用场景

---

## 学习资源汇总

### 官方文档

- [.NET 9 What's New](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
- [Semantic Kernel文档](https://learn.microsoft.com/zh-cn/semantic-kernel/)
- [Semantic Kernel Roadmap H1 2025](https://devblogs.microsoft.com/semantic-kernel/semantic-kernel-roadmap-h1-2025-accelerating-agents-processes-and-integration/)
- [OpenAI API文档](https://platform.openai.com/docs/api-reference)
- [Milvus中文文档](https://milvus.io/cn/docs)

### 开源项目

- [microsoft/semantic-kernel](https://github.com/microsoft/semantic-kernel)
- [odroe/BotSharp](https://github.com/odroe/BotSharp)
- [microsoft/agent-framework](https://github.com/microsoft/agent-framework)

### 技术博客

- 张善友博客 - .NET AI技术前沿
- [aneasystone技术博客 - MCP实战](https://aneasystone.com/blog/2024/11/mcp-practice/)

### 视频教程

- [ASP.NET Core 8.0零基础教程](https://www.bilibili.com/video/BV1Xg4y1p7Yq)
- [Global AI Bootcamp 2025 - Intro to Semantic Kernel in C#](https://www.youtube.com/watch?v=BeAJZAURlUo)

---

## 关键提醒

1. **优先保证**：阶段1 + 阶段4 + 阶段5 + 阶段6 + 阶段8（招聘核心考察点）
2. **每周产出**：每个阶段都要有可展示的GitHub代码仓库
3. **技术趋势**：关注.NET 9的AI原生能力，这是C#在AI领域的新机会
4. **实战导向**：优先完成可以运行演示的Demo，理论服务于实践
5. **开源参与**：2025年企业招聘特别看重开源贡献

---

## 参考来源

本文档内容参考了以下来源：
- 招聘岗位要求图片
- [Semantic Kernel Roadmap H1 2025](https://devblogs.microsoft.com/semantic-kernel/semantic-kernel-roadmap-h1-2025-accelerating-agents-processes-and-integration/)
- [.NET 9 What's New](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
- [AI Dev Gallery](https://devblogs.microsoft.com/dotnet/introducing-ai-dev-gallery-gateway-to-local-ai-development/)
- [TensorPrimitives improvements](https://github.com/dotnet/runtime/issues/93286)
- [BotSharp 5.0 MCP](https://www.cnblogs.com/shanyou/p/18809988)
- [Performance Improvements in .NET 9](https://ricomariani.medium.com/performance-improvements-in-net-9-d32afb4febca)
- [Anthropic: Building effective agents](https://www.anthropic.com/news/building-effective-agents)
- [Azure AI Services](https://learn.microsoft.com/zh-cn/azure/ai-services/)
