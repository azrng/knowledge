---
title: 委托
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: weituo
slug: iqhbtk
docsId: '31694735'
---

## 介绍

### 描述
委托(Delegate)由来，早在c/c++中，有一个概念叫做函数的指针，其实就是一个内存指针，指向一个函数，想去调用函数的时候，只要调用函数指针就可以了，至于函数本身的实现，可以放在其他地方，也可以后实现。到了net中，没有指针的概念，但是这种方法保存了下来，形成了现在的委托Delegate。委托本身也是一种引用类型，它保存的是托管堆中对象的引用，只不过这个引用是对方法的引用。
> 自己理解：委托可以保存好多同种方法(入参和出参的类型相同)的调用方式，当你去调用委托的时候，委托去代替你调用指定的方法。


### 优点
委托间接的将调用者和目标方法解耦(目标方法没见过调用者，调用者也不认真目标方法)。举个常见的例子，UI编程中的按钮Button类。按钮类本身并不知道它的OnClick事件是如何处理的，也不需要知道。所以实际中，OnClick事件就是使用委托发布的。开发者在开发过程中实现OnClick事件的处理，并由UI订阅使用。这种方式就是利用委托对类的解耦。调用者调用委托，然后委托再去调用目标方法。

## 操作

### 定义委托
委托类型定义了方法的返回类型(bool)和参数类型(int)
```csharp
//委托类型
delegate bool Transformer(int x);
```
Transformer兼容(存放)任何返回类型为bool并且有一个入参类型为int的方法,例如
```csharp
public static bool Vaild(int x)
{
    return x > 0;
}
```
将该方法赋值给一个委托变量就是创建了一个委托实例
```csharp
//委托实例
Transformer transformer = Vaild;
```
然后就可以让我(调用者)通过委托调用未曾蒙面的方法(假设Vaild方法是另一个同事写的)。
```csharp
Console.WriteLine(transformer(5));// True
Console.WriteLine(transformer.Invoke(-1));// False
```
调用者(我)调用委托(transformer),委托去调用方法(Vaild)。

### 委托是方法的指针
实现一个带上传进度通知的类
```csharp
internal class Program
{
    private static void Main(string[] args)
    {
        Console.WriteLine("Hello World!");
        var fileUpload = new FileUpload();
        //赋值的过程就是将自身所具有的和委托声明相同的声明方法名赋值给FileUploaded
        fileUpload.FileUploaded=OutPutMessage;
        fileUpload.FileUploaded+=ProgressAnother;
        fileUpload.Upload();
    }

    public static void OutPutMessage(int message)
    {
        Console.WriteLine(message);
    }
    public static void ProgressAnother(int message)
    {
        Console.WriteLine("另一个通知方法"+message);
    }
}

/// <summary>
/// 文件传输的进度通知
/// 演示目的：委托是方法的指针
/// </summary>
public class FileUpload
{
    public delegate void FileUploadHandler(int progress);

    public FileUploadHandler FileUploaded;

    public void Upload()
    {
        int fileProgress = 100;
        while (fileProgress>0)
        {
            fileProgress--;
            FileUploaded?.Invoke(fileProgress);
        }
    }
}
```
上面这个有一个问题就是，调用者可以修改委托的FileUploaded为null，也可以直接被外部调阅，比如
```csharp
// 会导致原来的需要订阅的地方接收不到通知
fileUpload.FileUploaded=null;
// 原本应该由FileUpload类自己执行的，变成通过调用者去执行了
fileUpload.FileUploaded(10);
```
基于上述问题，我们可以修改为通过事件(event)处理，它为委托加了保护，比如修改为
```csharp
public class FileUpload
{
    public delegate void FileUploadHandler(int progress);

    public event FileUploadHandler FileUploaded;

    public void Upload()
    {
        int fileProgress = 100;
        while (fileProgress>0)
        {
            fileProgress--;
            FileUploaded?.Invoke(fileProgress);
        }
    }
}
```
那么上面的几种情况就会在编辑期间被阻止，下面这些都是错误的提示
```csharp
fileUpload.FileUploaded=null;
fileUpload.FileUploaded(10);
fileUpload.FileUploaded=OutPutMessage;
```
错误信息是：事件‘xxxx’只能出现在+=或者-=的左边。

