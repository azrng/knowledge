---
title: DDD之值对象
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: dddzhizhiduixiang
slug: by2sfn
docsId: '50763575'
---

### 概述
作为领域驱动设计战术模式中最为核心的一个部分-值对象。一直是被大多数愿意尝试或者正在使用DDD的开发者提及最多的概念之一。但是在学习过程中，大家会因为受到传统开发模式的影响，往往很难去运用值对象这一概念，以及在对值对象进行持久化时感到非常的迷惑。本篇文章会从值对象的概念出发，解释什么是值对象以及怎么运用值对象，并且给出相应的代码片段（本教程的代码片段都使用的是C#,后期的实战项目也是基于 DotNet Core 平台）。

### 何为值对象
首先让我们来看一看原著 [《领域驱动设计:软件核心复杂性应对之道》](https://book.douban.com/subject/5344973/) 对值对象的解释：
> 很多对象没有概念上的表示，他们描述了一个事务的某种特征。
用于描述领域的某个方面而本身没有概念表示的对象称为Value Object（值对象）。


然后作者用“地址”这一概念给大家扩充了一下什么是值对象，我们应该怎么去发现值对象。所以你会发现现在很多的DDD文章中都是用这个例子给大家来解释。当然读懂了的人就会有一种醍醐灌顶的感觉，而像我这种菜鸡，以后运用的时候感觉除了地址这个东西会给他抽象出来之外，其他的还是该咋乱写咋写。
For Example ：
```csharp
public class DemoClass
{
    public Address  Address { get; set; } 

    //…………
}
```
OK，现在我们来仔细理解和分析一下值对象，虽然概念有一点抽象，但是至少有一关键点我们能够很清晰的捕捉到，那就是值对象没有标识，也就是说这个叫做Value Object的东西他没有ID。这一点也十分关键，他方便后面我们对值对象的深入理解。
既然值对象是没有ID的一个事物（东西），那么我们来考虑一下什么情况下我们不需要通过ID来辨识一个东西：

- “在超市购物的时候：我有五块钱，你也有五块钱”，这里会关心我的钱和你的钱是同一张，同一个编码，同一个组合方式（一张五块，五张一块）吗？显然不会。因为它们的价值是一样的，就购买东西来说，所以它是不需要ID的。
- “去上厕所的时候：同时有两个空位，都是一样的马桶，都一样的干净”，这里你会关心你要上的马桶是哪一个生产规格，哪一个编码吗？显然不会，你只关心它是否结构完好，能够使用。当然有的人可能要说：“我上厕所的时候，我每次都认准要上第一排的第一号厕所。”那么，反思一下，当十分内急的时候，你还会考虑这个问题吗？虽然这个例子举的有点奇葩，但却值得我们反思，在开发过程中我们所发现的一些事物（类），它是否真的需要一个身份ID。

通过上面的两个例子，相信你一个没有身份ID的事物（类）已经在你脑袋里面留下了一点印象。那么让我们再来看一下原著中所提供给我们的一个案例：

- 当一个小孩画画的时候,他注意的是画笔的颜色和笔尖的粗细。但如果有两只颜色和粗细相同的画笔，他可能不会在意使用哪一支。如果有一支笔弄丢了，他可以从一套新笔中拿出一支同颜色的笔来继续画画，根本不会在意已经换了一支笔。

#### 值对象是基于上下文的
请注意，这是一个非常重要的前提。你会发现在上面的三个案例中，都有一个同样的前缀：“???的时候”。也就是说，我们考虑值对象的时候，是基于实际环境因素和语境条件（上下文）的。这个问题非常好理解：比如你是一个孩子的爸爸，当你在家里面的时候，听到了有孩子叫“爸爸”，哪怕你没有看到你的孩子，你也知道这个爸爸指的是你自己；当你在地铁上的时候，突然从旁边车厢传来了一声“爸爸”，你不会认为这个是在叫你。所以，在实现领域驱动的时候，所有的元素都是基于上下文所考虑的，一切脱离了上下文的值对象是没有作用的。

#### 当前上下文的值对象可能是另一个上下文的实体
实体是战术模式中同样重要的一个概念，但是现在我们先不做讨论，我们只需要明白实体是一个具有ID的事物就行了。也就是说一个同样的东西在当前环境下可能没有一个独有的标识，但可能在另一个环境下它就需要一个特殊的ID来识别它了。考虑上面的例子：

- 同样的五块钱，此时在一个货币生产的环境下。它会考虑这同样的一张五块钱是否重号，显然重号的货币是不允许发行的。所以每一张货币必须有一个唯一的标识作为判断。
- 同样的马桶，此时在一个物管环境中。它会考虑该马桶的出厂编码，如果马桶出现故障，它会被返厂维修，并且通过唯一的id进行跟踪。

显然，同样的东西，在不同的语境中居然有着不同的意义。

### 怎么运用值对象
此时，你应该可以根据你自己的所在环境和语境（上下文）捕获出属于你自己的值对象了，比如货币呀，姓名呀，颜色呀等等。下面我们来考虑如何将它放在实际代码中。
以第一个五块钱的值对象例子来作为说明，此时我们在超市购物的上下文中，我们可能已经捕获倒了一个叫做“钱”（Money）的值对象。按照以往我们的写法，来看一看会有一个什么样的代码：
```csharp
public class MySupmarketShopping
{
    public decimal Money { get; set; } 

    public int MoneyCurrency { get; set;}
}
```

#### 尽量避免使用基元类型
仔细看上面的代码，你会发现，这没有问题呀，表明的很正确。我在超市购物中，我所具有的钱通过了一个属性来表明。这也很符合我们以往写类的风格。
当然，这个写法也并不能说明它是错的。只是说没有更好的表明我们当前环境所要表明的事物。
这个逻辑可能很抽象，特别是我们写了这么多年的代码，已经养成了这样的定性思维。那么，来考虑下面的一个问卷：

| **运动调查表(1)** |  |
| --- | --- |
| 姓名 | ________ |
| 性别 | ________ (字符串) |
| 周运动量 | ________(整型) |
| 常用运动器材 | ________(整型) |

| **运动调查表(2)** |  |
| --- | --- |
| 姓名 | ________ |
| 性别 | ________ (男\\女) |
| 周运动量 | ________(0~1000cal\\1000-1000cal) |
| 常用运动器材 | ________(跑步机\\哑铃\\其他) |

现在应该比较清晰的能够理解该要点了吧。从运动表1中，仿佛出了性别之外，我们都不知道后面的空需要表达什么意思，而运动表2加上了该环境特有的名称和选项，一下就能让人读懂。如果将运动表1转换为我们熟悉的代码，是否类似于上面的MySupmarketShopping类呢。所谓的基元类型，就是我们熟悉的（int,long,string,byte…………）。而多年的编码习惯，让我们认为他们是表明事物属性再正常不过的单位，但是就像两个调查表所给出的答案一样，这样的代码很迷惑，至少会给其他读你代码的人造成一些小障碍。

#### 值对象是内聚并且可以具有行为
接下来是实现我们上文那个Money值对象的时候了。这是一个生活中很常见的一个场景，所以有可能我们建立出来的值对象是这样的：
```csharp
class  Money
{
    public int Amount { get; set; }
    public Currency Currency { get; set; }

    public Money(int amount,Currency currency)
    {
        this.Amount = amount;
        this.Currency = currency;
    }
}
```
Money对象中我们还引入了一个叫做币种（Currency)的对象，它同样也是值对象，表明了金钱的种类。接下来我们更改我们上面的MySupmarketShopping。
```csharp
public class MySupmarketShopping
{
    public Money Amountofmoney { get; set; } 
}
```
你会发现我们将原来MySupmarketShopping类中的币种属性，通过转换为一个新的值对象后给了money对象。因为币种这个概念其实是属于金钱的，它不应该被提取出来从而干扰我的购物。此时，Money值对象已经具备了它应有的属性了，那么就这样就完成了吗？还是一个问题的思考，也许我在国外的超市购物，我需要将我的人民币转换成为美元。这对我们编码来说它是一个行为动作，因此可能是一个方法。那么我们将这个转换的方法放在哪儿呢？ 给MySupmarketShopping？ 很显然，你一下就知道如果有Money这个值对象在的话，转换这个行为就不应该给MySupmarketShopping，而是属于Money。然后Money类就理所当然的被扩充为了这个样子
```csharp

class  Money
{
    public int Amount { get; set; }
    public Currency Currency { get; set; }

    public Money(int amount,Currency currency)
    {
        this.Amount = amount;
        this.Currency = currency;
    }

    public Money ConvertToRmb(){
        int covertAmount = Amount / 6.18;
        return new Money(covertAmount,rmbCurrency);
    }
}
```
**请注意**：在这个行为完成后，我们是返回了一个新的Money对象，而不是在当前对象上进行修改。这是因为我们的值对象拥有一个很重要的特性，不可变性。值对象是不可变的：一旦创建好之后，值对象就永远不能变更了。相反，任何变更其值的尝试，其结果都应该是创建带有期望值的整个新实例。

