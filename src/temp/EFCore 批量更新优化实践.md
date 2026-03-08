# EF Core ExecuteUpdateAsync 签名演变与扩展优化实践

> .NET 7 到 .NET 10，批量更新的 API 发生了什么变化？如何编写适配两个版本的扩展方法？本文带你深入理解 EF Core 批量更新的签名演变与扩展优化之道。

---

## 一、ExecuteUpdateAsync 的两种签名

### 1.1 .NET 7 - .NET 9：表达式树签名

```csharp
// .NET 7 - .NET 9 的 API 签名
public static Task<int> ExecuteUpdateAsync<TSource>(
    this IQueryable<TSource> source,
    Expression<Func<SetPropertyCalls<TSource>, SetPropertyCalls<TSource>>> setPropertyCalls,
    CancellationToken cancellationToken = default)
    where TSource : class
```

**使用方式：**

```csharp
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Email, "new@email.com")
        .SetProperty(u => u.Phone, "123456789")
    );
```

**签名特点：**

| 特点 | 说明 |
|------|------|
| 参数类型 | `Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>>` |
| 返回值 | `SetPropertyCalls<T>` 用于链式调用 |
| 优势 | 完整的表达式树，可被 EF Core 翻译为 SQL |
| 劣势 | 签名冗长，理解成本高 |

---

### 1.2 .NET 10+：Action 委托签名

```csharp
// .NET 10+ 的 API 签名
public static Task<int> ExecuteUpdateAsync<TSource>(
    this IQueryable<TSource> source,
    Action<UpdateSettersBuilder<TSource>> setPropertyCalls,
    CancellationToken cancellationToken = default)
    where TSource : class
```

**使用方式：**

```csharp
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Email, "new@email.com")
        .SetProperty(u => u.Phone, "123456789")
    );
```

**签名变化：**

| 变化点 | .NET 7-9 | .NET 10+ |
|--------|----------|----------|
| 参数类型 | `Expression<Func<...>>` | `Action<UpdateSettersBuilder<T>>` |
| 构建器类型 | `SetPropertyCalls<T>` | `UpdateSettersBuilder<T>` |
| 签名长度 | 冗长 | 简洁 |
| 表达式树 | 完整保留 | 运行时构建 |

---

### 1.3 签名对比分析

```
┌─────────────────────────────────────────────────────────────────┐
│                     .NET 7-9 签名                               │
│                                                                 │
│  Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>>    │
│  │                        │                      │             │
│  │                        │                      └─ 返回值     │
│  │                        └─ 参数               │             │
│  └─ 表达式树包装                                  └─ 链式调用  │
│                                                                 │
│  优点：EF Core 可以直接分析表达式树结构                           │
│  缺点：类型签名复杂，泛型嵌套深                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     .NET 10+ 签名                               │
│                                                                 │
│  Action<UpdateSettersBuilder<T>>                                │
│  │              │                                               │
│  │              └─ 构建器类型（简化）                            │
│  └─ 普通委托                                                    │
│                                                                 │
│  优点：签名简洁，开发友好                                        │
│  缺点：失去部分表达式树分析能力（但 EF Core 内部处理了）          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、为什么签名会变化？

### 2.1 官方动机

根据 EF Core 团队的说明，签名变化的原因包括：

1. **简化 API 设计**：`Expression<Func<...>>` 嵌套过深，开发者理解成本高
2. **运行时构建更灵活**：`Action<Builder>` 模式更符合.NET 惯用法
3. **性能优化**：减少表达式树编译开销

### 2.2 实际影响

对于普通开发者，**使用方式几乎没有变化**：

```csharp
// 两种签名下，这段代码都能工作
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Email, "new@email.com")
    );
```

但对于**扩展方法开发者**，需要做版本兼容处理。

---

## 三、BaseRepository 的版本兼容实现

### 3.1 条件编译方案

```csharp
#if NET7_0_OR_GREATER && (!NET10_0_OR_GREATER)
/// <summary>
/// .NET 7-9：使用 Expression 签名
/// </summary>
public async Task<int> UpdateAsync(
    Expression<Func<TEntity, bool>> predict,
    Expression<Func<SetPropertyCalls<TEntity>, SetPropertyCalls<TEntity>>> setPropertyCalls)
{
    return await _dbContext.Set<TEntity>()
        .Where(predict)
        .ExecuteUpdateAsync(setPropertyCalls)
        .ConfigureAwait(false);
}

#elif NET10_0_OR_GREATER
/// <summary>
/// .NET 10+：使用 Action 签名
/// </summary>
public async Task<int> UpdateAsync(
    Expression<Func<TEntity, bool>> predict,
    Action<UpdateSettersBuilder<TEntity>> setPropertyCalls)
{
    return await _dbContext.Set<TEntity>()
        .Where(predict)
        .ExecuteUpdateAsync(setPropertyCalls)
        .ConfigureAwait(false);
}
#endif
```

### 3.2 关键差异点

| 差异点 | .NET 7-9 | .NET 10+ |
|--------|----------|----------|
| 第二个参数类型 | `Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>>` | `Action<UpdateSettersBuilder<T>>` |
| 构建器类型 | `SetPropertyCalls<T>` | `UpdateSettersBuilder<T>` |
| 返回类型 | 两者相同，都是`UpdateSettersBuilder<T>`（链式调用） |

---

## 四、扩展方法优化：条件批量更新

### 4.1 问题场景

标准的 `ExecuteUpdateAsync` 无法实现"值不为 null 时才更新"：

```csharp
// 问题：即使 dto.Email 为 null，也会执行更新，将数据库字段设为 NULL
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Email, dto.Email)  // null 也会更新
    );