### 委托链
委托链的核心就是维护一个可调用的委托列表。当调用列表的是，列表中的所有委托都会被调用。同时，委托链可以使用操作符，+来组合，-来删除
```csharp
    //要引用的方法的返回类型或参数要与委托类型声明相匹配。
    public delegate void Delegate_Method(int x, int y);

    internal class Program
    {
        private static void Main(string[] args)
        {
            Delegate_Method[] delegate_list = new Delegate_Method[] { Sum, Sub };
            //委托加法
            Delegate_Method delegate_jia = delegate_list[0] + delegate_list[1];//组合委托
            delegate_jia(100, 50);

            Console.WriteLine("****************************************");
            //委托减法
            Delegate_Method delegate_jian = delegate_jia - delegate_list[1];//移除委托
            delegate_jian(100, 50);

            Console.WriteLine("****************************************");
            //GetInvocationList方法获取委托链中的所有委托 
            Delegate[] delegates = delegate_jia.GetInvocationList();
            for (int i = 0; i < delegates.Length; i++)
            {
                var _delegate = (Delegate_Method)delegates[i];
                _delegate(100, 50);
            }

            Console.ReadLine();
        }

        public static void Sum(int x, int y)
        {
            Console.WriteLine(x + y);
        }

        public static void Sub(int x, int y)
        {
            Console.WriteLine(x - y);
        }
```

### 多播委托
所有的委托实例都拥有多播能力，这就代表一个委托实例可以引用一个目标方法，也可以引用多个目标方法，这就称为多播，多播委托时候，只能组合相同类型的委托。操作符(+、+=、-、-=)可用于从组合委托中增加/删除委托组件。
```csharp
//要引用的方法的返回类型和传入参数要与委托类型声明相匹配。
public delegate void Delegate_Method(int x, int y);
private static void Main(string[] args)
{
    //多播委托的返回类型总是void
    Delegate_Method delegate1, delegate2, delegate3, delegate4;

    delegate1 = null;

    //多播委托
    delegate1 += Sum;
    delegate1.Invoke(0, 1);
    Console.WriteLine("-----");
    delegate1 += Sub;
    delegate1.Invoke(1, 2);
    delegate1 -= Sum;
    delegate1 -= Sub;
    if (delegate1 is null)
        Console.WriteLine("delegate1为null");
    delegate1 += Sum;
    Console.WriteLine("----delegate1执行结束 分割线----");

    delegate2 = Sub;
    delegate2 += delegate1;
    // 委托是不可变的，因此调用+=和-=的实质是创建一个新的委托实例，并把它赋值给已有变量。
    delegate2.Invoke(3, 4);

    Console.WriteLine("----delegate2执行结束 分割线----");

    //组合委托
    delegate3 = delegate1 + delegate2;//委托对象分配给一个委托实例，以便使用操作符进行多播

    delegate3(100, 50);//组合委托调用由它组成的多个委托
    Console.WriteLine("----delegate3执行结束 分割线----");

    delegate4 = delegate3 - delegate2;// delegate1
    delegate4(100, 50);
    Console.WriteLine("----delegate4执行结束 分割线----");
}
public static void Sum(int x, int y)
{
    Console.WriteLine(x + y);
}
public static void Sub(int x, int y)
{
    Console.WriteLine(x - y);
}
```
返回结果
```csharp
1
-----
3
-1
delegate1为null
----delegate1执行结束 分割线----
-1
7
----delegate2执行结束 分割线----
150
50
150
----delegate3执行结束 分割线----
150
----delegate4执行结束 分割线----
```
> 多播委托返回类型总是void，如果返回值不是void，那么只会接受最后一个被调用的方法来返回值。


## 使用场景
1.有A,B两个方法，这两个方法比较长，中间那部分一样，那么这个时候就可以将中间那部分做成一个委托，然后在ab两个方法里面调用这个委托，这个情况下这个委托是可以通过抽出来公共方法进行替换的
2.有A,B两个方法，这两个方法比较长，上面和下面代码一样，中间的那块代码不一样，但是又相似点(请求参数和返回参数有某种继承关系),这个时候就可以将中间那部分作为两个委托方法，然后ab两个方法合为c，然后调用c的时候，根据不同的情况传输不同的委托方法作为c方法的参数

