# 告别控制台刷屏！我为 .NET 开发了一款轻量级日志面板

> 导读：在开发调试 API 时，日志几乎是我们定位问题的第一现场。
> 但现实往往是：**控制台刷得太快、关键信息留不住、想追一条请求链路还得手动翻半天**。
> 所以，我做了一个更适合开发阶段使用的小工具——**DevLogDashboard**。
> 它主打 **轻量、零配置、开箱即用**，帮助 .NET 开发者更高效地查看日志、追踪请求、定位异常。
> 目前项目还在预览版本，欢迎大家试用，也欢迎提出建议。 🚀

---

## 一、为什么要做这个工具？

作为一名 .NET 开发者，我在日常开发 API 项目时，长期被一个问题困扰：**日志明明很多，但真正想看的那条，总是最难找到。**

常见痛点大概有这些：

- **控制台日志刷屏太快**，关键信息一闪而过
- **反复重启应用**，只为了看某段代码的执行日志
- **生产环境用的日志系统太重**，不适合开发调试
- **想看完整的请求链路**，却要在海量日志中人工筛选

市面上并不是没有成熟方案。像 ELK、Seq 这样的日志系统都非常强大。
但问题在于，它们更适合 **生产环境**：部署成本更高、资源占用更多、配置也更复杂。

而在开发阶段，我们真正需要的，往往不是“大而全”，而是一个：

- **马上装上就能用**
- **不用额外部署数据库或服务**
- **能快速看日志、查异常、追请求**
- **足够轻量，不给本地开发增加负担**

于是，我开发了 **DevLogDashboard**。✅

---

## 二、DevLogDashboard 是什么？

**DevLogDashboard** 是一个面向 .NET 开发者的轻量级日志查看 NuGet 包，专门用于 API 项目在**开发调试阶段**快速查看日志和请求链路。

你可以把它理解成一个内嵌在应用里的“小型日志面板”：

- 不依赖外部数据库
- 不需要额外部署服务
- 直接通过浏览器查看日志
- 保留开发期最需要的核心能力

### 核心特点一览

| 特点 | 说明 |
|------|------|
| 🚀 **零配置** | 无需数据库等外部存储，开箱即用 |
| 💾 **内存存储** | 高效轻量，自动管理，重启自动清空 |
| 📊 **实时查看** | 浏览器访问，实时查看日志 |
| 🔍 **请求追踪** | 通过 RequestId 查看完整请求链路 |
| 📝 **结构化日志** | 支持记录和查看结构化数据 |
| 🌐 **HTTP 上下文** | 自动捕获请求信息，排查问题更方便 |

> **一句话总结**：它不是为了替代生产级日志系统，而是为了让你在开发阶段，**更轻松地看清日志**。

---

## 三、快速开始：几步就能跑起来

下面我们直接进入实战。整个接入过程非常简单。

### 第一步：安装 NuGet 包

先执行下面这条命令安装包：

```bash
dotnet add package Azrng.DevLogDashboard
```

### 第二步：注册服务并启用中间件

接下来，在 `Program.cs` 中添加配置。
这一步的作用是：**把 DevLogDashboard 注册到应用里，并暴露出一个可访问的日志面板路由。**

```csharp
using Azrng.DevLogDashboard.Extensions;

var builder = WebApplication.CreateBuilder(args);

// 添加 DevLogDashboard 服务
builder.Services.AddDevLogDashboard(options =>
{
    options.EndpointPath = "/dev-logs";      // 仪表板访问路径
    options.MaxLogCount = 10000;             // 最大存储日志数
    options.ApplicationName = "MyApi";       // 应用名称（可选）
    options.ApplicationVersion = "1.0.0";    // 应用版本（可选）
});

var app = builder.Build();

// 使用 DevLogDashboard（推荐仅在开发环境使用）
if (app.Environment.IsDevelopment())
{
    app.UseDevLogDashboard();
}

app.Run();
```

这里有一个细节值得强调：
**推荐只在开发环境启用**。这样既符合工具定位，也能避免不必要的暴露风险。

### 第三步：照常使用 `ILogger`

这一点是 DevLogDashboard 很友好的地方：**你不需要改变现有日志写法**。
平时怎么写 `ILogger`，现在还是怎么写。

下面这段示例代码演示了普通日志、结构化日志和异常日志的记录方式：

```csharp
[ApiController]
[Route("api/[controller]")]
public class ValuesController : ControllerBase
{
    private readonly ILogger<ValuesController> _logger;

    public ValuesController(ILogger<ValuesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        // 普通日志
        _logger.LogInformation("获取数据列表");

        // 结构化日志（使用 @ 符号）
        var data = new { Id = 1, Name = "Test" };
        _logger.LogInformation("返回数据：{@Data}", data);

        return Ok(new[] { "value1", "value2" });
    }

    [HttpGet("error")]
    public IActionResult Error()
    {
        try
        {
            throw new InvalidOperationException("测试错误");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "发生异常");
            return StatusCode(500);
        }
    }
}
```

