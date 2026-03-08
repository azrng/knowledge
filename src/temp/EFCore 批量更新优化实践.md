# EFCore 批量更新优化实践：从 SaveChanges 到 ExecuteUpdate 的演进之路

> 在 .NET 10 环境下，EF Core 的批量操作迎来了全新的 API 时代。本文将带你深入了解批量更新、删除、插入的优化实践，感受从传统模式到现代高效模式的演进。

---

## 一、测试环境

| 项目 | 版本/说明 |
|------|----------|
| .NET SDK | .NET 10.0 |
| EF Core | 10.0+ |
| 数据库 |  PostgreSQL |
| 开发工具 | Visual Studio 2026 |

---

## 二、为什么做这个文章？之前的修改和删除是如何实现的

### 2.1 编写本文的初衷

**在实际工作中，我们遇到了这样的场景：**

在使用 EF Core 进行批量更新时，经常需要处理 **PATCH 部分更新** 的需求。例如需要批量刷一些数据，期待当值为null的时候不更新。如果使用标准的 `SetProperty`，**即使值为 null 也会执行更新**，导致数据库中的有效数据被覆盖为 NULL：

```csharp
// ❌ 问题：即使 dto.Email 为 null，也会将数据库字段设为 NULL
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Email, dto.Email)  // null 也会更新！
        .SetProperty(u => u.Phone, dto.Phone)  // null 也会更新！
    );
```

**这正是我们编写这篇文章的初衷：**

1. **工作中实际用到了批量更新** - 需要高性能的批量操作方案
2. **需要处理字段为 null 时不更新的场景** - PATCH 部分更新的常见需求
3. **官方 API 无法直接满足条件更新** - 需要通过扩展方法实现

通过本文，我们希望分享如何在使用 EF Core `ExecuteUpdate` 进行高效批量更新的同时，优雅地处理"字段为 null 不更新"这类常见业务场景。

---

### 2.2 传统模式的痛点

在 EF Core 7 之前（以及传统的 EF 6 时代），批量更新和删除操作一直是一个性能痛点。让我们看看**之前的实现方式**：

#### 方式一：查询 + 循环修改 + SaveChanges

```csharp
// ❌ 批量更新：先查询，再循环修改，最后保存
var users = _context.Users.Where(x => x.Status == UserStatus.Inactive).ToList();

foreach (var user in users)
{
    user.Status = UserStatus.Deleted;
    user.DeletedAt = DateTime.Now;
}

await _context.SaveChangesAsync();
```

**问题分析：**

| 问题 | 说明 |
|------|------|
| 内存消耗 | 所有数据加载到内存，大数据量时可能 OOM |
| 性能低下 | 每条记录生成一条 UPDATE 语句 |
| 跟踪开销 | EF Core 需要跟踪所有实体的状态变化 |
| 并发风险 | 查询和更新之间数据可能被修改 |

#### 方式二：使用原生 SQL

```csharp
// ⚠️ 使用原生 SQL，失去类型安全
await _context.Database.ExecuteSqlRawAsync(
    "UPDATE Users SET Status = {0}, DeletedAt = {1} WHERE Status = {2}",
    UserStatus.Deleted, DateTime.Now, UserStatus.Inactive
);
```

**问题分析：**

| 问题 | 说明 |
|------|------|
| 类型不安全 | 参数拼写错误编译时无法发现 |
| 数据库绑定 | 失去 EF Core 的数据库抽象能力 |
| 维护成本高 | SQL 字符串散落在代码中，难以重构 |

#### 方式三：第三方库（如 EF Core.BulkExtensions）

```csharp
// ⚠️ 依赖第三方库，需要额外学习和集成成本
await _context.BulkUpdateAsync(users);
```

**问题分析：**

| 问题 | 说明 |
|------|------|
| 额外依赖 | 增加项目复杂度和维护成本 |
| 功能限制 | 免费版通常有限制 |
| 兼容性风险 | 需要跟随 EF Core 版本升级 |

### 2.2 删除操作的传统实现

```csharp
// ❌ 传统删除：先查询再删除
var users = _context.Users.Where(x => x.Status == UserStatus.Deleted).ToList();
_context.Users.RemoveRange(users);
await _context.SaveChangesAsync();
```

同样的问题：**内存占用高、性能差、跟踪开销大**。

---

## 三、现在的修改和删除是怎样的

