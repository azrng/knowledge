---
title: 数组
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: shuzu
slug: rchedhdg9f1ye6v8
docsId: '146446300'
---
## 说明

数组适用于循环处理
数组拥有随机访问特性
数据适用于按顺序存放数据、查找数据
因为其在内存中是连续存储的，所以他的索引速度是非常快的，而且赋值与修改元素也很简单，  
例如  

```csharp
  string[] s=new string[3];
   //赋值
   s[0]="a"; s[1]="b"; s[2]="c";
   //修改
   s[1]="b1";

如何判断数组中是否包含重复数据
public bool IsRepeat(string[] yourValue)
{
    Hashtable ht = new Hashtable();
    for (int i = 0; i < yourValue.Length - 1; i++)
    {
        if(ht.Contains(yourValue[i]))
        {
            return true;
        }
        else
        {
           ht.Add(yourValue[i], yourValue[i]);
        }
    }
    return false;
}
```
缺点就是：在两个数据间插入数据是很麻烦的，还有在声明数组的时候，必须同时执行数组的长度，数组长度过长会造成内存浪费，过短会造成溢出的错误。然后提供了ArrzyList对象来克服这些缺点。

#### **ArrayList**
大小是按照其中存储的数据来动态扩充与收缩的，所以我们在声明的时候不需要执行他的长度，继承了IList接口，所以可以很方便的进行数据的添加、插入、移除操作。
```csharp
 ArrayList list = new ArrayList();
   list.Add(1);//添加一个元素  传递的参数是object类型
   list.Remove(1);
   list.Add(11);
   list.Insert(2, 4);
   //list.RemoveAt();//移除指定索引位置的元素
   //list.Clear();//移除所有元素
   list.Add(99);
   //list.Sort(); //可以对某一个范围内的东西进行排序
```
但是因为每个元素都是object类型，所以在取值时候容易出现类型不匹配的错误，也就是说ArrzyList不是类型安全的，还有会导致经常得装箱拆箱，占用性能损耗并且占用很大空间  

#### List
List类是ArrzyList类的泛型等效类，他的大部分用法和ArrayList相似，因为他也继承了IList接口，但是我们在声明List集合的时候我们需要声明其数据的对象类型，但是他是类型安全的，并且不会装箱拆箱导致性能浪费。
```csharp
 List<int> list = new List<int>();
            list.Add(11);//添加单个元素
            list.AddRange(new int[] { 1, 2, 3, 4, 5 }); //添加多个元素
            list.AddRange(list);//可以添加集合
            //输出使用for循环出来 
            //list泛型集合转换成数组
            int[] nums = list.ToArray();//数组类型取决于泛型类型
            List<int> listtwo = nums.ToList();//数组转换成泛型
            //定义一个泛型 
            List<int> array = new List<int>() { 3, 4, 1, 5, 4, 45, 87, 65 };
            //所有大于30的集合元素
            IEnumerable<int> value1 = from u in array
                                      let n = Convert.ToInt32(u)
                                      where u > 30
                                      select u;
            int a = value1.ToList()[0];//
            //所有大于30的集合元素
            List<int> c = array.FindAll(e => e > 30);
            //返回3这个元素所在的位置索引
            int a2 = array.FindIndex(f => f == 3);
            //返回与条件相互匹配的最后一个元素
            int a3 = array.FindLast(g => g > 30);
            //返回最后匹配一个元素的索引
            int a4 = array.FindLastIndex(y => y > 40);
           //定义一个泛型 
            List<int> array = new List<int>() { 3, 4, 1, 5, 4, 45, 87, 65 };
            //返回排序后的泛型
            var value2 = array.OrderByDescending(i => i).ToList();
            //使用reverse也可以进行倒叙排列
            //返回排序后的泛型
            var value3 = (from u in array
                         orderby u descending
                         select u).ToList();
             list.sort();
```
Any:如果有数据则返回true ，否则返回false。     
Dictionary和HashSet效率相比较list 数组效率高  
HashSet对比list，就添加list比HashSet快
效率上，IList没有List效率高。

#### 字典

