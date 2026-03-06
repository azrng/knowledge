# RAG与知识库系统核心技能学习清单

> 基于不同Embedding模型的选择与评估、知识库构建、文档解析、分块策略、多跳检索、Prompt工程、Agent系统等核心技能整理

---

## 一、Embedding模型选择与评估

### 核心知识点
- 检索性能与精度的平衡
- 向量维度选择（384-768范围平衡）
- 基准测试评估方法

### 学习资料

| 资源 | 说明 |
|------|------|
| [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) | 官方Embedding模型排行榜 |
| [Top Embedding Models 2025](https://artsmart.ai/blog/top-embedding-models-in-2025/) | 2025年最佳Embedding模型指南 |
| [How to Choose Embedding Model for RAG](https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md) | Milvus官方选择指南 |
| [Best Open-Source Embedding Models](https://python.plainenglish.io/best-open-source-embedding-models-for-rag-your-2025-guide-feffe6b8bb68) | 开源模型推荐 |
| [MTEB GitHub](https://github.com/embeddings-benchmark/mteb) | 基准测试代码库 |

### 2025年Top模型
- **Qwen3-Embedding-8B**
- **BGE-M3**
- **Stella_en_1.5B_v5**
- **EmbeddingGemma-300m**

---

## 二、知识库构建

### 核心知识点
- 高质量数据源设计
- 元数据管理
- 知识图谱与向量库结合

### 学习资料

| 资源 | 说明 |
|------|------|
| [RAG Tutorial 2025 - Udemy](https://www.udemy.com/course/llm-rag-langchain-llamaindex/) | LangChain + LlamaIndex双框架课程 |
| [LlamaIndex Complete Guide](https://www.linkedin.com/pulse/llamaindex-complete-guide-from-beginner-advanced-rag-amritesh-anand--xpuxc) | 从入门到高级完整指南 |
| [LlamaIndex for Beginners 2025](https://medium.com/@gautsoni/llamaindex-for-beginners-2025-a-complete-guide-to-building-rag-apps-from-zero-to-production-cb15ad290fe0) | 从零构建RAG应用 |
| [12 Best RAG Courses 2025](https://www.classcentral.com/report/best-rag-courses/) | 精选课程列表 |

---

## 三、文档解析（复杂PDF/扫描件/表格）

### 核心知识点
- OCR与结构识别结合
- 表格混合内容处理
- 扫描件增强

### 学习资料

| 资源 | 说明 |
|------|------|
| [NVIDIA: PDF Data Extraction](https://developer.nvidia.com/blog/approaches-to-pdf-data-extraction-for-information-retrieval/) | NVIDIA官方技术指南 |
| [I Tested 12 PDF Tools](https://medium.com/@kramermark/i-tested-12-best-in-class-pdf-table-extraction-tools-and-the-results-were-appalling-f8a9991d972e) | 12款工具实测对比 |
| [Top 5 Data Extraction Tools 2025](https://algodocs.com/top-5-data-extraction-tools-in-2025/) | 2025年最佳提取工具 |
| [PDF Data Extraction Developer Guide](https://www.nutrient.io/blog/pdf-data-extraction-developer-guide/) | 开发者完整指南 |

### 推荐工具
- **DocSumo** - AI驱动的文档处理
- **Parseur** - OCR + NLP + AI
- **Tabula** - 表格提取
- **Adobe Acrobat Pro DC** - 专业PDF处理

---

## 四、分块策略（Chunking Strategy）

### 核心知识点
- 语义分块 vs 规则分块
- 块大小与上下文平衡
- 避免信息割裂

### 学习资料

| 资源 | 说明 |
|------|------|
| [RAG Chunking Strategies - Medium](https://medium.com/data-science-collective/rag-chunking-strategies-whats-the-optimal-chunk-size-955049eb386d) | 最优块大小讨论 |
| [Max-Min Semantic Chunking - Milvus](https://milvus.io/blog/smarter-rag-retrieval-with-max-min-semantic-chunking.md) | 语义分块深度指南 |
| [Amazon Bedrock Chunking](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-chunking-parsing.html) | AWS官方分块文档 |
| [Chunking Strategies - Weaviate](https://weaviate.io/blog/chunking-strategies) | Weaviate最佳实践 |

---

## 五、多跳检索、重排序、查询扩展

### 核心知识点
- 混合检索策略
- Reranking模型应用
- 查询扩展技术

### 学习资料

| 资源 | 说明 |
|------|------|
| [Advanced RAG Techniques - Neo4j](https://neo4j.com/blog/genai/advanced-rag-techniques/) | 15种高级RAG技术 |
| [Advanced Retrieval Strategies](https://app.ailog.fr/en/blog/guides/retrieval-strategies) | 检索策略完整指南 |
| [FlashRank Reranking Paper](https://arxiv.org/pdf/2601.03258) | 重排序+查询扩展论文 |
| [DMQR-RAG](https://openreview.net/forum?id=lz936bYmb3) | 多查询重写框架 |

### 前沿方法
- **HopRAG** - 多跳问答
- **SiReRAG** - 结构化推理
- **ReGraphRAG** - 知识图谱增强

---

## 六、Prompt工程与结构化输出

### 核心知识点
- JSON Schema设计
- 函数调用与结构化输出
- 输出可靠性保障

### 学习资料

| 资源 | 说明 |
|------|------|
| [Structured Output Complete Guide](https://medium.com/@chanyatfu/the-developers-field-guide-to-structured-llm-output-7f484134778b) | 结构化输出完整指南 |
| [Structured Prompting - Cloudsquid](https://cloudsquid.io/blog/structured-prompting) | JSON模式详解 |
| [Prompt Engineering Guide](https://www.promptingguide.ai/) | 综合Prompt教程 |
| [OpenAI Structured Output](https://community.openai.com/t/how-to-effectively-prompt-for-structured-output/1355135) | OpenAI社区指南 |

---

## 七、Agent系统（规划、工具调用、记忆）

### 核心知识点
- 任务分解与规划
- 工具调用模式
- 长期/短期记忆机制

### 学习资料

| 资源 | 说明 |
|------|------|
| [AI Agent Framework Comparison 2025](https://fast.io/resources/ai-agent-framework-comparison/) | 框架对比 |
| [LangChain vs AutoGPT](https://www.leanware.co/insights/langchain-vs-autogpt) | 主流框架详解 |
| [LLM Agent Framework 2025](https://voltagent.dev/blog/llm-agent-framework/) | 2025年Agent架构 |
| [Advanced Tool Calling](https://sparkco.ai/blog/advanced-tool-calling-in-llm-agents-a-deep-dive) | 工具调用深度解析 |

### 主流框架
- **LangChain** - 600+工具集成
- **AutoGen** - 多Agent协作
- **CrewAI** - 团队式Agent

---

## 八、敏感信息过滤与权限控制

### 核心知识点
- RBAC权限设计
- 敏感数据检测
- 访问控制策略

### 学习资料

| 资源 | 说明 |
|------|------|
| [Granular Access Control in RAG](https://willrodbard.com/2025/09/11/implementing-granular-access-control-in-rag-applications/) | RAG细粒度权限控制 |
| [OWASP LLM02:2025](https://genai.owasp.org/llmrisk/llm02-insecure-output-handling/) | OWASP安全标准 |
| [Secure RAG - Springer](https://link.springer.com/chapter/10.1007/978-3-032-15993-9_34) | 安全RAG学术研究 |
| [Data Security in AI - CSA](https://cloudsecurityalliance.org/artifacts/data-security-within-ai-environments) | CSA安全指南 |

---

## 九、多源异构数据融合

### 核心知识点
- 多模态知识整合
- 数据统一表示
- 跨源检索

### 学习资料

| 资源 | 说明 |
|------|------|
| [WavRAG - 音频文本融合](https://www.arxivdaily.com/thread/64466) | 多模态RAG |
| [RAG实战指南 - 掘金](https://juejin.cn/post/7573273271798546472) | 中文实战教程 |
| [Awesome-RAG-Reasoning](https://github.com/DavidZWZ/Awesome-RAG-Reasoning) | EMNLP 2025资源合集 |

---

## 学习路线建议

```
阶段一：基础（1-2周）
├── Embedding模型原理与MTEB评测
├── RAG基础架构
└── LangChain/LlamaIndex入门

阶段二：核心技能（2-3周）
├── 分块策略实践
├── 向量数据库选型与优化
└── 检索策略（混合、多跳）

阶段三：进阶（2-3周）
├── 文档解析（PDF/表格/OCR）
├── Reranking与查询扩展
└── Prompt工程与结构化输出

阶段四：系统设计（2-3周）
├── Agent架构设计
├── 记忆系统实现
├── 权限与安全
└── 多源数据融合
```

---

## 关键要点总结

> **这些才是拉开差距的地方**

1. **检索性能与精度的平衡** - 选择合适的Embedding模型和检索策略
2. **敏感信息过滤与权限控制** - 确保数据安全与合规
3. **多源异构数据的融合处理** - 统一不同来源和格式的数据
4. **Agent的记忆机制与任务分解能力** - 构建智能自主系统

---

*整理时间：2025年2月*
