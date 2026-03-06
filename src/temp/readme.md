---
title: 说明
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
tag:
  - temp
---
## 概述

临时方法

## 表情区域

更新日志：[https://theme-hope.vuejs.press/zh/changelog.html](https://theme-hope.vuejs.press/zh/changelog.html)

地址：https://theme-hope.vuejs.press/zh/cookbook/markdown/emoji/

👈    👍    👉

😄 😊

## 临时代码

有花堪折直须折，莫待无花空折枝

```
net stop winnat
net start winnat


港股 0.7下
医疗0.46下  0.47以下
科创 1.10下定投
长安汽车：13.11下
```

```
python 3.13 镜像脚本
# 使用官方 Python 3.13 镜像作为基础镜像
FROM python:3.13-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple

# 安装系统依赖和 uv
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
    && rm -rf /var/lib/apt/lists/* && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    mv /root/.local/bin/uv /usr/local/bin/

# 复制项目文件
# 先复制依赖定义文件以利用 Docker 层缓存
COPY pyproject.toml uv.lock ./

# 安装依赖
RUN uv sync --frozen --no-dev

# 复制应用代码
COPY app.py ./
COPY start.sh ./

# 启动应用
CMD ["sh", "start.sh"]

```

.net10sse

```
    [HttpPost("chat")]
    [NoWrapper]
    [AllowAnonymous]
    public ServerSentEventsResult<string> Chat()
    {
        return TypedResults.ServerSentEvents(GetHeartRateData());
    }

    private async IAsyncEnumerable<SseItem<string>> GetHeartRateData()
    {
        while (true)
        {
            var heartRate = Random.Shared.Next(60, 100);
            yield return new SseItem<string>($"数据如下:{heartRate}");

            await Task.Delay(1000);
        }
    }
    
    
输出结果示例
data: 数据如下:91
data: 数据如下:62
```


```
通过FromSqlRaw去执行一段sql，然后生成的queryable，可以和其他表等继续关联执行逻辑
      var sql = @"
                    SELECT *
                    FROM mdm.code_system_snapshot_view c
                    WHERE c.""Code"" = {0}
                      AND c.""VersionId"" = {1}
                      AND NOT EXISTS (
                          SELECT 1
                          FROM mdm.code_system_snapshot_view p
                          WHERE p.""Code"" = {0}
                            AND p.""VersionId"" = {2}
                            AND p.""ConceptCode"" = c.""ConceptCode""
                      )";

                return base.DbContext.Set<CodeSystemSnapShotConceptView>()
                           .FromSqlRaw(sql, code, currentVersionId, previousVersionId)
                           .Select(c => new ConceptStringDto { Code = c.ConceptCode, Display = c.ConceptDisplay, Values = c.Values });
```



DeepResearch实现原来这么简单！LangGraph三步构建会"思考"的AI Agent：https://mp.weixin.qq.com/s/bVVIC-1HR6J63w25wsltRw

会思考的AI智能网页抓取工具：https://mp.weixin.qq.com/s/YujN5ywxNYEzh9UloPkjDg

cursor:无限续杯：https://github.com/yuaotian/go-cursor-help/blob/master/README_CN.md

Docker 容器部署中的 IdentityServer：https://nestenius.se/net/identityserver-in-docker-containers-part-1/





异常补丁代码

```
namespace System;
/// <summary>Provides downlevel polyfills for static methods on Exception-derived types.</summary>
internal static class ExceptionPolyfills
{
    extension(ArgumentNullException)
    {
        public static void ThrowIfNull([NotNull] object? argument, [CallerArgumentExpression(nameof(argument))] string? paramName = null)
        {
            if (argument is null)
            {
                ThrowArgumentNullException(paramName);
            }
        }
    }

    [DoesNotReturn]
    private static void ThrowArgumentNullException(string? paramName) =>
        throw new ArgumentNullException(paramName);
}
```







不需要使用国际化的配置

```
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <!-- 禁用国际化，使用固定格式 -->
    <InvariantGlobalization>true</InvariantGlobalization>
    
    <!-- 设置中性语言为中文 -->
    <NeutralLanguage>zh-CN</NeutralLanguage>
    
    <!-- 设置卫星资源语言为中文 -->
    <SatelliteResourceLanguages>zh-CN</SatelliteResourceLanguages>
    
    <!-- 可选：设置默认UI文化 -->
    <AssemblyDefaultCulture>zh-CN</AssemblyDefaultCulture>
  </PropertyGroup>
</Project>





// 启用后，字符串操作更快
// 文化敏感的字符串比较 vs 固定文化比较
string.Compare("a", "A", StringComparison.CurrentCulture);    // 较慢
string.Compare("a", "A", StringComparison.InvariantCulture);  // 较快
```

yangshun/tech-interview-handbook项目简介: 💯 为忙碌的软件工程师精选的编码面试准备材料今日新增: 310 | 总星数: 133907 | 语言: TypeScripthttps://github.com/yangshun/tech-interview-handbook

## 其他镜像

```
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mcp_server:0.0.1
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mcp_server:0.0.2
```

## 通用


.Net Task揭秘：https://www.cnblogs.com/eventhorizon/p/15912383.html 需要看完

ThreadPool：https://dev.to/theramoliya/understanding-threadpool-in-c-203n

线程池实现：https://www.cnblogs.com/eventhorizon/p/15316955.html

深入了解垃圾回收：https://mp.weixin.qq.com/s/qlfbDk6lFqLRJKs0hOXvOQ



rx中文版：https://github.com/MarsonShine/Books/blob/master/RxNet/docs/gettting-started.md

https://github.com/Cysharp/R3



读书笔记：https://marsonshine.github.io/Books/ 看到编写高性能.Net代码

读书笔记仓库地址：https://github.com/MarsonShine/Books

软考刷题：软考通

https://gitee.com/zaonai/projects：备考资料

错误、异常全收集,地表最强追踪平台：https://mp.weixin.qq.com/s/NlXROYuuxUf1pJy7WCbxGw



https://mp.weixin.qq.com/s/48lRcpI95lXTfn_Ec0sKZw：.NET微服务下认证授权框架的探讨

框架设计准则:https://learn.microsoft.com/zh-cn/dotnet/standard/design-guidelines/



BCVP.VUE3系列第一课：项目初始化与核心知识点说明：https://mp.weixin.qq.com/s/BJki9ZnTzPX5Iucxp62zPQ



从程序员到架构师，需要做些什么？:[https://mp.weixin.qq.com/s/qqtyFv6_YsBJf1bVI5-C-g](https://mp.weixin.qq.com/s/qqtyFv6_YsBJf1bVI5-C-g)



Azure DevOps Server，本地安装：https://learn.microsoft.com/zh-cn/azure/devops/server/download/azuredevopsserver?view=azure-devops

教程：https://www.cnblogs.com/BrainDeveloper/p/12322251.html



用AI把古诗和古文变成图片:https://mp.weixin.qq.com/s/vgyFZIJUPk6FOfWAcaBctw



入门学习推荐：程序员的AI开发第一课:https://mp.weixin.qq.com/s/h7BOj200okaSVlsiKHDIKA



扩展整体：生长系统的实用指南:https://www.milanjovanovic.tech/blog/scaling-monoliths-a-practical-guide-for-growing-systems?utm_source=newsletter&utm_medium=email&utm_campaign=tnw125

停止混淆 CQRS 和 MediatR:https://www.milanjovanovic.tech/blog/stop-conflating-cqrs-and-mediatr?utm_source=newsletter&utm_medium=email&utm_campaign=tnw128



avalonia ui库：https://github.com/accntech/shad-ui

https://github.com/caorushizi/mediago： 视频提取工具

译】融入人工智能的 eShop – 全面的智能应用示例https://www.cnblogs.com/MingsonZheng/p/18695888

csv处理：https://mp.weixin.qq.com/s/TnVPrvOzM3CnXN8vJtPK3Q

icrosoft.Testing.Platform：现在所有主要的 .NET 测试框架都支持 - .NET 博客https://devblogs.microsoft.com/dotnet/mtp-adoption-frameworks/Microsoft.Testing.Platform 是取代 VSTest 的新测试执行平台，支持所有主要的 .NET 测试框架。本文介绍了 Microsoft.Testing.Platform 的功能以及如何在每个测试框架中启用它。



基于开源Drasi 实时监控和自动响应系统https://www.cnblogs.com/shanyou/p/18701838 Drasi

Kernel Memory 让 LLM 认识更多内容：https://mp.weixin.qq.com/s/WLc9RmIl32eOr2AtPfWeOA

SSH.NET: .NET 平台上的安全 Shell 库：https://mp.weixin.qq.com/s/izQa3uGbCfbHDB1pCdR_-g

https://mp.weixin.qq.com/s/84AuAs88y4hI9yEnvv_7UA?poc_token=HERJ1WejHUdXCcNDIHh3-LleqCV1D1eWmsNQrBPi | AI代码审查大杀器：SonarQube+C#实战，把团队代码缺陷率从15%干到0.3%！

## 服务器配置

免费服务器：azure 有限制，每天有免费次数，做测试可以用

免费数据库：0.5g空间  https://console.neon.tech/app/projects/wandering-bird-87869447

## Avalonia

treeview

选中更新事件：SelectionChanged



avalonia无线滚动：https://www.nequalsonelifestyle.com/2019/11/06/avalonia-infinite-scroll-tutorial/



如果进界面的时候想先选择配置，那么可以参考这里的弹框：https://www.cnblogs.com/raok/p/17566752.html

## 微服务

### docker

dockerfile的多阶段生成：https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/docker-application-development-process/docker-app-development-workflow#multi-stage-builds-in-dockerfile

### k8s

概念内容文档：https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/docker-application-development-process/docker-app-development-workflow#multi-stage-builds-in-dockerfile



## Maui

多平台流媒体播放：https://www.bilibili.com/video/BV1Pz421Q7uU/?vd_source=0a3cc07b87a63e3c53d4132b6ce1a83c

## 面试题

金三银四面试：C#.NET中高级面试题汇总：https://mp.weixin.qq.com/s/Dd5UBECyGav4Iks_dO2fmA

.NET工程师20K简历长啥样？：https://mp.weixin.qq.com/s/nhwVrV9iF2dlE3NcLeJrhw

https://mp.weixin.qq.com/s/yWLgpwKb9R_HhJKpYeDjGw | 金三银四面试：万字C#.NET笔试题高级进阶汇总篇

## 知识库

https://chat.token-ai.cn/chat/share-chat?id=af4da349d3a449709278e0bab4a5a2ec
Avalonia 知识库

https://chat.token-ai.cn/chat/share-chat?id=939b3ad2f853422db0d781bcb19a8bf1
Masa知识库

## 医保

医保报销是什么？门诊那些只是用医保里面自己的钱

## Github

使用github 流水线编译：https://www.bilibili.com/video/BV11e411i7Xx/?vd_source=0a3cc07b87a63e3c53d4132b6ce1a83c

## 工具箱

https://github.com/QiBowen2008/SuperTextToolBox

## 硬件结合

https://mp.weixin.qq.com/s/tbf6XP6QXwlPjnjpYvX-Gw | Homekit.Net 1.0.0发布：.NET原生SDK，助力打造私人智能家居新体验

## 爬图

https://mp.weixin.qq.com/s/gTPlq6WnS85ZUiHkTEO5wA | c#爬虫-1688官网自动以图搜图

## 大模型

最全中文sk教程：https://mp.weixin.qq.com/s/OSlwebdJX0yq_c8-jTMQpg?poc_token=HDEKEGajkeySY97I3lZVBhvETHtwJzqnHbRISX20

https://mp.weixin.qq.com/s/OSlwebdJX0yq_c8-jTMQpg | 这可能是目前最全的中文Semantic Kernel入门教程，呕心沥血，万字长文！！

PandoraNext

离线AI聊天清华大模型(ChatGLM3)本地搭建：https://mp.weixin.qq.com/s/UrJZCzuaxDyHwRrbPgnpdg

无需GPU，一键搭建本地大语言模型(LLM)服务，提供 OpenAI 接口 | 附 C#/Python 代码：https://mp.weixin.qq.com/s/X0ch-47lkTV1KFb7wMLs2w

LLamaSharp：https://mp.weixin.qq.com/s/f6hHwEQ-wDWe1qlDTiR3aQ

仓库地址：https://github.com/SciSharp/LLamaSharp

.NET 8 开源项目 智能AI知识库：https://mp.weixin.qq.com/s/Jec7SKRJxJCsnTKiFQBeig



## 机器学习

https://mp.weixin.qq.com/s/6_JxN6sFt2GMuAw4LYRHUQ：C# 也能做机器学习？

ETL.NET 助力海量数据轻松处理：https://mp.weixin.qq.com/s/bNvnSqCjkkyjUEAW80o7qQ



## 生产系统

访客系统：https://mp.weixin.qq.com/s/D15GTs09J8cHUEWTgQksIw

## 未知分类

https://mp.weixin.qq.com/s/fk8YFa7C_31B_BY2ogkAyg | 实现简单的自动部署

https://mp.weixin.qq.com/s/gC_FZGSQ1wcDpX2x9ARYZA | 一款开源跨平台的图形化路由追踪工具 OpenTrace

https://mp.weixin.qq.com/s/Op_PeDAoiwYxZsnBItujUQ | 如何使用Chrome浏览器做前端页面性能分析



Apache Arrow 是一个用于内存分析的开发平台。它包含一个 使大数据系统能够处理和移动数据的一组技术快。

https://arrow.apache.org/docs/format/ADBC.html | ADBC： Arrow Database Connectivity — Apache Arrow v13.0.0



Nix 是一个功能强大的开源软件包管理器和操作系统部署工具，主要用于构建、配置和管理软件环境



https://nixos.org/ | Nix & NixOS |可重现的构建和部署  声明式生成和部署

## 免责声明

免责声明

01. 网站内容

本博客网站所提供的所有信息，包括但不限于文本、图片、视频、音频、软件、代码、文档等，均为一般信息目的而提供。我们尽最大努力确保信息的准确性，但并不保证其完整性、正确性、及时性或适用性。读者在使用此类信息时应自行判断其准确性和可靠性，并承担因此产生的全部责任。

02. 第三方链接

本网站可能包含指向第三方网站的链接。这些链接仅供方便起见，我们并未对这些网站进行审核，也不对其内容负责。使用这些链接及其内容的风险由用户自行承担。

03. 版权与许可

本网站上的所有原创内容均受版权法的保护。未经明确许可，禁止复制、转载、分发、修改或以任何方式使用本网站上的内容。如需使用，请联系我们获取许可。

04. 法律责任

在任何情况下，本网站及其所有者、运营者、编辑、作者、代理人和任何相关方均不对任何直接、间接、附带、特殊、偶然或惩罚性损失承担责任，包括但不限于利润损失、业务中断、数据丢失或其他经济损失，无论这些损失是否由于使用或无法使用本网站的信息所致，或因违反合同、疏忽或其他行为所致。

05. 修改

我们保留随时修改或更新本免责声明的权利，且无需另行通知。因此，用户应定期检查本页面以获取最新的免责声明。继续使用本网站即表示接受这些修改。

06. 法律适用与管辖

本免责声明及其解释和执行均受适用的法律法规管辖。如果本免责声明中的任何条款被裁定为无效或不可执行，该条款应被视为可分离的，且其无效或不可执行不影响其他条款的有效性和可执行性。

通过访问和使用本博客网站，你表示已阅读、理解并同意遵守上述免责声明的所有条款。



