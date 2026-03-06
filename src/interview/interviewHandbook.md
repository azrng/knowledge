---
title: 面试宝典
lang: zh-CN
date: 2023-07-23
publish: true
author: azrng
isOriginal: false
order: 199
category:
  - 面试
tag:
  - 经验
filename: interviewHandbook
level: 0
docsId: '8f88973d-b1ad-4dba-9b16-d48478485016'
# 是否显示到列表
article: false
---
45、在MVC中如何保持Sessions？

可使用tempdata、viewdata、viewbag三种方式。其中tempdata：在不同的控制器或动作间转换时保持数据。另外，进行页面转向时，tempdata可以保持数据，它是一个内部的Session变量。Viewdata：可以在控制器和视图间保持数据。Viewbag：它是视图数据的动态包装，使用viewbag不需要类型转换，它使用的是内部动态关键词。

46、MVC中如何做输入验证？

在M层使用数据模型的属性标签形如Required,在C层使用ModelState.IsValid属性检查数据是否正确，也可在C层使用JavaScript进行数据验证。

47、已经有了ASPX，为什么还要Razor？哪个更好？

Razor是一个轻量级的视图引擎，MVC3引入，相比ASPX，Razor更干净、轻量级、语法更简单，只需要使用@关键字，如@DataTime.Now

48、MVC有多少种不同类型的结果类型，请详细描述？

有12种，最主要的是ActionResult类，它是一个基础类，它有11个子类型。

ViewResult - 给响应流渲染指定的视图

PartialViewResult - 给响应流渲染指定的局部视图

EmptyResult - 返回空的响应结果。

RedirectResult - 执行一个HTTP转向到指定的URL。

RedirectToRouteResult -执行一个HTTP转向到一个URL，这个URL由基于路由数据的路由引擎来决定

JsonResult - 序列化一个ViewData对像到JSON格式。

JavaScriptResult - 返回一段javascript代码，它可以在客户端执行。

ContentResult - 写内容到响应流，不需要视图支持。

FileContentResult - 返回一个文件到客户端。

FileStreamResult - 返回一个文件到客户端，它提供的是流。

FilePathResult - 返回一个文件到客户端。

 

49、以下两种异常处理方式有什么区别

```
try {} catch(){throw;} try{}catch(Exception ex){Throw ex;}
```

前者catch无参数，可以捕获所有异常，只有throw关键字，表示抛出当前catch语句捕获的异常。

后者catch有参数，可以捕获所有以Exception类派生的异常，throw 变量名；抛出的是Exception异常或Exception派生的类型

50、用接口或父类作为输入的参数有什么好处？返回值如果是接口是为了什么？

接口或父类作为参数，所有继承了此接口或父类的类都可以使用，即你给此方法传参数的时候，可以把继承了这个接口或父类的类的实例传给这个方法。可以一次性传入多种字段、方法等而不用定义多个形参。

接口作为返回值，返回的是实现接口的对象。



51、C#和JS的闭包？

闭包的概念是内层的函数可以引用包含在它外层的函数的变量，即使外层函数的执行已经终止。但该变量提供的值并非变量创建时的值，而是在父函数范围内的最终值。

C#闭包可理解为跨作用域访问函数内变量，那么如何避免闭包陷阱呢？C#中普遍的做法是，将匿名函数引用的变量用一个临时变量保存下来，然后在匿名函数中使用临时变量。JS闭包，在js中的我的理解就是函数嵌套函数，当内部函数在定义它的作用域的外部被引用时,就创建了该内部函数的闭包 ,如果内部函数引用了位于外部函数的变量,当外部函数调用完毕后,这些变量在内存不会被释放,因为闭包需要它们。

 

52、Ajax操作怎么处理session过期？

当Session过期时，我们获取请求头信息值判断是否为ajax请求，如果是，我们可以返回特定格式的JSON数据，客户端可以对此数据处理，发现session失效，可以跳转到其他页面如登录等。

 

53、简要谈一下你对微软.Net架构下remoting和webservice两项技术的理解及实际中的应用？

Remoting可以利用TCP/IP，二进制传送提高效率，webservice可利用http，穿透防火墙。

远程逻辑调用，remoing接口只能用在.net remoting是.net 中用来跨越machine,process, appdomain 进行方法调用的技术,对于三成结构的程序，就可以使用remoting技术来构建，它是分布应用的基础技术.相当于以前的DCOM

WebService是一种构建应用程序的普通模型，并能在所有支持internet网通讯的操作系统上实施。Web Service令基于组件的开发和web的结合达到最佳，基于组件的对象模型。

 

54、Sleep()和wait()有什么区别？

1. sleep是线程类Thread 的方法，它是使当前线程暂时睡眠，可以放在任何位置。

