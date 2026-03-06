---
title: 表达式树
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: biaodashishu
slug: au4h3x
docsId: '64460622'
---

## 概述
表达式树是用树形数据结构来表示代码逻辑运算的技术，它让我们可以在运行时访问逻辑运算的结构。

## 和委托关系
表达式树其实与委托已经没什么关系了，非要扯上关系，那就这么说吧，表达式树是存放委托的容器。
要用Lambda表达式的时候，直接从表达式中获取出来，Compile()就可以直接用了。如下代码：
```csharp
static void Main(string[] args)
{
    Expression<Func<int, int, int>> exp = (x, y) => x + y;
    Func<int, int, int> fun = exp.Compile();
    int result = fun(2, 3);
}
```
Expression对象存储了运算逻辑，它把运算逻辑保存为AST(抽象语法树)，我们可以在运行时候动态分析运算逻辑。(摘抄自杨老师的书籍)

我们编写同样的分别输出表达同样逻辑的Expression对象和Func对象来对比区别：
```csharp
// 表达式树
Expression<Func<Book, bool>> x = b => b.Price > 5 || b.Name == "张三";
// 委托
Func<Book, bool> z = b => b.Price > 5 || b.Name == "张三";

Console.WriteLine(x);
Console.WriteLine(z);
```
输出结果
> b => ((b.Price > 5) OrElse (b.Name == "张三"))
> System.Func`2[UserQuery+Book,System.Boolean]

Func输出结果中，只有参数、返回值，没有内部运算逻辑，而表达式树的输出结果中，有内部的运算逻辑，这证明了表达式树对象存储了运算逻辑。

## 操作

### 常见工厂方法说明
> 来自杨老师书籍

![image.png](/common/1671202693169-f39655ca-641f-40fe-bd95-be921d3b41aa.png)
![image.png](/common/1671202706366-58d80567-a4e2-406f-bfe1-546cc31eda2f.png)

### 生成表达式树
可以让c#编辑器帮我们从Lambda表达式生成表达式树，如
```csharp
Expression<Func<Book,bool>> x = b => b.Price > 5;
```
编辑器会把b => b.Price > 5这个表达式构建成Expression对象，然后我们就可以使用该表达式对象进行数据的查询了，也可以在运行时候用API动态创建表达式树，例如
```csharp
db.Book.Where(t => t.Price > 5);
```

### 简单筛选
```csharp
public void SampleWhere()
{
    var user = UserDto.GetUserDtos().AsQueryable();
    //泛型写法
    Func<UserDto, bool> predicate = s => s.Deleted=false;
    var list = user.Where(predicate).ToList();

    //表达式树写法
    Expression<Func<UserDto, bool>> lambdaExp = (s) => !s.Deleted;
    var list2 = user.Where(lambdaExp).ToList();
}
```
通过简单的筛选去学习如何创建表达式树
```csharp
/// <summary>
/// 通过简单的筛选去学习
/// </summary>
public void SampleWhereToStudy()
{
    // 实现效果   t => t.Name == "张三"
    var user = UserDto.GetUserDtos().AsQueryable();
    var result1 = user.Where(t => t.Name == "张三");

    ParameterExpression demo = Expression.Parameter(typeof(UserDto), "t");
    Console.WriteLine(demo);

    MemberExpression demo_name = Expression.Property(demo, "Name");
    Console.WriteLine(demo_name);// t.Name

    ConstantExpression value = Expression.Constant("张三");
    Console.WriteLine(value);// 张三

    BinaryExpression greaterThen = Expression.Equal(demo_name, value);
    Console.WriteLine(greaterThen); // t.Name=="张三"

    var lambda = Expression.Lambda<Func<UserDto, bool>>(greaterThen, demo);
    Console.WriteLine(lambda);// t=>t.Name=="张三"

    var lamdbaFunc = lambda.Compile();// 编译表达式
    Console.WriteLine(lamdbaFunc);// System.Func`2[CSharpBasic.Model.UserDto,System.Boolean]

    var resultTrue = lamdbaFunc(new UserDto { Name = "张三" });
    Console.WriteLine(resultTrue);//True

    // 筛选张三
    var result = user.Where(lamdbaFunc).ToList();
}
```
> 资料来自：超超老师教程


### 动态筛选
```csharp
public void DynamicWhere()
{
    //实现效果：已知一个表UserDto  包含属性Name、Address、Id等，需要实现通过属性进行动态过滤
    var user = UserDto.GetUserDtos().AsQueryable();
    var list2 = user.EqualWhere("Name", "张三").FirstOrDefault();
}

