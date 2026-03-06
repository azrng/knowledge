---
title: 格式化设置
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 006
category:
  - Visual Studio
tag:
  - 无
filename: geshihuashezhi
---

## 前言
群里朋友说.Net8出来预览版了，让我更新一下Vs到最新版(预览版 17.6.0 Preview 1.0)，尝鲜.Net8的功能，然后突然就发现格式化的样式变化了(和VS有关)，很不习惯，经过摸索后改了回去，下面来简单操作介绍如何还原回去(有点想吐槽)。

## 操作
在预览版最新版本的Vs中，格式化一个类是这样子的
```csharp
namespace ClassLibrary {

    public class Class1 {

        public int Sum(int a, int b) {
            return a + b;
        }
    }
}
```
当我使用老版本VS(17.4.5)打开格式化后样式是这样子的
```csharp
namespace ClassLibrary
{
    public class Class1
    {
        public int Sum(int a, int b)
        {
            return a + b;
        }
    }
}
```
这才是我们熟悉的格式化样式，那么如何还原那？

打开工具=>选项=>文本编辑器=>C#=>代码样式=>格式设置=>新行，如图<br />![image.png](/common/1677146027579-0a5e138b-c6ba-4939-aae7-d0579ec3bbde.png)<br />将这些选择框都勾选中就可以了，当你设置的时候下面还可以出来预览的效果图。
