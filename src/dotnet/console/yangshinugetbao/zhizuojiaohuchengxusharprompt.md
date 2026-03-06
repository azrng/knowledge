---
title: 制作交互程序Sharprompt
lang: zh-CN
date: 2023-08-07
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zhizuojiaohuchengxusharprompt
slug: ap1v3s
docsId: '57282790'
---

## 介绍
Sharprompt是一个基于C#的交互式命令行应用框架，具有如下特点：

- 多平台支持
- 支持常用的提示方式（普通输入/密码/选择项等）
- 支持基于模型的提示（预览中）
- 输入值的验证
- 使用枚举值自动生成数据源
- 可定制的符号和颜色模式
- Unicode 支持（多字节字符和表情符号😀🎉）

## 常用API
Prompt.Input
简单的输入提示，返回指定类型数据
Prompt.Password
输入密码提示
Prompt.Confirm
确认提示，返回bool值
Prompt.Select
单选提示
Prompt.ColorSchema
指定配色方案
> 更多API说明请参看官方文档：https://github.com/shibayan/Sharprompt


## 示例
```csharp
Console.OutputEncoding = Encoding.UTF8;

Prompt.ColorSchema.Select = ConsoleColor.DarkCyan;
var type = Prompt.Select("数据库类型", new[] { "Oracle", "SQL Server", "MySQL", "PostgreSQL", "MariaDB" },defaultValue: "MySQL", pageSize: 3);

var server = Prompt.Input<string>("服务地址");

Prompt.ColorSchema.Answer = ConsoleColor.DarkRed;

var name = Prompt.Input<string>("用户名");

var password = Prompt.Password("密码");

Console.WriteLine($"你输入的是 {type} {server} {name} {password}");

var confirm = Prompt.Confirm("继续吗");
Console.WriteLine($"你的选择是 {confirm}!");
```