### 3.1 EF Core 7+ 引入的 ExecuteUpdate

从 EF Core 7 开始，微软官方引入了 `ExecuteUpdateAsync` API，在 .NET 10 中进一步优化。

#### 基本用法

```csharp
// ✅ .NET 10 批量更新：一条 SQL 直接执行
await _context.Users
    .Where(x => x.Status == UserStatus.Inactive)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Status, UserStatus.Deleted)
        .SetProperty(u => u.DeletedAt, DateTime.Now)
    );
```

**生成的 SQL：**

```sql
UPDATE [Users]
SET [Status] = @p0, [DeletedAt] = @p1
WHERE [Status] = @p2
```

#### 关键特性

| 特性 | 说明 |
|------|------|
| 单条 SQL | 无论多少数据，只执行一条 UPDATE |
| 不跟踪 | 不加载实体到内存，无状态跟踪开销 |
| 类型安全 | 使用 Lambda 表达式，编译时检查 |
| 数据库无关 | 仍然使用 EF Core，支持多种数据库 |

### 3.2 ExecuteDeleteAsync 批量删除

```csharp
// ✅ .NET 10 批量删除：一条 SQL 直接执行
await _context.Users
    .Where(x => x.Status == UserStatus.Deleted && x.DeletedAt < DateTime.Now.AddDays(-30))
    .ExecuteDeleteAsync();
```

**生成的 SQL：**

```sql
DELETE FROM [Users]
WHERE [Status] = @p0 AND [DeletedAt] < @p1
```

### 3.3 签名变化：从 Expression 到 Action

在 .NET 10 中，API 签名进一步简化：

```csharp
// .NET 7-9 的签名
Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>>

// .NET 10+ 的签名（更简洁）
Action<UpdateSettersBuilder<T>>
```

**使用体验无差异，但内部实现更优化**。

---

## 四、有什么优点

### 4.1 性能对比

| 场景 | 传统方式 | ExecuteUpdate | 提升 |
|------|----------|---------------|------|
| 更新 1000 条记录 | 1000+ 条 SQL | 1 条 SQL | **1000x** |
| 更新 10000 条记录 | 10000+ 条 SQL | 1 条 SQL | **10000x** |
| 内存占用 | O(n) | O(1) | **显著降低** |

### 4.2 代码简洁度对比

```csharp
// ❌ 之前：10+ 行代码
var entities = await _context.Entities
    .Where(x => x.Type == type)
    .ToListAsync();

foreach (var entity in entities)
{
    entity.Status = newStatus;
}

await _context.SaveChangesAsync();

// ✅ 现在：3 行代码
await _context.Entities
    .Where(x => x.Type == type)
    .ExecuteUpdateAsync(x => x
        .SetProperty(e => e.Status, newStatus)
    );
```

### 4.3 高级用法：条件更新扩展方法

结合扩展方法，可以实现**字段级别的按需更新**，这是实际业务中最常用的场景。

#### 扩展方法完整实现

```csharp
/// <summary>
/// 条件更新扩展方法
/// </summary>
public static class ConditionalUpdateExtensions
{
    /// <summary>
    /// 当条件为 true 时，指定一个属性及在 ExecuteUpdate 方法中应更新为的对应值
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIfTrue<TSource, TProperty>(
        this UpdateSettersBuilder<TSource> updateSettersBuilder,
        bool condition,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty valueExpression)
    {
        if (!condition)
            return updateSettersBuilder;

        updateSettersBuilder.SetProperty(propertyExpression, Expression.Constant(valueExpression, typeof(TProperty)));
        return updateSettersBuilder;
    }

    /// <summary>
    /// 当值不为 null 或空白时，指定一个属性及在 ExecuteUpdate 方法中应更新为的对应值
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIfNotNullOrWhiteSpace<TSource>(
        this UpdateSettersBuilder<TSource> updateSettersBuilder,
        Expression<Func<TSource, string>> propertyExpression,
        string valueExpression)
    {
        if (valueExpression.IsNullOrWhiteSpace())
            return updateSettersBuilder;

        updateSettersBuilder.SetProperty(propertyExpression, Expression.Constant(valueExpression, typeof(string)));
        return updateSettersBuilder;
    }

    /// <summary>
    /// 当值不为 null 时，指定一个属性及在 ExecuteUpdate 方法中应更新为的对应值
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIfNotNull<TSource, TProperty>(
        this UpdateSettersBuilder<TSource> updateSettersBuilder,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty valueExpression)
        where TProperty : class
    {
        if (valueExpression is null)
            return updateSettersBuilder;

        updateSettersBuilder.SetProperty(propertyExpression, Expression.Constant(valueExpression, typeof(TProperty)));
        return updateSettersBuilder;
    }

    /// <summary>
    /// 当满足自定义条件时，指定一个属性及在 ExecuteUpdate 方法中应更新为的对应值
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIf<TSource, TProperty>(
        this UpdateSettersBuilder<TSource> updateSettersBuilder,
        Func<TProperty, bool> condition,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty valueExpression)
    {
        if (!condition(valueExpression))
            return updateSettersBuilder;

        updateSettersBuilder.SetProperty(propertyExpression, Expression.Constant(valueExpression, typeof(TProperty)));
        return updateSettersBuilder;
    }
}
```

