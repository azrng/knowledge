---
title: AutoMapper
lang: zh-CN
date: 2023-10-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - mapper
filename: automapper
slug: szd8fg
docsId: '42421422'
---

## 概述
是一个基于约定的对象-对象映射器。通俗地讲就是将一对象转换为另一个对象，前提是我们需要在这两个对象之间建立约定。支持框架：.Net 4.6.1+ 、.Net Standard 2.0+
> 官网：[https://docs.automapper.org/](https://docs.automapper.org/)


## 使用
> 本次示例环境：vs2019、.net5


### 生成代码
通过安装扩展或安装nuget包来更好地查看生成的代码，或者直接使用[在线地址查看](https://dotnetfiddle.net/aJYTGZ)
> 详情：[https://docs.automapper.org/en/latest/Understanding-your-mapping.html](https://docs.automapper.org/en/latest/Understanding-your-mapping.html)

```csharp
    var config = new MapperConfiguration(cfg => cfg.CreateMap<AddUserDto, User>());
    var executionPlan = config.BuildExecutionPlan(typeof(AddUserDto), typeof(User));
	
	//如果是操作数据库
	var expression = context.Entities.ProjectTo<Dto>().Expression;
```
> 该代码不建议在发布后使用。


### 控制台操作
通过控制台对AutoMapper简单用法来一个了解，使用vs2019新建.Net5控制台应用
引用组件
```csharp
  <ItemGroup>
    <PackageReference Include="AutoMapper" Version="10.1.1" />
    <PackageReference Include="Newtonsoft.Json" Version="13.0.1" />
  </ItemGroup>
```
> Newtonsoft.Json是为了显示转换为效果，序列化使用


#### 默认约定映射
目标：将接收到的用户请求类转换为我们的用户实体类添加到数据库中
数据准备
用户实体类
```csharp
    public class User
    {
        public string Id { get; set; }

        /// <summary>
        /// 字符长度限制
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///图片地址
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// 生日
        /// </summary>
        public DateTime BirthDay { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
    }
```
添加用户请求类
```csharp
    public class AddUserDto
    {
        public string Id { get; set; }

        /// <summary>
        /// 字符长度限制
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///图片地址
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 省
        /// </summary>
        public string Province { get; set; }

        /// <summary>
        /// 市
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// 区
        /// </summary>
        public string Area { get; set; }

        /// <summary>
        /// 生日
        /// </summary>
        public DateTime BirthDay { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
    }
```
```csharp
    var addUser = new AddUserDto
    {
        Id = "123456",
        Name = "azrng",
        Province = "河南省",
        City = "郑州市",
        Area = "金水区",
        BirthDay = DateTime.Parse("2021-05-20 13:14"),
        CreateTime = DateTime.Now,
        Url = "www.baidu.com/1.png"
    };

    //创建映射规则,第一个参数为源实体,第二个为目标实体
    var config = new MapperConfiguration(cfg => cfg.CreateMap<AddUserDto, User>());
    //var mapper = config.CreateMapper();
    //or
    var mapper = new Mapper(config);
    //进行转换,得到目标实体
    Console.WriteLine(JsonConvert.SerializeObject(mapper.Map<User>(addUser)));
    //{"Id":"123456","Name":"azrng","Url":"www.baidu.com/1.png","Address":null,"BirthDay":"2021-05-20T13:14:00","CreateTime":"2021-05-20T16:09:08.6982869+08:00"}
```

#### 自动配置
主动扫描从配置文件继承的类，并将它们加入配置
```csharp
    var assembly = Assembly.GetExecutingAssembly();
    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddMaps(assembly);
    });
    var mapper = new Mapper(config);
    Console.WriteLine(JsonConvert.SerializeObject(mapper.Map<User>(addUser)));
```

### WebAPI
安装组件
```csharp
    <PackageReference Include="AutoMapper" Version="10.1.1" />
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="8.1.1" />
```
ConfigureServices中将Automapper注入到依赖注入容器中
```csharp
    //只映射单个
    //services.AddAutoMapper(typeof(UserProfile));

    //映射程序集
    //services.AddAutoMapper(typeof(Startup).Assembly);

    //将继承于Profile的类批量映射
    var profiles = Assembly.GetExecutingAssembly().DefinedTypes
        .Where(t => typeof(Profile).GetTypeInfo().IsAssignableFrom(t.AsType()))
        .Select(t => t.AsType()).ToArray();
    services.AddAutoMapper(profiles);
```
创建包含用户实体类的WebAPI项目并且配置连接数据库，
```csharp
    public class User : IdentityBaseEntity
    {
        /// <summary>
        /// 字符长度限制
        /// </summary>
        [Comment("名称")]
        [Required]//必填
        [StringLength(60, MinimumLength = 3)]//长度限制
        public string Name { get; set; }

        /// <summary>
        /// 生日
        /// </summary>
        [Comment("生日")]
        [Required]//必填
        public DateTime BirthDay { get; set; }

        /// <summary>
        ///头像
        /// </summary>
        [Comment("头像")]
        [Required]//必填
        [StringLength(200)]//长度限制
        public string HeadImg { get; set; }

        [Comment("创建时间")]
        [DataType(DataType.Date)]//格式限制
        public DateTime CreateTime { get; set; }
    }
```

#### 默认约定映射
使用添加用户场景操作
```csharp
    public class AddUserVm
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 生日
        /// </summary>
        public DateTime BirthDay { get; set; }

        /// <summary>
        ///头像
        /// </summary>
        public string HeadImg { get; set; }
    }
```
用户映射配置
```csharp
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<AddUserVm, User>();//默认映射
        }
    }
```
使用
```csharp
        private readonly OpenDbContext _dbContext;
        private readonly IMapper _mapper;

        public UserController(OpenDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<string>> AddAsync(AddUserVm dto)
        {
            //自行参数校验
            var entity = _mapper.Map<User>(dto);
            await _dbContext.AddAsync(entity).ConfigureAwait(false);
            await _dbContext.SaveChangesAsync().ConfigureAwait(false);
            return entity.Id;
        }
```
添加成功
![image.png](/common/1622272805433-53ec4b63-b872-43b8-9a45-b92293c43cad.png)
> 这里我们模拟存储的是头像的相对地址


#### 自定义成员映射
这个时候我们需要查询某一个用户的信息，那么我们先来添加用户详情返回类
```csharp
public class GetUserResult
{
    /// <summary>
    /// 名称
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    ///年
    /// </summary>
    public string Year { get; set; }

    /// <summary>
    /// 月
    /// </summary>
    public string Month { get; set; }

    /// <summary>
    /// 日
    /// </summary>
    public string Day { get; set; }

    /// <summary>
    ///头像
    /// </summary>
    public string HeadImg { get; set; }
}
```
创建自定义成员映射
```csharp
    CreateMap<User, GetUserResult>()
            //单独配置每一个成员
            .ForMember(ur => ur.Year, u => u.MapFrom(src => src.BirthDay.Year))
            .ForMember(ur => ur.Month, u => u.MapFrom(src => src.BirthDay.Month))
            .ForMember(ur => ur.Day, u => u.MapFrom(src => src.BirthDay.Day))
            .ForMember(ur => ur.HeadImg, u => u.MapFrom(src => "www.baidu.com/" + src.HeadImg));
```
查询操作
```csharp
        [HttpGet("{userId}")]
        public async Task<ActionResult<GetUserResult>> GetDetails(string userId)
        {
            var result = await _dbContext.Users.Where(t => t.Id == userId).ProjectTo<GetUserResult>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
            return Ok(result);
        }
```
结果
```csharp
{
    "name": "azrng",
    "year": "1990",
    "month": "5",
    "day": "29",
    "headImg": "www.baidu.com/123456.png"
}
```

### 其他操作

#### 命名公约
相互映射以下属性：property_name -> PropertyName
```csharp
    var config = new MapperConfiguration(cfg =>
    {
        //源成员的命名约定
        cfg.SourceMemberNamingConvention = new LowerUnderscoreNamingConvention();
        //目标成员的命名约定
        cfg.DestinationMemberNamingConvention = new PascalCaseNamingConvention();
    });
```

#### 替换字符
替换属性名称字符  Source和Destination 的Avíator属性i不一样
```csharp
    var config = new MapperConfiguration(cfg =>
    {
        cfg.CreateMap<Source, Destination>();
        //可能替换单个字符或者整个单词
        cfg.ReplaceMemberName("í", "i");
        //cfg.ReplaceMemberName("Airlina", "Airline");
    });
    var mapper = new Mapper(config);
    Console.WriteLine(JsonConvert.SerializeObject(mapper.Map<Destination>(source)));
    //{"Value":1,"Aviator":2,"SubAirlinaFlight":3}
```

#### 识别前/后缀
因为有时候源/目标属性具有前后缀，因为名称不同，所以不能直接映射
```csharp
    var config = new MapperConfiguration(cfg =>
    {
        cfg.RecognizePrefixes("frm");//比如前缀都是frm区别
        //cfg.CreateMap<a,b>
    });
```

#### 全局属性/字段过滤
映射时候选择一部分进行过滤
```csharp
    var config = new MapperConfiguration(cfg =>
    {
        cfg.ShouldMapField = fi => false;

        cfg.ShouldMapProperty = pi => pi.GetMethod.IsPublic || pi.GetMethod.IsPrivate;
    });
```

#### 嵌套映射
当映射的类里面包含嵌套的类，那么需要将这个嵌套的类也给配置
```csharp
    var config = new MapperConfiguration(cfg =>
    {
        cfg.CreateMap<OuterSource, OuterDest>();
        cfg.CreateMap<InnerSource, InnerDest>();//需要将嵌套的内容也配置

    });
    var outerSource = new OuterSource
    {
        Value = 2,
        Inner = new InnerSource
        {
            OtherValue = 5
        }
    };
    var mapper = new Mapper(config);
    var outerDest = mapper.Map<OuterDest>(outerSource);
```

#### 列表和数组
```csharp
    var config = new MapperConfiguration(cfg =>
    {
        cfg.CreateMap<Source, Destination>();
    });
    var listSourse = new List<Source>
                {
    				new Source{ Value=1 },
    				new Source{  Value=2}
                };
    var mapper = new Mapper(config);
    var listDest = mapper.Map<List<Destination>>(listSourse);
```

#### 反向映射
```csharp
    var configuration = new MapperConfiguration(cfg =>
    {
        //约定映射
        //cfg.CreateMap<Order, OrderDto>().ReverseMap();
        //自定义反向映射
        cfg.CreateMap<Order, OrderDto>()
        .ForMember(od => od.CustomerName, o => o.MapFrom(src => src.Customer.Name))
        .ReverseMap();
    });
    var mapper = new Mapper(configuration);

    var order = new Order
    {
        Customer = new Customer
        {
            Name = "Bob"
        },
        Total = 15.8m
    };
    var orderDto = mapper.Map<OrderDto>(order);
```

#### 忽略成员
使用`IgnoreAttribute`忽略映射和/或验证中的单个目标成员：
```csharp
using AutoMapper.Configuration.Annotations;

[AutoMap(typeof(Order))]
public class OrderDto {
    [Ignore]
    public decimal Total { get; set; }
    
    
CreateMap<ChatSatisfactionTemplate, GetSatisfactionTemplateOutputDto>()
    .ForMember(t => t.PushTypeSum, opt => opt.MapFrom(src => src.PushType))
    .ForMember(t => t.PushTypeChannelSum, opt => opt.MapFrom(src => src.PushTypeChannel))
    .ForMember(t => t.PushType, opt => opt.Ignore())
    .ForMember(t=>t.PushTypeChannel,opt=>opt.Ignore());
```

#### 类型映射配置
这相当于一个配置。`CreateMap<Order, OrderDto>()`
```csharp
[AutoMap(typeof(Order))]
public class OrderDto {
    // destination members
```

#### 重定向到不同源成员
SourceMemberAttribute可以重定向到单独的命名成员
```csharp
    [AutoMap(typeof(User))]
    public class GetUserResult
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 名称2
        /// </summary>
        [SourceMember(nameof(User.Name))]
        public string Name2 { get; set; }

        /// <summary>
        /// 名称3
        /// </summary>
        [SourceMember("Name")]
        public string Name3 { get; set; }
    }
```
> 注意：必须使用AutoMap，不能和CreateMap搭配使用


#### 枚举映射
需要引用包
```csharp
AutoMapper.Extensions.EnumMapping
```
配置操作
```csharp
    CreateMap<Source, Destination>()
        .ConvertUsingEnumMapping(opt => opt
        .MapValue(Source.First, Destination.Default))
        .ReverseMap();//支持反过来映射
```

#### 自定义类型转换器
特殊需求，将一种类型转换为另一种类型，例如字符串的源类型到 Int32 的目标类型可以直接使用Convert.ToInt32，复杂的需要自定义类型转换器
配置以及自定义转换器
```csharp
    var configuration = new MapperConfiguration(cfg => {
      cfg.CreateMap<string, int>().ConvertUsing(s => Convert.ToInt32(s));
      cfg.CreateMap<string, DateTime>().ConvertUsing(new DateTimeTypeConverter());
      cfg.CreateMap<string, Type>().ConvertUsing<TypeTypeConverter>();
      cfg.CreateMap<Source, Destination>();
    });


public class DateTimeTypeConverter : ITypeConverter<string, DateTime>
{
    public DateTime Convert(string source, DateTime destination, ResolutionContext context)
    {
        return System.Convert.ToDateTime(source);
    }
}

public class TypeTypeConverter : ITypeConverter<string, Type>
{
    public Type Convert(string source, Type destination, ResolutionContext context)
    {
          return Assembly.GetExecutingAssembly().GetType(source);
    }
}
```
> 参考文档：[https://docs.automapper.org/en/latest/Custom-type-converters.html](https://docs.automapper.org/en/latest/Custom-type-converters.html)


#### 条件映射
仅当源对象中的属性baz大于或等于0时，才会映射该属性
```csharp
var configuration = new MapperConfiguration(cfg => {
  cfg.CreateMap<Foo,Bar>()
    .ForMember(dest => dest.baz, opt => opt.Condition(src => (src.baz >= 0)));
});
```
通过PreCondition方法，解析值之前加条件，它在映射过程中运行更快。通过先调用先决条件，决定哪些是将要映射的源，然后调用条件，最后分配给目标值
```csharp
var configuration = new MapperConfiguration(cfg => {
  cfg.CreateMap<Foo,Bar>()
    .ForMember(dest => dest.baz, opt => {
        opt.PreCondition(src => (src.baz >= 0));
        opt.MapFrom(src => {
            // Expensive resolution process that can be avoided with a PreCondition
        });
    });
});
```

#### 空替换
如果源值在成员中的任何位置为空，则空替换允许您为目标成员提供替代值。这意味着它不是从 null 映射，而是从您提供的值映射。
```csharp
var config = new MapperConfiguration(cfg => cfg.CreateMap<Source, Dest>()
    .ForMember(destination => destination.Value, opt => opt.NullSubstitute("Other Value")));
```

#### 映射前或者映射后操作
一般不这么操作
```csharp
var configuration = new MapperConfiguration(cfg => {
  cfg.CreateMap<Source, Dest>()
    .BeforeMap((src, dest) => src.Value = src.Value + 10)
    .AfterMap((src, dest) => dest.Name = "John");
});
```
> AfterMap是 AutoMaper 完成工作后执行的代码。AutoMapper 对此一无所知（它是一个黑匣子），并且不能在其中使用任何逻辑。

## 实践

### 对象之间赋值操作

安装nuget包，可以实现将对象a的值覆盖到对象b上，且设置覆盖规则

```csharp
using AutoMapper;
using Dumpify;

var config = new MapperConfiguration(cfg =>
{
    // 忽略IdCard替换，null值也不进行替换
    cfg.CreateMap<UserInfo1, UserInfo2>()
        .ForMember(opt => opt.IdCard, t => t.Ignore())
        .ForAllMembers(opt => opt.Condition((src, dest, member) => member != null));
});
var mapper = new Mapper(config);

var userInfo = new UserInfo1
{
    Id = null,
    Name = "ccc",
    IdCard = "123456",
    CreateTime = DateTime.Now.AddDays(1)
};

var userInfo2 = new UserInfo2
{
    Id = "10",
    Name = "bbbb",
    IdCard = "654321",
    CreateTime = DateTime.Now
};

// 使用userInfo的值去覆盖userInfo2的值
var result = mapper.Map(userInfo, userInfo2);
result.Dump();

// outputs
              UserInfo2              
┌────────────┬──────────────────────┐
│ Name       │ Value                │
├────────────┼──────────────────────┤
│ Id         │ "10"                 │
│ IdCard     │ "654321"             │
│ Name       │ "ccc"                │
│ CreateTime │ [2024/8/24 23:58:57] │
└────────────┴──────────────────────┘

                  
// 引用的模型
public class UserInfo1
{
    public string Id { get; set; }

    public string IdCard { get; set; }

    public string Name { get; set; }

    public DateTime? CreateTime { get; set; }
}

public class UserInfo2
{
    public string Id { get; set; }

    public string IdCard { get; set; }

    public string Name { get; set; }

    public DateTime? CreateTime { get; set; }
}
```

如果我把两个模型改为下面的样子，在每个模型上增加一个集合属性，如

```c#
public class UserInfo1
{
    public string Id { get; set; }

    public string IdCard { get; set; }

    public string Name { get; set; }

    public DateTime? CreateTime { get; set; }

    public List<string> List { get; set; }
}

public class UserInfo2
{
    public string Id { get; set; }

    public string IdCard { get; set; }

    public string Name { get; set; }

    public DateTime? CreateTime { get; set; }

    public List<string> List { get; set; }
}
```

再次执行上面的方法变为

```csharp
              UserInfo2              
┌────────────┬──────────────────────┐
│ Name       │ Value                │
├────────────┼──────────────────────┤
│ Id         │ "10"                 │
│ IdCard     │ "654321"             │
│ Name       │ "ccc"                │
│ CreateTime │ [2024/8/24 23:56:36] │
│ List       │ ┌──────────────┐     │
│            │ │ List<string> │     │
│            │ └──────────────┘     │
└────────────┴──────────────────────┘
```

这里有点注意的是，此处将一个null的集合，映射到了另外一个null的集合，最后出来的结果是一个空集合，这个如果要保持原样那么就需要特殊配置处理了

```csharp
var config = new MapperConfiguration(cfg =>
{
    // 忽略IdCard替换，null值也不进行替换
    cfg.CreateMap<UserInfo1, UserInfo2>()
        .ForMember(opt => opt.IdCard, t => t.Ignore())
        .ForMember(dest => dest.List, opt => opt.AllowNull())  // 此处
        .ForAllMembers(opt => { opt.Condition((src, dest, member) => member != null); });
});
var mapper = new Mapper(config);

// outputs 
              UserInfo2              
┌────────────┬──────────────────────┐
│ Name       │ Value                │
├────────────┼──────────────────────┤
│ Id         │ "10"                 │
│ IdCard     │ "654321"             │
│ Name       │ "ccc"                │
│ CreateTime │ [2024/8/24 23:58:17] │
│ List       │ null                 │
└────────────┴──────────────────────┘
```

## 参考文档

> [https://docs.automapper.org/en/latest/Getting-started.html](https://docs.automapper.org/en/latest/Getting-started.html)

