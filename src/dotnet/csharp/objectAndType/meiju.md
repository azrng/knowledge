---
title: 枚举
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - enum
filename: meiju
slug: dyza2c
docsId: '49182360'
---

## 概述
枚举是一种特殊的值类型，可以在枚举类型中定义一组命令的数组常量。适合存储状态、类型等场景，比如性别、支付状态。

### 将0值作为枚举的默认值

允许使用的枚举类型有byte、sbyte、short、ushort、int、uint、long和ulong。应该始终将0值作为枚举类型的默认值。不过，这样做不是因为允许使用的枚举类型在声明时的默认值是0值，而是有工程上的意义。

## 操作

### 常见操作
c#枚举成员的类型模式是int类型，通过集成可以声明枚举成员为其它类型
```csharp
// 枚举转字符串
string foo = Days.Saturday.ToString(); // "Saturday"
string foo = Enum.GetName(typeof(Days), 6); // "Saturday"

// 字符串转枚举
Enum.TryParse("Tuesday", out Days bar); // true, bar = Days.Tuesday
(Days)Enum.Parse(typeof(Days), "Tuesday"); // Days.Tuesday

// 枚举转数字
byte foo = (byte)Days.Monday; // 1

// 数字转枚举
Days foo = (Days)2; // Days.Tuesday

// 获取枚举所属的数字类型
Type foo = Enum.GetUnderlyingType(typeof(Days))); // System.Byte

// 获取所有的枚举成员
Array foo = Enum.GetValues(typeof(MyEnum);

// 获取所有枚举成员的字段名
string[] foo = Enum.GetNames(typeof(Days));
```
> 来自：[https://mp.weixin.qq.com/s/5JLCO3mmz1zZcITtMNPnBw](https://mp.weixin.qq.com/s/5JLCO3mmz1zZcITtMNPnBw)


### 基础定义
默认情况下每个枚举都对应一个整数，如果不自定义，那么枚举成员自动从0开始进行常量赋值
```csharp
public enum MobileTypeEnum
{
    None,
    HuaWei,
    XiaoMi,
    YiJia,
    MeiZu
}

private static void Main(string[] args)
{
    foreach (var item in Enum.GetValues(typeof(MobileTypeEnum)))
    {
        Console.WriteLine($"枚举信息： name:{item}  value:{(int)item} ");
    }
}
```
![image.png](/common/1626531299085-a2f02c7a-b29e-4616-8e1b-8cc1216c5260.png)

### 显式指定枚举值
```csharp
public enum MobileTypeEnum
{
    None = 0,
    HuaWei = 1,
    XiaoMi = 2,
    YiJia = 4,
    MeiZu = 8
}
```
![image.png](/common/1626531347136-1c2a7353-8ad2-4475-91d2-3750bfa7c3a6.png)
如果指定某一个成员为指定值，那么在该成员后的值会在显式指定值的基础上递增。

### 获取描述信息
```csharp
[Flags]
public enum MobileTypeEnum
{
    [Description("未选择")]
    None = 0,

    [Description("华为")]
    HuaWei = 1,

    [Description("小米")]
    XiaoMi = 2,

    [Description("一加")]
    YiJia = 4,

    [Description("魅族")]
    MeiZu = 8
}

private static void Main(string[] args)
{
    var myMobile = MobileTypeEnum.HuaWei;

    var description = string.Empty;
    var fieldInfo = myMobile.GetType().GetField(myMobile.ToString());
    if (fieldInfo != null)
    {
        var infos = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);
        if (infos.Length == 0)
        {
            description = myMobile.ToString();
        }
        else
        {
            var des = (DescriptionAttribute)infos[0];
            description = des.Description;
        }
    }
    Console.WriteLine(description);//华为
}
```
扩展类
```csharp
static class EnumExtensions
{
    public static string GetDescription(this Enum val)
    {
        var field = val.GetType().GetField(val.ToString());
        var customAttribute = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute));
        if (customAttribute == null) { return val.ToString(); }
        else { return ((DescriptionAttribute)customAttribute).Description; }
    }
}
```

### 替代默认类型
C#枚举成员的类型默认是 int 类型，通过继承可以声明枚举成员指定其他整数类型代替默认类型，例如：byte、sbyte、short、ushort、int、uint、long、ulong
```csharp
public enum MobileTypeEnum : long
{
    None,HuaWei,XiaoMi,YiJia,MeiZu
}

public enum MobileTypeEnum : byte
{
    None,HuaWei,XiaoMi,YiJia,MeiZu
}
```

### 枚举类型转换
枚举的实例可以和相对应的整数类型相互显式转换
```csharp
public enum MobileTypeEnum
{
    None = 0,
    HuaWei = 1,
    XiaoMi = 2,
    YiJia = 4,
    MeiZu = 8
}

var mobile = (int)MobileTypeEnum.HuaWei;// 1
var mobileType = (MobileTypeEnum)mobile;// HuaWei

var mobileType2 = (MobileTypeEnum)1024;// 1024
```
也可以将一个枚举类型转换为另一个(通过对应的数值进行转换).
```csharp
public enum MobileTypeEnum
{
    None = 0,
    HuaWei = 1,
    XiaoMi = 2,
    YiJia = 4,
    MeiZu = 8
}

public enum ChatAppEnum
{
    None = 0,
    WeChat = 1,
    QQ = 2,
    FeiXin = 4
}


var mobile = (int)MobileTypeEnum.HuaWei;// 1
ChatAppEnum chat = (ChatAppEnum)(int)mobile;// WeChat
```

### 枚举特殊值
0在枚举中是一个特殊的值，它经常作为作为第一个枚举成员的默认值，表示枚举的默认值
```csharp
MobileTypeEnum defaultValue = 0;
```

### 标志枚举类型
枚举成员之间可以进行合并，合并的枚举类型成员需要显示指定值(不是必须，不过为了避免混淆)
```csharp
[Flags]
public enum MobileTypeEnum
{
    None = 0,
    HuaWei = 1,
    XiaoMi = 2,
    YiJia = 4,
    MeiZu = 8
}
```
场景：在选择手机页面选择你使用过的手机型号，这个时候是多选的操作，存储数据库的时候一个字段存不了，这时候我们可以存储枚举的位运算，而不需要单独建表，下面我们就展示选择huawei、yijia两个枚举值，并且在复显的时候选中
```csharp
[Flags]
public enum MobileTypeEnum
{
	None = 0,
	HuaWei = 1,
	XiaoMi = 2,
	YiJia = 4,
	MeiZu = 8
}
private static void Main(string[] args)
{
	// 选中的手机型号
	var myMobile = MobileTypeEnum.HuaWei | MobileTypeEnum.YiJia;// HuaWei| YiJia
	// 选择多个手机牌子
	var myTest = (int)MobileTypeEnum.HuaWei | (int)MobileTypeEnum.HuaWei | (int)MobileTypeEnum.XiaoMi;// 3
	// 是否包含
	var exist = myMobile.HasFlag(MobileTypeEnum.HuaWei);// true 
	// 选中的则显示对应枚举值
	var isSelected = MobileTypeEnum.HuaWei & myMoblie;// HuaWei
	// 未选中则显示默认值
	var isSelected2 = MobileTypeEnum.XiaoMi & myMoblie;// None
 	// 将值转字符串
	var myMobileName = myMobile.ToString();//HuaWei, YiJia

	var show = new List<int>();
	foreach (var item in Enum.GetValues(typeof(MobileTypeEnum)))
	{
		show.Add((int)item & (int)myMobile);
	}
	show = show.Where(t => t > 0).ToList();// 1  4
}
```
> 如果一个枚举成员多次逻辑或(|)另一个枚举值，那么只会生效一次

数据库中查询包含某一个手机的数据
```sql
-- 查询选择HuaWei手机的数据
select * from user where mymobile & 1;

-- 查询选择话HuaWei和MeiZu手机的数据
select * from user where mymobile & 9 = 9;
```
上面介绍了 | 和 &，还有两个感觉应该也常用，那就是 |= 和 ^=
```csharp
// 选中的手机型号 HuaWei| YiJia
var myMoblie = MobileTypeEnum.HuaWei | MobileTypeEnum.YiJia;
// HuaWei, YiJia
Console.WriteLine(myMoblie.ToString());
// myMoblie = myMoblie | MobileTypeEnum.XiaoMi;  在原来的位运算基础上增加选项 
myMoblie |= MobileTypeEnum.XiaoMi;
// HuaWei, XiaoMi, YiJia
Console.WriteLine(myMoblie.ToString());

// myMoblie = myMoblie ^ MobileTypeEnum.YiJia;  在原来的位运算基础上去除选项
myMoblie ^= MobileTypeEnum.YiJia; 
// HuaWei, XiaoMi
Console.WriteLine(myMoblie.ToString());

//如果将0去 ^ 会出现问题
```
关于是否需要在枚举上加flags特性，其实不加也可以使用位运算等合并，那么加的意义是什么？来将上面MobileTypeEnum枚举特性去掉
```csharp
public enum MobileTypeEnum
{
    None = 0,
    HuaWei = 1,
    XiaoMi = 2,
    YiJia = 4,
    MeiZu = 8
}
```
运行看输出结果一下
```csharp
5
7
3
```
也就是说如果不加flags特性，那么在调用ToString方法时候，会输出一个数值而不是一组名称。

### 枚举运算法
枚举可用的运算符有  
![image.png](/common/1626537743642-13dbe621-1e63-419a-83de-e69187b42a9e.png)  
枚举类型可以和整数类型之间做加法，但是两个枚举类型之间不能做加法
```csharp
var aa = (int)MobileTypeEnum.HuaWei | (int)MobileTypeEnum.HuaWei | (int)MobileTypeEnum.XiaoMi;// 3
var ee = aa ^ (int)MobileTypeEnum.XiaoMi; // 1
var bb = 0 | (int)MobileTypeEnum.XiaoMi;// 2
var cc = 0 ^ (int)MobileTypeEnum.XiaoMi;// 2
```

### 类型安全性
因为枚举和整数类型可以相互转换，因此枚举的真实值可能超过枚举类型成员的数值范围，会产生非法值
```csharp
var myMoblie = (MobileTypeEnum)1024;// 1024
```
在有些时候该情况可能会导致系统出现异常，那么如果判断枚举的值是否是成员定义的范围内?
使用IsDefined判断给定的数值或者名称是否在指定枚举中，不过位运算值不起作用
```csharp
var myMoblie = (MobileTypeEnum)1024;// 1024
var verify1 = Enum.IsDefined(typeof(MobileTypeEnum), myMoblie);// false

var verify2 = Enum.IsDefined(typeof(MobileTypeEnum), MobileTypeEnum.YiJia);// true

var verify3 = Enum.IsDefined(typeof(MobileTypeEnum), MobileTypeEnum.HuaWei | MobileTypeEnum.MeiZu);// false
```
使用ToString方法
```csharp
var myMobile2 = MobileTypeEnum.HuaWei | MobileTypeEnum.MeiZu;
var verify4 = IsFlagDefined(myMobile2);// true

public static bool IsFlagDefined(Enum e)
{
    return !decimal.TryParse(e.ToString(), out _);
}
```

## 组件

智能枚举：https://github.com/PawelGerr/Thinktecture.Runtime.Extensions/wiki/Smart-Enums
