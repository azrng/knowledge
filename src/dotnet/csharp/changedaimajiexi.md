---
title: 单个代码解析
lang: zh-CN
date: 2023-11-17
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: changedaimajiexi
slug: czyzbh
docsId: '30978113'
---

#### 获取IP地址
```sql
Request.UserHostAddress.ToString();
// 或者
string userip = "";
if (Context.Request.ServerVariables["HTTP_VIA"] != null)
{
	userip = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
}
else
{
	userip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
}
```

#### 将字符串转为指定类型的实例
```csharp
public static T GetValue<T>(string value)
{
    return (T)Convert.ChangeType(value, typeof(T));
}
```

#### == 和 equals
对于值类型，这两种都是比较的数值内容是否相等。
对于引用类型，比较的是引用的“地址”是否相同。
通过源码查看，==调用的是equals，所以这两个是同样的效果，可以相互替换。
所以这也就是当我们在比较String类型时、不同的引用、数值一样、Equals与==返回的结果一致、相同、所以在进行String类型判断这两个方法内部本质是相同的、当然String类型是一个特例。c## 有运算符重载 语法，字符串 == 被重写为Equals,而Equals里边实际上是比较字符串的值
总结：Equals比较的永远是变量的内容是否相同，而= =比较的则是引用地址是否相同(前提:此种类型内部没有对Equals 或= = 进行重写操作，否则输出可能会有不同)
> 引用地址：[https://www.cnblogs.com/ChenBigBao/p/14807569.html](https://www.cnblogs.com/ChenBigBao/p/14807569.html)


#### ref和out区别
1、使用ref型参数时，传入的参数必须先被初始化。对out而言，必须在方法中对其完成初始化。
2、使用ref和out时，在方法的参数和执行方法时，都要加Ref或Out关键字。以满足匹配。
3、out适合用在需要retrun多个返回值的地方，而ref则用在需要被调用的方法修改调用者的引用的时候。
