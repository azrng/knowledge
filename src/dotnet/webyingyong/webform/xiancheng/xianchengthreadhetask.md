---
title: 线程thread和 Task
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xianchengthreadhetask
slug: lfgvws
docsId: '31541465'
---
.NET Framework中的线程分为两类：1.前台线程；2.后台线程。
1.前台线程：
class Program
{
    static void Main(string[] args)
    {
       Console.WriteLine("=====Thread=====");
        TestThread();
       Console.WriteLine("主线程执行完毕");   
    }
    public static void TestThread()
    {
        Thread thread = new Thread(PrintNum);
        thread.Start();
    }
 
    public static void PrintNum()
    {
        Thread.Sleep(3000);
        for (int i = 0; i < 10; i++)
            Console.WriteLine(i);
    }
}
主线程虽然执行完毕了，但是并没有退出程序，而是等待子线程执行完毕后，退出程序。
![image.png](/common/1613566425572-63c08e76-8ab9-4fcb-8dc1-537a925313c3.png)
 
2.后台线程
class Program
{
    static void Main(string[] args)
    {
       Console.WriteLine("=====ThreadPool=====");
    　　ThreadPool.QueueUserWorkItem(new WaitCallback(PrintNum));
    　　Console.WriteLine("主线程执行完毕");     
    }
    public static void PrintNum(object obj)
    {
        Thread.Sleep(3000);
        for (int i = 0; i < 10; i++)
            Console.WriteLine(i);
    }
}
![image.png](/common/1613566425574-a98ff84d-8a08-49d5-88d6-4f1f7cbd4ef8.png)
主线程运行完毕后，就直接退出了程序，没有等待子线程。
总结：
1.前台线程：主线程执行完毕后，会等待所有子线程执行完毕后，才退出程序。
2.后台线程：主线程执行完毕后，直接退出程序，不论子线程是否执行完毕。
3.推荐：多线程的操作，推荐使用线程池线程而非新建线程。因为就算只是单纯的新建一个线程，这个线程什么事情也不做，都大约需要1M的内存空间来存储执行上下文数据结构，并且线程的创建与回收也需要消耗资源，耗费时间。而线程池的优势在于线程池中的线程是根据需要创建与销毁，是最优的存在。但是这也有个问题，那就是线程池线程都是后台线程，主线程执行完毕后，不会等待后台线程而直接结束程序。所以下面就要引出.NET Framework4.0提供的Task，来解决此类问题。
 
 
如果一个应用程序接收到很多请求，且处理每个请求都非常耗时。在这种情况下，我们就必须指定一个点来结束请求，当有新的请求进入状态时，没有worker 线程可使用，这种现象称为线程饥饿。
 
