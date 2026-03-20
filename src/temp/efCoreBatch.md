# EFCore 批量更新优化实践：从 SaveChanges 到 ExecuteUpdate 的演进之路

> 在 .NET 10 环境下，EF Core 的批量操作迎来了全新的 API 时代。本文将带你深入了解批量更新、删除的优化实践，感受从传统模式到现代高效模式的演进。

---

## 导读

在日常开发中，**批量更新、批量删除**几乎是每个中后台系统都会遇到的高频需求。

过去，我们通常要先把数据查出来，再逐条修改，最后调用 `SaveChangesAsync()` 提交。这个方式当然能用，但一旦数据量上来，问题也会随之出现：**SQL 太多、内存占用高、实体跟踪开销大、整体性能不理想**。

而从 EF Core 7 开始，官方提供了 `ExecuteUpdateAsync` 和 `ExecuteDeleteAsync`，让我们可以直接用一条 SQL 完成批量操作。到了 .NET 10，这套 API 的体验又进一步提升。

更关键的是，本文不只讲“怎么用”，还会结合真实业务场景，重点解决一个很常见的问题：**做 PATCH 部分更新时，如何避免 null 把数据库原有值覆盖掉**。

如果你也正在使用 EF Core，或者正准备优化现有的批量操作代码，这篇文章会很有参考价值。🚀

---

## 一、测试环境

| 项目 | 版本/说明 |
|------|----------|
| .NET SDK | .NET 10.0 |
| EF Core | 10.0+ |
| 数据库 |  PostgreSQL |
| 开发工具 | Visual Studio 2026 |

---

## 二、为什么要写这篇文章：先看传统实现的痛点

在正式进入 `ExecuteUpdate` 之前，我们先回到问题本身：**为什么我们需要这类 API？**

很多时候，技术升级并不是因为“有新功能就要试一试”，而是因为旧方案在真实业务里确实存在明显短板。

### 2.1 真实业务场景：PATCH 部分更新的难点

在实际工作中，我们经常会遇到这样的需求：

- 做**批量更新**
- 做**部分字段更新**
- 并且要求：**当某个字段值为 null 时，不更新该字段**

这类需求在 PATCH 接口里尤其常见。比如前端只传了 `Phone`，没有传 `Email`，那我们通常希望：**只更新 Phone，不动 Email**。

但如果直接使用标准的 `SetProperty`，情况并不总是如我们所愿：**即使值为 null，也会执行更新**，最终把数据库中原本有效的数据覆盖成 `NULL`。

下面这段代码就很典型，它是一个“不可忽视”的坑：

```csharp
// ❌ 问题：即使 dto.Email 为 null，也会将数据库字段设为 NULL
await _context.Users
    .Where(x => x.Id == userId)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Email, dto.Email)  // null 也会更新！
        .SetProperty(u => u.Phone, dto.Phone)  // null 也会更新！
    );
```

也正因为如此，本文的出发点非常明确：

1. **业务中确实需要高性能的批量更新方案**
2. **需要优雅处理“字段为 null 时不更新”的需求**
3. **官方 API 能解决批量更新，但条件更新还需要我们进一步封装**

换句话说，本文不仅讨论性能优化，还讨论**如何把新 API 用到真正可落地的业务代码里**。💡

---

### 2.2 传统批量更新：为什么不够理想？

在 EF Core 7 之前（以及传统的 EF 6 时代），批量更新和删除一直是老生常谈的性能问题。

下面我们按常见方式逐个来看。

#### 方式一：查询 + 循环修改 + SaveChanges

这是最常见、也最“直觉”的写法：先查数据，再逐个修改，最后统一保存。

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

这段代码看起来没问题，但当数据量变大时，几个问题会同时暴露出来：

| 问题 | 说明 |
|------|------|
| 内存消耗 | 所有数据加载到内存，大数据量时可能 OOM |
| 性能低下 | 每条记录生成一条 UPDATE 语句 |
| 跟踪开销 | EF Core 需要跟踪所有实体的状态变化 |
| 并发风险 | 查询和更新之间数据可能被修改 |

**本质上，这种方式适合“逐个处理业务逻辑”，但不适合“纯批量数据库操作”。**

---

#### 方式二：使用原生 SQL

如果觉得 `SaveChanges` 太慢，很多人会进一步想到：那我直接写 SQL 不就好了？

