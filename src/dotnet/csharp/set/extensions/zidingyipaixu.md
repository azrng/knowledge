---
title: 自定义排序
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: zidingyipaixu
slug: fmv24w
docsId: '44222728'
---

## 使用场景
有时候希望集合可以根据我们想要的顺序排序，这个时候默认的Sort方法就不支持了，那么我们需要重新定义排序规则，通过继承IComparer对象，它主要将定义类型为比较两个对象而实现的方法。

## 编写自定义排序
编写文件名例如“xxx-01”,"1xx01-13"按照数字的大小进行排序的排序规则
```csharp
public class FilesNameComparer<T> : IComparer<T>
{
    public int Compare(T x, T y)
    {
        if (x == null || y == null)
            throw new ArgumentException("Parameters can't be null");

        //对比文件对象A的文件名
        string fileA = x.ToString();
        //对比文件对象B的文件名
        string fileB = y.ToString();

        //将文件名里的字符一个个拆成字符数组
        char[] arr1 = fileA.ToCharArray();
        char[] arr2 = fileB.ToCharArray();

        int i = 0, j = 0;
        //逐字符处理
        while (i < arr1.Length && j < arr2.Length)
        {
            if (char.IsDigit(arr1[i]) && char.IsDigit(arr2[j]))
            {
                string s1 = "", s2 = "";
                while (i < arr1.Length && char.IsDigit(arr1[i]))
                {
                    s1 += arr1[i];
                    i++;
                }
                while (j < arr2.Length && char.IsDigit(arr2[j]))
                {
                    s2 += arr2[j];
                    j++;
                }
                if (int.Parse(s1) > int.Parse(s2)) return 1;
                if (int.Parse(s1) < int.Parse(s2)) return -1;
            }
            else
            {
                if (arr1[i] > arr2[j]) return 1;
                if (arr1[i] < arr2[j]) return -1;
                i++;
                j++;
            }
        }

        if (arr1.Length == arr2.Length)
        {
            return 0;
        }
        else
        {
            return arr1.Length > arr2.Length ? 1 : -1;
        }
    }
}
```

## 操作例子
准备model类
```csharp
public class FileModel
{
    public string Name { get; set; }
    public override string ToString()
    {
        return Name;
    }
}
```
```csharp
var comparer = new FilesNameComparer<FileModel>();
List<FileModel> fileList = new List<FileModel>();
fileList.Add(new FileModel { Name = "100-1" });
fileList.Add(new FileModel { Name = "1" });
fileList.Add(new FileModel { Name = "101-1" });
fileList.Add(new FileModel { Name = "101-2" });
fileList.Add(new FileModel { Name = "100-2" });
fileList.Add(new FileModel { Name = "102-3" });
fileList.Add(new FileModel { Name = "110-1" });
fileList.Add(new FileModel { Name = "20-1" });
fileList.Sort(comparer);
foreach (var s in fileList)
{
    Console.WriteLine(s.Name);
}
```



