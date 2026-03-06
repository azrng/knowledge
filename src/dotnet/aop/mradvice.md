---
title: MrAdvice
lang: zh-CN
date: 2022-05-30
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: mradvice
slug: qqambk
docsId: '77443029'
---
> 最后更新时间：2022年5月30日


## 介绍
Mr. Advice 是 PostSharp 的开源（免费）替代品。
下载量：394k

## 操作

### 简单操作
创建特性
```csharp
public class MyProudAdvice : Attribute, IMethodAdvice
{
    public void Advise(MethodAdviceContext context)
    {
        // do things you want here
        context.Proceed(); // this calls the original method
        // do other things here
    }
}
```
在需要使用的地方标注
```csharp
[MyProudAdvice]
public void MyProudMethod()
{
}
```

## 资料
官网：[https://www.postsharp.net/](https://www.postsharp.net/)
github：[https://github.com/ArxOne/MrAdvice](https://github.com/ArxOne/MrAdvice)
