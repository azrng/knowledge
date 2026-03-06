---
title: string
lang: zh-CN
date: 2023-10-30
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - string
---

## 概述
字符串是一个引用类型，但是经常和值类型一起出现，比如作为类的属性等，默认值为null。


## 字符串null值处理
在c#11 的时候引入了可为null的声明符号也就是问号?，启用之后IDE会给没有处理但是可能为null的情况提示警告，如果你就是想允许为null值，那么就需要声明为比如string?类型，然后在你使用的时候比如ToUpper的时候会有警告提示。

当你认为有个东西属性肯定不为null的时候，你可以通过使用关键字Required来处理，例如
```csharp
public required string FirstName { get; set; }

public required string LastName { get; set; }
```

[https://cat.aiursoft.cn/post/2023/7/18/say-goodbye-to-string-null-reference-exceptions-with-csharps-required-keyword](https://cat.aiursoft.cn/post/2023/7/18/say-goodbye-to-string-null-reference-exceptions-with-csharps-required-keyword) | C## required：跟 string 的空引用异常说再见 - kitlau's blog

## 逐子字符串
在普通字符串中，反斜杠字符是转义字符。而在逐字字符串（Verbatim Strings）中，字符将被编程器按照原义进行解释。使用逐字字符串只需在字符串前面加上 @ 符号。
```csharp
// 逐字字符串：转义符
var filename = @"c:\temp\newfile.txt";
Console.WriteLine(filenaame);

// 逐字字符串：多行文本
var multiLine = @"This is a
multiline paragraph.";
Console.WriteLine(multiLine);

// 非逐字字符串
var escapedFilename = "c:\temp\newfile.txt";
Console.WriteLine(escapedFilename);
```
> 逐字字符串中唯一不被原样解释的字符是双引号。由于双引号是定义字符串的关键字符，所以在逐字字符串中要表达双引号需要用双引号进行转义。


## 类型转换
```csharp
var str = "字符串和byte数组相互转换";
byte[] bytes = System.Text.Encoding.Default.GetBytes(str);
var str2 = System.Text.Encoding.Default.GetString(bytes);
```

## 比较

### 大小写
使用.NET进行开发时，请遵循以下简要建议比较字符串：

- 使用为字符串操作显式指定字符串比较规则的重载。通常情况下，这涉及调用具有StringComparison类型的参数的方法重载。
- 使用StringComparison.Ordinal或StringComparison.OrdinalIgnoreCase进行比较，并以此作为匹配区域性不明确的字符串的安全默认设置。
- 将比较与StringComparison.Ordinal或StringComparison.OrdinalIgnoreCase配合使用，以获得更好的性能。
- 向用户显示输出时，使用基于StringComparison.CurrentCulture的字符串操作。
- 当进行与语言（例如，符号）无关的比较时，使用非语言的StringComparison.Ordinal或StringComparison.OrdinalIgnoreCase值，而不使用基于CultureInfo.InvariantCulture的字符串操作。
- 在规范化要比较的字符串时，使用String.ToUpperInvariant方法而非String.ToLowerInvariant方法。
- 使用String.Equals方法的重载来测试两个字符串是否相等。
- 使用String.Compare和String.CompareTo方法可对字符串进行排序，而不是检查字符串是否相等。
- 在用户界面，使用区分区域性的格式显示非字符串数据，如数字和日期。使用格式以固定区域性使非字符串数据显示为字符串形式。

比较字符串时，请避免采用以下做法：

- 不要使用未显式或隐式为字符串操作指定字符串比较规则的重载。
- 在大多数情况下，不要使用基于StringComparison.InvariantCulture的字符串操作。其中的一个少数例外情况是，保存在语言上有意义但区域性不明确的数据。
- 不要使用String.Compare或CompareTo方法的重载和用于确定两个字符串是否相等的返回值为0的测试。

StringComparison枚举成员

| StringComparison 成员 | 描述 |
| --- | --- |
| CurrentCulture | 使用当前区域性执行区分大小写的比较。 |
| CurrentCultureIgnoreCase | 使用当前区域性执行不区分大小写的比较。 |
| InvariantCulture | 使用固定区域性执行区分大小写的比较。 |
| InvariantCultureIgnoreCase | 使用固定区域性执行不区分大小写的比较。 |
| Ordinal | 执行序号比较。 |
| OrdinalIgnoreCase | 执行不区分大小写的序号比较。 |

```csharp
bool result = root.Equals(root2, StringComparison.OrdinalIgnoreCase);
```

### Compare
使用场景：比较两个字符串，并且返回一个整数，这个整数指示它在排序的相对位置。
```csharp
string a = "abcde";
string b = "a";
Console.WriteLine(String.Compare(b, a));
```

## StringBuilder

```csharp
var sb = new StringBuilder();
// 追加内容
sb.Append("hello!");
sb.Dump();

// 替换指定值
sb.Replace("ll", "LL");
sb.Dump();

// 移出只能位置值（移出最侯的!）
sb.Remove(sb.Length - 1, 1);
sb.Dump();

// 追加内容 指定字符并指定要追加几个
sb.Append('w', 5);
sb.Dump();

// 转字符串 设置哪一部分转字符串
sb.ToString(0, 5).Dump();
```

### 字符串拼接

string是不变类，使用 `+` 操作连接字符串将会导致创建一个新的字符串。如果字符串连接次数不是固定的，例如在一个循环中，则应该使用 StringBuilder 类来做字符串连接工作。因为 StringBuilder 内部有一个 StringBuffer ，连接操作不会每次分配新的字符串空间。只有当连接后的字符串超出 Buffer 大小时(默认分配长度为16)，才会申请新的 Buffer 空间。典型代码如下：

```c#
StringBuilder sb = new StringBuilder(256);
for (int i = 0; i < Results.Count; i++)
{
	sb.Append(Results[i]);
}
```

如果连接次数是固定的并且只有几次，此时应该直接用`+`号连接，保持程序简洁易读。实际上，编译器已经做了优化，会依据加号次数调用不同参数个数的 String.Concat 方法。例如：

```c#
string str = str1 + str2 + str3 + str4;
```

会被编译为 String.Concat(str1, str2, str3, str4)。该方法内部会计算总的 String 长度，仅分配一次，并不会如通常想象的那样分配三次。作为一个经验值，当字符串连接操作达到 10 次以上时，则应该使用 StringBuilder。



这里有一个细节应注意：StringBuilder 内部默认长度为 16 ，这个值实在太小。按 StringBuilder 的使用场景，肯定得重新分配。经验值一般用 256 作为初值。当然，如果能计算出最终生成字符串长度的话，则应该按这个值来设定初始长度。使用 new StringBuilder(256) 就将初始长度设为了256。

## 函数

### Split

用于根据某个内容分割字符串

```csharp
var message = "Hello, C# string";

// 根据指定内容分割 值为两个
message.Split(", ").Dump();

// 根据空格分割 且只分割两个
message.Split(" ", 2).Dump();

// 根据c#分割并且去除空格
message.Split("C#", StringSplitOptions.TrimEntries).Dump();

message = "1 2  4  5";
// 根据空格分割并去除控制 值为4个
message.Split(" ", StringSplitOptions.RemoveEmptyEntries).Dump();
```

### Join

将数组中的字符串拼接成一个字符串
```csharp
var parts = new[] { "Foo", "Bar", "Fizz", "Buzz"};
var joined = string.Join(", ", parts);
// joined = "Foo, Bar, Fizz, Buzz"
```
以下四种方式都可以达到相同的字符串拼接的目的：
```csharp
string first = "Hello";
string second = "World";
string foo = first + " " + second;
string foo = string.Concat(first, " ", second);
string foo = string.Format("{0} {1}", firstname, lastname);
string foo = $"{firstname} {lastname}";
```

string.Format方法在内部使用StringBuilder进行字符串的格式化，如下面的示例

```csharp
var a = "t";
var b = "e";
var c = "s";
var d = "t";
var f = string.Format("{0}{1}{2}{3}", a, b, c, d);
```

#### 字符串内插法

```csharp
var name = "World";
var str =$"Hello, {name}!"; // 输出：Hello, World!
```

#### FormattableString
是抽象类，在使用 FormattableString 时，可以通过使用 $ 符号前缀来创建一个可格式化字符串。目前我只见过他用于处理SQL拼接的参数化查询操作中

一个主要注意的示例
```csharp
using Dumpify;

var name = "张三";
var str = $"hello word {name}";

Test($"{str}");
Console.WriteLine("------");
Test($"hello word {name}");

// FormattableString
static string Test(FormattableString formattableString)
{
    // 文本值
    formattableString.Format.Dump();
    // 参数
    formattableString.GetArguments().Dump();
    return "ok";
}

--- 输出 ---
"{0}"
┌───┬───────────────────┐
│ ## │ object[1]         │
├───┼───────────────────┤
│ 0 │ "hello word 张三" │
└───┴───────────────────┘

------           
"hello word {0}" 
┌───┬───────────┐
│ ## │ object[1] │
├───┼───────────┤
│ 0 │ "张三"    │
└───┴───────────┘
```

### Trim
使用场景：去除前后空格、字符等操作
```csharp
var aa = ",,123456,,";
var bb = aa.Trim(',');// 123456
var cc = aa.TrimEnd(',');// ,,123456
var dd = aa.TrimStart(',');// 123456,,
```
有些情况下空格就是去不掉，这时候可以用一个正则强制去掉的方案
```csharp
string mStr= Regex.Replace( str, @"\s", "" );
```

### IndexOf

- IndexOf() 可查找字符或字符串在另一个字符串中第一次出现的位置，找不到返回-1。
- LastIndexOf() 返回字符或字符串在另一个字符串中最后出现的位置。
- IndexOfAny() 返回在另一个字符串内首次出现 char 数组的位置。

使用代码来找字符串中左括号和右括号的位置
```csharp
string message = "Find what is (inside the parentheses)";

int openingPosition = message.IndexOf('(');
int closingPosition = message.IndexOf(')');

Console.WriteLine(openingPosition);
Console.WriteLine(closingPosition);
```

#### 忽略大小写查询出现的位置
忽略大小写然后检索字符串b在字符串a中第一次出现的位置
```csharp
CompareInfo Compare = CultureInfo.CurrentUICulture.CompareInfo;
string a = "AaasasaAAaasaabbb";
string b = "bb";
Console.WriteLine(Compare.IndexOf(a, b, CompareOptions.IgnoreCase));
```

#### 查询字符串在另一个字符串出现的位置和次数
我们首先定义了一个字符串 str 和一个要查找的字符串 searchTerm。然后，我们定义了一个计数器 count 和一个变量 index，用于存储每次找到的字符串的位置。接下来，我们使用一个 while 循环来依次查找每个字符串，每找到一次就将计数器加1，并输出该字符串在原始字符串中的位置。最后，我们输出该字符串在原始字符串中出现的次数。注意，在每次调用 IndexOf 方法时，我们传递了参数 index + 1，这是为了从上次找到的位置之后继续查找，以避免重复计数。
```csharp
string str = "This is a sample string. This string contains the word string multiple times.";
string searchTerm = "string";
int count = 0;
int index = -1;

while ((index = str.IndexOf(searchTerm, index + 1)) != -1)
{
    count++;
    Console.WriteLine("'{0}' found at position {1}", searchTerm, index);
}

Console.WriteLine("'{0}' appears {1} times in the string.", searchTerm, count);
```

### Substring
通过使用起始位置和可选的长度参数，Substring() 只返回字符串的指定部分。
检索或者截取指定位置的值
```csharp
string message = "Find what is (inside the parentheses)";

int openingPosition = message.IndexOf('(');
int closingPosition = message.IndexOf(')');

// Console.WriteLine(openingPosition);
// Console.WriteLine(closingPosition);

int length = closingPosition - openingPosition;
Console.WriteLine(message.Substring(openingPosition, length));//(inside the parentheses
```

### Remove
```csharp
string data = "12345John Smith          5000  3  ";
string updatedData = data.Remove(5, 20);
Console.WriteLine(updatedData);//123455000  3
```
Remove() 方法的原理与 Substring() 方法类似。 要从字符串中删除这些字符，你需要提供起点和长度。

### Replace
需要将一个或多个字符替换为其他字符（或无字符）时，可以使用 Replace() 方法。
```csharp
string message = "This--is--ex-amp-le--da-ta";
message = message.Replace("--", " ");
message = message.Replace("-", "");
Console.WriteLine(message);//This is example data
```

### 填充和对齐
填充
PadLeft() 方法将在字符串左侧添加空格，使字符总数等于你发送的参数，若要在字符串右侧添加空格或字符，请改用 PadRight() 方法。
```csharp
string input = "Pad this";
Console.WriteLine(input.PadLeft(12));
Console.WriteLine(input.PadRight(12));

// 使用重载方法替换为其他值
Console.WriteLine(input.PadLeft(12, '-'));
Console.WriteLine(input.PadRight(12, '-'));
```
或者使用new一个string对象来生成重复字符串
```csharp
var str=new string('*',5);//*****
```
补齐
```csharp
var number = 42;

// 向左补齐
var str = $"The answer to life, the universe and everything is {number, 5}.";
// str = "The answer to life, the universe and everything is ___42." ('_'表示空格)

// 向右补齐
var str = $"The answer to life, the universe and everything is ${number, -5}.";
// str = "The answer to life, the universe and everything is 42___."
```

### 格式化

#### 格式化货币
**（跟系统的环境有关，中文系统默认格式化人民币，英文系统格式化美元）**
string.Format("{0:C}",0.2) 结果为：￥0.20 （英文操作系统结果：$0.20）
默认格式化小数点后面保留两位小数，如果需要保留一位或者更多，可以指定位数 
string.Format("{0:C1}",23.15) 结果为：￥23.2 （截取会自动四舍五入）
格式化多个Object实例 
string.Format("市场价：{0:C}，优惠价{1:C}",23.15,19.82)

```csharp
decimal price = 123.45m;
int discount = 50;
Console.WriteLine($"Price: {price:C} (Save {discount:C})"); //Price: ¤123.45 (Save ¤50.00)
```
> 使用 ¤ 符号，而不是国家/地区的货币符号。 这是用于在任何货币类型下表示“货币”的通用符号。 在 .NET 编辑器中显示此符号，因为此符号会忽略当前位置。


#### 格式化数字
典型的的格式化方法为：
```csharp
string.Format("{index[:format]}", number)
```
可使用“0”和“#”占位符进行补位。“0” 表示位数不够位数就补充“0”，小数部分如果位数多了则会四舍五入；“#”表示占位，用于辅助“0”进行补位。
标准格式化用法：
```csharp
// “0”描述：占位符，如果可能，填充位
string.Format("{0:000000}",1234); // 结果：001234

// “#”描述：占位符，如果可能，填充位
string.Format("{0:######}",1234);  // 结果：1234
string.Format("{0:#0####}",1234);  // 结果：01234
string.Format("{0:0#0####}",1234); // 结果：0001234

// "."描述：小数点
string.Format("{0:000.000}", 1234);       // 结果：1234.000
string.Format("{0:000.000}", 4321.12543); // 结果：4321.125

// ","描述：千分表示
string.Format("{0:0,0}", 1234567);   //结果：1,234,567

// "%"描述：格式化为百分数
string.Format("{0:0%}",1234);        // 结果：123400%
string.Format("{0:#%}", 1234.125);   // 结果：123413%
string.Format("{0:0.00%}",1234);     // 结果：123400.00%
string.Format("{0:#.00%}",1234.125); // 结果：123412.50%
```
内置快捷字母格式化用法：
```csharp
// E-科学计数法表示
(25000).ToString("E"); // 结果：2.500000E+004

// C-货币表示，带有逗号分隔符，默认小数点后保留两位，四舍五入
(2.5).ToString("C"); // 结果：￥2.50

// D[length]-十进制数
(25).ToString("D5"); // 结果：00025

// F[precision]-浮点数，保留小数位数(五舍五+入) 也可以小写f2 
(25).ToString("F2"); // 结果：25.00 
(25.005).ToString("F2"); // 结果：25.00 
(25.0051).ToString("F2"); // 结果：25.01 


// G[digits]-常规，保留指定位数的有效数字，四舍五入
(2.52).ToString("G2"); // 结果：2.5

// N-带有逗号分隔符，默认小数点后保留两位，四舍五入
(2500000).ToString("N"); // 结果：2,500,000.00

// X-十六进制，非整型将产生格式异常
(255).ToString("X"); // 结果：FF
```
ToString 也可以自定义补零格式化：
```csharp
(15).ToString("000");              // 结果：015
(15).ToString("value is 0");       // 结果：value is 15

// 0.00 四舍五入，不足进行补0
(10.456).ToString("0.00");         // 结果：10.46 
(10.455).ToString("0.00");         // 结果：10.46 

(10.456).ToString("00");           // 结果：10
(10.456).ToString("value is 0.0"); // 结果：value is 10.5
```
转换为二进制、八进制、十六进制输出：
```csharp
int number = 15;
Convert.ToString(number, 2);  // 结果：1111
Convert.ToString(number, 8);  // 结果：17
Convert.ToString(number, 16); // 结果：f
```

#### 用分号隔开的数字，并指定小数点后的位数
string.Format("{0:N}", 14200) 结果为：14,200.00  （默认为小数点后面两位）
string.Format("{0:N3}", 14200.2458) 结果为：14,200.246 （自动四舍五入）

#### 格式化百分比
string.Format("{0:P}", 0.24583) 结果为：24.58% （默认保留百分的两位小数）
string.Format("{0:P1}", 0.24583) 结果为：24.6% （自动四舍五入）
```csharp
decimal tax = .36785m;
Console.WriteLine($"Tax rate: {tax:P2}");//Tax rate: 36.79 %
```

#### 零占位符和数字占位符
string.Format("{0:0000.00}", 12394.039) 结果为：12394.04
string.Format("{0:0000.00}", 194.039) 结果为：0194.04
string.Format("{0:###.##}", 12394.039) 结果为：12394.04
string.Format("{0:####.#}", 194.039) 结果为：194
ToString("0.#")  ToString("#.#")
下面的这段说明比较难理解，多测试一下实际的应用就可以明白了。 
零占位符： 
如果格式化的值在格式字符串中出现“0”的位置有一个数字，则此数字被复制到结果字符串中。小数点前最左边的“0”的位置和小数点后最右边的“0”的位置确定总在结果字符串中出现的数字范围。 
“00”说明符使得值被舍入到小数点前最近的数字，其中零位总被舍去。
数字占位符： 
如果格式化的值在格式字符串中出现“#”的位置有一个数字，则此数字被复制到结果字符串中。否则，结果字符串中的此位置不存储任何值。 
请注意，如果“0”不是有效数字，此说明符永不显示“0”字符，即使“0”是字符串中唯一的数字。如果“0”是所显示的数字中的有效数字，则显示“0”字符。 
“##”格式字符串使得值被舍入到小数点前最近的数字，其中零总被舍去。
PS：空格占位符
string.Format("{0,-50}", theObj);//格式化成50个字符，原字符左对齐，不足则补空格 
string.Format("{0,50}", theObj);//格式化成50个字符，原字符右对齐，不足则补空格

#### 日期格式化
string.Format("{0:d}",System.DateTime.Now) 结果为：2009-3-20 （月份位置不是03）
string.Format("{0:D}",System.DateTime.Now) 结果为：2009年3月20日
string.Format("{0:f}",System.DateTime.Now) 结果为：2009年3月20日 15:37
string.Format("{0:F}",System.DateTime.Now) 结果为：2009年3月20日 15:37:52
string.Format("{0:g}",System.DateTime.Now) 结果为：2009-3-20 15:38
string.Format("{0:G}",System.DateTime.Now) 结果为：2009-3-20 15:39:27
string.Format("{0:m}",System.DateTime.Now) 结果为：3月20日
string.Format("{0:t}",System.DateTime.Now) 结果为：15:41
string.Format("{0:T}",System.DateTime.Now) 结果为：15:41:50
```csharp
var date = DateTime.Now();
var str = $"Today is {date:yyyy-MM-dd}！";
```

#### 特殊格式化
12345.ToString("n"); //生成 12,345.00  
12345.ToString("C"); //生成 ￥12,345.00  
12345.ToString("e"); //生成 1.234500e+004  
12345.ToString("f4"); //生成 12345.0000  
12345.ToString("x"); //生成 3039 (16进制)  
12345.ToString("p"); //生成 1,234,500.00%  

### ToString

#### 固定小数位数格式

| **格式字符串** |           **说明**            |           **示例**           |     **输出结果**     |
| :------------: | :---------------------------: | :--------------------------: | :------------------: |
|     `0.0`      | 强制保留 1 位小数，末尾零显示 |    `3.1.ToString("0.0")`     |        `3.1`         |
|     `0.00`     | 强制保留 2 位小数，末尾零显示 |     `3.ToString("0.00")`     |        `3.00`        |
|    `0.000`     |       强制保留 3 位小数       |   `2.5.ToString("0.000")`    |       `2.500`        |
|    `0.0000`    |       强制保留 4 位小数       | `1.23456.ToString("0.0000")` | `1.2346`（四舍五入） |


#### 动态小数位数格式

| **格式字符串** |            **说明**            |         **示例**          | **输出结果** |
| :------------: | :----------------------------: | :-----------------------: | :----------: |
|     `0.##`     | 保留最多两位小数，末尾零不显示 |  `3.0.ToString("0.##")`   |     `3`      |
|    `0.###`     |        保留最多三位小数        | `2.501.ToString("0.###")` |   `2.501`    |
|     `0.0#`     |  保留至少 1 位小数，最多 2 位  |   `3.ToString("0.0#")`    |    `3.0`     |


#### 科学计数法与特殊格式

| **格式字符串** |         **说明**          |             **示例**              | **输出结果** |
| :------------: | :-----------------------: | :-------------------------------: | :----------: |
|    `0.0E+0`    | 科学计数法，保留 1 位小数 |   `12345.67.ToString("0.0E+0")`   |   `1.2E+4`   |
|   `0.00E+00`   | 科学计数法，保留 2 位小数 |  `0.00123.ToString("0.00E+00")`   |  `1.23E-03`  |
|   `0.000000`   |   固定小数位数（6 位）    | `0.12345678.ToString("0.000000")` |  `0.123457`  |


#### 千位分隔符与复合格式

| **格式字符串** |           **说明**           |            **示例**             |  **输出结果**  |
| :------------: | :--------------------------: | :-----------------------------: | :------------: |
|      `N0`      | 数字格式，无小数，千位分隔符 |    `1234567.ToString("N0")`     |  `1,234,567`   |
|      `N2`      |    数字格式，保留两位小数    |   `1234567.89.ToString("N2")`   | `1,234,567.89` |
|    `#,0.00`    |    千位分隔符 + 两位小数     | `1234567.89.ToString("#,0.00")` | `1,234,567.89` |


#### 百分比与货币格式

| **格式字符串** |                 **说明**                 |          **示例**          |       **输出结果**       |
| :------------: | :--------------------------------------: | :------------------------: | :----------------------: |
|    `0.00%`     |         百分比格式，保留两位小数         | `0.1234.ToString("0.00%")` |         `12.34%`         |
|      `C2`      | 货币格式，保留两位小数（受系统区域影响） |  `1234.56.ToString("C2")`  | `￥1,234.56`（中文环境） |
|      `C0`      |             货币格式，无小数             |  `1234.56.ToString("C0")`  |        `￥1,235`         |


#### 自定义格式规则

##### 截断而非四舍五入

```c#
// 截断到两位小数（需手动处理）
decimal value = 123.4567m;
string truncated = Math.Truncate(value * 100) / 100 
                   .ToString("0.00", CultureInfo.InvariantCulture);
// 输出 "123.45"
```

### 自定义格式化器

```csharp
public class CustomFormat : IFormatProvider, ICustomFormatter
{
    public string Format(string format, object arg, IFormatProvider formatProvider)
    {
        if (!this.Equals(formatProvider))
        {
            returnnull;
        }
        if (format == "Reverse")
        {
            returnstring.Join("", arg.ToString().Reverse());
        }
        return arg.ToString();
    }

    public object GetFormat(Type formatType)
    {
        return formatType == typeof(ICustomFormatter) ? this : null;
    }
}
```
使用自定义格式化器：
```csharp
String.Format(newCustomFormat(), "-> {0:Reverse} <-", "Hello World");
// 输出：-> dlroW olleH <-
```

### 字符串拘留池
在.NET中字符串是不可变对象，修改字符串变量的值会产生新的对象。为降低性能消耗及减小程序集大小，.NET提供了string interning的功能，直译过来就是字符串拘留。所谓的字符串拘留池(intern pool)其实是一张哈希表，键是字符串字面量，值是托管堆上字符串对象的引用。但若该表过大，则会对性能造成负面影响。在加载程序集时，不同版本的CLR对于是否留用程序集元数据中的字符串字面量（在编译时值已确定）不尽相同。但显式调用string.Intern方法则会将字符串字面量放入池中。
我们在给string类型变量分配字面量值时，CLR会先到字符串池中看下有没有完全相同的字符串（区分大小写），若有则返回对应的引用，若无，则创建新对象并添加到字符串池中返回引用。但若在运行时（如，使用new关键字）来给字符串变量分配值则不会使用字符串池。
C#提供了和字符串池相关的两个方法：

```
//若str不在字符串池中就创建新字符串对象放到池里并返回引用
public staticc String Intern(String str);
//若str不在字符串池中不会创建新字符串对象并返回null
public staticc String IsInterned(String str);
```

操作示例

```csharp
var str = "abc";
var str01 = "abc";
//运行时常量
var str02 = new string(new char[] { 'a', 'b', 'c' });
//编译时常量（可通过反编译器查看编译后的代码）
string str03 = "a" + "bc";

Console.WriteLine($"str01==str is {ReferenceEquals(str01, str)}");
Console.WriteLine($"str02==str is {ReferenceEquals(str02, str)}");
Console.WriteLine($"str03==str is {ReferenceEquals(str03, str)}");

var str04 = String.IsInterned(new string(new char[] { 'a', 'b' }));
Console.WriteLine($"str04 == null is {str04 == null}");
var str05 = String.IsInterned("abdgj");
Console.WriteLine($"str05={str05}");

var str06 = String.Intern(new string(new char[] { 'a', 'b', 'd', 'e' }));
Console.WriteLine($"str06={str06}");
```

示例2

```csharp

var s1 = string.Concat("aa","bb");
var s11 = string.IsInterned(s1) ?? "not interned";
s11.Dump();

string.Intern(s1);
var s12 = string.IsInterned(s1) ?? "not interned";
s12.Dump();


// 常量自动加入拘留池
var s2 = "abc";
var s22 = string.IsInterned(s2) ?? "not interned";
s22.Dump();


var s3 = "abc";
s3 += "d";
var s33 = string.IsInterned(s3) ?? "not interned";
s33.Dump();

-- 输出结果
not interned
aa,bb
abc
not interned
```

## 操作

### 字符串哈希值
根据字符串去生成不同的value
```csharp
static string GetStringHashValue(string str)
{
    if (str == null)
    {
        throw new ArgumentNullException("str");
    }

    using MD5 mD = MD5.Create();
    byte[] bytes = Encoding.UTF8.GetBytes(str);
    byte[] array = mD.ComputeHash(bytes);
    return BitConverter.ToInt64(array, 0).ToString().Replace("-", string.Empty);
}

static string GetStringHashValue2(string str)
{
    if (str == null)
    {
        throw new ArgumentNullException("str");
    }

   return str.GetHashCode().ToString().Replace("-", string.Empty);
}
```
这两个函数实现的功能不同，GetStringHashValue使用了MD5哈希算法计算指定字符串的哈希值，而GetStringHashValue2使用了C#中默认的哈希算法。由于MD5是一种公认的安全性较高的哈希算法，所以GetStringHashValue计算出的哈希值的冲突率更低。但是，相对于C#默认的哈希算法而言，MD5计算哈希值的代价更大，因此在处理大量数据时可能会影响程序的性能。
另外，需要注意的是，GetStringHashValue返回的哈希值是一个64位的有符号整数，而 GetStringHashValue2返回的哈希值是一个32位的有符号整数。如果应用场景对哈希值的长度和取值范围有要求，需要根据实际情况选择合适的方法。
综上所述，选择哪种方法取决于具体的应用场景和需求。如果需要更高的安全性和更低的哈希值冲突率，则可以选择GetStringHashValue；如果需要更好的性能和较短的哈希值，则可以选择GetStringHashValue2。

### 字符串比较
比较两个字符串是否相等
```csharp
public static class TestExtension
{
	/// <summary>
	/// 速度最慢
	/// </summary>
	/// <param name="sourceValue"></param>
	/// <param name="newValue"></param>
	/// <returns></returns>
	public static bool StrEquals1(this string sourceValue, string newValue)
	{
		return CultureInfo.InvariantCulture.CompareInfo.IndexOf(sourceValue, newValue, CompareOptions.IgnoreCase) == 0;
	}
	public static bool StrEquals2(this string sourceValue, string newValue)
	{
		return CultureInfo.InvariantCulture.CompareInfo.Compare(sourceValue, newValue, CompareOptions.IgnoreCase) == 0;
	}

	public static bool StrEquals3(this string sourceValue, string newValue)
	{
		//最后调用的CultureInfo.CurrentCulture.CompareInfo.Compare(this, value, string.GetCaseCompareOfComparisonCulture(comparisonType)) == 0;
		return sourceValue.Equals(newValue, StringComparison.CurrentCultureIgnoreCase);
	}

	public static int StrEquals4(this string sourceValue, string newValue)
	{
		//最后调用的还是CultureInfo.CurrentCulture.CompareInfo.Compare(strA, strB, string.GetCaseCompareOfComparisonCulture(comparisonType));
		return string.Compare(sourceValue, newValue, StringComparison.CurrentCultureIgnoreCase);
	}
}
```
IndexOf是一种写法，其他的比如Compare和Equals都是用的CultureInfo.InvariantCulture.CompareInfo.Compare。

### 检验是否为url
```csharp
public bool ValidHttpURL(string strUrl, out Uri resultURI)
{
    if (!Regex.IsMatch(strUrl, @"^https?:\/\/", RegexOptions.IgnoreCase))
        strUrl = "http://" + strUrl;

    if (Uri.TryCreate(strUrl, UriKind.Absolute, out resultURI))
        return (resultURI.Scheme == Uri.UriSchemeHttp || resultURI.Scheme == Uri.UriSchemeHttps);

    return false;
}
```

### 计算字符串相似度
我们应该以什么维度来判断相似性呢？这些算法又怎么实现呢？这篇文章对常见的计算方式做一个记录。Levenshtein 距离，又称编辑距离，指的是两个字符串之间，由一个转换成另一个所需的最少编辑操作次数。许可的编辑操作包括将一个字符替换成另一个字符，插入一个字符，删除一个字符。编辑距离的算法是首先由俄国科学家Levenshtein提出的，故又叫Levenshtein Distance。我们在做数据系统的时候，经常会用到模糊搜索，但是，数据库提供的模糊搜索并不具备按照相关度进行排序的功能。现在提供一个比较两个字符串相似度的方法。通过计算出两个字符串的相似度，就可以通过Linq在内存中对数据进行排序和筛选，选出和目标字符串最相似的一个结果。本次所用到的相似度计算公式是 相似度=Kqq/(Kqq+Krr+Kss) (Kq > 0 , Kr>=0,Ka>=0) 其中，q是字符串1和字符串2中都存在的单词的总数，s是字符串1中存在，字符串2中不存在的单词总数，r是字符串2中存在，字符串1中不存在的单词总数. Kq,Kr和ka分别是q,r,s的权重，根据实际的计算情况，我们设Kq=2，Kr=Ks=1. 根据这个相似度计算公式，得出以下程序代码：
```csharp
/// <summary>
/// 获取两个字符串的相似度
/// </summary>
/// <param name=”sourceString”>第一个字符串</param>
/// <param name=”str”>第二个字符串</param>
/// <returns></returns>
decimal GetSimilarityWith(string sourceString, string str)
{

	decimal Kq = 2;
	decimal Kr = 1;
	decimal Ks = 1;

	char[] ss = sourceString.ToCharArray();
	char[] st = str.ToCharArray();

	//获取交集数量
	int q = ss.Intersect(st).Count();
	int s = ss.Length - q;
	int r = st.Length - q;

	return Kq * q / (Kq * q + Kr * r + Ks * s);
}
```
这就是计算字符串相似度的方法，但是实际应用时，还需要考虑到同义词或近义词的情况发生， 如“爱造人小说阅读的更新最快”和“爱造人小说阅读地更新最快” 。两个字符串在一定意义上说其实是相同的，如果使用上述方法计算就会出现不准确的情况。所以在实际应用的时候，我们需要替换同义词或近义词，计算替换后的相似度。如果是近义词，需要综合替换近义词前和近义词后的计算结果，得出两个字符串的实际相似度。

资料来源：[https://mp.weixin.qq.com/s/v4aZRtdqm4qlzVq7q4oMQQ](https://mp.weixin.qq.com/s/v4aZRtdqm4qlzVq7q4oMQQ)

## 优化

### 避免不必要的调用ToUpper 或ToLower 方法

String是不变类，调用ToUpper或ToLower方法都会导致创建一个新的字符串。如果被频繁调用，将导致频繁创建字符串对象。这违背了前面讲到的“避免频繁创建对象”这一基本原则。

例如，bool.Parse方法本身已经是忽略大小写的，调用时不要调用ToLower方法。

另一个非常普遍的场景是字符串比较。高效的做法是使用 Compare 方法，这个方法可以做大小写忽略的比较，并且不会创建新字符串。

还有一种情况是使用 HashTable 的时候，有时候无法保证传递 key 的大小写是否符合预期，往往会把 key 强制转换到大写或小写方法。实际上 HashTable 有不同的构造形式，完全支持采用忽略大小写的 key: new HashTable(StringComparer.OrdinalIgnoreCase)。

### 最快的空串比较方法

将String对象的Length属性与0比较是最快的方法：`if (str.Length == 0)`

其次是与String.Empty常量或空串比较：`if (str == String.Empty)`或`if (str == "")`

注：C#在编译时会将程序集中声明的所有字符串常量放到保留池中（intern pool），相同常量不会重复分配。

### 零分配字符串

适用于 .NET Core 和 Unity 的 **Z**ero 分配**字符串**生成器：[https://github.com/Cysharp/ZString](https://github.com/Cysharp/ZString)

## 引用

### CultureInfo
CultureInfo.InvariantCulture

| 成员名称 | 说明 |
| --- | --- |
| CurrentCulture | 使用区域敏感排序规则和当前区域比较字符串 |
| CurrentCultureIgnoreCase | 使用区域敏感排序规则、当前区域来比较字符串，同时忽略被比较字符串的大小写。 |
| InvariantCulture | 使用区域敏感排序规则和固定区域比较字符串。 |
| InvariantCultureIgnoreCase | 使用区域敏感排序规则、固定区域来比较字符串，同时忽略被比较字符串的大小写。 |
| Ordinal | 使用序号排序规则比较字符串。 |
| OrdinalIgnoreCase | 使用序号排序规则并忽略被比较字符串的大小写，对字符串进行比较。 |


### CompareOptions枚举
```csharp
//
    // 摘要:
    //     定义要使用的字符串比较选项 System.Globalization.CompareInfo。
    [ComVisible(true)]
    [Flags]
    public enum CompareOptions
    {
        //
        // 摘要:
        //     指示字符串比较的默认选项设置。
        None = 0,
        //
        // 摘要:
        //     指示字符串比较必须忽略大小写。
        IgnoreCase = 1,
        //
        // 摘要:
        //     指示字符串比较必须忽略非空格组合字符，如标注字符。 Unicode Standard 将组合字符定义为与基的字符，以生成新的字符组合的字符。 非空格组合字符不在呈现时本身会占用空间位置。
        IgnoreNonSpace = 2,
        //
        // 摘要:
        //     指示字符串比较必须忽略符号，如空白字符、 标点、 货币符号、 百分比符号，数学符号、 的与符号，依次类推。
        IgnoreSymbols = 4,
        //
        // 摘要:
        //     指示字符串比较必须忽略假名类型。 假名类型引用为日文平假名和片假名字符，表示在日语中的语音。 平假名用于本机日语表达式和单词，而片假名用于从"计算机"或"Internet"等其他语言借用的词语。
        //     拼音声音可以表示在平假名和片假名。 如果选择此值，则一种声音的平假名字符视为相等的同一个声音的片假名字符。
        IgnoreKanaType = 8,
        //
        // 摘要:
        //     指示字符串比较必须忽略字符宽度。 例如，日语的片假名字符可以编写为全角或半角。 如果选择此值，则片假名字符的全角形式视为相等半角形式编写的相同字符。
        IgnoreWidth = 16,
        //
        // 摘要:
        //     字符串比较必须忽略大小写，然后执行序号比较。 此方法相当于将转换为大写使用固定区域性，然后对结果执行序号比较的字符串。
        OrdinalIgnoreCase = 268435456,
        //
        // 摘要:
        //     指示字符串比较必须使用字符串排序算法。 在字符串排序、 连字符和撇号，以及其他非字母数字的符号，排在字母数字字符之前。
        StringSort = 536870912,
        //
        // 摘要:
        //     指示字符串比较必须使用 Unicode utf-16 编码的连续值的字符串 （由代码单元比较代码单位），从而导致比较速度，但不区分区域性。 字符串与代码单元
        //     XXXX 开始16 YYYY 开头的字符串之前16, ，如果 XXXX16 小于 YYYY16。 此值不能与其他组合 System.Globalization.CompareOptions
        //     值，并必须单独使用。
        Ordinal = 1073741824
    }
```

## 扩展Nuget包

### SmartFormat

SmartFormat不仅继承了 string.Format 的功能，还扩展了更多高级特性，例如命名占位符、列表格式化、本地化支持、复数化等。SmartFormat 提供了高性能、低内存占用的运行时格式化能力。

仓库地址：https://github.com/axuno/SmartFormat

## 资料

[https://mp.weixin.qq.com/s/qk-TsyCqIJTn_zxsPJ4QGQ](https://mp.weixin.qq.com/s/qk-TsyCqIJTn_zxsPJ4QGQ) | [C## 查遗补漏] 01：字符串操作