#### 使用示例

**示例 1：当值不为 null 时才更新**

```csharp
string? email = GetUserEmailInput();
string? phone = GetUserPhoneInput();

await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIfNotNull(u => u.Email, email)
         .SetPropertyIfNotNull(u => u.Phone, phone)
);
```

**示例 2：当字符串不为空白时才更新**

```csharp
string? userName = GetUserNameInput();

await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIfNotNullOrWhiteSpace(u => u.UserName, userName)
         .SetProperty(u => u.UpdateTime, DateTime.Now) // 无条件更新
);
```

**示例 3：根据布尔条件决定是否更新**

```csharp
bool shouldActivate = CheckActivationCondition();
await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIfTrue(shouldActivate, u => u.IsActive, true)
         .SetPropertyIfTrue(shouldActivate, u => u.ActivationDate, DateTime.Today)
);
```

**示例 4：使用自定义条件**

```csharp
int newScore = GetScore();
await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIf(score => score > 0, u => u.Score, newScore)
);
```

**示例 5：混合使用普通 SetProperty 和条件更新**

```csharp
await repository.UpdateAsync(
    x => x.IsActive == false,
    x => x.SetProperty(u => u.UpdateTime, DateTime.Now) // 无条件更新
         .SetPropertyIfNotNull(u => u.LastLoginIp, userIp) // 条件更新
         .SetPropertyIfNotNullOrWhiteSpace(u => u.Comment, comment) // 条件更新
);
```

### 4.4 完整对比表

| 特性 | 传统 SaveChanges | ExecuteUpdate/Delete |
|------|------------------|---------------------|
| SQL 数量 | N+1 条 | 1 条 |
| 内存占用 | 高（加载全部实体） | 低（不加载） |
| 实体跟踪 | 需要 | 不需要 |
| 并发安全 | 较低 | 较高 |
| 类型安全 | 是 | 是 |
| 数据库无关 | 是 | 是 |
| 适用场景 | 复杂业务逻辑 | 简单批量操作 |
| 条件更新 | 天然支持 | 需要扩展方法 |

---

## 五、最佳实践建议

### 5.1 何时使用 ExecuteUpdate

| ✅ 推荐使用 | ⚠️ 谨慎使用 |
|------------|------------|
| 批量状态更新 | 需要触发域事件的场景 |
| 条件批量修改 | 需要验证业务规则的场景 |
| 软删除标记 | 需要级联更新的复杂场景 |
| 统计字段更新 | 需要乐观并发检查的场景 |

### 5.2 何时仍需使用 SaveChanges

```csharp
// ✅ 复杂业务逻辑，仍需使用传统方式
foreach (var order in orders)
{
    // 需要调用领域方法
    order.Approve();

    // 需要发送领域事件
    _domainEvents.Add(new OrderApprovedEvent(order));

    // 需要验证业务规则
    if (!order.CanShip())
        throw new BusinessException("不能发货");
}

await _context.SaveChangesAsync();
```

---

## 六、结语

EF Core 的 `ExecuteUpdate`、`ExecuteDelete` 系列 API，标志着 EF Core 在批量操作领域迈出了重要一步。

**核心收获：**

1. **性能提升**：从 N+1 条 SQL 到 1 条 SQL，性能提升数量级
2. **内存优化**：不再加载实体到内存，O(1) 内存复杂度
3. **开发体验**：类型安全的 Lambda 表达式，告别字符串 SQL
4. **渐进式采用**：可以与传统 SaveChanges 共存，按需选择
