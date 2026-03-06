---
title: Parameter count mismatch
lang: zh-CN
date: 2021-05-17
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: parametercountmismatch
slug: mggguh
docsId: '32068348'
---
通过反射添加的时候提示Parameter count mismatch错误，需要将传入的T限制约束为class,new()
```csharp
 protected void HandleAdd<TIn, TOut>(Func<int, List<TOut>> func, bool IsGuobaOne = true) where TIn : IdentityEntityBase
            where TOut : class, new()
        {
            var page = GetPageNumber<TIn>(IsGuobaOne);
            for (int i = 1; i <= page; i++)
            {
                var data = (List<TOut>)func.Invoke(i);
                var result = youluDb.Insertable(data).ExecuteCommand();
                Console.WriteLine($"导入{nameof(TOut)}  {result > 0}成功:失败");
            }
        }
```