### 第四步：打开仪表板

启动应用后，在浏览器访问下面的地址：

```
http://localhost:{port}/dev-logs
```

这时，你就能看到实时日志面板了。🎉

---

## 四、有哪些功能？开发阶段最常用的都安排了

DevLogDashboard 没有追求“大而全”，而是把开发调试中最常用、最刚需的能力保留下来。

---

### 1. Logs 面板：实时查看日志列表

这是最常用的页面，适合快速扫描应用当前发生了什么。

你可以在这里完成这些操作：

- 按时间倒序显示所有日志
- 按级别筛选（选择某个级别后显示该级别及更高级别）
- 按日期范围筛选
- 支持关键词搜索
- 展开查看详情和堆栈跟踪
- 查看完整的 HTTP 请求上下文

💡 对开发者来说，这意味着你不再需要盯着控制台“抢日志”，而是可以在界面里更稳定地查看和筛选。

---

### 2. Traces 面板：按请求链路追踪问题

如果你排查的是一个完整请求的执行过程，那 `Traces` 面板会更有价值。

它支持：

- 按 RequestId 聚合显示请求
- 查看完整请求生命周期
- 分析请求耗时
- 快速定位包含错误的请求

这类能力在定位以下问题时特别有用：

- 某个接口为什么慢
- 某次请求是在哪一步报错的
- 同一条请求里，前后到底发生了哪些日志事件

---

### 3. 搜索语法：更快缩小排查范围

当日志多起来之后，搜索能力就非常关键了。
DevLogDashboard 支持多种搜索方式，方便你快速定位目标日志。

下面是支持的查询示例：

```
// 精准查询
message="获取人员列表"

// 模糊查询
message like "超时"

// 字段查询
RequestId = "0HNJ2POQECAU1"

// 级别查询
level = "ERROR"
```

支持的搜索字段如下：

| 字段 | 说明 |
|------|------|
| `message` | 日志消息 |
| `level` | 日志级别 |
| `requestId` | 请求 ID |
| `requestPath` | 请求路径 |
| `requestMethod` | 请求方法 |
| `source` | 日志来源 |
| `exception` | 异常信息 |
| `application` | 应用名称 |

> 💡 **小技巧**：在日志详情页，点击属性行首的 **✓** 符号，可快速搜索相同值的日志。

---

## 五、如何配置？常见场景一次讲清楚

如果你希望更细粒度地控制记录行为，可以通过配置项进行调整。

### 基础配置项

下面这段代码展示了 DevLogDashboard 的主要配置能力：

```csharp
builder.Services.AddDevLogDashboard(options =>
{
    options.EndpointPath = "/dev-logs";        // 仪表板访问路径（默认：/dev-logs）
    options.MaxLogCount = 10000;               // 最大存储日志数（默认：10000）
    options.OnlyLogErrors = false;             // 只记录错误日志（默认：false）
    options.MinLogLevel = LogLevel.Trace;      // 最低日志级别（默认：Trace）
    options.ApplicationName = "MyApi";         // 应用名称（可选）
    options.ApplicationVersion = "1.0.0";      // 应用版本（可选）

    // 忽略的路径（不记录日志）
    options.IgnoredPaths.Add("/health");
    options.IgnoredPaths.Add("/metrics");

    // 忽略的 HTTP 方法
    options.IgnoredMethods.Add("OPTIONS");
});
```

### 几个典型使用场景

为了便于大家快速上手，下面列几个常见配置方式。

#### 场景 1：只关注 Warning 和 Error

如果你当前只想盯住异常和警告日志，可以这样配置：

```csharp
options.OnlyLogErrors = true;  // 只记录 Warning 和 Error 级别
```

#### 场景 2：设置最低日志级别

如果你想保留 Information 及以上日志，可以这样写：

```csharp
options.MinLogLevel = LogLevel.Information;  // 只记录 Information 及以上
```

#### 场景 3：忽略健康检查等无效噪音

像 `/health`、`/ready` 这类接口通常会产生大量“无效日志”，可以直接忽略：

```csharp
options.IgnoredPaths.Add("/health");
options.IgnoredPaths.Add("/ready");
```

> ✅ 这类配置的核心价值在于：**减少噪音，让真正有用的日志浮出来。**

---

## 六、技术架构：它为什么足够轻？

很多人会关心一个问题：
既然它是嵌入式的日志面板，那内部架构会不会很重？

答案是：**不会。**
DevLogDashboard 从设计上就优先考虑了开发环境的轻量性。

### 支持框架