更快的字典：[https://blog.ndepend.com/faster-dictionary-in-c/](https://blog.ndepend.com/faster-dictionary-in-c/)

##### Dictionary
```csharp
dictionary<int,string> dic=new dictionary<int,string>();
dic.add(1,"");//键必须是唯一的
//修改数据
dic[1]="";
//使用foreach获取  键使用dic.keys  值dic[keys]
//另一个获取的方法
foreach(keyValuePair<int,string> kv in dic)
{
console.writeLine("{0}----{1}",kv.key,kv.Value);;
}


```

##### ConcurrentDictionary
ConcurrentDictionary和Dictionary对比
[https://www.cnblogs.com/zhuyapeng/p/12754829.html](https://www.cnblogs.com/zhuyapeng/p/12754829.html)

#### 循环

##### Parallel.For
为固定数目的独立For循环迭代提供了负载均衡式的并行执行

##### Parallel Foreach（并行foreach）
为固定数目的独立ForEach循环迭代提供了负载均衡式的并行执行。这个方法支持自定义分区器（Partitioner），以使得我们可以完全掌控数据分发。
使用场景：对于数据量大的使用该方法，数据量小的不建议
```csharp
Parallel.ForEach(list,x=>{
    //逻辑操作
});
或者
List.Foreach(ex=>{
   //逻辑操作
});
```
并行是并发的子集，并发和并行都可以多线程执行，就看其处理器是否是多核的，这些线程能不能同时被cpu多个核执行，如果可以就说明是并行，而并发是多个线程被cpu单核轮流切换着执行。**总之，只有在多核处理器上并行才会有意义**。

### 索引
使用system.Index从尾部向前对集合进行索引
```sql
string[] cities = { "Kolkata", "Hyderabad", "Bangalore", "London", "Moscow", "London", "New York" };
var city = cities[^1];
Console.WriteLine("The selected city is: " + city);//New York
```

### 切片
使用system.Range从array或者span上提取子集合
```sql
//提取string的最后六个字符
string str = "Hello World!";
Console.WriteLine(str[^6..]);//World!

//提取子集合
 int[] integers = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
 var slice = integers[1..5];
 foreach (int i in slice)
 {
    Console.WriteLine(i);
 }
 //1 2 3 4
```

#### span
span可用于高性能的字符串分割

### 迭代器
别名是游标，意图：提供一张方法顺序访问一个聚合对象中各个元素，而又不暴露该对象内部标识。
> 文档：[**迭代器模式的一种应用场景以及C#对于迭代器的内置支持**](https://www.cnblogs.com/onepiece_wang/p/5361741.html)


### 扩展方法

- 扩展方法必须是静态方法
- 扩展方法必须在静态类里面，类的名称无所谓
- 扩展方法的第一个参数一定是 this，后面跟上你需要扩展的类型
> 扩展方法的优先级低于同名的非扩展方法


### 表达式树
Expression<Func<T, bool>>，是一个表达式参数。
Expression<Func<Product, bool>> 类型，调用其 Compile 方法，可以得到 Func<Product, bool> 类型的委托。
动态构建linq表达式对于不能在编译时候建立查询，只能在运行时创建查询的场景很有用。
缺点是：不易维护、不易阅读、不易调试，如果最终的表达式执行出错，很难通过调试来发现具体是构建中的哪一出问题了。

### 链表
链表指的是像链条一样的结构。
遍历链表的时间复杂度是O（n）
链表在处理和插入数据时，非常灵活。

### 枚举
```csharp
    public enum WeChatAppTypeEnum
    {
        [Description("未知类型")] None = 0,
        [Description("公众号")] Mp = 1,
        [Description("小程序")] Mini = 2,
        [Description("企业微信")] QY = 3,
        [Description("App")] App = 4
    }
```

### 数据定位Index
```csharp
            var array = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 };
            //获取某个位置的数据
            var aa = array[1];
            var aa2 = array[new Index(1, false)];//第二个参数fromEnd为true从后往前 false从前往后 
            var aa4 = array[new Index(1)];//第二个参数默认是false
            var aa3 = array[^9];//fromEnd为true时候的简写方法
```
> 输出都是2


### 数据范围Range
```csharp
            var array = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 };
            //获取一个范围的数据
            var aa = array.Skip(3).Take(2);
            var aa2 = array[new Range(3, 5)];
            var aa3 = array[3..5];
```
> 输出 4，5

写法延伸
```csharp
var xx = array[3..];        //从第3个数据到最后
var xx = array[..5];        //从头到第4个数据(注意后面是不包含)
var xx = array[..];            //全部
var xx = array[0..^0];    //全部
```

