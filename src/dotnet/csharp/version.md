---
title: 语言版本记录
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - version
---

## 概述

版本更新记录：[https://docs.microsoft.com/zh-cn/dotnet/csharp/whats-new/csharp-version-history](https://docs.microsoft.com/zh-cn/dotnet/csharp/whats-new/csharp-version-history)  

历史语言版本说明：[Language-Version-Histor](https://github.com/dotnet/csharplang/blob/main/Language-Version-History.md)

微软官方的C#设计标准仓库：[csharplang](https://github.com/dotnet/csharplang)

> 检测当前语言版本：#error version 

## 低版本语言支持包

- [Polyfill](https://github.com/SimonCropp/Polyfill) — 我个人最喜欢的，它为大量 C# 功能提供了条件属性！请参阅 [GitHub 项目](https://github.com/SimonCropp/Polyfill)以获取最新列表。
- [IsExternalInit](https://github.com/manuelroemer/IsExternalInit) - 添加并支持 < .NET 5。init        record
- [可为 Null](https://github.com/manuelroemer/Nullable) - 为 < .NET Core 3.0 添加了对可为 null 的引用类型的支持。
- [IndexRange](https://github.com/bgrainger/IndexRange) - 在 < .NET Core 3.0 中添加了对 C# 索引和范围功能的支持。

## 新增功能

### C# 13

C# 13(.Net 9) 中的新特性 - 半自动属性：[地址](https://www.cnblogs.com/Rwing/p/18510363/Csharp_13_dot_net_9_preview_Semi-auto_properties)

### C# 9.0

.NET5支持C#9.0.

#### 1. 记录类型
C# 9.0 引入了记录类型，这是一种引用类型，它提供**合成方法**来提供值语义，从而实现相等性。 默认情况下，记录是不可变的。
```csharp
public record Person
{
        public string LastName { get; }

        public string FirstName { get; }

        public Person(string first, string last) => (FirstName, LastName) = (first, last);
}
```

#### 2. Init 仅限的资源库
从 C# 9.0 开始，可为属性和索引器创建 init 访问器，而不是 set 访问器。 调用方可使用属性初始化表达式语法在创建表达式中设置这些值，但构造完成后，这些属性将变为只读。 仅限 init 的资源库提供了一个窗口用来更改状态。
```csharp
public struct WeatherObservation
{
    public DateTime RecordedAt { get; init; }

    public decimal TemperatureInCelsius { get; init; }

    public decimal PressureInMillibars { get; init; }

    public override string ToString() => $"At{RecordedAt:h:mm tt} on {RecordedAt:M/d/yyyy}: " +
        $"Temp = {TemperatureInCelsius}, with {PressureInMillibars}pressure";
}
```
调用方可使用属性初始化表达式语法来设置值，同时仍保留不变性：
```csharp
var now = new WeatherObservation
{RecordedAt = DateTime.Now, TemperatureInCelsius = 20, PressureInMillibars = 998.0m};
```

#### 3. 顶级语句
顶级语句从许多应用程序中删除了不必要的流程。只有一行代码执行所有操作。 借助顶级语句，可使用 using 语句和执行操作的一行替换所有样本：
```csharp
using System;
Console.WriteLine("Hello World!");
```
如果需要单行程序，可删除 using 指令，并使用完全限定的类型名称：
```csharp
System.Console.WriteLine("Hello World!");
```

#### 4. 模式匹配增强功能
C# 9 包括新的模式匹配改进：
类型模式要求在变量是一种类型时匹配
带圆括号的模式强制或强调模式组合的优先级
联合 and 模式要求两个模式都匹配
析取 or 模式要求任一模式匹配
求反 not 模式要求模式不匹配
关系模式要求输入小于、大于、小于等于或大于等于给定常数。

```csharp
    public static bool IsLetter(this char c) => c is >= 'a' and <= 'z' or >= 'A' and <= 'Z';
    public static bool IsLetterOrSeparator(this char c) => c is(>= 'a' and<= 'z') or(>= 'A' and<= 'Z') or'.' or ',';
```

#### 5. 调试和完成功能
在 C# 9.0 中，已知创建对象的类型时，可在 new 表达式中省略该类型。 最常见的用法是在字段声明中：
```csharp
private List<WeatherObservation> _observations = new();
```
当需要创建新对象作为参数传递给方法时，也可使用目标类型 new。 请考虑使用以下签名的 ForecastFor() 方法：
```csharp
public WeatherForecast ForecastFor(DateTime forecastDate, WeatherForecastOptions options)
```
可按如下所示调用该方法：
```csharp
var forecast = station.ForecastFor(DateTime.Now.AddDays(2), new());
```

### C# 8.0
“.NET Core 3.x”和“.NET Standard 2.1”支持 C# 8.0；

#### 1. Readonly 成员
可将 readonly 修饰符应用于结构的成员。 它指示该成员不会修改状态。 这比将 readonly 修饰符应用于 struct 声明更精细。  请考虑以下可变结构：
```csharp
public readonly double Distance => Math.Sqrt(X * X + Y * Y);
```

#### 2. 默认接口方法
现在可以将成员添加到接口，并为这些成员提供实现。 借助此语言功能，API 作者可以将方法添加到以后版本的接口中，而不会破坏与该接口当前实现的源或二进制文件兼容性。 现有的实现继承默认实现。
```csharp
    public interface ICustomer
    {
        IEnumerable<IOrder> PreviousOrders { get; }
        DateTime DateJoined { get; }
        DateTime? LastOrder { get; }
        string Name { get; }

        IDictionary<DateTime, string> Reminders { get; }
    }
```

#### 3. Switch 表达式升级
通常情况下，switch 语句在其每个 case 块中生成一个值。借助 Switch 表达式，可以使用更简洁的表达式语法。
```csharp
        public static RGBColor FromRainbowClassic(Rainbow colorBand)
        {
            switch (colorBand)
            {
                    caseRainbow.Red: return new RGBColor(0xFF, 0x00, 0x00);
                    caseRainbow.Orange: return new RGBColor(0xFF, 0x7F, 0x00);
                    caseRainbow.Yellow: return new RGBColor(0xFF, 0xFF, 0x00);
                    caseRainbow.Green: return new RGBColor(0x00, 0xFF, 0x00);
                    caseRainbow.Blue: return new RGBColor(0x00, 0x00, 0xFF);
                    caseRainbow.Indigo: return new RGBColor(0x4B, 0x00, 0x82);
                    caseRainbow.Violet: return new RGBColor(0x94, 0x00, 0xD3);
                default: throw new ArgumentException(message: "invalid enum value", paramName: nameof(colorBand));
            }
        }
```
这里有几个语法改进：
变量位于 switch 关键字之前。 不同的顺序使得在视觉上可以很轻松地区分 switch 表达式和 switch 语句。
将 case 和 : 元素替换为 =>。 它更简洁，更直观。
将 default 事例替换为 _ 弃元。
正文是表达式，不是语句。
```csharp
        public static RGBColor FromRainbow(Rainbow colorBand) => colorBand switch
        {
            Rainbow.Red => newRGBColor(0xFF, 0x00, 0x00), Rainbow.Orange => new RGBColor(0xFF, 0x7F, 0x00),
            Rainbow.Yellow => new RGBColor(0xFF, 0xFF, 0x00), Rainbow.Green => new RGBColor(0x00, 0xFF, 0x00),
            Rainbow.Blue => newRGBColor(0x00, 0x00, 0xFF), Rainbow.Indigo => new RGBColor(0x4B, 0x00, 0x82),
            Rainbow.Violet => new RGBColor(0x94, 0x00, 0xD3),
            _ => throw new ArgumentException(message: "invalid enum value", paramName: nameof(colorBand)),
        };
```

#### 4. 属性模式
借助属性模式，可以匹配所检查的对象的属性。 请看一个电子商务网站的示例，该网站必须根据买家地址计算销售税。 这种计算不是 Address 类的核心职责。 它会随时间变化，可能比地址格式的更改更频繁。 销售税的金额取决于地址的 State 属性。 下面的方法使用属性模式从地址和价格计算销售税：
```csharp
        public static decimal ComputeSalesTax(Address location, decimal salePrice) => location switch
        {
            {State: "WA"} => salePrice * 0.06M, {State: "MN"} => salePrice * 0.075M,
            {State: "MI"} => salePrice * 0.05M, // other cases removed for brevity...
            _ => 0M
        };
```
在 LINQ 查询中会经常看到这种情况。 可以通过导入 Enumerable 或 Queryable 来导入 LINQ 模式。

#### 5. 元组模式
一些算法依赖于多个输入。 使用元组模式，可根据表示为元组的多个值进行切换。  以下代码显示了游戏“rock, paper, scissors（石头剪刀布）”的切换表达式：：
```csharp
        public static string RockPaperScissors(string first, string second) => (first, second) switch
        {
            ("rock", "paper") => "rock is covered by paper. Paper wins.",
            ("rock", "scissors") => "rock breaks scissors. Rock wins.",
            ("paper", "rock") => "paper covers rock. Paper wins.",
            ("paper", "scissors") => "paper is cut by scissors. Scissors wins.",
            ("scissors", "rock") => "scissors is broken by rock. Rock wins.",
            ("scissors", "paper") => "scissors cuts paper. Scissors wins.", (_, _) => "tie"
        };
```
如果person为空，返回的值就是null，是string的默认值，如果FirstName是int类型，那返回的就是int的默认值0。

#### 6. using 声明
 using 声明是前面带 using 关键字的变量声明。 它指示编译器声明的变量应在封闭范围的末尾进行处理。 以下面编写文本文件的代码为例：
```csharp
        static int WriteLinesToFile(IEnumerable<string> lines)
        {
            using varfile = new System.IO.StreamWriter("WriteLines2.txt");
            // Notice how we declare skippedLines after the using statement.
            intskippedLines = 0;
            foreach (string line inlines)
            {
                if (!line.Contains("Second"))
                {
                    file.WriteLine(line);
                }
                else
                {
                    skippedLines++;
                }
            } // Notice how skippedLines is in scope here.
            return skippedLines; // file is disposed here}
        }
```
前面的代码相当于下面使用经典 using 语句的代码：
```csharp
        static int WriteLinesToFile(IEnumerable<string> lines)
        {
            // We must declare the variable outside of the using block
            // so that it is in scope to be returned.
            int skippedLines = 0;
            using (var file = new System.IO.StreamWriter("WriteLines2.txt"))
            {
                foreach (stringline in lines)
                {
                    if (!line.Contains("Second"))
                    {
                        file.WriteLine(line);
                    }
                    else
                    {
                        skippedLines++;
                    }
                }
                return skippedLines;
            } // file is disposed here}
        }
```

#### 7. Static 静态本地函数
现在可以向本地函数添加 static 修饰符，以确保本地函数不会从封闭范围捕获（引用）任何变量。
```csharp
        int M()
        {
            int y = 5;
            int x = 7;
            returnAdd(x, y);
            static int Add(intleft, int right) => left + right;
        }
```

#### 8. async 异步流
从 C# 8.0 开始，可以创建并以异步方式使用流。返回异步流的方法有三个属性：
它是用 async 修饰符声明的。
它将返回 `IAsyncEnumerable<T>`。
该方法包含用于在异步流中返回连续元素的 yield return 语句。
```csharp
        public static async System.Collections.Generic.IAsyncEnumerable<int> GenerateSequence()
        {
            for (int i = 0; i < 20; i++)
            {
                await Task.Delay(100);
                yield return i;
            }
        }

        await foreach (var number in GenerateSequence()) {
            Console.WriteLine(number);
        }
```
异步可释放：
从 C# 8.0 开始，语言支持实现 System.IAsyncDisposable 接口的异步可释放类型。可使用 await using 语句来处理异步可释放对象。

#### 9. 索引和范围
范围指定范围的开始和末尾 。 包括此范围的开始，但不包括此范围的末尾，这表示此范围包含开始但不包含末尾 。 范围 [0..^0] 表示整个范围，就像 [0..sequence.Length] 表示整个范围。
以下代码创建了一个包含单词“quick”、“brown”和“fox”的子范围。 它包括 words[1] 到 words[3]。 元素 words[4] 不在该范围内。
```csharp
var quickBrownFox = words[1..4];
var allWords = words[..]; 
// contains "The" through "dog".var firstPhrase = words[..4];
// contains "The" through "fox"var lastPhrase = words[6..]; 
// contains "the", "lazy" and "dog"
```

#### 10. null 合并赋值
C# 8.0 引入了 null 合并赋值运算符 ??=。 仅当左操作数计算为 null 时，才能使用运算符 ??= 将其右操作数的值分配给左操作数。
```csharp
List<int> numbers = null;
int? i = null;
numbers ??= new List<int>();
numbers.Add(i ??= 17);
numbers.Add(i ??= 20);
Console.WriteLine(string.Join(" ", numbers)); // output: 17 17Console.WriteLine(i);  // output: 17
```

### C# 7.x 

#### 1.out 变量
可以在方法调用的参数列表中声明 out 变量，而不是编写单独的声明语句：：
```csharp
if (int.TryParse(input,out int result))   
    Console.WriteLine(result);
else   
    Console.WriteLine("Could not parse input");
```
为清晰明了，可能需指定 out 变量的类型，如上所示。 但是，该语言支持使用隐式类型的局部变量：
```csharp
if (int.TryParse(input,out var answer))    
    Console.WriteLine(answer);
else   
    Console.WriteLine("Could not parse input");
```

#### 2.Tuple 元组
低于 C# 7.0 的版本中也提供元组，但它们效率低下且不具有语言支持。这意味着元组元素只能作为 Item1 和 Item2 等引用。
可以通过为每个成员赋值来创建元组，并可选择为元组的每个成员提供语义名称：
```csharp
(string Alpha, stringBeta) namedLetters = ("a", "b");
Console.WriteLine($"{namedLetters.Alpha}, {namedLetters.Beta}");
```
在进行元组赋值时，还可以指定赋值右侧的字段的名称：
```csharp
var alphabetStart = (Alpha: "a", Beta: "b");
Console.WriteLine($"{alphabetStart.Alpha}, {alphabetStart.Beta}");
```
使用的时候，可以直接点出来：
```csharp
alphabetStart.AlphaalphabetStart.Beta
```

#### 3.弃元
C# 增添了对弃元的支持。 弃元是一个名为 _（下划线字符）的只写变量，可向单个变量赋予要放弃的所有值。 弃元类似于未赋值的变量；不可在代码中使用弃元（赋值语句除外）：
```csharp
public class Example{    
    public static void Main()    
    {       
        var (_, _, _, pop1, _, pop2) = QueryCityDataForYears("New York City",1960, 2010);
        Console.WriteLine($"Population change, 1960 to 2010: {pop2 - pop1:N0}");    
    }
    private static(string, double,int, int,int, int) QueryCityDataForYears(string name, intyear1, int year2)    
    {       
        int population1 = 0, population2 = 0;        
        doublearea = 0;
        if (name == "New York City")       
        {            
            area = 468.48;            
            if(year1 == 1960)            
            {                
                population1 = 7781984;           
            }            
            if (year2 == 2010)            
            {                
                population2 = 8175133;           
            }            
            return (name, area, year1, population1, year2, population2);        
            return ("",0, 0, 0, 0, 0);    
        }
}
```


#### 4.is 模式匹配
模式匹配支持 is 表达式和 switch 表达式。 每个表达式都允许检查对象及其属性以确定该对象是否满足所寻求的模式。 使用 when 关键字来指定模式的其他规则：
```csharp
public static int SumPositiveNumbers(IEnumerable<object> sequence)
{    
    int sum = 0;   
    foreach (vari in sequence)    
    {       
        switch (i)        
        {            
            case 0:               
                break;            
                caseIEnumerable<int> childSequence:           
                {                
                    foreach(var item inchildSequence)                    
                        sum += (item > 0) ? item : 0;               
                    break;            
                }            
            case int n when n > 0:                
                sum += n;                
                break;            
            case null:                
                throw new NullReferenceException("Null found in sequence");            
            default:                
                throw new InvalidOperationException("Unrecognized type");        
        }    
    }    
    return sum;
}
```
case 0: 是常见的常量模式。
case `IEnumerable<int>` childSequence: 是一种类型模式。
case int n when n > 0: 是具有附加 when 条件的类型模式。
case null: 是 null 模式。
default: 是常见的默认事例。

#### 5.本地函数（内部）
本地函数使你能够在另一个方法的上下文内声明方法。 本地函数使得类的阅读者更容易看到本地方法仅从声明它的上下文中调用。
```csharp
        public static IEnumerable<char> AlphabetSubset3(char start, char end)
        {
            if (start < 'a' || start > 'z')
                throw new ArgumentOutOfRangeException(paramName: nameof(start), message: "start must be a letter");
            if (end < 'a' || end > 'z')
                throw new ArgumentOutOfRangeException(paramName: nameof(end), message: "end must be a letter");
            if (end <= start) throw new ArgumentOutOfRangeException($"{nameof(end)} must be greater than {nameof(start)}");
            return alphabetSubsetImplementation();

            IEnumerable<char> alphabetSubsetImplementation()
            {
                for (var c = start; c < end; c++) yield return c;
            }
        }
```
注意上边的alphabetSubsetImplementation方法，是在内部定义的。
同样可以使用异步：
```csharp
        public Task<string> PerformLongRunningWork(string address, int index, string name)
        {
            if (string.IsNullOrWhiteSpace(address))
                throw new ArgumentException(message: "An address is required", paramName: nameof(address));
            if (index < 0)
                throw new ArgumentOutOfRangeException(paramName: nameof(index),
                    message: "The index must be non-negative");
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException(message: "You must supply a name", paramName: nameof(name));
            return longRunningWorkImplementation();

            async Task<string> longRunningWorkImplementation()
            {
                var interimResult = await FirstWork(address);
                varsecondResult = await SecondStep(index, name);
                return $"The results are {interimResult} and {secondResult}. Enjoy.";
            }
        }
```
当然也支持某些使用lambda表达式来完成。

#### 6. 数字文本语法改进 
C# 7.0 包括两项新功能，可用于以最可读的方式写入数字来用于预期用途：二进制文本和数字分隔符 。在创建位掩码时，或每当数字的二进制表示形式使代码最具可读性时，以二进制形式写入该数字：
```csharp
        public const int Sixteen = 0b0001_0000;
        public const int ThirtyTwo = 0b0010_0000;
        public const int SixtyFour = 0b0100_0000;
        public const int OneHundredTwentyEight = 0b1000_0000;
```
常量开头的 0b 表示该数字以二进制数形式写入。 二进制数可能会很长，因此通过引入 _ 作为数字分隔符通常更易于查看位模式，如上面二进制常量所示。 数字分隔符可以出现在常量的任何位置。 对于十进制数字，通常将其用作千位分隔符：
```csharp
public const long BillionsAndBillions = 100_000_000_000;
```


### C# 6

#### 1.get 只读属性
简洁的语法来创建不可变类型，仅有get访问器：
```csharp
public string FirstName { get; }
public string LastName { get; }
```
当然很多时候，我们使用的是私有化来设置set。
然后通过构造函数来赋值：
```csharp
public Student(string firstName, string lastName){   
    if (IsNullOrWhiteSpace(lastName))       
        throw new ArgumentException(message: "Cannot be blank", paramName: nameof(lastName));   
    FirstName = firstName;    
    LastName = lastName;
}
```

#### 2.get 属性初始化表达式
 在属性声明中声明自动属性的初始值，
```csharp
public ICollection<double> Grades { get; }   = new List<double>();
```
声明处就可以直接被初始化。

#### 3.Expression-bodied 函数成员
 这适用于方法和只读属性。 例如，重写 ToString() 通常是理想之选：
```csharp
public override string ToString()   => $"{LastName}, {FirstName}";
```
也可以将此语法用于只读属性：
```csharp
public string FullName => $"{FirstName} {LastName}";
```

#### 4.using 静态命名空间
 using static  增强功能可用于导入单个类的静态方法。 指定要使用的类：
using static System.Math;
在 LINQ 查询中会经常看到这种情况。 可以通过导入 Enumerable 或 Queryable 来导入 LINQ 模式。

#### 5.Null 条件运算符
 Null 条件运算符使 null 检查更轻松、更流畅  。 将成员访问 . 替换为 ?.：
var first = person?.FirstName;
如果person为空，返回的值就是null，是string的默认值，如果FirstName是int类型，那返回的就是int的默认值0。

#### 6.$ 字符串内插
新的字符串内插功能可以在字符串中嵌入表达式。 使用 $ 作为字符串的开头，并使用 { 和 } 之间的表达式代替序号：
``` c#
public string GetGradePointPercentage() =>   $"Name: {LastName}, {FirstName}. G.P.A: {Grades.Average():F2}";
```
上一行代码将 Grades.Average() 的值格式设置为具有两位小数的浮点数。
如果同时有`$`和`@`，`$`必须在`@`运算符前面。

#### 7.when 异常筛选器
“异常筛选器”是确定何时应该应用给定的catch子句的子句 。如果用于异常筛选器的表达式计算结果为true，则catch子句将对异常执行正常处理。 如果表达式计算结果为false，则将跳过catch子句。一种用途是检查有关异常的信息，以确定catch子句是否可以处理该异常：
```csharp
public static async Task<string> MakeRequest(){   
    WebRequestHandler webRequestHandler = new WebRequestHandler();    
    webRequestHandler.AllowAutoRedirect = false;    
    using (HttpClient client = new HttpClient(webRequestHandler))    
    {        
        var stringTask = client.GetStringAsync("https://docs.microsoft.com/en-us/dotnet/about/");        
        try        
        {            
            var responseText = await stringTask;            
            return responseText;        
        }        
        catch (System.Net.Http.HttpRequestException e) when (e.Message.Contains("301"))       
        {            
            return "Site Moved";        
        }    
    }
}
```

#### 8.nameof 表达式
 nameof 表达式的计算结果为符号的名称。 每当需要变量、属性或成员字段的名称时，这是让工具正常运行的好办法，说白了就是更好的重构：
```csharp
if (IsNullOrWhiteSpace(lastName))    
    throw new ArgumentException(message: "Cannot be blank", paramName: nameof(lastName));
```

#### 9.Catch 和 Finally 块中的 Await
现在可以在 catch 或 finally 表达式中使用 await。 这通常用于日志记录方案：
```csharp
public static async Task<string> MakeRequestAndLogFailures()
{    
    await logMethodEntrance();    
    var client = new System.Net.Http.HttpClient();    
    var streamTask = client.GetStringAsync("https://localHost:10000");    
    try {       
        var responseText = await streamTask;        
        return responseText;    
    } catch (System.Net.Http.HttpRequestException e) when (e.Message.Contains("301"))   
    {        
        await logError("Recovered from redirect", e);        
        return "Site Moved";    
    }   
    finally    
    {        
        await logMethodExit();        
        client.Dispose();    
    }
}
```

#### 10.索引器初始化关联集合
可以将集合初始值设定项与 `Dictionary<TKey,TValue>` 集合和其他类型一起使用，在这种情况下，可访问的 Add 方法接受多个参数。 新语法支持使用索引分配到集合中：
```csharp
private Dictionary<int, string> webErrors = new Dictionary<int, string>
{    
    [404] = "Page not Found",    
    [302] = "Page moved, but left a forwarding address.",   
    [500] = "The web server can't come out to play today."
 };
```
