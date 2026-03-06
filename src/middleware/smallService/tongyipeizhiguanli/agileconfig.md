---
title: AgileConfig
lang: zh-CN
date: 2022-06-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: agileconfig
slug: ozgegn
docsId: '32969108'
---

## 描述
基于NetCore开发的轻量级配置中心，部署简单、配置简单，使用简单，可以根据个人或者公司需求采用。

- 部署简答，最少只需要一个数据节点，支持docker部署
- 支持多节点分布式部署来保证高可用
- 配置支持按照应用隔离，应用内配置支持分组隔离
- 使用长链接技术，配置信息实时推送到客户端
- 支持IConfiguration、IOptions模式读取配置，原程序几乎不用改造
- 配置修改支持版本记录，随时回滚配置
- 所有所有节点都故障，客户端支持从本地缓存读取配置
> GitHub地址：[https://github.com/kklldog/AgileConfig](https://github.com/kklldog/AgileConfig)  可以给这个大佬点个star

如果使用apollo进行部署做配置中心，对于部分公司来讲，过于笨重，所以我个人还是挺推荐这个的，再次感谢[kklldog](https://github.com/kklldog)大佬的开源项目。

## 部署
通过docker部署，目前支持sqlserver，mysql，sqlite, PostgreSql，Oracle 五种数据库。本次示例使用轻量级的sqlite作为数据存储
```csharp
docker run -d --name agile_config -e adminConsole=true -e db:provider=sqlite -e db:conn="Data Source=agile_config.db" -p 8011:5000 kklldog/agile_config:latest 
```
> 1. adminConsole 配置程序是否为管理控制台。如果为true则启用控制台功能，访问该实例会出现管理界面。
> 2. db:provider 配置程序的数据库类型。目前程序支持：sqlite，mysql，sqlserver 三种数据库。
> 3. db:conn 配置数据库连接串


## 进入系统
通过浏览器访问我们地址：[http://localhost:8011/](http://localhost:8011/)
![image.png](/common/1622383774783-61f141ee-37bf-445f-9df8-5992ee54cefa.png)
界面还是简约美观的，第一次登录需要初始化管理员密码，然后登录进入系统
![image.png](/common/1622383889423-e0085b40-f3f3-4893-9cdc-292cc5c4b23b.png)
通过主界面我们看到了下面这个几个菜单
**节点**：AgileConfig支持多节点部署，所有的节点都是平行的。为了简化部署，AgileConfig并没有单独的控制台程序，请直接使用任意一个节点作为控制台。
![image.png](/common/1622386210763-174c2eb6-e88d-4a18-b711-b6a085b19e4c.png)
**应用**：AgileConfig支持多应用程序接入。需要为每个应用程序配置名称、ID、秘钥等信息。每个应用可以设置是否可以被继承，可以被继承的应用类似apollo的公共 namespace 的概念。公共的配置可以提取到可继承应用中，其它应用只要继承它就可以获得所有配置。如果子应用跟被继承应用之间的配置键发生重复，子应用的配置会覆盖被继承的应用的配置。子应用可以继承多个应用，如果多个应用之间发生重复键，按照继承的顺序，后继承的应用的配置覆盖前面的应用。
![image.png](/common/1622384227460-80915f07-a920-40a7-b9fc-97dd9dc22683.png)
创建好应用后我们可以点击列表的配置该应用的配置项。
![image.png](/common/1622384452757-5d559635-9e50-4c20-a4c6-e02d203c914a.png)
新添加的配置并不会被客户端感知到，需要手工点击“上线”才会推送给客户端。
![image.png](/common/1622384497260-bdc43c47-c8f8-49de-a31e-c1b45abda318.png)
已上线的配置如果发生修改、删除、回滚操作，会实时推送给客户端。版本历史记录了配置的历史信息，可以回滚至任意版本。
![image.png](/common/1622384628520-de2c0e58-d077-411c-a5a5-94d8fed65a91.png)
**客户端**：可以查看已经连接的客户端
**日志**：记录一些关键信息的日志

## 创建客户端
通过VS2019创建一个.Net5的WebAPI应用程序，安装组件
```csharp
  <ItemGroup>
    <PackageReference Include="AgileConfig.Client" Version="1.1.8.5" />
  </ItemGroup>
```
连接我们的配置中心，在program中进行配置
```csharp
    public class Program
    {
        public static IConfigClient ConfigClient;

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    //读取本地配置
                    var localconfig = new ConfigurationBuilder()
                                     .SetBasePath(Directory.GetCurrentDirectory())
                                     .AddJsonFile("appsettings.json").Build();
                    //从本地配置里读取AgileConfig的相关信息
                    var appId = localconfig["AgileConfig:appId"];
                    var secret = localconfig["AgileConfig:secret"];
                    var nodes = localconfig["AgileConfig:nodes"];

                    //new一个client实例
                    var configClient = new ConfigClient(appId, secret, nodes);
                    //使用AddAgileConfig配置一个新的IConfigurationSource
                    config.AddAgileConfig(configClient);
                    //找一个变量挂载client实例，以便其他地方可以直接使用实例访问配置
                    ConfigClient = configClient;
                    //注册配置项修改事件
                    configClient.ConfigChanged += ConfigClient_ConfigChanged;
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        /// <summary>
        /// 此事件会在配置项目发生新增、修改、删除的时候触发
        /// </summary>
        private static void ConfigClient_ConfigChanged(ConfigChangedArg obj)
        {
            Console.WriteLine($"action:{obj.Action} key:{obj.Key}");

            switch (obj.Action)
            {
                case ActionConst.Add:
                    break;

                case ActionConst.Update:
                    break;

                case ActionConst.Remove:
                    break;

                default:
                    break;
            }
        }
    }
```
appsettings添加
```csharp
  "AgileConfig": {
    "appId": "001",
    "secret": "454551215781234",//密钥
    "nodes": "http://localhost:8011" //多个节点使用逗号分隔
  }
```

## 读取配置
AgileConfig支持asp.net core 标准的IConfiguration，跟IOptions模式读取配置。还支持直接通过AgileConfigClient实例直接读取。本文直接注入IConfiguration来获取刚才我们配置的数据库连接信息。
在startup中获取配置
![image.png](/common/1622385329008-3943607a-db74-4ed1-80ea-b5af13863a73.png)
增加一个接口获取配置信息
```csharp
    private readonly IConfiguration _configuration;

    public HomeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public string Get()
    {
        return _configuration["db:ConnectionString"];
    }
```
访问接口输出配置
Server=localhost;Database=test;Port=3306;charset=utf8;uid=root;pwd=123456;
在程序不关闭情况下修改配置，测试一下配置是否更新
![image.png](/common/1622385587535-bf535c22-acfe-408a-9649-f1efe1839403.png)
请求接口重新获取最近配置(不是实时更新，需要等待一小会，但是满足我们的实际需求)

## 参考资料
> 开发作者的文章：[https://www.cnblogs.com/kklldog/p/agile-config.html](https://www.cnblogs.com/kklldog/p/agile-config.html)
> GitHub中文文档：[https://github.com/kklldog/AgileConfig/blob/master/README_CN.md](https://github.com/kklldog/AgileConfig/blob/master/README_CN.md)

