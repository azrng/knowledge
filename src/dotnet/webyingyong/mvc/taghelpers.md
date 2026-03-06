---
title: TagHelpers
lang: zh-CN
date: 2023-07-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: taghelpers
slug: rpqyoz
docsId: '32030676'
---
Tag Helpers提供了在视图中更改和增强现有html元素的功能。将他们添加到视图中，回经过一个Razor模板引擎处理并创建一个html，之后再返回给浏览器，有一些tag helpers，其实作为元素或者实际的标签。
 
Img
```
<img src="" asp-append-version="true">a<a>
```
枚举绑定
```csharp
<select asp-for="EnumCountry"asp-items="Html.GetEnumSelectList<CountryEnum>()"> </select> 
或者
<select asp-for="EmployeeId" asp-items="@(new SelectList(Model.peopleList ,"Id","FullName"))"> <option>Please select one</option> </select>
```
枚举
```csharp
 public enum CountryEnum
    {
       [Display(Name = "United Mexican States")]
       Mexico,
       [Display(Name = "United States of America")]
        USA,
       Canada,
       France,
       Germany,
        Spain
    }
```
下拉列表
```csharp
前端：
<select asp-items="@(new SelectList(ViewBag.TypeList,"Id","name"))">
</select>
后端：ViewBag.TypeList赋值
```
