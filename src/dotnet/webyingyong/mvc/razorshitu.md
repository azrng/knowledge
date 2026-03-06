---
title: Razor视图
lang: zh-CN
date: 2023-09-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: razorshitu
slug: zgo953
docsId: '31379924'
---

## 默认控件
```csharp
@Html.ActionLink("Index", "Order")

@Html.ActionLink("带控制器", "action名称", "控制器名称")

@Html.ActionLink("带路由器信息", "action名称", new { id = 1, name = "李思" })

<a href="/Html/Action/1?name=1&height=5">带路由信息</a>

@Html.RouteLink("LinkText", new { action = "ActionName" })

@Html.RouteLink("LinkText", new { action = "Index", controller = "Order" })

@Html.RouteLink("LinkText", new { action = "Index", id = 1 })
```

## 扩展控件

### 方案一
> 本质：通过一个后台方法，返回一个**已经存在**的HTML标签的字符串，浏览器在读取的时候就获取成一个html标签

通过静态类的方式定义静态拓展方法，扩展IHemlHelper，返回IHtmlContent类型
```csharp
 /// <summary>
    /// 扩展类
    /// </summary>
    public static class HtmlHelperExtensions
    {
        /// <summary>
        /// 扩展br标签
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static IHtmlContent Br(this IHtmlHelper helper)
        {
            return new HtmlString($"<br/>>");
        }
        /// <summary>
        /// 格式化标签
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public static IHtmlContent Pre(this IHtmlHelper helper, string content)
        {
            return new HtmlString($"<pre>{content}</pre>");
        }
    }
```
调用示例(引用命名空间)
```csharp
@Html.Br()
@Html.Pre("我是  格式化  标签")
```

### 方案二
> 本质：通过一个后台方法，返回一个**不存在**的HTML标签的字符串，在读取的时候，通过后台的方法，去生成我们制定的标签。

定义一个类(类名称建议以TagHelper结尾)
```csharp
 [HtmlTargetElement("SimpleTagHelper")]//标签名称
    public class CustomTagSimTagHelper : TagHelper
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string PageIndex { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            var _id = Id;
            var _name = Name;
            var _pageIndex = PageIndex;

            output.TagName = "div";
            output.Attributes.Add("dir", "123");
            output.Attributes.Add("name", "我的名字");

            output.PreContent.SetContent("这个是我自定义的标签");
        }
    }
```
> 注意：建议标记HtmlTargetElement，不写的情况下会去掉后缀作为标签名称

使用方法
```csharp
<SimpleTagHelper id=11 name="lisi" page-index="第一页"></SimpleTagHelper>
```
> 注意：
> 1.需要在_ViewImports中进行注册才能使用 @addTagHelper *,MvcStudy
> 2.如果属性是两个字符，第二个字母是大写，那么前台的写法是：第一个字母小写-第二个字母小写


## 局部视图

### 创建局部视图
![image.png](/common/1612855084630-06c2331d-581c-4d52-9ff2-0c66d9f62b28.png)

### 简单配置局部视图
```csharp
@model string

<div style="background-color:red;width:300px;height:200px">

    <h1>这个是我的局部视图</h1>
    名称：@Model
</div>
```

### 供其他页面使用
```csharp
@{
    ViewData["Title"] = "Index3";
    Layout = "~/Views/Shared/_Layout.cshtml";
}

<h3>局部视图使用</h3>
@Html.Partial("PartialView", "lisi")
```
> 使用场景：有一部分页面内容多个页面都需要用到，那么可以考虑将该部分做成一个局部视图，供其他多个页面引用使用


## 视图组件
场景：

- 呈现页面响应的某一部分 而不是整个响应
- 控制器和视图之间发现的关注分离
- 可以具有参数和业务逻辑
- 通常在页面布局中调用

### 具体操作

#### 新建带搜索组件类
```csharp
 [ViewComponent(Name = "CustomList")]
    public class ListViewComponet : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(string searchString)
        {
            var list = await GetStudentList(searchString);
            //默认返回路径 组件在shared目录下
            return View(list);

            //如果组件不在share目录下
            //return View("~/View/Test/TestDefault.cshtml", list);
        }
        public Task<List<Student>> GetStudentList(string searchString)
        {
            return Task.Run(() =>
            {
                return new List<Student>
                {
                    new Student {Id = "1", Name = "张三"},
                    new Student {Id = "2", Name = "李四"},
                    new Student {Id = "3", Name = "王五"},
                    new Student {Id = "4", Name = "赵六"}
                }.Where(t => t.Name.Contains(searchString)).ToList();
            });
        }
    }
    public class Student
    {
        /// <summary>
        /// 标识
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }
    }
```
> 类名后缀是：ViewComponet  默认该类和Shared:Components:组件名:Default 对应


#### 创建视图
在Views\Shared\Components\CustomList目录下创建空视图Default.cshtml
```csharp
@using MvcStudy.Extensions.ViewComponetExtension;

@model List<Student>


@foreach (var item in Model)
{
  
    <p>用户ID：@item.Id  用户名：@item.Name</p>
}
```

#### 其他页面使用
```csharp
@await Component.InvokeAsync("CustomList", new { searchString = "张" });
```
> 通过这种方法就可以把一个带操作逻辑的视图当成组件引入到另一个视图中


































