---
title: 运算符
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 运算符
---

## 运算符重载

在构建自己类型的时候，应该始终考虑是否可以用于运算符重载，比如下面的实例

```csharp
{
    var mikeIncome = new Salary { RMB = 10 };
    var roseIncome = new Salary { RMB = 20 };
    var familyIncome = Salary.Add(mikeIncome, roseIncome);
}

// 经过运算符重载

{
    var mikeIncome = new Salary { RMB = 10 };
    var roseIncome = new Salary { RMB = 20 };
    var familyIncome = mikeIncome + roseIncome;
}


file class Salary
{
    public int RMB { get; set; }

    public static Salary Add(Salary a, Salary b)
    {
        a.RMB += b.RMB;
        return a;
    }

    public static Salary operator +(Salary a, Salary b)
    {
        a.RMB += b.RMB;
        return a;
    }
}
```

