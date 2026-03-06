---
title: Session
lang: zh-CN
date: 2023-04-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: session
slug: ia48yo
docsId: '30599235'
---

### 1. 简单使用
ConfigureServices中使用
```csharp
services.AddDistributedMemoryCache();
services.AddSession();
```
> 因为session的服务端存储需要缓存，所以需要引入net.core的缓存DistributedMemoryCache；

Configure中使用
```csharp
app.UseSession();
```
控制器中使用
```csharp
  HttpContext.Session.SetString("user", "lisi");
  var user = HttpContext.Session.GetString("user");
  //存储
  HttpContext.Session.Set("LoginId", System.Text.Encoding.Default.GetBytes("666"));
  //获取
  bool flag = HttpContext.Session.TryGetValue("LoginId", out byte[] byteLoginId);
  var loginId = System.Text.Encoding.Default.GetString(byteLoginId); // LoginId="666";
  //获取
  var loginId2 = HttpContext.Session.GetString("LoginId");
```
操作string类型需要安装组件
> Microsoft.AspNetCore.Http

注：
> 当前操作只能在控制器中使用session


### 2. 封装的Session公共类
目的是可以让全局都可以获取到上下文
```csharp
/// <summary>
    /// 上下文
    /// </summary>
    public class MyHttpContext
    {
        /// <summary>
        /// 服务提供者
        /// </summary>
        public static IServiceProvider _serviceProvider;

        public static HttpContext Current
        {
            get
            {
                var factory = _serviceProvider.GetService<IHttpContextAccessor>();
                return factory.HttpContext;
            }
        }
    }
```
ConfigureServices中使用
```csharp
            services.AddDistributedMemoryCache();
            services.AddSession();
            //注入IHttpContextAccessor
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
```
Configure中使用
```csharp
  MyHttpContext._serviceProvider = app.ApplicationServices;
  app.UseSession();
```
存储session
```csharp
MyHttpContext.Current.Session.SetString("aa", "bb");
var aa = MyHttpContext.Current.Session.GetString("aa");
```

### 3. 通过session存储用户信息
ConfigureServices中使用
```csharp
            services.AddDistributedMemoryCache();
            services.AddSession();
            //注入IHttpContextAccessor
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
```
Configure中使用
```csharp
  MyHttpContext._serviceProvider = app.ApplicationServices;
  app.UseSession();
```
操作者模型
```csharp
/// <summary>
    /// 操作模型，保存登陆用户必要信息。
    /// </summary>
    public class Operator
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// 账号
        /// </summary>
        public string Account { get; set; }

        /// <summary>
        /// 真实姓名
        /// </summary>
        public string RealName { get; set; }

        /// <summary>
        /// 昵称
        /// </summary>
        public string NickName { get; set; }

        /// <summary>
        /// 是否可以查看所有数据  数据权限
        /// </summary>
        public DataPermissionEnum DataPermission { get; set; } = DataPermissionEnum.My;

        /// <summary>
        /// 头像
        /// </summary>
        public string Avatar { get; set; }

    }

    /// <summary>
    /// 数据权限
    /// </summary>
    public enum DataPermissionEnum
    {
        [Display(Name = "仅自己的数据")]
        [Description("仅自己的数据")]
        My = 0,

        [Display(Name = "查看所有的数据")]
        [Description("查看所有的数据")]
        All = 1
    }
```
操作者单例   

注意：该方法存在问题
```csharp
	/// <summary>
    /// 用户登陆信息提供者。
    /// </summary>
    public class OperatorProvider
    {
        /// <summary>
        /// Session键。
        /// </summary>
        private const string _lOGIN_USER_KEY = "LoginUser";

        private OperatorProvider()
        {
        }

        static OperatorProvider()
        {
        }

        //使用内部类+静态构造函数实现延迟初始化。
        private class Nested
        {
            static Nested()
            {
            }

            public static readonly OperatorProvider instance = new OperatorProvider();
        }

        /// <summary>
        /// 在大多数情况下，静态初始化是在.NET中实现Singleton的首选方法。
        /// </summary>
        public static OperatorProvider Instance
        {
            get
            {
                return Nested.instance;
            }
        }

        public Operator Current
        {
            get; set;
        }

        /// <summary>
        ///
        /// 从Session/Cookie删除用户操作模型。
        /// </summary>
        public void Remove(HttpContext context)
        {
            context.Session.Remove(_lOGIN_USER_KEY);
        }

        public void Remove()
        {
            MyHttpContext.Current.Session.Remove(_lOGIN_USER_KEY);
        }
    }
```
存储并且获取用户信息
```csharp
//存储 
OperatorProvider.Instance.Current = new Operator
            {
                Account = "admin",
                NickName = "张三"
            };
//获取
var account = OperatorProvider.Instance.Current.Account;
```

### 4. Session设置
```csharp
services.AddDistributedMemoryCache();
services.AddSession(options =>
{
    options.Cookie.Name = ".AdventureWorks.Session";
    options.IdleTimeout = System.TimeSpan.FromSeconds(10);//设置session的过期时间
    options.Cookie.HttpOnly = true;//设置在浏览器不能通过js获得该cookie的值
});
services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
```