```csharp
// ⚠️ 使用原生 SQL，失去类型安全
await _context.Database.ExecuteSqlRawAsync(
    "UPDATE Users SET Status = {0}, DeletedAt = {1} WHERE Status = {2}",
    UserStatus.Deleted, DateTime.Now, UserStatus.Inactive
);
```

这样做确实能提升性能，但它也带来了新的代价：

| 问题 | 说明 |
|------|------|
| 类型不安全 | 参数拼写错误编译时无法发现 |
| 数据库绑定 | 失去 EF Core 的数据库抽象能力 |
| 维护成本高 | SQL 字符串散落在代码中，难以重构 |

也就是说，**你获得了性能，却牺牲了可维护性和类型安全**。

---

#### 方式三：引入第三方库

还有一种常见思路，是借助第三方批量操作库，比如 `EF Core.BulkExtensions`。

```csharp
// ⚠️ 依赖第三方库，需要额外学习和集成成本
await _context.BulkUpdateAsync(users);
```

它的确能解决不少问题，但也并非没有代价：

| 问题 | 说明 |
|------|------|
| 额外依赖 | 增加项目复杂度和维护成本 |
| 功能限制 | 免费版通常有限制 |
| 兼容性风险 | 需要跟随 EF Core 版本升级 |

如果你的项目对依赖控制比较严格，或者希望尽量使用官方能力，那这类方案通常只能作为补充，而不是首选。

---

### 2.3 传统批量删除：问题同样存在

更新如此，删除也是一样。

传统写法通常是先查出待删数据，再统一删除：

```csharp
// ❌ 传统删除：先查询再删除
var users = _context.Users.Where(x => x.Status == UserStatus.Deleted).ToList();
_context.Users.RemoveRange(users);
await _context.SaveChangesAsync();
```

这种方式的核心问题并没有变，依然是：

- **内存占用高**
- **性能差**
- **实体跟踪开销大**

所以，从根本上看，我们需要的是一种能够**直接面向数据库执行批量操作**，又保留 EF Core **类型安全和抽象能力**的方案。

---

## 三、现在怎么做：EF Core 的官方批量操作方案

好消息是，从 EF Core 7 开始，官方终于给出了更现代的答案：`ExecuteUpdateAsync` 和 `ExecuteDeleteAsync`。

这意味着，我们不再需要在“性能”和“可维护性”之间二选一。

---

### 3.1 `ExecuteUpdateAsync`：批量更新的新方式

先看最基本的用法。

下面这段代码的作用是：**把所有状态为 Inactive 的用户，批量更新为 Deleted，并设置删除时间**。

```csharp
// ✅ .NET 10 批量更新：一条 SQL 直接执行
await _context.Users
    .Where(x => x.Status == UserStatus.Inactive)
    .ExecuteUpdateAsync(x => x
        .SetProperty(u => u.Status, UserStatus.Deleted)
        .SetProperty(u => u.DeletedAt, DateTime.Now)
    );
```

它最终生成的 SQL 如下：

```sql
UPDATE [Users]
SET [Status] = @p0, [DeletedAt] = @p1
WHERE [Status] = @p2
```

看到这里，其实核心价值已经非常清晰了：**你写的是 EF Core 的 Lambda 表达式，但执行效果接近一条高效的原生 SQL。**

#### 这类 API 的关键优势

| 特性 | 说明 |
|------|------|
| 单条 SQL | 无论多少数据，只执行一条 UPDATE |
| 不跟踪 | 不加载实体到内存，无状态跟踪开销 |
| 类型安全 | 使用 Lambda 表达式，编译时检查 |
| 数据库无关 | 仍然使用 EF Core，支持多种数据库 |

✅ **一句话总结：它适合“规则统一、逻辑明确”的批量更新场景。**

---

### 3.2 `ExecuteDeleteAsync`：批量删除同样简单

批量删除的思路与批量更新完全一致。

比如，下面这段代码会删除所有已标记删除，并且删除时间早于 30 天前的用户：

```csharp
// ✅ .NET 10 批量删除：一条 SQL 直接执行
await _context.Users
    .Where(x => x.Status == UserStatus.Deleted && x.DeletedAt < DateTime.Now.AddDays(-30))
    .ExecuteDeleteAsync();
```

生成的 SQL 也很直接：

```sql
DELETE FROM [Users]
WHERE [Status] = @p0 AND [DeletedAt] < @p1
```

