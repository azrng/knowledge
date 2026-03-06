---
title: 分页处理
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: fenxiechuli
slug: kpkdnm
docsId: '91863020'
---

## 目的
处理集合分页的情况

## 操作

### 公共类
```csharp
/// <summary>
/// List分页处理
/// </summary>
public class ListPage<T>
{
    /// <summary>
    /// 页数
    /// </summary>
    public int PageCount { get; set; }
    /// <summary>
    /// 当前页码
    /// </summary>
    public int CurrPage { get; set; }
    /// <summary>
    /// 一页多少条
    /// </summary>
    public int PageSize { get; set; }
    /// <summary>
    /// 数据源信息
    /// </summary>
    private List<T> DataSource { get; set; }
    /// <summary>
    /// 获取数据源和一页多少
    /// </summary>
    /// <param name="List"></param>
    /// <param name="PageSize"></param>
    public ListPage(List<T> List, int PageSize = 4, int CurrPage = 0)
    {
        DataSource = List;
        this.PageSize = PageSize;
        this.PageCount = (int)Math.Ceiling((decimal)DataSource.Count / PageSize);
        this.CurrPage = CurrPage;

    }
    //是否有下一页
    public bool HasNextPage
    {
        get { return CurrPage < this.PageCount; }
    }
    /// <summary>
    /// 直接获取下一页
    /// </summary>
    /// <returns></returns>
    public List<T> NextPage()
    {
        var data = DataSource.Skip((CurrPage) * PageSize).Take(PageSize).ToList();
        CurrPage++;
        return data;
    }
    /// <summary>
    /// 获取指定页
    /// </summary>
    /// <returns></returns>
    public List<T> getPage(int CurrPage)
    {
        var data = DataSource.Skip((CurrPage) * PageSize).Take(PageSize).ToList();
        return data;
    }
}
```
使用示例
```csharp
List<int> list = new List<int>();
list.Add(10);
list.Add(20);
list.Add(30);
list.Add(40);
list.Add(50);
list.Add(60);
list.Add(70);
list.Add(80);
ListPage<int> ts = new ListPage<int>(list, 3);
while (ts.HasNextPage)
{
    var obj = ts.NextPage();
    foreach (var item in obj)
    {
        Console.WriteLine(item);
    }
    Console.WriteLine("输出完一页信息!");
}
var bb = ts.NextPage();
Console.WriteLine("123");
Console.ReadLine();
```

## 资料
[https://mp.weixin.qq.com/s/5OP5FZT2ClCyCk4J8PPKkA](https://mp.weixin.qq.com/s/5OP5FZT2ClCyCk4J8PPKkA) | .NET 开发中个人常用的三个处理类(批量任务队列，List分页处理，配置文件管理)