而wait，它是使当前线程暂时放弃对象的使用权进行等待，必须放在同步方法或同步块里。

2.Sleep使用的时候，线程并不会放弃对象的使用权，即不会释放对象锁，所以在同步方法或同步块中使用sleep，一个线程访问时，其他的线程也是无法访问的。

而wait是会释放对象锁的，就是当前线程放弃对象的使用权，让其他的线程可以访问。

3.线程执行wait方法时，需要其他线程调用Monitor.Pulse()或者Monitor.PulseAll()进行唤醒或者说是通知等待的队列。

而sleep只是暂时休眠一定时间，时间到了之后，自动恢复运行，不需另外的线程唤醒。

 

55、在c#中using和new这两个关键字有什么意义，请写出你所知道的意义？

using 引入名称空间或者使用非托管资源，使用完对象后自动执行实现了IDisposable接口的类的Dispose方法。

 

new 新建实例或者隐藏父类方法。

 

56、string str=null与string str="" 有什么区别？

string str=null 把这个引用指向了一个null，没有地址没有值的地方，即没分配内存空间

string str="" 把这个引用指向了一个地址，地址里面存的是空的字符，即占用了内存空间

 

57、序列化有何作用？

通过流类型可以方便地操作各种字节流，但如何把现有的实例对象转换为方便传输的字节流，就需要用到序列化的技术。

 

58、.Net中会存在内存泄漏吗？请简单描述。

所谓内存泄露就是指一个不再被程序使用的对象或变量一直被占据在内存中。.Net中有垃圾回收机制，它可以保证一对象不再被引用的时候，即对象编程了孤儿的时候，对象将自动被垃圾回收器从内存中清除掉。虽然.Net可以回收无用的对象，但是.Net仍然存在由于使用不当导致的内存泄露问题。.Net中的内存泄露的情况：长生命周期的对象持有短生命周期对象的引用就很可能发生内存泄露，尽管短生命周期对象已经不再需要，但是因为长生命周期对象持有它的引用而导致不能被回收，这就是.Net中内存泄露的发生场景，通俗地说，就是程序员可能创建了一个对象，以后一直不再使用这个对象，这个对象却一直被引用，即这个对象无用但是却无法被垃圾回收器回收的，这就是.Net中可能出现内存泄露的情况，例如，缓存系统，我们加载了一个对象放在缓存中(例如放在一个全局Dictionary对象中)，然后一直不再使用它，这个对象一直被缓存引用，但却不再被使用。

 

59、JavaScript中的“=、==、===”区别？

=：即赋值运算；

==：判断两个变量是否相同，仅限于值，如果值相同而类型不同，那么JavaScript引擎会在内部做类型转换；

===：判断两个变量是否相同，无论是值还是类型，如果类型不同而值相同，也会返回false，而引擎不会在内部进行转换。

 

60、JavaScript中的“undefined、null”区别？

通俗地讲，undefined出现的原因是JavaScript引擎不知道这是个什么东西，而对于null，JavaScript引擎识别了它，但是没有被分配内存空间。

undefined的类型就是undefined，而null的类型是object。

 

61、简述javascript的作用域和闭包？

js变量的作用域是指：函数内定义的局部变量只在此函数内有效，而全局变量可以全局有效。

闭包的作用就在于能够改变局部变量的作用域，将值保存下来，但是如果使用不当会造成无法回收变量，引起性能问题，甚至崩溃。

 

62、列举你用过的javascript框架，并简述它们的优缺点？

js框架：jQuery EasyUI、ExtJS、Bootstrap、AngularJS等等。

jQuery EasyUI：轻量级web前端ui开发框架，尤其适合MIS系统的界面开发，能够重用jquery插件。

ExtJS：统一的前端UI开发框架，学习难度中等。尤其适合MIS系统的界面开发，开发文档和例子代码都比较完整。缺点是大量的js脚本，降低了运行速度。

Bootstrap：响应式网站开发框架，优点是降低了后端开发人员开发前端页面的难度，统一了界面风格，缺点是界面风格比较单一。

AngularJS：将java后端的优秀特性引入到了js前端，大而全的框架。缺点是学习曲线高，Angular2几乎重写。

 

63、什么是反射？

程序集包含模块，而模块又包括类型，类型下有成员，反射就是管理程序集，模块，类型的对象，它能够动态的创建类型的实例，设置现有对象的类型或者获取现有对象的类型，能调用类型的方法和访问类型的字段属性。它是在运行时创建和使用类型实例。

 

64、XML 与 HTML 的主要区别？