这种方式最大的好处就是：**不用先把数据取出来，也不用让 EF Core 跟踪这些实体。**

对于“归档清理”“历史数据清除”“批量软删后物理删除”这类场景，效果尤其明显。🚀

---

### 3.3 API 签名变化：从 `Expression` 到 `Action`

在 .NET 10 中，这部分 API 的签名也做了进一步简化。

```csharp
// .NET 7-9 的签名
Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>>

// .NET 10+ 的签名（更简洁）
Action<UpdateSettersBuilder<T>>
```

对我们日常使用来说，**体验上差异不大**，但从框架设计上看，这种变化意味着 API 更简洁，内部实现也更容易优化。

你可以把它理解为：**写法还是熟悉的写法，但底层更现代了。**

---

## 四、它到底好在哪：性能、简洁度与业务适配能力

理解一个新 API，最好的方式不是只看语法，而是看它解决了哪些旧问题。

---

### 4.1 性能提升有多明显？

如果从数据库交互层面看，`ExecuteUpdate` 的提升是非常直观的。

| 场景 | 传统方式 | ExecuteUpdate | 提升 |
|------|----------|---------------|------|
| 更新 1000 条记录 | 1000+ 条 SQL | 1 条 SQL | **1000x** |
| 更新 10000 条记录 | 10000+ 条 SQL | 1 条 SQL | **10000x** |
| 内存占用 | O(n) | O(1) | **显著降低** |

⚠️ 这里需要注意，表格里的“提升”是为了帮助你直观理解**SQL 数量级差异**。真实业务中的最终性能，还会受到数据库索引、网络延迟、事务范围、锁竞争等因素影响。

但有一点几乎是确定的：**当你面对大批量、统一规则的更新/删除时，`ExecuteUpdate` / `ExecuteDelete` 会明显优于传统逐条跟踪更新。**

---

### 4.2 代码也更简洁了

性能之外，另一个非常明显的收益是：**代码量更少，意图更直接。**

先看传统写法：

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

两者对比非常鲜明：

- 旧方式强调“把对象取出来再操作”
- 新方式强调“直接描述数据库应该怎么更新”

这不仅更短，也更符合批量操作的本质。

---

### 4.3 真正常用的进阶玩法：条件更新扩展方法

前面提到，`ExecuteUpdate` 虽然很好用，但在真实业务里还有一个关键需求：**字段值为 null 时不更新**。

这时候，扩展方法就非常有价值了。它能把“条件更新”封装成可复用的能力，让代码既高效，又更贴近业务语义。

#### 扩展方法完整实现

下面这段代码的作用是：为 `UpdateSettersBuilder<TSource>` 增加一组“按条件设置属性”的方法。

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

这类封装最大的意义在于：**把“是否更新字段”的判断前置到代码层面**，避免把无意义甚至危险的 `NULL` 更新提交到数据库。

---

#### 使用示例 1：值不为 null 时才更新

这个场景最适合处理“用户传了才改，不传就保持原值”的需求。

```csharp
string? email = GetUserEmailInput();
string? phone = GetUserPhoneInput();

await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIfNotNull(u => u.Email, email)
         .SetPropertyIfNotNull(u => u.Phone, phone)
);
```

✅ 这样写的好处是：如果 `email` 或 `phone` 为 `null`，对应字段就不会进入更新语句。

---

#### 使用示例 2：字符串不为空白时才更新

对于昵称、备注、用户名这类字符串字段，仅仅判断 `null` 往往还不够，通常还要避免空字符串或空白字符串覆盖原值。

```csharp
string? userName = GetUserNameInput();

await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIfNotNullOrWhiteSpace(u => u.UserName, userName)
         .SetProperty(u => u.UpdateTime, DateTime.Now) // 无条件更新
);
```

这里就体现出了“普通更新”和“条件更新”可以自由组合的优势。

---

#### 使用示例 3：根据布尔条件决定是否更新

有时候，是否更新并不取决于值本身，而是取决于某个业务判断结果。

```csharp
bool shouldActivate = CheckActivationCondition();
await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIfTrue(shouldActivate, u => u.IsActive, true)
         .SetPropertyIfTrue(shouldActivate, u => u.ActivationDate, DateTime.Today)
);
```

这种写法很适合把多字段联动更新封装成一组条件动作。

---

#### 使用示例 4：使用自定义条件

如果内置判断还不够，你也可以传入自己的条件函数。

