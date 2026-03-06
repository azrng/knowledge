---
title: Elsa
lang: zh-CN
date: 2021-12-03
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: elsa
slug: udr7n8
docsId: '29473054'
---

## 说明
elsa是一个开源的.NET Standard 工作流框架，工作流不仅可以使用代码定义，还可以定义为JSON、YAML或XML。
官方网站：[https://elsa-workflows.github.io/elsa-core/](https://elsa-workflows.github.io/elsa-core/)

持久化。工作流几乎可以使用任何存储机制持久化。将支持以下提供程序：

- In Memory
- File System
- SQL Server
- MongoDB
- CosmosDB

## 产品主要功能
**1. 可视化的工作流编辑器**
    Elsa带有一个独立的，可重复使用的HTML5工作流设计器Web组件，您可以将其嵌入自己的HTML网页中。设计器完全在客户端运行，并具有丰富的JavaScript API，该API可让您定义自定义插件以扩展其功能。
    ![](/common/1609604825057-055011fd-e5d4-4558-acf1-23449e4ad402.png)
**   2. Dashboard 看板**
   Elsa看板使您能够定义工作流程定义并检查执行的工作流程。要设计工作流程，只需右键单击画布，从活动选择器中选择一个活动，对其进行配置，然后拖动多个活动之间的连接以创建从简单的短期运行的工作流程到高级的长期运行的工作流程的流程。
**  3. 支持长期和短期的工作流模式**
   Elsa提供了短期和长期工作流程。可以理解为简单的和复杂的流程设计
   例如，当您需要实现业务规则引擎时，短时运行的工作流程非常有用，在该流程中，如果工作流程是一个接收输入并返回结果的函数，则可以从应用程序中调用它。
   长时间运行的工作流能够轻松地实现涉及人和机器的复杂过程。长期运行过程的典型示例是文档批准工作流，其中某些文档的审阅过程涉及多方。这样的工作流程可能涉及计时器，电子邮件，提醒，HTTP请求，用户操作等。
** 4. 丰富的工作流活动**
**     基本元语：**是低级的技术活动。

- SetVariable

**      控制流：**控制流活动提供对过程的控制。例如，Fork活动会将工作流程分为两个或多个执行分支。

- ForEach
- Fork
- IfElse
- Join
- Switch
- While

**     工作流活动：**活动代表工作流程中的单个步骤。开箱即用的Elsa NuGet套件套件为您提供了一系列不错的活动，主要包含以下工作流活动
     **工作流程：**工作流类别中的活动与工作流级别的功能相关，例如相关性和信令。

- Correlate
- Finish
- Signaled
- Start
- TriggerSignal
- TriggerWorkflow

      **控制台活动：**在实施带有工作流的基于控制台的应用程序时，控制台活动非常有用。

- ReadLine
- WriteLine

      **DropBox活动：**Dropbox活动可帮助实现与Dropbox API集成。

- SaveToDropbox

**      电子邮件活动：**电子邮件活动允许您使用SMTP发送电子邮件。

- SendEmail

**       HTTP活动：**能够实现发送传出HTTP请求并响应传入HTTP请求的工作流，非常适合与基于外部Web的API集成。

- ReceiveHttpRequest
- SendHttpRequest
- WriteHttpResponse

**      定时器活动**：定时器活动可以基于某些基于时间的事件（例如CRON表达式，常规计时器）或在将来的特定时间触发工作流。

- CronEvent
- InstantEvent
- TimerEvent

**       User Task：**用户任务事件是用户自定义配置的活动，用户可以执行一系列可能的操作。每个动作对应于活动的结果。用户执行任何这些操作后，工作流将沿适当的路径恢复。这里的想法是您的应用程序将使用选定的操作触发工作流。
          例如，这可以表示为一组简单的按钮。由您的应用程序决定如何呈现这些操作。
    **5. 版本控制**
      每个工作流程定义都是版本化的。发布工作流程的新版本时，其版本号会增加。现有工作流程实例仍将使用工作流程定义的先前版本，但新工作流程将使用最新版本。   
**    6. 持久化支持**

- CosmosDB (DocumentDB)
- Entity Framework Core：各类关系型数据库，支持SQLServer
- Memory：Non-persistent, use only for tests and/or short-lived workflows.
- MongoDB
- YesSQL

**    7. 表达式**
             工作流活动可以使用表达式，这些表达式可以炸运行时执行，使用表达式可以引用其他活动产生的值。Elsa支持以下三种类似的表达式：
           **  文字表达式：**
             文字表达式不是一个真正的解释，当你需要设置，无需运行时计算活动属性的值才会被使用。
           **  JavaScript表达式：**
             当你需要计算一些数值或读取工作流程中的过程值时通常使用JavaScript表达式。
**             液体表达式（这个名字很奇怪，目前还在研究中）**
             当你需要创建一个HTTP请求，HTTP响应的计算通常使用流式表达式，或例如其中主体被标记使用液体发送电子邮件时。

## 资料

.NET 工作流Elsa - 书签:https://mp.weixin.qq.com/s/KTbCVWUBMRq2J23h7PsiuQ?poc_token=HGkommejqLeCJkJ6fDyQrhtTyq22Wot3n7AS7OL7