1. XML是区分大小写字母的，HTML不区分。 
2. 在HTML中，如果上下文清楚地显示出段落或者列表键在何处结尾，那么你可以省略&lt;/p&gt;或者&lt;/li&gt;之类的结束 标记。在XML中，绝对不能省略掉结束标记。 

```
HTML：<img src="1.jpg"><br><br>

XML：<img src="1.jpg"></img>
```



3. 在XML中，拥有单个标记而没有匹配的结束标记的元素必须用一个 / 字符作为结尾。这样分析器就知道不用 查找结束标记了。 
4. 在XML中，属性值必须分装在引号中。在HTML中，引号是可用可不用的。
5. 在HTML中，可以拥有不带值的属性名。在XML中，所有的属性都必须带有相应的值。

XML是用来存储和传输数据的

HTML是用来显示数据的

如果使用了完全符合XML语法要求的HTML，那么就叫做符合XHTML标准。符合XHTML标准的页面有利于SEO。

 

65、不用中间变量交换两个变量？

```
int i = 500;

int j = int.MaxValue - 10;

//int i = 10;

//int j = 20;

 

Console.WriteLine("i={0},j={1}", i, j);

 

i = i + j;//i=30

j = i - j;//j=10;

i = i - j;//i=20;

 

Console.WriteLine("i={0},j={1}",i,j);
```



位逻辑或运算将两个运算对象按位进行或运算。或运算的规则是：1或1等1，1或0等于1，

0或0等于0。

另外一个解决方案：位运算。^位逻辑异或运算 相同得0，相异得1。

int  a=5; 

int  b=6;

a=a^b; 

b=b^a;  //b^a相当于  b^a^b  也就是  b^a^b的值就是a了,  下边相同  

a=a^b;

 

66、请编程遍历WinForm页面上所有TextBox控件并给它赋值为string.Empty？

```
foreach (System.Windows.Forms.Control control in this.Controls) 

{ 

if (control is System.Windows.Forms.TextBox) 

{ 

System.Windows.Forms.TextBox tb = (System.Windows.Forms.TextBox)control ; 

tb.Text = String.Empty ; 

} 

}
```

67、一个数组：1,1,2,3,5,8,13,21...+m，求第30位数是多少？

写递归要确定两个：递归的终止条件；递归表达式。



```c#
// 解答：总结递归规律：F(n)=F(n-2)+F(n-1) Fibonacci数列   
static int F(int n)
{
   if (n == 1)
   {
     return 1;
   }
   if (n == 2)
   {
     return 1;
   }
   return F(n - 2) + F(n - 1);
 }

```

非递归(有bug吗？)，递归算法的缺点：测试大数据
      ```
    
nt n = Convert.ToInt32(Console.ReadLine());
if (n <= 0)
{
  Console.WRiteLine("必须大于0");
  return;  
}

 if (n == 1) //时刻注意边界值！！！
 {
   Console.WriteLine("1");
   return;
 }
 int[] data = new int[n];
 data[0] = 1;
 data[1] = 1;
 for (int i = 2; i < n; i++)
 {
   data[i] = data[i - 1] + data[i - 2];
 }

      ```

上面程序的时间复杂度为O(n)，空间复杂度为O(n)

 

参考：

算法复杂度：时间复杂度：算法运行需要消耗的时间的数量级、空间复杂度：算法运行需要消耗的内存的数量级。

消耗的时间或者内存随着问题规模的扩大而成正比增加，就是O(n)。

消耗的时间或者内存随着问题规模的扩大而不变，就是O(1)。

消耗的时间或者内存随着问题规模的扩大而n\*n增加，就是O(n*n)

算法复杂度只考虑最差情况（从一个数组中找出第一个大于10的数，时间复杂度为O(n)），并且算法复杂度忽略常量和低阶。把数组数一遍和数两遍的时间复杂度都是O(n)。把长度为n的数组数n/2遍的时间复杂度还是O(n*n)。

68、冒泡排序

```c#
var nums = new int[] { 5, 8, 50, 1, 6 };
for (int j = 0; j < nums.Length - 1; j++)
{
    for (int i = 0; i < nums.Length - 1 - j; i++)
    {
        if (nums[i] > nums[i + 1])
        {
            int temp = nums[i];
            nums[i] = nums[i + 1];
            nums[i + 1] = temp;
        }
    }
}
```

69、求以下表达式的值，写出您想到的一种或几种实现方法：1-2+3-4+……+m

```
int Num = this.TextBox1.Text.ToString();
int Sum = 0;
for (int i = 0; i < Num + 1; i++)
{
    if ((i % 2) == 1)
    {
        Sum += i;
    }
    else
    {
        Sum = Sum - I;
    }
}

System.Console.WriteLine(Sum.ToString());

System.Console.ReadLine();
```