// 扩展方法
public static class ExpressExtensons
{
    /// <summary>
    /// 等于筛选
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="queryable"></param>
    /// <param name="whereField"></param>
    /// <param name="value"></param>
    /// <returns></returns>
    public static IQueryable<T> EqualWhere<T>(this IQueryable<T> queryable, string whereField, object value)
    {
        return queryable.Where<T>(whereField, value);
    }

    /// <summary>
    /// 小于筛选
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="queryable"></param>
    /// <param name="whereField"></param>
    /// <param name="value"></param>
    /// <returns></returns>
    public static IQueryable<T> LessWhere<T>(this IQueryable<T> queryable, string whereField, object value)
    {
        return queryable.Where<T>(whereField, value, 1);
    }

    /// <summary>
    /// 大于筛选
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="queryable"></param>
    /// <param name="whereField"></param>
    /// <param name="value"></param>
    /// <returns></returns>
    public static IQueryable<T> GreaterWhere<T>(this IQueryable<T> queryable, string whereField, object value)
    {
        return queryable.Where<T>(whereField, value, 1);
    }

    private static IQueryable<T> Where<T>(this IQueryable<T> queryable, string whereField, object value, int type = 0)
    {
        var paramExp = Expression.Parameter(typeof(T), "t");
        //因为这个Property里面已经包含属性校验的功能，所以不用再另外写了
        var memberExp = Expression.Property(paramExp, whereField);
        //值表达式
        var valueExp = Expression.Constant(value);
        var exp = type switch
        {
            //小于
            1 => Expression.LessThan(memberExp, valueExp),
            //小于等于
            2 => Expression.LessThanOrEqual(memberExp, valueExp),
            //大于
            3 => Expression.GreaterThan(memberExp, valueExp),
            //大于等于
            4 => Expression.GreaterThanOrEqual(memberExp, valueExp),
            //等于
            _ => Expression.Equal(memberExp, valueExp),
        };
        var lambda = Expression.Lambda<Func<T, bool>>(exp, paramExp);

        return queryable.Where(lambda);
    }
}
```

### 匹配查询
当我们用户表中查询一批数据，他们的账号姓名以及性别都需要匹配的时候，我们可以这么操作
```sql
var userList = new List<GetUserInfoResponse>
{
    new GetUserInfoResponse{  Account="admin1", Name="张三",Sex=SexEnum.Man},
    new GetUserInfoResponse{  Account="admin3", Name="王五",Sex=SexEnum.Man},
    new GetUserInfoResponse{  Account="admin2", Name="李四",Sex=SexEnum.Man}
};

var p = Expression.Parameter(typeof(User), "t");

var parts = new List<Expression>();
foreach (var item in userList)
{
    var accountProperty = Expression.Property(p, nameof(User.Account));
    var accountValue = Expression.Constant(item.Account);
    var accountExpression = Expression.Equal(accountProperty, accountValue);

    var nameProperty = Expression.Property(p, nameof(User.Name));
    var nameValue = Expression.Constant(item.Name);
    var nameExpression = Expression.Equal(nameProperty, nameValue);

    var sexProperty = Expression.Property(p, nameof(User.Sex));
    var sexValue = Expression.Constant(item.Sex);
    var sexExpression = Expression.Equal(sexProperty, sexValue);

    var part = Expression.AndAlso(accountExpression, nameExpression);
    var express = Expression.AndAlso(part, sexExpression);

    parts.Add(Expression.AndAlso(part, sexExpression));
}
var body = parts.Aggregate(Expression.OrElse);
var filter = Expression.Lambda<Func<User, bool>>(body, p);

var queryString = _dbContext.Users.Where(filter).ToQueryString();
```
生成SQL如下
```
SELECT u.id,
       u.account,
       u.create_time,
       u.credit,
       u.deleted,
       u.group_id,
       u.modify_time,
       u.name,
       u.pass_word,
       u.sex