### 来看一个例子
其实我们在平时的编码过程中，有些类型就是典型的值对象，只是我们当时并没有这个完整的概念体系去发现。
比如在.NET中，DateTime类就是一个经典的例子。有的编程语言，他的基元类型其实是没有日期型这种说法的，比如Go语言中是通过引入time的包实现的。尝试一下，如果不用DateTime类你会怎么去表示日期这一个概念，又如何实现日期之间的相互转换（比如DateTime所提供的AddDays，AddHours等方法）。
> 这是一个现实项目中的一个案例，也许你能通过它加深值对象概念在你脑海中的印象。

该案例的需求是：将一个时间段内的一部分时间段扣除，并且返回剩下的小时数。比如有一个时间段 12:00 - 14:00.另一个时间段 13:00 - 14:00。 返回小时数1。
```csharp
    string StartTime_ = Convert.ToDateTime(item["StartTime"]).ToString("HH:mm");
    string EndTime_ = Convert.ToDateTime(item["EndTime"]).ToString("HH:mm");
    string CurrentStart_ = Convert.ToString(item["CurrentStart"]);
    string CurrentEnd_ = Convert.ToString(item["CurrentEnd"]);
    //计算开始时间
    string[] s = StartTime_.Split(':');
    double sHour = double.Parse(s[0]);
    double sMin = double.Parse(s[1]);
    //计算结束时间
    string[] e = EndTime_.Split(':');
    double eHour = double.Parse(e[0]);
    double eMin = double.Parse(e[1]);

    DateTime startDate_ = hDay.AddHours(sHour).AddMinutes(sMin);
    DateTime endDate_ = hDay.AddHours(eHour).AddMinutes(eMin);

    TimeSpan ts = new TimeSpan();
    if (StartDate <= startDate_ && EndDate >= endDate_)
    {
        ts = endDate_ - startDate_;
    }
    else if (StartDate <= startDate_ && EndDate >= startDate_ && EndDate < endDate_)
    {
        ts = EndDate - startDate_;
    }
    else if (StartDate > startDate_ && StartDate <= endDate_ && EndDate >= endDate_)
    {
        ts = endDate_ - StartDate;
    }
    else if (StartDate > startDate_ && StartDate < endDate_ && EndDate > startDate_ && EndDate < endDate_)
    {
        ts = EndDate - StartDate;
    }
    if (OverTimeUnit == "minute")
    {
        Duration_ = Duration_ > ts.TotalMinutes ? Duration_ - ts.TotalMinutes : 0;
    }
    else if (OverTimeUnit == "hour")
    {
        Duration_ = Duration_ > ts.TotalMinutes ? Duration_ - ts.TotalMinutes : 0;
    }

```
```csharp
    DateTimeRange oneRange = new DateTimeRange(oneTime,towTime);
    DateTimeRange otherRange = new DateTimeRange(oneTime,towTime);
    var resultHours = oneRange.GetRangeHours() - oneRange.GetAlphalRange(otherRange);
```
首先来看一看代码片段1，使用了传统的方式来实现该功能。但是里面使用大量的基元类型来描述问题，可读性和代码量都很复杂。
接下来是代码片段2，在实现该过程时，我们先尝试寻找该问题模型中的共性，因此提取出了一个叫做时间段（DateTimeRange）类的值对象出来，而赋予了该值对象应有的行为和属性。
```csharp

//展示了DateTimeRange代码的部分内容
public class DateTimeRange
{
    private DateTime _startTime;
    public DateTime StartTime
    {
        get { return _startTime; }
    }

    private DateTime _endTime;
    public DateTime EndTime
    {
        get { return _endTime; }
    }

    public DateTimeRange GetAlphalRange(DateTimeRange timeRange)
    {
        DateTimeRange reslut = null;

        DateTime bStartTime = _startTime;
        DateTime oEndTime = _endTime;
        DateTime sStartTime = timeRange.StartTime;
        DateTime eEndTime = timeRange.EndTime;

        if (bStartTime < eEndTime && oEndTime > sStartTime)
        {
            // 一定有重叠部分
            DateTime sTime = sStartTime >= bStartTime ? sStartTime : bStartTime;
            DateTime eTime = oEndTime >= eEndTime ? eEndTime : oEndTime;

            reslut = new DateTimeRange(sTime, eTime);
        }
        return reslut;
    }
}
```
通过寻找出的该值对象，并且丰富值对象的行为。为我们编码带来了大量的好处。

