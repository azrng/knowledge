---
title: 日期和时间
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: rijiheshijian
slug: gn33xp
docsId: '47399313'
---
> 常用时间格式  ： yyyy-MM-dd HH:mm:ss.fff


## 时间

### TimeSpan

#### 定义
```csharp
## 声明变量
var timespan = TimeSpan.FromHours(9); // {09:00:00}

## 获取当前时间戳
DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); // utc
```

#### 转换
```csharp
## 字符串转TimeSpan
TimeSpan.Parse("09:30"); 

## TimeSpan转时间
var timespan = TimeSpan.FromHours(9);
var date=DateTime.Now.Date.Add(timespan); // {2021/6/19 9:00:00}
```

### DataTime
DateTime不是一个类（class），而是一个结构(struct)，它存在于System命名空间下，在Dotnet Core中，处于System.Runtime.dll中。

DataTime时间的相关操作：[https://www.cnblogs.com/hnzhengfy/p/DatetimeInCS.html](https://www.cnblogs.com/hnzhengfy/p/DatetimeInCS.html)

#### 初始化
初始化一个DateTime对象，C#提供了11种方式进行初始化，根据需要，可以使用年月日时分秒，以及Ticks。
> Ticks是C#里一个独特的定义，它是以公历0001年1月1日00:00:00.000以来所经历的以100纳秒为间隔的间隔数。我们知道，纳秒、微秒、毫秒和秒之间都是1000倍的关系，所以，1毫秒等于10000Ticks。这个数字很重要。在C#到Javascript时间转换时，需要很清楚这个对应关系。

```csharp
DateTime date1 = new DateTime(2020, 7, 14);
DateTime date2 = new DateTime(2020, 7, 14, 14, 23, 40);
DateTime date3 = new DateTime(637303334200000000);
```

#### 转换格式
```csharp
DateTime dtime = DateTime.Now;
string a = dtime.ToString("yyyy-MM-dd");//2018-03-29    
string b = dtime.ToLongDateString();//2018年3月29日
string c = dtime.ToLongTimeString();//9:57:41
string d = dtime.ToShortDateString();//2018/3/29
string e = dtime.ToShortTimeString();//10:01 不带秒针
//"yyyy-MM-dd HH:mm:ss.fffff"  最详细的时间格式


TimeSpan duration = new System.TimeSpan(30, 0, 0, 0);
DateTime newDate1 = DateTime.Now.Add(duration);

DateTime today = DateTime.Now;
DateTime newDate2 = today.AddDays(30);

string dateString = "2020-07-14 14:23:40";
DateTime dateTime12 = DateTime.Parse(dateString);

DateTime date1 = new System.DateTime(2020, 7, 13, 14, 20, 10);
DateTime date2 = new System.DateTime(2020, 7, 14, 14, 25, 40);
DateTime date3 = new System.DateTime(2020, 7, 14, 14, 25, 40);

TimeSpan diff1 = date2.Subtract(date1);
DateTime date4 = date3.Subtract(diff1);
TimeSpan diff2 = date3 - date2;

DateTime date5 = date2 - diff1;
```
::: details 转换字符串格式

```csharp
 //2021年4月24日
 System.DateTime.Now.ToString("D");
 //2021-4-24
 System.DateTime.Now.ToString("d");
 //2021年4月24日 16:30:15
 System.DateTime.Now.ToString("F");
 //2021年4月24日 16:30
 System.DateTime.Now.ToString("f");
 //2021-4-24 16:30:15
 System.DateTime.Now.ToString("G");
 //2021-4-24 16:30
 System.DateTime.Now.ToString("g");
 //16:30:15
 System.DateTime.Now.ToString("T");
 //16:30
 System.DateTime.Now.ToString("t");
 //2021年4月24日 8:30:15
 System.DateTime.Now.ToString("U");
 //2021-04-24 16:30:15Z
 System.DateTime.Now.ToString("u");
 //4月24日
 System.DateTime.Now.ToString("m");
 System.DateTime.Now.ToString("M");
 //Tue, 24 Apr 2021 16:30:15 GMT
 System.DateTime.Now.ToString("r");
 System.DateTime.Now.ToString("R");
 //2021年4月
 System.DateTime.Now.ToString("y");
 System.DateTime.Now.ToString("Y");
 //2021-04-24T15:52:19.1562500+08:00
 System.DateTime.Now.ToString("o");
 System.DateTime.Now.ToString("O");
 //2021-04-24T16:30:15
 System.DateTime.Now.ToString("s");
 //2021-04-24 15:52:19
 System.DateTime.Now.ToString("yyyy-MM-dd HH：mm：ss：ffff");
 //2021年04月24 15时56分48秒
 System.DateTime.Now.ToString("yyyy年MM月dd HH时mm分ss秒");
 //星期二, 四月 24 2021
 System.DateTime.Now.ToString("dddd, MMMM dd yyyy");
 //二, 四月 24 ’08
 System.DateTime.Now.ToString("ddd, MMM d \"’\"yy");
 //星期二, 四月 24
 System.DateTime.Now.ToString("dddd, MMMM dd");
 //4-08
 System.DateTime.Now.ToString("M/yy");
 //24-04-08
 System.DateTime.Now.ToString("dd-MM-yy");

 //今天 获取短时间类型   2022/10/18 0:00:00
 DateTime.Now.Date.ToShortDateString();

 //7天后
 DateTime.Now.Date.ToShortDateString();
 DateTime.Now.AddDays(7).ToShortDateString();
 //7天前
 DateTime.Now.AddDays(-7).ToShortDateString();
 DateTime.Now.Date.ToShortDateString();
```

:::

#### ParseExact

```csharp
var str = "22/11/2009";
//IFormatProvider 一定要适配该时间字符串格式的区域 Cluture，如果不确定的话，可以使用通用的 CultureInfo.InvariantCulture。
DateTime date = DateTime.ParseExact(str, "dd/MM/yyyy", CultureInfo.InvariantCulture);
DateTime date2 = DateTime.Parse(str, CultureInfo.CreateSpecificCulture("en-GB"));
DateTime date3 = DateTime.ParseExact(str, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("zh-cn"));

var ifp = new CultureInfo("zh-CN", true);
DateTime? time1 =
    DateTime.TryParseExact("20231118093232", "yyyyMMddHHmmss", ifp, DateTimeStyles.None, out var time)
        ? time
        : null;
time1.Dump();

var ifp = new CultureInfo("zh-CN", true);
DateTime? time = DateTime.ParseExact("202311", "yyyyMM", ifp);
time.Dump();
```

#### DayOfWeek

DayOfWeek是用来判断日期是星期几的，是一个枚举值，一周从周日开始，所以0表示周日，6表示周六
```csharp
string[] Day = new string[] { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" };
var a = Day[Convert.ToInt16(DateTime.Now.DayOfWeek)];
Console.WriteLine(a);
```

#### **DateTimeKind**
**DateTimeKind**，用来定义实例表示的时间是基于本地时间(LocalTime)、UTC时间(UTC)或是不指定(Unspecified)。
在大多数情况下，我们定义时间就直接定义年月日时分秒，例如下面：
```csharp
DateTime myDate = new DateTime(2020, 7, 14, 14, 23, 40);
```
这种定义下，这个时间就是Unspecified的。
在使用时，如果应用过程中不做时间转换，始终以这种方式用，那不会有任何问题。但在某些情况下，时间有可能会发生转换，例如跨国应用的时间处理，再例如MongoDB，在数据库保存数据时，强制使用UTC时间。这种情况下，处理时间就必须采用LocalTime或UTC时间：
```csharp
DateTime myDate = new DateTime(2020, 7, 14, 14, 23, 40, DateTimeKind.Local);
```
或
```csharp
DateTime myDate = new DateTime(2020, 7, 14, 14, 23, 40, DateTimeKind.Unspecified);
```
否则，在时间类型不确定的情况下，时间转换会出现问题。
看看下面的例子：
```csharp
DateTime myDate = new DateTime(2020, 7, 14, 14, 23, 40);

var date1 = myDate.ToLocalTime();
Console.WriteLine(date1.ToString());
/* 7/14/2020 22:23:40 PM */

var date2 = myDate.ToUniversalTime();
Console.WriteLine(date2.ToString());
/* 7/14/2020 6:23:40 AM */
```
当使用ToLocalTime方法时，Unspecified时间会认为自己是UTC时间，而当使用ToUniversalTime时，Unspecified时间又会认为自己是LocalTime时间，导致时间上的转换错误。

#### 时间对象的加减
```csharp
DateTime date1 = new System.DateTime(2020, 7, 14);

TimeSpan timeSpan = new System.TimeSpan(10, 5, 5, 1);
DateTime addResult = date1 + timeSpan;
DateTime substarctResult = date1 - timeSpan; 

DateTime date2 = new DateTime(2020, 7, 14);
DateTime date3 = new DateTime(2020, 7, 15);

bool isEqual = date2 == date3;
```

#### TimeProvider

.NET 8 的 TimeProvider 特性：让你随心所欲地控制时间:https://mp.weixin.qq.com/s/4zff-zIdFtJGXbxcOsIl1g

```c#
 public class OrderService
 {
     private readonly TimeProvider _timeProvider;

     public OrderService(TimeProvider timeProvider)
     {
         _timeProvider = timeProvider;
     }

     public bool IsOrderExpired(Order order)
     {
         return order.ExpiryTime < _timeProvider.GetUtcNow();
     }
 }
 
 
 [TestClass()]
public class OrderServiceTests
{
    [TestMethod()]
    public void IsOrderExpiredTest()
    {
        var order = new Order
        {
            ExpiryTime = DateTimeOffset.UtcNow.AddSeconds(5)
        };

        var timeProvider = new FakeTimeProvider();
        var orderService = new OrderService(timeProvider);

        timeProvider.SetUtcNow(DateTimeOffset.UtcNow);
        Assert.IsFalse(orderService.IsOrderExpired(order));

        timeProvider.SetUtcNow(DateTimeOffset.UtcNow.AddSeconds(5));
        Assert.IsTrue(orderService.IsOrderExpired(order));
    }
}
```

## 时间戳

```csharp
// 获取时间戳
string time = ((DateTime.Now.ToUniversalTime().Ticks-621355968000000000) / 10000000).ToString();

/// <summary> 
/// 获取时间戳 
/// </summary> 
/// <returns>UTC</returns> 
public static string GetTimeStamp()
{
	TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
	return Convert.ToInt64(ts.TotalSeconds).ToString();
}

/// <summary>
/// 转换时间戳为C#时间
/// </summary>
/// <param name="timeStamp">时间戳 单位：毫秒</param>
/// <returns>C#时间</returns>
public static DateTime ConvertTimeStampToDateTime(long timeStamp)
{
    DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)); // 当地时区
    return startTime.AddMilliseconds(timeStamp);
}

/// <summary>
/// 转换c#时间为时间戳
/// </summary>
/// <param name="dt"></param>
/// <returns></returns>
public static long ConvertTimeStampToLong(DateTime dt)
{
    DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
    return Convert.ToInt64((dt - startTime).TotalMilliseconds);
}
```

## 阴历
DateTime本身依赖于日历Calendar类。Calendar是一个抽象类，在System.Globalization命名空间下，也在System.Runtime.dll中。而在Calendar类下面，提供了很多不同类型的日历。跟我们有关系的，是中国的阴历ChineseLunisolarCalendar。
```csharp
Calendar calendar = new ChineseLunisolarCalendar();

DateTime date = new DateTime(2020, 06, 24, calendar);
/* 7/14/2020 00:00:00 AM */
```
是否闰月
```csharp
Calendar calendar = new ChineseLunisolarCalendar();

bool is_leapYear = calendar.IsLeapYear(2020);
bool is_leapMonth = calendar.IsLeapMonth(2020, 5);
bool is_leapDay = calendar.IsLeapDay(2020, 5, 26);
```
公历转阴历
```csharp
DateTime date = DateTime.Now;

Calendar calendar = new ChineseLunisolarCalendar();

int year = calendar.GetYear(date);
/* 2020 */
int month = calendar.GetMonth(date);
/* 6 */
int day = calendar.GetDayOfMonth(date);
/* 24 */
```

## 农历
获取农历
```csharp
var currTime = DateTime.Now;
var ChineseCalendar = new ChineseLunisolarCalendar();
int year = ChineseCalendar.GetYear(currTime);
int day = ChineseCalendar.GetDayOfMonth(currTime);
int month = ChineseCalendar.GetMonth(currTime);
int leapMonth = ChineseCalendar.GetLeapMonth(year);
string date = string.Format("农历{0}{1}（{2}）年{3}{4}月{5}{6}"
    , "甲乙丙丁戊己庚辛壬癸"[(year - 4) % 10]
    , "子丑寅卯辰巳午未申酉戌亥"[(year - 4) % 12]
    , "鼠牛虎兔龙蛇马羊猴鸡狗猪"[(year - 4) % 12]
    , month == leapMonth ? "闰" : ""
    , "无正二三四五六七八九十冬腊"[leapMonth > 0 && leapMonth <= month ? month - 1 : month]
    , "初十廿三"[day / 10]
    , "十一二三四五六七八九"[day % 10]);
Console.WriteLine($"当前时间：{currTime},农历是：" + date);
```
二十四节气
```csharp
public static string ChineseTwentyFourDay(DateTime date)
{
    var solarTerm = new string[]
    {
        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
        "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
    };
    var sTermInfo = new int[]
    {
        0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989,
        308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758
    };
    var baseDateAndTime = new DateTime(1900, 1, 6, 2, 5, 0); //#1/6/1900 2:05:00 AM#
    DateTime newDate;
    double num;
    int y;
    var tempStr = "";

    y = date.Year;

    for (var i = 1; i <= 24; i++)
    {
        num = (525948.76 * (y - 1900)) + sTermInfo[i - 1];

        newDate = baseDateAndTime.AddMinutes(num); //按分钟计算
        if (newDate.DayOfYear != date.DayOfYear) continue;
        tempStr = solarTerm[i - 1];
        break;
    }

    return tempStr;
}
```

## 常用操作

### 获取本周第一天
```csharp
private DateTime GetWeekFirstDay()
{
	var currTime = DateTime.Now;
	//星期一为第一天
	int weeknow = Convert.ToInt32(currTime.DayOfWeek);
	//因为是以星期一为第一天，所以要判断weeknow等于0时，要向前推6天。
	weeknow = (weeknow == 0 ? 6 : (weeknow - 1));
	//本周第一天
	return currTime.AddDays(-weeknow);
}
```

### 连续签到天数
```csharp
private int GetContinuousExerciseDays(List<DateTime> completedTimes)
{
	var days = 0;
	if (completedTimes.Any())
	{
		days = 1;
		completedTimes = completedTimes.OrderBy(x => x).Select(x => DateTime.Parse(x.ToShortDateString()))
			.GroupBy(x => x).Select(x => x.FirstOrDefault()).ToList();
		for (var i = 0; i < completedTimes.Count - 1; i++)
			if (completedTimes[i + 1].Subtract(completedTimes[i]).Days == 1)
				days++;
			else
				days = 1;
	}
	return days;
}
```

### 计时器

#### Stopwatch
```csharp
//方案1 
var stopwatch = Stopwatch.StartNew();//开始计时
stopwatch.Stop();//计时结束
stopwatch.Reset();//重新设置为零
stopwatch.Restart();//重新设置并开始计时
Console.WriteLine(stopwatch.ElapsedMilliseconds);

//方案2
System.Diagnostics.Stopwatch sw = new System.Diagnostics.Stopwatch();
sw.Start();
var list = Json.ToObject<List<BookModel>>(books.ToJson());
sw.Stop();
var s = sw.ElapsedMilliseconds;//毫秒
Console.WriteLine($"当前总花费时间：{s}毫秒");
```
详细可以参考文档：https://docs.microsoft.com/en-us/dotnet/api/system.diagnostics.stopwatch?view=net-6.0#methods

#### ValueStopwatch
.NET Core 内部定义了一个 ValueStopwatch 的结构体来减少使用 Stopwatch 带来的内存分配从而提高性能
ValueStopwatch 定义如下，可以参考：https://github.com/dotnet/aspnetcore/blob/main/src/Shared/ValueStopwatch/ValueStopwatch.cs
```csharp
var watch = ValueStopwatch.StartNew();

DoWork();

return watch.GetElapsedTime();
```

#### Stopwatch.GetTimestamp
从前面 ValueStopwatch 的实现代码可以看的出来，主要使用的代码是 Stopwatch.GetTimestamp()，在这个方法的基础上进行的实现，在 .NET 7 中会增加两个 GetElapsedTime 的方法来比较高效地获取耗时时间，使用方式如下：
```csharp
var start = Stopwatch.GetTimestamp();

DoWork();

return Stopwatch.GetElapsedTime(start);

// 或者

var start = Stopwatch.GetTimestamp();

DoWork();

var stop = Stopwatch.GetTimestamp();
return Stopwatch.GetElapsedTime(start, stop);
```

## 资料
[https://mp.weixin.qq.com/s/iouEqGXl2HgiPjSIGhUf7A](https://mp.weixin.qq.com/s/iouEqGXl2HgiPjSIGhUf7A) | 统计耗时的几种方式