FROM sample."user" AS u
WHERE NOT (u.deleted)
  AND (((((u.account = 'admin1') AND (u.name = '张三')) AND (u.sex = 1)) OR
        (((u.account = 'admin3') AND (u.name = '王五')) AND (u.sex = 1))) OR
       (((u.account = 'admin2') AND (u.name = '李四')) AND (u.sex = 1)))
```

### 动态排序
```csharp
public void DynamicOrderby()
{
    // 实现效果
    var userQueryable = UserDto.GetUserDtos().AsQueryable();
    var sortList = userQueryable.OrderBy(t => t.CreatedDate).ToList();
    foreach (var item in sortList)
    {
        Console.WriteLine(item.CreatedDate);
    }

    Console.WriteLine("-----------------");

    // 通过表达式树去实现效果
    var list = userQueryable.OrderBy("CreatedDate", false);
    foreach (var item in list)
    {
        Console.WriteLine(item.CreatedDate);
    }
}


public static class ExpressExtensons
{
    /// <summary>
    /// 根据字段排序处理
    /// </summary>
    /// <typeparam name="T">泛型列</typeparam>
    /// <param name="queryable">查询queryable</param>
    /// <param name="sortField">排序列</param>
    /// <param name="isAsc">true正序 false倒序</param>
    /// <returns></returns>
    public static IQueryable<T> OrderBy<T>(this IQueryable<T> queryable, string sortField, bool isAsc = true)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = typeof(T).GetProperty(sortField);
        if (property == null)
            throw new ArgumentNullException($"无效的属性 {sortField}");

        var memberExpression = Expression.Property(parameter, property);
        var orderbeExpression = Expression.Lambda(memberExpression, new ParameterExpression[] { parameter });

        var orderMethod = isAsc ? "OrderBy" : "OrderByDescending";
        var resultExpression = Expression.Call(typeof(Queryable), orderMethod, new Type[] { queryable.ElementType, property.PropertyType },
                                               new Expression[] { queryable.Expression, Expression.Quote(orderbeExpression) });

        return queryable.Provider.CreateQuery<T>(resultExpression);
    }
}
```

### 筛选加排序
其中的排序代码使用上面排序的扩展方法来完成。
```csharp
public void SampleDynamicWhere2()
{
    var userQueryable = UserDto.GetUserDtos().AsQueryable();
    //实现效果
    var result1 = userQueryable.Where(t => t.Name.ToUpper()=="张三" || t.Name.Length>1).OrderBy(t => t.Id).ToList();

    //1. 表达式树写法
    ParameterExpression paramExp = Expression.Parameter(typeof(UserDto));
    ParameterExpression paramExpName = Expression.Parameter(typeof(UserDto), "Name");

    //1.1 开始构造 Where(t => t.Name.ToUpper()=="张三" || t.Name.Length>1)

    //1.1.1 构造表达式 t.Name.ToUpper()=="张三"
    //方案一：这段话还有问题 所以用下面的写法来实现
    // Expression left = Expression.Call(paramExpName, typeof(string).GetMethod("ToUpper", Type.EmptyTypes));

    //方案二 可行
    var leftMemberExp = Expression.Property(paramExp, "Name");
    Expression left = Expression.Call(leftMemberExp, typeof(string).GetMethod("ToUpper", Type.EmptyTypes));

    Expression right = Expression.Constant("张三");
    Expression equalExp = Expression.Equal(left, right);

    //1.1.2 构建表达式t.Name.Length>1
    left=Expression.Property(leftMemberExp, typeof(string).GetProperty("Length"));

    right=Expression.Constant(3, typeof(int));
    Expression greaterThenExp = Expression.GreaterThanOrEqual(left, right);

    //var resultSample = userQueryable.Where(Expression.Lambda<Func<UserDto, bool>>(greaterThenExp, paramExp)).ToList();

    //1.2 构造上面两个表达式或
    Expression predictBody = Expression.OrElse(equalExp, greaterThenExp);

    //1.3 构建where表达式
    //Expression<Func<UserDto, bool>> lambda = Expression.Lambda<Func<UserDto, bool>>(predictBody, paramExpName);
    MethodCallExpression whereCallExpression = Expression.Call(typeof(Queryable), "Where",
        new Type[] { userQueryable.ElementType }, userQueryable.Expression,
        Expression.Lambda<Func<UserDto, bool>>(predictBody, new ParameterExpression[] { paramExp }));

    //1.4 构造OrderBy(t => t.Id)
    // 使用扩展方法来操作实现动态排序操作：扩展方法看动态排序

    //1.5 创建查询
    var result2 = userQueryable.OrderBy("Id");
    foreach (var item in result2)
    {
        Console.WriteLine(item.Name);
    }
}
```

### 模糊查询
```csharp
var props = typeof(T).GetProperties(System.Reflection.BindingFlags.Public |
                                    System.Reflection.BindingFlags.Instance |
                                    System.Reflection.BindingFlags.DeclaredOnly)
    .Where(p => p.PropertyType == typeof(string))
    .Where(p => p.IsDefined(typeof(QueryFilterFieldAttribute), true))
    .ToArray();

