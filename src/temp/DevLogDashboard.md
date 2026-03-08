# 告别控制台刷屏！我为 .NET 开发了一款轻量级日志面板

> 导语：在开发调试阶段，你是否也曾为日志查看而烦恼？控制台刷屏太快看不清？反复重启看日志太麻烦？今天给大家带来一款轻量级的日志查看神器——**DevLogDashboard**

---

## 一、为什么做这个？

作为一名 .NET 开发者，在日常开发 API 项目时，日志查看一直是个痛点：

- **控制台日志刷屏太快**，关键信息一闪而过
- **反复重启应用**，只为了看某段代码的执行日志
- **生产环境用的日志系统太重**，不适合开发调试
- **想看完整的请求链路**，却要在海量日志中人工筛选

市面上的日志系统（如 ELK、Seq）功能强大，但部署复杂、资源占用高，更适合生产环境。而开发阶段，我们需要的是一款**开箱即用、轻量简单**的日志查看工具。

于是，我开发了 **DevLogDashboard**。

---

## 二、DevLogDashboard 是什么？

**DevLogDashboard** 是一个面向 .NET 开发者的轻量级日志查看 NuGet 包，专为 API 项目在开发调试阶段提供便捷的日志面板界面。

### 核心特点

| 特点 | 说明 |
|------|------|
| 🚀 **零配置** | 无需数据库等外部存储，开箱即用 |
| 💾 **内存存储** | 高效轻量，自动管理，重启自动清空 |
| 📊 **实时查看** | 浏览器访问，实时查看日志 |
| 🔍 **请求追踪** | 通过 RequestId 查看完整请求链路 |
| 📝 **结构化日志** | 支持记录和查看结构化数据 |
| 🌐 **HTTP 上下文** | 自动捕获请求信息，排查问题更方便 |

---

## 三、快速开始

### 第一步：安装 NuGet 包

```bash
dotnet add package Azrng.DevLogDashboard
```

### 第二步：配置服务

在 `Program.cs` 中添加以下代码：

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

### 第三步：正常使用日志

不需要改变任何编码习惯，直接使用 `ILogger` 即可：

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

### 第四步：访问仪表板

启动应用后，在浏览器访问：

```
http://localhost:{port}/dev-logs
```

就能看到实时日志面板了！

---

## 四、功能展示

### 1. Logs 面板 - 实时日志列表

- 按时间倒序显示所有日志
- 按级别筛选（选择某个级别后显示该级别及更高级别）
- 按日期范围筛选
- 支持关键词搜索
- 展开查看详情和堆栈跟踪
- 查看完整的 HTTP 请求上下文

### 2. Traces 面板 - 请求链路追踪

- 按 RequestId 聚合显示请求
- 查看完整请求生命周期
- 分析请求耗时
- 快速定位包含错误的请求

### 3. 强大的搜索语法

支持多种搜索方式：

```
// 精准查询
message="获取人员列表"

// 模糊查询
message like "超时"

// 字段查询
RequestId = "0HNJ2POQECAU1"

// 级别查询
level = "ERROR"

// 组合查询
level = "ERROR" and message like "超时"

// 多条件组合
level = "ERROR" or level = "WARNING"
```

支持的搜索字段：

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

## 五、配置选项

### 基础配置

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

### 授权配置（推荐配置）

为了保护敏感日志信息，建议配置授权过滤器：

```csharp
builder.Services.AddDevLogDashboard(options =>
{
    options.AuthorizationFilter = async context =>
    {
        // 自定义授权逻辑，返回 false 则拒绝访问
        return await Task.FromResult(
            context.User.Identity?.IsAuthenticated ?? false
        );
    };
});
```

### 常用场景

**场景 1：只记录错误日志**

```csharp
options.OnlyLogErrors = true;  // 只记录 Warning 及以上级别
```

**场景 2：设置日志级别过滤**

```csharp
options.MinLogLevel = LogLevel.Information;  // 只记录 Information 及以上
```

**场景 3：忽略健康检查等路径**

```csharp
options.IgnoredPaths.Add("/health");
options.IgnoredPaths.Add("/ready");
```

---

## 六、技术架构

### 支持框架

- .NET 6.0 / 7.0 / 8.0 / 9.0 / 10.0

### 核心组件

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

- **存储方式**：内存 (ConcurrentBag)，线程安全
- **前端**：原生 JavaScript，无框架依赖
- **API**：RESTful 风格，自包含路由

