---
title: T4语法
lang: zh-CN
date: 2022-01-26
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: t4yufa
slug: qbmsln
docsId: '29634896'
---
## 指令

```
<#@ 指令  属性=“值” #>模式
```


## 模板指令
```
<#@ template debug="false" hostspecific="false" language="C#"#> 
```
解释：不可以调试，不提供host这几个属性，使用c#语言，完整模式是：
```
<#@ template [language="VB"] [compilerOptions="options"] [culture="code"] [debug="true"] [hostspecific="true"] [inherits="templateBaseClass"] [visibility="internal"] [linePragmas="false"] #>
```

## 程序集指令
```
<#@ assembly name="System.Core"#>
```
作用类似于在vs项目中添加程序集引用。

## 导入指令
```
<#@ import namespace="System.Linq"#> 
等效于c#中的“using System.Linq”.
```

## 输出指令

```
<#@ output extension=".txt" #>
告诉我们T4模板最终将生产.txt对应后缀的文件
<# 标准控制块 #> 可以包含语句。
<#= 表达式控制块 #> 可以包含表达式。
<#+ 类特征控制块 #> 可以包含方法、字段和属性，就像一个类的内部
```


## 标准控制块
```
<#  
    for(int i = 0; i < 4; i++)  
    {  
#>  
Hello!  
<#  
    }   
#>
```

## 表达式控制块
```
<#= 2 + 3 #>  
```

## 类功能控制块
```
<#+ 
    public string name="张三";
    public string sex="1";
    public string province="河南省";
    public string city="焦作市";

    public string SelfIntroduction(int i)
    {
        return "自我介绍"+(i+1).ToString()+"次，我的名字是"+name+",所在地是"+province;
    }
#>

```

 