```

### 4.2 优化思路

在调用 `SetProperty` 之前进行条件判断，只有满足条件时才调用：

```csharp
public static UpdateSettersBuilder<TSource> SetPropertyIfNotNull<TSource, TProperty>(
    this UpdateSettersBuilder<TSource> builder,
    Expression<Func<TSource, TProperty>> propertyExpression,
    TProperty value)
    where TProperty : class
{
    if (value is null)
        return builder; // 不调用 SetProperty，直接返回

    builder.SetProperty(propertyExpression,
        Expression.Constant(value, typeof(TProperty)));
    return builder;
}
```

---

## 五、完整扩展方法实现（.NET 10+）

### 5.1 核心扩展方法

```csharp
#if NET10_0_OR_GREATER
public static class ConditionalUpdateExtensions
{
    /// <summary>
    /// 当条件为 true 时，才更新指定属性
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIfTrue<TSource, TProperty>(
        this UpdateSettersBuilder<TSource> builder,
        bool condition,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty value)
    {
        if (!condition)
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value, typeof(TProperty)));
        return builder;
    }

    /// <summary>
    /// 当字符串不为 null 或空白时，才更新指定属性
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIfNotNullOrWhiteSpace<TSource>(
        this UpdateSettersBuilder<TSource> builder,
        Expression<Func<TSource, string>> propertyExpression,
        string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value, typeof(string)));
        return builder;
    }

    /// <summary>
    /// 当值不为 null 时，才更新指定属性（引用类型）
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIfNotNull<TSource, TProperty>(
        this UpdateSettersBuilder<TSource> builder,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty value)
        where TProperty : class
    {
        if (value is null)
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value, typeof(TProperty)));
        return builder;
    }

    /// <summary>
    /// 当值有值时，才更新指定属性（可空值类型）
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIfHasValue<TSource, TProperty>(
        this UpdateSettersBuilder<TSource> builder,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty? value)
        where TProperty : struct
    {
        if (!value.HasValue)
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value.Value, typeof(TProperty)));
        return builder;
    }

    /// <summary>
    /// 当自定义条件满足时，才更新指定属性
    /// </summary>
    public static UpdateSettersBuilder<TSource> SetPropertyIf<TSource, TProperty>(
        this UpdateSettersBuilder<TSource> builder,
        Func<TProperty, bool> condition,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty value)
    {
        if (!condition(value))
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value, typeof(TProperty)));
        return builder;
    }
}
#endif
```

### 5.2 .NET 7-9 的扩展方法适配

由于 .NET 7-9 使用 `SetPropertyCalls<T>` 而非 `UpdateSettersBuilder<T>`，需要单独实现：

```csharp
#if NET7_0_OR_GREATER && (!NET10_0_OR_GREATER)
public static class ConditionalUpdateExtensions
{
    public static SetPropertyCalls<TSource> SetPropertyIfNotNull<TSource, TProperty>(
        this SetPropertyCalls<TSource> builder,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty value)
        where TProperty : class
    {
        if (value is null)
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value, typeof(TProperty)));
        return builder;
    }

    public static SetPropertyCalls<TSource> SetPropertyIfNotNullOrWhiteSpace<TSource>(
        this SetPropertyCalls<TSource> builder,
        Expression<Func<TSource, string>> propertyExpression,
        string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value, typeof(string)));
        return builder;
    }

    public static SetPropertyCalls<TSource> SetPropertyIfTrue<TSource, TProperty>(
        this SetPropertyCalls<TSource> builder,
        bool condition,
        Expression<Func<TSource, TProperty>> propertyExpression,
        TProperty value)
    {
        if (!condition)
            return builder;

        builder.SetProperty(propertyExpression,
            Expression.Constant(value, typeof(TProperty)));
        return builder;
    }
}
#endif
```

---

## 六、使用示例对比

### 6.1 原始用法 vs 扩展方法

```csharp
// ─────────────────────────────────────────────────────────────
// 原始用法：无法实现条件更新
// ─────────────────────────────────────────────────────────────
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Email, dto.Email)  // 即使 null 也会更新
        .SetProperty(u => u.Phone, dto.Phone)
    );

// ─────────────────────────────────────────────────────────────
// 扩展方法：优雅的条件更新
// ─────────────────────────────────────────────────────────────
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetPropertyIfNotNull(u => u.Email, dto.Email)
        .SetPropertyIfNotNull(u => u.Phone, dto.Phone)
        .SetPropertyIfNotNullOrWhiteSpace(u => u.NickName, dto.NickName)
    );
