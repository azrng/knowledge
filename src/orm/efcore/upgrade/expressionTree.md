---
title: 表达式树
lang: zh-CN
date: 2023-08-13
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 表达式树
  - efcore
filename: expressionTree
docsId: 'c7c29acc-ab67-4a43-9d8b-4b6484de167b'
---

## 查看表达式树的Ast

借助组件ExpressionTreeToString可以查看表达式树生成的AST

```c#
Expression<Func<Book, bool>>e=b =>b.AuthorName.Contains("测试")||b.Price>30;Console.WriteLine(e.ToString("Object notation","C#"));
```

> 该方法学习自杨老师教程