### 值对象的持久化
有关值对象持久化的问题一直是一个非常棘手的问题。这里我们提供了目前最为常见的两种实现思路和方法供参考。而该方法都是针对传统的关系型数据库的。（因为Nosql的特性，所以无需考虑这些问题）
> 将值对象映射在表的字段中

该方法也是微软的官方案例Eshop中提供的方案，通过EFCore提供的固有实体类型形式来将值对象存储在依赖的实体表字段中。具体的细节可以参考 [EShop实现值对象](https://docs.microsoft.com/zh-cn/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects)。通过该方法，我们最后持久化出来的结果比较类似于这样：
![image.png](/common/1628521829541-28e87f3c-bc4f-4c6d-8824-b839b8d0cb6a.png)
> **将值对象单独用作表来存储**

该方式在持久化时将值对象单独存为一张表，并且以依赖对象的ID主为自己的主键。在获取时用Join的方式来与依赖的对象形成关联。
可能持久化出来的结果就像这样：
![image.png](/common/1628521829652-2ae60861-aa6c-4f16-aa7c-55b8ca9780ba.png)
> **可能没有完美的持久化方式**

正如这个小标题一样，目前可能并没有完美的一个持久化方式来供关系型数据库持久化值对象。方式一的方式可能会造成数据大量的冗余，毕竟对值对象来说，只要值是一样的我们就认为他们是相等的。假如有一个地址值对象的值是“四川”，那么有100w个用户都是四川的话，那么我们会将该内容保存100w次。而对于一些文本信息较大的值对象来说，这可能会损耗过多的内存和性能。并且通过EFCore的映射获取值对象也有一个问题，你很难获取倒组合关系的值对象，比如值对象A中有值对象B，值对象B中有值对象C。这对于建模值对象来说可能是一个很正常的事情，但是在进行映射的时候确非常困难。
对于方式二来说，建模中存在了大量的值对象，我们在持久化时不得不对他们都一一建立一个数据表来保存，这样造成数据库表的无限增多，并且对于习惯了数据库驱动开发的人员来说，这可能是一个噩梦，当尝试通过数据库来还原业务关系时这是一项非常艰难的任务。
总之，还是那句话，目前依旧没有一个完美的解决方案，你只能通过自己的自身条件和从业经验来进行对以上问题的规避，从而达到一个折中的效果。

### 总结
总结可能就是没有总结了吧。有时间的话继续扩充战术模式中其它关键概念（实体，仓储，领域服务，工厂等）的文章。

### 转载地址
> [https://www.cnblogs.com/uoyo/p/11951840.html](https://www.cnblogs.com/uoyo/p/11951840.html)