```

### 6.2 综合场景示例

```csharp
public class UserService
{
    private readonly DbContext _context;

    // 场景 1：PATCH 部分更新
    public async Task PatchAsync(long userId, UserPatchDto dto)
    {
        await _context.Users
            .Where(x => x.Id == userId)
            .ExecuteUpdateAsync(x => x
                .SetPropertyIfNotNull(u => u.Email, dto.Email)
                .SetPropertyIfNotNull(u => u.Phone, dto.Phone)
                .SetPropertyIfNotNullOrWhiteSpace(u => u.NickName, dto.NickName)
                .SetPropertyIfHasValue(u => u.Age, dto.Age)
            );
    }

    // 场景 2：条件更新
    public async Task UpdateRoleAsync(long userId, bool isAdmin)
    {
        await _context.Users
            .Where(x => x.Id == userId)
            .ExecuteUpdateAsync(x => x
                .SetPropertyIfTrue(isAdmin, u => u.Role, "Administrator")
                .SetPropertyIfTrue(!isAdmin, u => u.Role, "User")
            );
    }

    // 场景 3：自定义条件
    public async Task UpdateScoreAsync(long userId, int score)
    {
        await _context.Users
            .Where(x => x.Id == userId)
            .ExecuteUpdateAsync(x => x
                .SetPropertyIf(
                    s => s > 0,           // 条件：分数大于 0
                    u => u.Score,         // 属性
                    score                 // 值
                )
            );
    }
}
```

---

## 七、扩展方法的设计原理

### 7.1 核心思想：守卫模式 + 链式调用

```csharp
public static UpdateSettersBuilder<TSource> SetPropertyIfNotNull<...>(...)
{
    // 守卫模式：条件不满足时提前返回
    if (value is null)
        return builder;

    // 执行更新
    builder.SetProperty(propertyExpression,
        Expression.Constant(value, typeof(TProperty)));

    // 返回 builder，支持链式调用
    return builder;
}
```

### 7.2 为什么能链式调用？

```
UpdateSettersBuilder<T>
    │
    ├─ SetPropertyIfNotNull(...)  → 返回 UpdateSettersBuilder<T>
    │      └─ 内部调用 builder.SetProperty(...)
    │      └─ 返回 builder（同一个实例）
    │
    └─ 链式调用继续...
```

### 7.3 表达式树的作用

```csharp
Expression<Func<TSource, TProperty>> propertyExpression
// 例如：u => u.Email

Expression.Constant(value, typeof(TProperty))
// 将值包装为表达式树节点
```

EF Core 会将这两个表达式组合，最终生成类似这样的 SQL：

```sql
UPDATE Users SET Email = @p0 WHERE Id = @p1
```

---

## 八、版本兼容性总结

| 特性 | .NET 7-9 | .NET 10+ |
|------|----------|----------|
| 核心 API | `ExecuteUpdateAsync` | `ExecuteUpdateAsync` |
| 参数签名 | `Expression<Func<SetPropertyCalls<T>,...>>` | `Action<UpdateSettersBuilder<T>>` |
| 构建器类型 | `SetPropertyCalls<T>` | `UpdateSettersBuilder<T>` |
| 扩展方法 | 需针对 `SetPropertyCalls<T>`扩展 | 需针对 `UpdateSettersBuilder<T>` 扩展 |
| 条件编译 | `#if NET7_0_OR_GREATER && (!NET10_0_OR_GREATER)` | `#if NET10_0_OR_GREATER` |

---

## 九、最佳实践建议

### 9.1 优先使用原生 SetProperty

```csharp
// ✅ 推荐：简单场景直接用 SetProperty
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Status, UserStatus.Active)
    );
```

### 9.2 条件更新使用扩展方法

```csharp
// ✅ 推荐：PATCH 场景使用条件扩展
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetPropertyIfNotNull(u => u.Email, dto.Email)
    );
```

### 9.3 仓库层做好版本兼容

```csharp
// ✅ 推荐：Repository 中用条件编译处理版本差异
#if NET7_0_OR_GREATER && (!NET10_0_OR_GREATER)
public Task<int> UpdateAsync(..., Expression<Func<SetPropertyCalls<...>, ...>> ...)
#elif NET10_0_OR_GREATER
public Task<int> UpdateAsync(..., Action<UpdateSettersBuilder<...>> ...)
#endif
```

---

## 十、结语

从 .NET 7 到 .NET 10，`ExecuteUpdateAsync` 的签名从 `Expression<Func<...>>` 简化为 `Action<Builder>`，体现了 EF Core 团队对开发者体验的重视。

**作为库开发者，我们需要：**

1. 理解两种签名的差异
2. 使用条件编译做好版本兼容
3. 针对不同的构建器类型实现扩展方法

**作为应用开发者，我们可以：**

1. 直接使用 `ExecuteUpdateAsync` 进行批量更新
2. 利用扩展方法实现条件更新
3. 享受签名简化带来的便利

---

*本文涉及的完整代码已开源，欢迎交流讨论！*
