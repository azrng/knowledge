---
title: 大模型工具
lang: zh-CN
date: 2025-01-01
publish: true
author:  azrng
isOriginal: true
category:
  - soft
  - ai
  - llm
tag:
  - 大模型
  - 工具
---
## 应用

1、ollama部署大模型，提供了cli命令行和api，还可以使用maxkb作为用户界面进行使用。

## Ollama

Ollama是一款开源的大模型管理工具，它允许用户在本地便捷地运行多种大型开源模型，包括清华大学的ChatGLM、阿里的千问以及Meta的llama等。目前，Ollama兼容macOS、Linux和Windows三大主流操作系统。

官网：[https://ollama.com/](https://ollama.com/)

### 命令行

```shell
# 查询模型列表
ollama list

# 运行模型
ollama run xxx

# 只拉取不运行
ollama pull xxx

# 查看当前运行的模型
ollama ps

# 停止某一个模型
ollama stop xxx

# 删除模型
ollama rm xxx
```

### 部署

#### Windows部署

从Ollama官网下载安装程序，按照安装向导完成安装

#### Linux部署

```shell
curl https://ollama.ai/install.sh | sh
```

#### docker部署


这里我们直接使用docker部署的Ollama，我直接放我的docker-compose文件配置

```yaml
services:
  ollama: 
    container_name: ollama
    image: registry.cn-hangzhou.aliyuncs.com/zrng/ollama:0.4.6 # docker.io/ollama/ollama:latest
    ports:
      - 11434:11434 # 对外端口
    restart: always
    environment:
      - OLLAMA_PROXY_URL=http://host.docker.internal:11434/v1 # web ui使用的时候地址填写：http://host.docker.internal:11434
    volumes:
      - E:\Data\ollama:/root/.ollama # 挂载数据
```

+ 访问地址为：[http://IP:11434](http://localhost:11434)
+ image地址配置的是阿里云镜像仓库地址，防止拉取失败
+ OLLAMA_PROXY_URL：这个是后面填写API 域名的时候要用的
+ volumes这个挂载了我的容器数据

执行docker-compose命令后，在容器启动正常后访问Ollama地址判断启动是否正常，比如我这里直接访问：[http://localhost:11434/](http://localhost:11434/)

![image](/ai/1350373-20250101211657228-597289635.png)

### 查看模型列表

通过docker方式部署，通过命令进入Ollama容器中，查看是否存在默认的模型

```yaml
# 查询模型列表
ollama list
```

![image](/ai/1350373-20250101211645377-136082156.png)

#### 安装llama模型


现在来安装一个开源模型，我找了一个小一点的模型llama3.2进行测试，也可以去模型仓库中寻找合适的模型：[https://ollama.com/library](https://ollama.com/library)

```json
# 安装大模型
ollama run llama3.2
```

![image](/ai/1350373-20250101211713251-1229119748.png)

安装完成可以通过命令行查看模型是否安装成功

![image](/ai/1350373-20250101211719148-106168135.png)

现在模型已经安装成功，可以在容器内使用命令行使用模型，也可以使用其他UI服务进行使用

#### 安装Deepseek模型

模型下载地址：[https://ollama.com/library/deepseek-coder](https://ollama.com/library/deepseek-coder)

```shell
# 拉取模型
ollama pull deepseek-r1:1.5b
ollama pull deepseek-coder:6.7b
ollama pull deepseek-r1:8b

# 运行模型
ollama run deepseek-r1:1.5b
ollama run deepseek-coder:6.7b
ollama run deepseek-r1:8b
```

![image-20250209223838276](/ai/image-20250209223838276.png)

其他自定义配置文件可以看：[Ollama本地部署DeepSeek-R1:14b完全指南](Ollama本地部署DeepSeek-R1:14b完全指南)

## LM Studio

专注本地大模型的交互，提供用户界面，支持模型的发现、下载、管理、运行。

官网：[https://lmstudio.ai/](https://lmstudio.ai/)

### 修改源

该软件默认使用的模型源是huggingface，因为一些原因访问不方便，但是可以找到安装路径，比如我的安装路径为 D:\Program Files\LmStudio\LM Studio ，那么就可以去\resources\app\.webpack\main 找到一个叫做`index.js`的文件，使用vscode等工具打开该文件，搜索`huggingface.co` 批量替换为镜像站 `hf-mirror.com` (先关闭软件后修改)

## vLLM

vLLM 是一个快速且易于使用的库，专为大型语言模型 (LLM) 的推理和部署而设计。

文档：[https://vllm.hyper.ai/](https://vllm.hyper.ai/)

## Cherry Studio

多模型协助的“全能指挥官”

官网：[https://cherry-ai.com](https://cherry-ai.com)

### 独特优势 

* 多模型自由切换：支持OpenAI、DeepSeek、Gemini等主流云端模型，同时集成Ollama本地部署，实现云端与本地模型的灵活调用。 
* 内置300+预配置助手：覆盖写作、编程、设计等场景，用户可自定义助手角色与功能，还能在同一对话中对比多个模型输出结果。 
* 多模态文件处理：支持文本、PDF、图像等多种格式，集成WebDAV文件管理、代码高亮与Mermaid图表可视化，满足复杂数据处理需求。 

### 适用场景

* 开发者需多模型对比调试代码或生成文档； 
* 创作者需快速切换不同风格文案生成； 
* 企业需兼顾数据隐私（本地模型）与云端高性能模型混合使用。 

### 选型建议

适合技术团队、多任务处理者，或对数据隐私与功能扩展性要求较高的用户。

## 提示词优化程序

### prompt-optimizer

Prompt Optimizer是一个强大的AI提示词优化工具，帮助你编写更好的AI提示词，提升AI输出质量。支持Web应用和Chrome插件两种使用方式。

仓库地址：[https://github.com/linshenkx/prompt-optimizer](https://github.com/linshenkx/prompt-optimizer)



docker部署方案

```shell
# 运行容器（默认配置）
docker run -d -p 80:80 --restart unless-stopped --name prompt-optimizer linshen/prompt-optimizer

# 运行容器（配置API密钥和访问密码）
docker run -d -p 80:80 \
  -e VITE_OPENAI_API_KEY=your_key \
  -e ACCESS_USERNAME=your_username \  # 可选，默认为"admin"
  -e ACCESS_PASSWORD=your_password \  # 设置访问密码
  --restart unless-stopped \
  --name prompt-optimizer \
  linshen/prompt-optimizer
```

## AnythingLLM

一体化AI应用程序

官网地址：[https://anythingllm.com](https://anythingllm.com)

文档网站：[https://docs.anythingllm.com/](https://docs.anythingllm.com/)

### 独特优势

* 文档智能问答：支持PDF、Word等格式文件索引，通过向量检索技术精准定位文档片段，结合大模型生成上下文关联的答案。 
* 本地化部署灵活：可对接Ollama等本地推理引擎，无需依赖云端服务，保障敏感数据安全。 
* 检索与生成一体化：先检索知识库内容，再调用模型生成答案，确保回答的专业性与准确性。 

### 适用场景

* 企业内部文档库的自动化问答（如员工手册、技术文档）； 
* 学术研究中的文献摘要与关键信息提取； 
* 个人用户管理海量笔记或电子书资源。 

### 选型建议

推荐给依赖文档处理的企业、研究机构，或需要构建私有知识库的团队。

## MaxKB

MaxKB = Max Knowledge Base，是一款基于大语言模型和 RAG 的开源知识库问答系统，广泛应用于智能客服、企业内部知识库、学术研究与教育等场景。

官网：[https://maxkb.cn/](https://maxkb.cn/)

### docker部署
这个工具我还通过docker工具来创建，还直接放我的docker-compose文件配置

```yaml
services:
  maxkb:
    container_name: maxkb # http://localhost:28080  admin/MaxKB@123..
    image: registry.cn-hangzhou.aliyuncs.com/zrng/maxkb:1.8.0 # 1panel/maxkb
    ports:
      - 28080:8080 # 对外端口
    restart: always
```

+ 访问地址为：IP+28080
+ image地址配置的是阿里云镜像仓库的地址，防止拉取失败

现在我访问地址：[http://localhost:28080](http://localhost:28080/ui/login)

![image](/ai/1350373-20250101211727860-1434857526.png)

默认用户名/密码：admin/MaxKB@123..  官方文档地址为：[https://maxkb.cn/docs/installation/online_installtion/](https://maxkb.cn/docs/installation/online_installtion/) ，登录成功后可以按照弹框提示修改默认的密码，然后去系统管理添加模型

### 添加模型
![image](/ai/1350373-20250101211733926-719309424.png)

这里我们可以看到支持很多的大模型

![image](/ai/1350373-20250101211740901-1045422565.png)

因为我的大模型是Ollama，所以选择私有模型=>Ollama，然后添加模型

![image](/ai/1350373-20250101211747720-1536757240.png)

### 添加应用
现在可以添加应用了，到应用界面添加新应用

![image](/ai/1350373-20250101211759755-427349766.png)

![image](/ai/1350373-20250101211804832-1218856794.png)

下面的内容我使用默认的配置，然后点击右上角的保存并发布，然后点击左侧的概览，可以看到应用信息以及访问地址等

![image](/ai/1350373-20250101211812682-782853015.png)


直接访问地址：[http://localhost:28080/ui/chat/d0a18a63b48e8b94](http://localhost:28080/ui/chat/d0a18a63b48e8b94)

![image](/ai/1350373-20250101211817787-736010266.png)

这里可以就可以输入我们要咨询的内容了，根据电脑配置好坏响应内容的速度也有不同。

### 嵌入第三方
通过简单的配置可以将该应用嵌入到第三方系统中

![image](/ai/1350373-20250101211823747-123863987.png)

### 知识库
在知识库选项卡，可以新建知识库并导入文本或Web站点等，然后将我们需要支持咨询的内容上传并向量化

![image](/ai/1350373-20250101211830196-829366208.png)


然后在应用界面可以关联新建的知识库，以便返回我们更想要的内容。

![image](/ai/1350373-20250101211834390-747781163.png)

## AI Dev Gallery

大模型展示与分享平台，可以浏览模型以及相关信息，如模型的功能、性能指标、应用场景等。

项目地址：[https://github.com/microsoft/ai-dev-gallery ](https://github.com/microsoft/ai-dev-gallery )

介绍文档：[https://mp.weixin.qq.com/s/ZoKZBzJrj490u8rJlZF9qA](https://mp.weixin.qq.com/s/ZoKZBzJrj490u8rJlZF9qA)

## Dify

官方文档：[https://enterprise-docs.dify.ai/zh-cn/introduction](https://enterprise-docs.dify.ai/zh-cn/introduction)

[Helm文件配置](https://enterprise-docs.dify.ai/zh-cn/deployment/advanced-configuration/dify-helm-chart) [Dify文件上传](https://personel-zhouxinle888-a66353926f9185cff28f2bd374a5c3a9dd89d5206.gitlab.io/dify/dify-20.html)

