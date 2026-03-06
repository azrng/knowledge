---
title: dotNet调用
lang: zh-CN
date: 2025-03-16
publish: true
author: azrng
isOriginal: true
category:
  - ai
tag:
  - ai
  - dotNet
---

## 概述

面向.Net开发人员的AI：[https://learn.microsoft.com/zh-cn/dotnet/ai/](https://learn.microsoft.com/zh-cn/dotnet/ai/)

生态系统工具和SDK：[https://learn.microsoft.com/zh-cn/dotnet/ai/dotnet-ai-ecosystem](https://learn.microsoft.com/zh-cn/dotnet/ai/dotnet-ai-ecosystem)

```xml
<ItemGroup>
    <PackageReference Include="Microsoft.Extensions.VectorData.Abstractions" Version="9.0.0-preview.1.25161.1" />
    <PackageReference Include="Microsoft.SemanticKernel.Connectors.Qdrant" Version="1.42.0-preview" />
    <PackageReference Include="Microsoft.Extensions.AI" Version="9.3.0-preview.1.25161.3" />
    <PackageReference Include="Microsoft.Extensions.AI.OpenAI" Version="9.3.0-preview.1.25161.3" />
</ItemGroup>

```

## 本地测试的环境变量配置

```shell
# c#中读取使用
LLM:APIURL
LLM:APIKEY

# 其他语言读取
ASPNETCORE_LLM__APIURL
ASPNETCORE_LLM__APIKEY

# 设置环境变量
[Environment]::SetEnvironmentVariable("ASPNETCORE_LLM__APIURL", "https://open.bigmodel.cn/api/paas/v4/", "User")
[Environment]::SetEnvironmentVariable("ASPNETCORE_LLM__APIKEY", "xxxx", "User")


# 测试是否设置成功(新开窗口测试)
Get-ChildItem Env:ASPNETCORE_LLM__APIURL


# 移除环境变量
[Environment]::SetEnvironmentVariable("ASPNETCORE_LLM__APIURL", $null, "User")
```

## Microsoft.Extensions.AI

它为在 .NET 应用程序中使用 LLM 提供了一个统一的接口。 它抽象出不同 LLM 实现的复杂性。 与 OpenAI 兼容的模型或终端节点提供 AI 抽象之间切换，而无需更改应用程序代码。

**Microsoft.Extensions.AI 通过 NuGet 包提供了以下服务的实现：**

- **OpenAI**
- **Azure OpenAI**
- **Azure AI Inference**
- **Ollama**

将来，这些抽象的服务实现都将会是客户端库的一部分。

## SemanticKernel系列包

[语义内核](https://learn.microsoft.com/zh-cn/dotnet/ai/semantic-kernel-dotnet-overview)是一种开源 SDK，可在 .NET 应用中启用 AI 集成和业务流程功能。 对于将一个或多个 AI 服务与其他 API 或 Web 服务、数据存储和自定义代码结合使用的 .NET 应用程序，此 SDK 是推荐的 AI 编排工具。 语义内核以以下方式使企业开发人员受益：

- 简化将 AI 功能集成到现有应用程序中的过程，从而为企业产品提供统一的解决方案。
- 通过可降低复杂性的抽象，最大限度地缩短使用不同 AI 模型或服务的学习曲线。
- 通过减少 AI 模型提示和响应的不可预测行为来提高可靠性。 可以微调提示并计划任务，以创建可控且可预测的用户体验。

文档：[https://learn.microsoft.com/zh-cn/semantic-kernel/get-started/supported-languages](https://learn.microsoft.com/zh-cn/semantic-kernel/get-started/supported-languages)

快速入门示例：[https://learn.microsoft.com/zh-cn/semantic-kernel/get-started/quick-start-guide](https://learn.microsoft.com/zh-cn/semantic-kernel/get-started/quick-start-guide?pivots=programming-language-csharp)

各种示例代码：[https://github.com/microsoft/semantic-kernel/tree/main/dotnet/samples](https://github.com/microsoft/semantic-kernel/tree/main/dotnet/samples)

一组 C# 笔记本，可帮助你快速开始使用语义内核。:https://github.com/johnmaeda/SK-Recipes

### 功能

语义内核围绕几个核心概念构建：

- **连接**：与外部 AI 服务和数据源交互。
- **插件**：封装应用程序可以使用的功能。
- **规划器**：根据用户行为编排执行计划和策略。
- **内存**：抽象并简化 AI 应用程序的上下文管理。

### 内核

内核是语义内核的核心组件。 简单描述就是内核是一个依赖项注入容器，用于管理运行 AI 应用程序所需的所有服务和插件。 将所有服务和插件提供给内核，AI 会根据需要无缝调用。



#### 内核使用依赖注入

在 C# 中，可以使用依赖关系注入来创建内核。 为此，需要创建 `ServiceCollection` 服务和插件并将其添加到其中。 下面是如何使用依赖关系注入创建内核的示例。考虑到插件即可是可变的所以创建为瞬时服务

```csharp
using Microsoft.SemanticKernel;

var builder = Host.CreateApplicationBuilder(args);

// Add the OpenAI chat completion service as a singleton
builder.Services.AddOpenAIChatCompletion(
    modelId: "gpt-4",
    apiKey: "YOUR_API_KEY",
    orgId: "YOUR_ORG_ID", // Optional; for OpenAI deployment
    serviceId: "YOUR_SERVICE_ID" // Optional; for targeting specific services within Semantic Kernel
);

// Create singletons of your plugins
builder.Services.AddSingleton(() => new LightsPlugin());
builder.Services.AddSingleton(() => new SpeakerPlugin());

// Create the plugin collection (using the KernelPluginFactory to create plugins from objects)
builder.Services.AddSingleton<KernelPluginCollection>((serviceProvider) => 
    [
        KernelPluginFactory.CreateFromObject(serviceProvider.GetRequiredService<LightsPlugin>()),
        KernelPluginFactory.CreateFromObject(serviceProvider.GetRequiredService<SpeakerPlugin>())
    ]
);

// Finally, create the Kernel service with the service provider and plugin collection
builder.Services.AddTransient((serviceProvider)=> {
    KernelPluginCollection pluginCollection = serviceProvider.GetRequiredService<KernelPluginCollection>();

    return new Kernel(serviceProvider, pluginCollection);
});
```

### 插件

从大模型调用插件，处理模型与代码之间的来回通信。支持：自动调用插件、手动调用插件、必须调用指定插件等等。

文档：[https://learn.microsoft.com/zh-cn/semantic-kernel/concepts/ai-services/chat-completion/function-calling](https://learn.microsoft.com/zh-cn/semantic-kernel/concepts/ai-services/chat-completion/function-calling/?pivots=programming-language-csharp)

#### 默认插件

* `ConversationSummaryPlugin`：对话总结插件

- `FileIOPlugin`： 读写文件插件
- `HttpPlugin`： `Http`请求功能的插件
- `MathPlugin`：`Math` 计算插件
- `TextPlugin`：字符串操作插件
- `TimePlugin`：获取当前时间和日期插件
- `WaitPlugin`： `WaitPlugin`提供了一组函数，在进行其余操作之前等待。

#### 提示词插件

```csharp
var builder = Kernel.CreateBuilder();
builder.AddOpenAIChatCompletion(_configuration["LLM:ModelId"], openAIClient: _aiClient);

// 添加企业服务
builder.Services.AddLogging(services => services.AddConsole().SetMinimumLevel(LogLevel.Trace));

// // 加载语义函数插件
// kernel.CreateFunctionFromPrompt(promptTemplate: @"总结提供的未结构化文本：{{$userInput}}",
//     functionName: "SummarizeText",
//     templateFormat: "SemanticFunctions");

var kernel = builder.Build();

// 使用yaml格式：https://www.cnblogs.com/ruipeng/p/18205081
var kernelFunctions = kernel.CreateFunctionFromPrompt(new PromptTemplateConfig
                                                      {
                                                          Name = "intent",
                                                          Description = "使用助手理解用户输入的意图。",
                                                          TemplateFormat =
                                                              PromptTemplateConfig
                                                                  .SemanticKernelTemplateFormat, //此处可以省略默认就是"semantic-kernel"
                                                          Template = "此请求的意图是什么？{{$request}}",
                                                          InputVariables =
                                                          [
                                                              new() { Name = "request", Description = "用户的请求.", IsRequired = true }
                                                          ],
                                                          ExecutionSettings = new Dictionary<string, PromptExecutionSettings>()
                                                                              {
                                                                                  {
                                                                                      PromptExecutionSettings
                                                                                          .DefaultServiceId, //"default"
                                                                                      new OpenAIPromptExecutionSettings()
                                                                                      {
                                                                                          MaxTokens = 1024, Temperature = 0
                                                                                      }
                                                                                  },
                                                                              }
                                                      });

var request = "今天天气咋样";
var kernelArguments = new KernelArguments { { "request", request } };
var functionResult = await kernelFunctions.InvokeAsync(kernel, kernelArguments);
Console.WriteLine($"意图：{functionResult}");
```

#### 原生本地代码函数

:::info

由于大多数LLM应用程序都使用 Python 进行函数调用训练，因此即使您使用的是 C# 或 Java SDK，也建议对函数名称和属性名称使用蛇形大小写。

:::

```csharp
[KernelFunction("get_lights")]
[Description("Gets a list of lights and their current state")]
public async Task<List<LightModel>> GetLightsAsync()
{
  return lights
}
```

### 筛选器

文档：[https://learn.microsoft.com/zh-cn/semantic-kernel/concepts/enterprise-readiness/filters](https://learn.microsoft.com/zh-cn/semantic-kernel/concepts/enterprise-readiness/filters)

### 矢量存储

文档：[https://learn.microsoft.com/zh-cn/semantic-kernel/concepts/vector-store-connectors/](https://learn.microsoft.com/zh-cn/semantic-kernel/concepts/vector-store-connectors/?pivots=programming-language-csharp)

#### Postgres

文档：https://learn.microsoft.com/en-us/semantic-kernel/concepts/vector-store-connectors/out-of-the-box-connectors/postgres-connector?pivots=programming-language-csharp

```xml
<PackageReference Include="Microsoft.SemanticKernel.Connectors.Postgres" Version="1.47.0-preview" />
```





### 依赖注入

```csharp
<PackageReference Include="Microsoft.SemanticKernel" Version="1.42.0"/>
<PackageReference Include="Microsoft.SemanticKernel.Plugins.Core" Version="1.46.0-alpha" />
```

#### 依赖注入方式一

```csharp
// 配置大模型 openai
var apiKeyCredential =
    new ApiKeyCredential(configuration["LLM:ApiKey"].GetOrDefault(configuration["ASPNETCORE_LLM:ApiKey"]));
var aiClientOptions = new OpenAIClientOptions { Endpoint = new Uri(configuration["LLM:EndPoint"]) };
var aiClient = new OpenAIClient(apiKeyCredential, aiClientOptions);

// 添加Kernel服务 方案1
{
    services.AddTransient<Kernel>(sp =>
    {
        var kernelBuilder = Kernel.CreateBuilder();

        // 注入企业组件
        kernelBuilder.Services.AddLogging(services => services.AddConsole().SetMinimumLevel(LogLevel.Trace));

        // openai方案
        kernelBuilder.AddOpenAIChatCompletion(modelId: configuration["LLM:ModelId"], aiClient);

        // ollama 方案
        //kernelBuilder.AddOllamaChatCompletion(configuration["LLM:ModelId"], new Uri(configuration["LLM:EndPoint"]));

        var kernel = kernelBuilder.Build();

        // 注册插件
        kernel.Plugins.AddFromType<TextPlugin>();
        kernel.Plugins.AddFromType<TimePlugin>();
        kernel.Plugins.AddFromType<WeatherPlugin>();

        return kernel;
    });
    services.AddTransient<IChatCompletionService>(sp =>
    {
        var kernel = sp.GetRequiredService<Kernel>();
        return kernel.GetRequiredService<IChatCompletionService>();
    });
}
```

使用的时候可以通过注入Kernel、IChatCompletionService来操作

#### 依赖注入方式二

```csharp
// 配置大模型 openai
var apiKeyCredential =
    new ApiKeyCredential(configuration["LLM:ApiKey"].GetOrDefault(configuration["ASPNETCORE_LLM:ApiKey"]));
var aiClientOptions = new OpenAIClientOptions { Endpoint = new Uri(configuration["LLM:EndPoint"]) };
var aiClient = new OpenAIClient(apiKeyCredential, aiClientOptions);

{
    // var kernelBuilder = services.AddKernel();
    // kernelBuilder.AddOpenAIChatCompletion(modelId: configuration["LLM:ModelId"], aiClient);
    // // kernelBuilder.Services.AddLogging(services => services.AddConsole().SetMinimumLevel(LogLevel.Trace));
    // // 注册插件
    // kernelBuilder.Plugins.AddFromType<TextPlugin>();
    // kernelBuilder.Plugins.AddFromType<TimePlugin>();
    // kernelBuilder.Plugins.AddFromType<WeatherPlugin>();
}
```

使用的时候通过注入Kernel来操作

## AutoGen

面向多智能体AI应用的编程框架。

仓库地址：[https://github.com/microsoft/autogen](https://github.com/microsoft/autogen)

## 向量

### Microsoft.SemanticKernel.Connectors.InMemory

提供内存中的向量存储类来保存可查询的向量数据记录

### Microsoft.Extensions.VectorData.Abstractions

启用对向量存储的 Create-Read-Update-Delete （CRUD） 和搜索作。

### Microsoft.Extensions.VectorData

**Microsoft.Extensions.VectorData** 是一组 .NET代码库，旨在管理 .NET 应用程序中基于向量的数据。这些库为与向量存储交互提供了一个统一的 C# 抽象层，使开发人员能够有效地处理嵌入并执行向量相似性查询。提供了以下功能

- 对向量存储执行 Create-Read-Update-Delete （CRUD）作
- 在矢量存储上使用矢量和文本搜索

其他介绍：https://devblogs.microsoft.com/dotnet/introducing-microsoft-extensions-vector-data

## 提示词编写

文档：[https://learn.microsoft.com/zh-cn/dotnet/ai/conceptual/prompt-engineering-dotnet](https://learn.microsoft.com/zh-cn/dotnet/ai/conceptual/prompt-engineering-dotnet)

## 基础操作

### 调用在线OpenAi标准接口

引用nuget包

```xml
<ItemGroup>
    <PackageReference Include="Microsoft.Extensions.AI" Version="9.3.0-preview.1.25161.3" />
    <PackageReference Include="Microsoft.Extensions.AI.OpenAI" Version="9.3.0-preview.1.25161.3" />
</ItemGroup>
```

注入服务

```csharp
var apiKeyCredential = new ApiKeyCredential(build.Configuration["LLM:ApiKey"]);
var aiClientOptions = new OpenAIClientOptions();
aiClientOptions.Endpoint = new Uri(build.Configuration["LLM:EndPoint"]);
var aiClient = new OpenAIClient(apiKeyCredential, aiClientOptions)
    .AsChatClient(build.Configuration["LLM:ModelId"]);
build.Services.AddChatClient(aiClient).UseFunctionInvocation().UseLogging();
```

使用专家提示进行连续问答

```c#
public class ChatService
{
    private readonly IChatClient _chatClient;

    public ChatService(IChatClient chatClient)
    {
        _chatClient = chatClient;
    }

    public async Task RunAsync()
    {
        await ExpertChat();
    }


    /// <summary>
    /// 使用专家提示进行连续问答
    /// </summary>
    private async Task ExpertChat()
    {
        var expertPrompt = "假设你是一个.net开发专家，请详细回答以下问题";

        // 创建一个历史记录，并添加系统消息作为专家提示
        var chatHistory = new List<ChatMessage> { new ChatMessage(ChatRole.System, expertPrompt) };

        Console.WriteLine($"已设置专家提示: {expertPrompt}");
        Console.WriteLine("开始对话 (输入'exit'退出):");

        while (true)
        {
            Console.Write("\n您的问题: ");
            var userPrompt = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(userPrompt) || userPrompt.ToLower() == "exit")
            {
                Console.WriteLine("对话结束");
                break;
            }

            chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));

            Console.WriteLine("\nAI回答:");
            var chatResponse = "";
            await foreach (var item in _chatClient.GetStreamingResponseAsync(chatHistory))
            {
                // 流式输出回答
                Console.Write(item.Text);
                chatResponse += item.Text;
            }

            chatHistory.Add(new ChatMessage(ChatRole.Assistant, chatResponse));
            Console.WriteLine();
        }
    }
}
```

## 文章

https://mp.weixin.qq.com/s/eJtzvKeXaoP1rdnS3WC-CQ | Microsoft.Extensions.VectorData实现语义搜索

https://devblogs.microsoft.com/dotnet/announcing-dotnet-ai-template-preview1/ | .NET AI Template Now Available in Preview - .NET Blog