```csharp
int newScore = GetScore();
await repository.UpdateAsync(
    x => x.Id == userId,
    x => x.SetPropertyIf(score => score > 0, u => u.Score, newScore)
);
```

这样一来，扩展方法就具备了很强的通用性。

---

#### 使用示例 5：混合使用普通 `SetProperty` 和条件更新

这也是实际项目里最常见的组合方式：**有些字段必须更新，有些字段按条件更新。**

```csharp
await repository.UpdateAsync(
    x => x.IsActive == false,
    x => x.SetProperty(u => u.UpdateTime, DateTime.Now) // 无条件更新
         .SetPropertyIfNotNull(u => u.LastLoginIp, userIp) // 条件更新
         .SetPropertyIfNotNullOrWhiteSpace(u => u.Comment, comment) // 条件更新
);
```

这类写法可读性很高，读代码的人一眼就能看出：

- `UpdateTime` 是必更字段
- `LastLoginIp` 和 `Comment` 是按条件更新字段

这就是扩展方法真正的价值：**让业务意图更明确。**

---

### 4.4 一张表看懂：传统方式 vs 新方式

如果把两类方案放在一起对比，你会更容易判断什么时候该选哪一种。

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

💡 **核心判断标准只有一个：你是在处理“实体业务逻辑”，还是在执行“数据库批量动作”。**

---

## 五、最佳实践：什么时候该用，什么时候别硬用

技术方案没有绝对的“银弹”，`ExecuteUpdate` 也一样。它很强，但并不意味着所有更新都应该改成它。

---

### 5.1 推荐使用 `ExecuteUpdate` / `ExecuteDelete` 的场景

下面这些场景，通常都非常适合：

| ✅ 推荐使用 | ⚠️ 谨慎使用 |
|------------|------------|
| 批量状态更新 | 需要触发域事件的场景 |
| 条件批量修改 | 需要验证业务规则的场景 |
| 软删除标记 | 需要级联更新的复杂场景 |
| 统计字段更新 | 需要乐观并发检查的场景 |

你可以简单理解为：

- 如果你的目标是**批量改数据库**
- 而不是**逐个执行业务对象行为**
- 那么 `ExecuteUpdate` 通常就是更优解

---

### 5.2 这些场景仍然更适合 `SaveChanges`

如果你的代码不仅仅是“改字段”，而是包含了领域行为、规则校验、事件触发，那么传统方式依然不可替代。

下面这段代码就是一个典型例子：

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

为什么这种场景不适合 `ExecuteUpdate`？

因为这里真正重要的，不是“把数据库字段改了”，而是：

- 执行实体方法
- 保持领域模型一致性
- 触发事件
- 校验业务规则

而这些能力，恰恰是 `SaveChanges` 模式下“实体被加载并跟踪”的价值所在。✅

---

## 六、总结：从“能用”走向“高效好用”

EF Core 的 `ExecuteUpdate`、`ExecuteDelete` 系列 API，标志着官方在批量操作能力上的一次重要补齐。

它最大的意义，不只是“少写几行代码”，而是让我们终于可以同时拥有：

- **接近原生 SQL 的执行效率**
- **EF Core 的类型安全与抽象能力**
- **更现代、更清晰的批量操作写法**

### 核心 takeaway

1. **性能提升明显**：从 N+1 条 SQL 到 1 条 SQL，特别适合批量更新/删除
2. **内存占用更低**：无需加载实体，避免大量跟踪开销
3. **代码更简洁**：用 Lambda 表达式直接描述更新意图
4. **适合渐进式演进**：不需要推翻现有架构，可以与 `SaveChanges` 共存
5. **条件更新值得封装**：针对 PATCH 场景，通过扩展方法可以很好解决“null 不更新”的问题

### 最后一句

如果你的项目里还存在大量“先查出来、循环修改、最后 `SaveChangesAsync()`”的批量操作代码，现在就是一个很好的优化时机。🚀

你也可以顺手检查一下自己项目中的 PATCH 更新逻辑，看看是否存在“`null` 把有效字段覆盖掉”的隐患。

---

如果这篇文章对你有帮助，欢迎**点赞、在看、转发**，也欢迎在留言区聊聊：

- 你现在项目里的批量更新是怎么做的？
- 你更倾向官方 `ExecuteUpdate`，还是第三方 Bulk 方案？
- 对“条件更新扩展方法”这种写法，你会怎么进一步封装？

我们评论区见。