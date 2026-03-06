---
title: 简单的线程
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jianchandexiancheng
slug: riudz3
docsId: '31541462'
---
相互不影响的线程：
  Method1();
  Method2();
两个一起执行
        public static async Task Method1()
        {
            await Task.Run(() =>
            {
                for (int i = 0; i < 25; i++)
                {
                   Console.WriteLine($"Method   1 + {i} ");
                }
            });
        }
        public static void Method2()
        {
            for (int i = 0; i < 25; i++)
            {
               Console.WriteLine("Method     2 +" + i);
            }
        }
 
 
方法三需要依赖方法一
callMethod();
方法三等待方法一运行结束
```csharp
public static async void callMethod()
        {
            Task<int> task = Method1();
            Method2();
            int count = await task;
            Method3(count);
        }
        public static async Task<int> Method1()
        {
            int count = 0;
            await Task.Run(() =>
            {
                for (int i = 0; i < 25; i++)
                {
                   Console.WriteLine($"Method   1 + {i} ");
                    count += 1;
                }
 
            });
            return count;
        }
        public static void Method2()
        {
            for (int i = 0; i < 25; i++)
            {
               Console.WriteLine("Method     2 +" + i);
            }
        }
        public static void Method3(int count)
        {
            Console.WriteLine("Total count is " + count);
        }
```
 异步执行一个方法
```csharp
           Task.Run(() =>
                    {
                        bool flag = cardBagApp.SendTravelCard(phone);
                    });

```