if (props.IsEmpty())
{
    return query;
}

Expression filterExpression = null;

ParameterExpression param = Expression.Parameter(typeof(T));
ConstantExpression constant = Expression.Constant(requestDto.Filter, typeof(string));
foreach (var prop in props)
{
    MemberExpression body = Expression.Property(param, prop);
    MethodCallExpression methodCall = Expression.Call(body,
        typeof(string).GetMethod("Contains", new Type[] { typeof(string) }) ?? throw new AbpException(),
        constant);

    filterExpression = filterExpression == null
        ? (Expression)methodCall
        : Expression.Or(filterExpression, methodCall);
}

if (filterExpression == null)
{
    return query;
}

return query.Where(Expression.Lambda<Func<T, bool>>(filterExpression, param));
```

### 动态查询指定属性
通过传递一个字符串，然后查询指定的列返回
```csharp
var userQueryable = UserDto.GetUserDtos().AsQueryable();

ParameterExpression parameter1 = Expression.Parameter(typeof(UserDto));
MemberExpression men = Expression.Property(parameter1, "Name");
var selectFieldExpression = Expression.Lambda<Func<UserDto, string>>(men, new ParameterExpression[] { parameter1 });
var result1 = userQueryable.Select(selectFieldExpression).ToList();
```
通过编写一个映射后的类实现简单的对应映射转换
> 注意：如果映射后的类包含多余的列会出错，示例为demo。

```csharp
public void DynamicSelect()
{
    var userQueryable = UserDto.GetUserDtos().AsQueryable();
    // 简单映射转换
    var result2 = userQueryable.SelectMapper<UserDto, UserTest>().ToList();
}

public static class ExpressExtensons
{
    /// <summary>
    /// 查询映射
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="M"></typeparam>
    /// <param name="queryable"></param>
    /// <returns></returns>
    public static IQueryable<M> SelectMapper<T, M>(this IQueryable<T> queryable)
    {
        var parameter = Expression.Parameter(typeof(T), "t");
        var newExpression = Expression.New(typeof(M));

        var mapperType = typeof(T).GetProperties();

        var listBinding = new List<MemberBinding>();
        foreach (var item in typeof(M).GetProperties())
        {
            if (!mapperType.Any(t => t.Name == item.Name))
            {
                continue;
            }

            var mem = Expression.Property(parameter, item.Name);// t.name
            var member = typeof(M).GetMember(item.Name)[0];
            MemberBinding memBinding = Expression.Bind(member, mem);// 这里传mem是用t.name给他赋值
            listBinding.Add(memBinding);
        }

        var memberExp = Expression.MemberInit(newExpression, listBinding);
        var selectExpression = Expression.Lambda<Func<T, M>>(memberExp, new ParameterExpression[] { parameter });
        return queryable.Select(selectExpression);
    }
}
```

### 深拷贝
如果我们使用表达式树进行实现深拷贝，那么我们需要用下面的方式实现
```csharp
void Main()
{
	var stu = new Student { Id = "11", Name = "李四" };
	Expression<Func<Student, StudentSecond>> ss = (x) => new StudentSecond { Id = x.Id, Name = x.Name };
	var f = ss.Compile();
	StudentSecond studentSecond = f(stu);
	studentSecond.Dump();
}

public class Student
{
	public string Id { get; set; }
	public string Name { get; set; }
}