### API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/dev-logs-api/dashboard` | GET | 获取仪表板首页统计数据 |
| `/dev-logs-api/logs` | GET | 查询日志列表（分页） |
| `/dev-logs-api/logs/{id}` | GET | 获取单条日志详情 |
| `/dev-logs-api/traces` | GET | 获取请求追踪汇总列表 |
| `/dev-logs-api/traces/{requestId}` | GET | 获取特定 RequestId 的所有日志 |
| `/dev-logs-api/clear` | POST | 清空所有日志 |

---

## 七、注意事项

> ⚠️ **重要提示**

1. **仅用于开发环境**：本产品设计用于开发调试，生产环境请使用专业的日志系统（如 ELK、Seq 等）
2. **内存限制**：默认最大存储 10000 条日志，超出后自动清理最旧的 10%
3. **线程安全**：使用 ConcurrentBag 和 lock 保证多线程并发安全
4. **授权安全**：建议配置授权过滤器，防止敏感信息泄露
5. **自动清理**：超出最大日志数量时自动清理旧日志，无需手动维护

---

## 十一、版本历史

### 1.0.0-preview.1

- 初始版本发布
- 支持基础日志记录和查看功能
- 支持请求追踪
- 支持结构化日志
- 支持 HTTP 上下文信息捕获

---

## 九、设计灵感：致敬 Seq

DevLogDashboard 的界面设计和交互体验，深度借鉴了 **.NET 领域最著名的日志系统——Seq**。

### 为什么选择 Seq 作为参考？

**Seq** 是由 Datalust 开发的 .NET 结构化日志收集和分析平台，在 .NET 社区享有盛誉：

| Seq 的特点 | 说明 |
|------------|------|
| 🎯 **专为 .NET 设计** | 与 Serilog 等日志库无缝集成 |
| 📊 **结构化日志** | 原生支持结构化数据查询和分析 |
| 🔍 **强大的查询语法** | SQL-like 查询语言，支持复杂过滤 |
| 🌐 **实时流式查看** | 日志实时推送，监控无延迟 |
| 💼 **生产级方案** | 适合企业级生产环境 |

### DevLogDashboard 借鉴了 Seq 的哪些设计？

#### 1. 界面布局

```
┌─────────────────────────────────────────────────┐
│  DevLogDashboard (参考 Seq 设计)                  │
├─────────────────────────────────────────────────┤
│  [Logs]  [Traces]  [Settings]  ← 顶部导航       │
├─────────────────────────────────────────────────┤
│  🔍 搜索框 (支持 Seq-like 查询语法)               │
├─────────────────────────────────────────────────┤
│  日志列表 (时间戳 | 级别 | 消息 | 来源)           │
├─────────────────────────────────────────────────┤
│  点击展开查看详情和结构化数据                    │
└─────────────────────────────────────────────────┘
```

#### 2. 查询语法

DevLogDashboard 的搜索语法深受 Seq 启发：

```
// Seq 风格查询
level = "ERROR"
message like "超时"
RequestId = "0HNJ2POQECAU1"

// 组合查询 (类似 Seq)
level = "ERROR" and message like "超时"
```

#### 3. 日志详情展示

参考 Seq 的展开式设计：

- 时间戳、级别、消息一目了然
- 展开后显示完整异常堆栈
- 结构化数据以表格形式展示
- HTTP 上下文信息清晰分组

#### 4. 请求追踪

Seq 的核心功能之一 Request Tracking 也被引入：

- 通过 RequestId 聚合日志
- 查看完整请求生命周期
- 快速定位问题请求

### 与 Seq 的定位差异

| 特性 | Seq | DevLogDashboard |
|------|-----|-----------------|
| **目标场景** | 生产环境 | 开发调试 |
| **部署方式** | 独立服务，需 Docker/安装 | NuGet 包，零部署 |
| **存储方式** | 数据库/文件持久化 | 内存存储，重启清空 |
| **资源占用** | 较高 (独立进程) | 极低 (应用内) |
| **配置复杂度** | 中/高 | 零配置 |
| **成本** | 免费版有限制，企业版付费 | 完全免费 (MIT) |

### 总结

> **DevLogDashboard = Seq 的开发调试轻量版**

我们站在 Seq 的肩膀上，保留了它优秀的交互设计和查询体验，同时做到了：

- **更轻量**：无需独立部署，一个 NuGet 包搞定
- **更简单**：零配置，开箱即用
- **更专注**：聚焦开发调试场景，不追求大而全

感谢 Seq 团队的优秀设计，为我们树立了标杆！🙏

---

## 十、写在最后

DevLogDashboard 的灵感来源于 **Seq**、LogDashboard 和 MiniProfiler，目标是成为 .NET 开发者开发调试阶段的得力助手。

目前项目还在早期阶段，欢迎提 Issues 和 PR！