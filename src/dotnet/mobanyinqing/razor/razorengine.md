---
title: RazorEngine
lang: zh-CN
date: 2023-02-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: razorengine
slug: yuzzvr
docsId: '74438261'
---

## 介绍
RazorEngine 是基于 Microsoft 的 Razor 解析引擎构建的模板引擎，允许您使用 Razor 语法构建动态模板。

**注意：目前该包已经不更新**

## 原理
.Net在编译的时候会把.cshtml文件生成一个动态程序集，每次调用，就会每次生成一个不重复的动态程序集，通过设置模板key来实现一次编译，下次会使用缓存，不会生成新的动态程序集。
如果cshtml文件发生了修改，那么还调用缓存的话，那么就不合适了，所以可以将模板key设置为动态的。

- 根据文件名+修改时间
- 文件的MD5值作为模板key
> 资料来源：Razor模板引擎：[https://www.cnblogs.com/green-jcx/p/5786669.html](https://www.cnblogs.com/green-jcx/p/5786669.html)


## RazorEngine
支持NetFramework4.0和4.5，最后更新时间2017.06.16
仓库地址：[https://github.com/Antaris/RazorEngine](https://github.com/Antaris/RazorEngine)

### 基础操作
```csharp
using RazorEngine;
using RazorEngine.Templating; // For extension methods.

string template = "Hello @Model.Name, welcome to RazorEngine!";
var result = Engine.Razor.RunCompile(template, "templateKey", null, new { Name = "World" });
```
"templateKey"是一个模板key，可以根据这个重新运行，如果你模板会一直不变化，只编译一次模块可以多次使用，如果你的模板内容会变，那么缓存会失效。
```csharp
// using RazorEngine.Templating; 
var result = Engine.Razor.Run("templateKey", null, new { Name = "Max" });
```
null参数是modeType，为null意味着我们使用dynamic作为模型的类型，也可以提供类型对象来使用。
```csharp
// using RazorEngine.Templating; // Dont forget to include this.
var result = Engine.Razor.RunCompile("templateKey", typeof(Person), new Person { Name = "Max" });
```
当使用@model的时候，modeType参数将被忽略，但您应该在每次调用时使用相同的类型实例或者null，以防止由于缓存层中的类型不匹配而导致不必要的重新编译。
> 在实际操作的时候，页面模板头部使用@model会报错，可能是我操作不对，但是不影响我的使用。


## RazorEngine.NetCore
支持.NetCore3.1、.NetSandard2.1，最后更新时间2020.06.19
仓库地址：[https://github.com/fouadmess/RazorEngine](https://github.com/fouadmess/RazorEngine)

### 基础操作
和上面的RazorEngine一样，不再描述。

### 填充内容导出HTML
引用组件
```csharp
<ItemGroup>
  <PackageReference Include="RazorEngine.NetCore" Version="3.1.0" />
</ItemGroup>
```
模板配置
```csharp
<div>
    <table border="1" style="border:1px solid black;text-align:center" cellpadding="1" cellspacing="1">
        <tr>
            <th colspan="2">@Model.UserName</th>
        </tr>
        <tr>
            <td>科目</td>
            <td>成绩</td>
        </tr>
        @foreach (var item in Model.SubjectList)
        {
            <tr>
                <td>@item.SubjectName</td>
                <td>@item.Grade</td>
            </tr>
        }

    </table>
</div>
```
> 需要右键设置始终复制

涉及到的UserGradeDto类如下
```csharp
namespace RazorEngineConsoleApp.Models
{
    public class UserGradeDto
    {
        public string UserName { get; set; } = null!;

        /// <summary>
        /// 科目成绩集合
        /// </summary>
        public IEnumerable<SubjectGradeDto> SubjectList { get; set; } = null!;

        public static UserGradeDto GetInfo()
        {
            return new UserGradeDto
            {
                UserName = "张三",
                SubjectList = new List<SubjectGradeDto>
                    {
                        new SubjectGradeDto
                        {
                            SubjectName = "语文",
                            Grade = 90
                        },
                        new SubjectGradeDto
                        {
                            SubjectName = "数学",
                            Grade = 80
                        },
                        new SubjectGradeDto
                        {
                            SubjectName = "英语",
                            Grade = 70
                        }
                    }
            };
        }
    }

    public class SubjectGradeDto
    {
        /// <summary>
        /// 科目名字
        /// </summary>
        public string SubjectName { get; set; } = null!;

        /// <summary>
        /// 成绩
        /// </summary>
        public int Grade { get; set; }
    }
}
```

#### 模板通过强类型方式填充
配置生成的代码
```csharp
var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "View", "usergrade1.cshtml");
if (!File.Exists(filePath))
{
    Console.WriteLine("模板文件不存在");
    return;
}
//打开并且读取模板
string template = File.ReadAllText(filePath);

//一次编译多次使用
{
    //modelType为null
    //添加模板
    Engine.Razor.AddTemplate("usergrade1", template);
    //编译模板
    Engine.Razor.Compile("usergrade1", modelType: null);
    //运行模板
    string str = Engine.Razor.Run("usergrade1", modelType: null, UserGradeDto.GetInfo());
    Console.WriteLine(str);

    //modelType不为null
    ////添加模板
    //Engine.Razor.AddTemplate("usergrade1", template);
    ////编译模板
    //Engine.Razor.Compile("usergrade1", typeof(UserGradeDto));
    ////运行模板
    //string str = Engine.Razor.Run("usergrade1", typeof(UserGradeDto), UserGradeDto.GetInfo());
    //Console.WriteLine(str);
}

//一次编译一次使用
{
    //var str = Engine.Razor.RunCompile(template, "usergrade1", typeof(UserGradeDto), UserGradeDto.GetInfo());
}
```
生成结果
```csharp
<div>
    <table border="1" style="border:1px solid black;text-align:center" cellpadding="1" cellspacing="1">
        <tr>
            <th colspan="2">张三</th>
        </tr>
        <tr>
            <td>科目</td>
            <td>成绩</td>
        </tr>
            <tr>
                <td>语文</td>
                <td>90</td>
            </tr>
            <tr>
                <td>数学</td>
                <td>80</td>
            </tr>
            <tr>
                <td>英语</td>
                <td>70</td>
            </tr>
    </table>
</div>
```

#### 模板通过dynamic填充
配置生成的代码
```csharp
var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "View", "usergrade2.cshtml");
if (!File.Exists(filePath))
{
    Console.WriteLine("模板文件不存在");
    return;
}
//打开并且读取模板
string template = File.ReadAllText(filePath);
//dynamic方式
var result = Engine.Razor.RunCompile(template, "templateKey", null, new { UserName = "李思", SubjectList = new List<SubjectGradeDto> { new SubjectGradeDto { SubjectName = "语文", Grade = 90 } } });
Console.WriteLine(result);
```
> 这里的SubjectGradeDto内容就是上面UserGradeDto的内容

生成结果和上面示例结果一致，不在张贴。

## 总结
这两个包都已经不再更新，但是该项目正在寻求新的维护者，感兴趣的可以去研究下源码。