public class StudentSecond
{
	public string Id { get; set; }
	public string Name { get; set; }
}
```
将上面内容反编译后为
```csharp
var stu = new Student { Id = "11", Name = "李四" };
ParameterExpression parameterExpression;
Expression<Func<Student, StudentSecond>> ss = Expression.Lambda<Func<Student, StudentSecond>>(Expression.MemberInit(Expression.New(typeof(StudentSecond)), new MemberBinding[]
{
	Expression.Bind(methodof(StudentSecond.set_Age(int), Expression.Property(parameterExpression, methodof(Student.get_Age()))),
	Expression.Bind(methodof(StudentSecond.set_Id(int)), Expression.Property(parameterExpression, methodof(Student.get_Id()))),
	Expression.Bind(methodof(StudentSecond.set_Name(string)), Expression.Property(parameterExpression, methodof(Student.get_Name())))
}), new ParameterExpression[]
{
	parameterExpression
});
Func<Student, StudentSecond> f = ss.Compile();
StudentSecond studentSecond = f(stu);
```
那么也就是说我们只要用反射循环所有的属性然后Expression.Bind所有的属性。最后调用Compile()(s)就可以获取正确的StudentSecond。那么可以写出来下面的代码
```csharp
void Main()
{
	var stu = new Student { Id = "11", Name = "李四" };
	var ss = TransExpV2<Student, StudentSecond>.Trans(stu);
	ss.Dump();
}

public class Student
{
	public string Id { get; set; }
	public string Name { get; set; }
}

public class StudentSecond
{
	public string Id { get; set; }
	public string Name { get; set; }
}


/// <summary></summary>
public static class TransExpV2<TIn, TOut>
{
	private static readonly Func<TIn, TOut> cache = GetFunc();
	private static Func<TIn, TOut> GetFunc()
	{
		ParameterExpression parameterExpression = Expression.Parameter(typeof(TIn), "p");
		List<MemberBinding> memberBindingList = new List<MemberBinding>();

		foreach (var item in typeof(TOut).GetProperties())
		{
			if (!item.CanWrite)
				continue;

			MemberExpression property = Expression.Property(parameterExpression, typeof(TIn).GetProperty(item.Name));
			MemberBinding memberBinding = Expression.Bind(item, property);
			memberBindingList.Add(memberBinding);
		}

		MemberInitExpression memberInitExpression = Expression.MemberInit(Expression.New(typeof(TOut)), memberBindingList.ToArray());
		Expression<Func<TIn, TOut>> lambda = Expression.Lambda<Func<TIn, TOut>>(memberInitExpression, new ParameterExpression[] { parameterExpression });

		return lambda.Compile();
	}

	public static TOut Trans(TIn tIn)
	{
		return cache(tIn);
	}
}
```

## 可视化查看
既然表达式树是一颗表示运算逻辑的抽象语法树，那么我们就找更方便的方案查看表达式树

- LinqPad的输出
- Visual Studio调试程序，在快速监视窗口中查看变量的值，展开Raw View查看
- 使用Expression Tree Visualizer查看(插件安装麻烦)
   - 可以使用nuget包ExpressionTreeToString来查看

## 使用场景
表达式树是给框架的作者用的

## 缺点
表达式树的代码是非常复杂的，代码易读性查、可维护性查，所以在开发中还是尽量避免动态去构建表达式树。

## 开源项目
System.Linq.Dynamic.Core这个开源项目，它允许开发人员使用字符串格式的语法来进行数据操作。
谓词筛选表达式Expression<Func<T, bool>>的扩展库：[https://github.com/xljiulang/PredicateLib](https://github.com/xljiulang/PredicateLib)

## 资料
表达式树资料：[https://www.cnblogs.com/li-peng/p/3154381.html](https://www.cnblogs.com/li-peng/p/3154381.html)
表达式树保姆级教程：[https://masuit.org/1795?t=v5wlwn042vi8](https://masuit.org/1795?t=v5wlwn042vi8)
[https://mp.weixin.qq.com/s/iCJMk2dJuEKaRu6V71m1CA](https://mp.weixin.qq.com/s/iCJMk2dJuEKaRu6V71m1CA) | C## 最完善的表达式树 Expression.Dynamic的玩法
基于Expression Lambda表达式树的通用复杂动态查询构建器：[https://www.cnblogs.com/ls0001/p/17395510.html](https://www.cnblogs.com/ls0001/p/17395510.html)
C## 表达式树：[https://ex.whuanle.cn](https://ex.whuanle.cn)