### 封装好的泛型委托
```csharp
//无返回值，无参数委托，不需要单独声明
Action act = this.DoNothing;
//无返回值，有参数委托，参数类型为泛型
Action<string> act = p => { };
//返回类型为string，参数类型为string的委托
Func<string,string> func = p => p;
//返回类型为bool，参数类型为string的委托
Func<string,bool> func = p => p.Equals('');
```
除了用户自定义的委托之外，系统还为用户提供了一个内置的委托类型Action和Func

#### Action委托
`Action`属于无参数无返回值的函数类型
`Action<T>`通过设置泛型，我们可以定义多个参数，无返回值的函数
当函数有多个重载时候，系统会自动匹配
Action是没有返回值的
参数也是0或者最多16个
常用例子：
```csharp
class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            UserInfo userInfo = new UserInfo()
            {
                id = "222",
                Name = "我是测试数据",
                Age = 10
            };
            var str = Test(userInfo, (info) =>
            {
                //可以可以拿到一个useinfo类型的对象，可以对其进行操作
                info.Name = "我已经不是当初那个值了";
                info.Age = 100;
                //我是一个委托但是我并没有返回值
            });
            Console.WriteLine(str);
 
        }
        public static string Test(UserInfo userInfo, Action<UserInfo> action)
        {
            UserInfo userInfo1 = new UserInfo()
            {
                id = "1",
                Name = userInfo.Name,
                Age = userInfo.Age
            };
            action.Invoke(userInfo1);
            return userInfo1.Name;
        }
 
    }
    public class UserInfo
    {
        public string id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
    }
```
返回值：
![image.png](/common/1613872694982-1b0b4a67-7fdb-41a5-86e3-c30a09086f9e.png)

#### Func委托
Func只有带泛型的一种形式，Action有带泛型和不带的两种
Func委托必须要带一个返回值
可以有0个最多16个参数类型
最后一个泛型参数代表返回类型，前面的都是参数类型
参数类型必须跟指向的方法的参数类型按照顺序对应 
常用例子
```csharp
class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            UserInfo userInfo = new UserInfo()
            {
                id = "222",
                Name = "我是测试数据"
            };
            var str = Test(userInfo, (info) =>
              {
                 //可以可以拿到一个useinfo类型的对象，可以对其进行操作
                  info.Name = "我已经不是当初那个值了";
                  //我是一个委托,并且我包含返回值
                  return info.Name;
              });
            Console.WriteLine(str);
        }
        public static string Test(UserInfo userInfo, Func<UserInfo, string> action)
        {
            UserInfo userInfo1 = new UserInfo()
            {
                id = "1",
                Name = userInfo.Name
            };
            return  action.Invoke(userInfo1);
        }
    }
    public class UserInfo
    {
        public string id { get; set; }
        public string Name { get; set; }
    }
```
返回值：我已经不是当初那个值了

#### Predicate委托
常用语检索collection，语法结构：`Predicate<T>`
示例用法：
```csharp
Predicate<Customer> hydCustomers = x => x.Id == 1;
Customer customer = custList.Find(hydCustomers);
```

### 异步调用委托
```csharp
Task task = Task.Run(() => ((SendDelegate)item).Invoke(msg));
```

## 资料

委托和事件应用场景：[https://www.cnblogs.com/guoqiang1/p/8138889.html](https://www.cnblogs.com/guoqiang1/p/8138889.html)
委托和事件学习笔记：[https://www.cnblogs.com/edisonchou/archive/2012/03/20/2407675.html](https://www.cnblogs.com/edisonchou/archive/2012/03/20/2407675.html)
系统预定于委托和Labmda表达式教程：[https://www.cnblogs.com/edisonchou/p/4104612.html](https://www.cnblogs.com/edisonchou/p/4104612.html)
多播委托和事件：[https://mp.weixin.qq.com/s/4x7CN5p724X-1lmumomSdg](https://mp.weixin.qq.com/s/4x7CN5p724X-1lmumomSdg)