- .NET 6.0 / 7.0 / 8.0 / 9.0 / 10.0

### 核心组件

下面是整体组件结构：

```
┌─────────────────────────────────────────────────┐
│              DevLogDashboard                     │
├─────────────────────────────────────────────────┤
│  DevLogDashboardMiddleware  - 仪表板中间件        │
│  DevLogDashboardLogger      - 自定义日志记录器    │
│  DevLogDashboardLoggerProvider - 日志提供程序     │
│  InMemoryLogStore           - 内存日志存储        │
│  DevLogDashboardApiHandler  - API 请求处理器      │
└─────────────────────────────────────────────────┘
```

### 技术特点

它的实现思路可以概括为三点：

- **存储方式**：内存 (Queue + ReaderWriterLockSlim)，线程安全
- **前端**：原生 JavaScript，无框架依赖
- **API**：RESTful 风格，自包含路由

也正因为这种设计，它才能做到：

- 不依赖数据库
- 不依赖额外服务
- 占用资源低
- 非常适合本地开发与联调阶段使用

---

## 七、使用前要注意什么？

虽然 DevLogDashboard 足够轻便，但在使用时，还是有几个边界需要明确。

> ⚠️ **重要提示**

1. **仅用于开发环境**：本产品设计用于开发调试，生产环境请使用专业的日志系统（如 ELK、Seq 等）
2. **内存限制**：默认最大存储 10000 条日志，超出后自动清理最旧的日志
3. **线程安全**：使用 Queue + ReaderWriterLockSlim 保证多线程并发安全
4. **自动清理**：超出最大日志数量时自动清理旧日志，无需手动维护

这里最关键的一点就是第一条：
**它的定位是“开发调试工具”，不是“生产日志平台”。** 这一点一定要区分清楚。

---

## 八、设计灵感：向 Seq 致敬

在界面设计和交互体验上，DevLogDashboard 借鉴了 **.NET 领域非常知名的日志系统——Seq**。

这并不是简单“模仿”，而是希望把 Seq 那种优秀的日志浏览体验，用一种更轻量、更适合开发阶段的方式带给 .NET 开发者。

### 为什么参考 Seq？

因为 Seq 在 .NET 社区里，几乎是很多人心中的“结构化日志查看标杆”。

它的优势很明确：

| Seq 的特点 | 说明 |
|------------|------|
| 🎯 **专为 .NET 设计** | 与 Serilog 等日志库无缝集成 |
| 📊 **结构化日志** | 原生支持结构化数据查询和分析 |
| 🔍 **强大的查询语法** | SQL-like 查询语言，支持复杂过滤 |
| 🌐 **实时流式查看** | 日志实时推送，监控无延迟 |
| 💼 **生产级方案** | 适合企业级生产环境 |

### 它和 Seq 的定位有什么不同？

虽然有设计上的借鉴，但两者的定位其实非常清晰，不冲突。

| 特性 | Seq | DevLogDashboard |
|------|-----|-----------------|
| **目标场景** | 生产环境 | 开发调试 |
| **部署方式** | 独立服务，需 Docker/安装 | NuGet 包，零部署 |
| **存储方式** | 数据库/文件持久化 | 内存存储，重启清空 |
| **资源占用** | 较高 (独立进程) | 极低 (应用内) |
| **配置复杂度** | 中/高 | 零配置 |
| **成本** | 免费版有限制，企业版付费 | 完全免费 (MIT) |

换句话说：

- 如果你要的是**生产级日志平台**，Seq 更合适
- 如果你要的是**开发阶段快速看日志**，DevLogDashboard 更轻巧直接

---

## 九、写在最后

DevLogDashboard 的灵感来源于 **Seq**、LogDashboard 和 MiniProfiler。
我希望它能成为 .NET 开发者在开发调试阶段的一个顺手工具：**不用折腾部署，也不用忍受控制台刷屏，就能更高效地查看日志、追踪请求、定位问题。**

如果你也经常被这些问题困扰：

- 控制台日志刷太快，看不清
- 想查某次请求的完整链路，很费劲
- 不想为了本地调试引入一整套重型日志系统

那不妨试试 **DevLogDashboard**。也欢迎你在实际使用后，把体验、建议和问题反馈给我。🙌

---

## 总结

最后用几句话总结一下这篇文章的核心内容：

- **DevLogDashboard 是一个面向 .NET 开发调试阶段的轻量级日志面板**
- **它主打零配置、内存存储、浏览器实时查看**
- **支持结构化日志、请求链路追踪、基础搜索语法**
- **适合开发环境，不适合替代生产级日志系统**

如果这篇文章对你有帮助，欢迎 **点赞、在看、转发**。
如果你对日志调试、.NET 工具链或者 DevLogDashboard 的后续功能有想法，也欢迎在留言区交流。💬