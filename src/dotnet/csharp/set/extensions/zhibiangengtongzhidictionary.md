---
title: 值变更通知Dictionary
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: zhibiangengtongzhidictionary
slug: pvchlf
docsId: '65993906'
---

## 需求
实现字典值变更时候做一些其他操作

## 操作
关键字：变更 通知 字典
```csharp
using System;
using System.Collections.Generic;
using System.Text;
namespace DAL
{
    public class ValueChangedEventArgs<TK> : EventArgs
    {
        public TK Key { get; set; }
        public ValueChangedEventArgs(TK key)
        {
            Key = key;
        }
    }

    public class DictionaryWapper<TKey, TValue>
    {
        public object  objLock = new object();
       
        private Dictionary<TKey, TValue> _dict;
        public event EventHandler<ValueChangedEventArgs<TKey>> OnValueChanged;
        public DictionaryWapper(Dictionary<TKey, TValue> dict)
        {
            _dict = dict;
        }
        public TValue this[TKey Key]
        {
            get { return _dict[Key]; }
            set
            {
                lock(objLock)
                {
                    try
                    {
                        if (_dict.ContainsKey(Key) && _dict[Key] != null && !_dict[Key].Equals(value))
                        {
                            OnValueChanged(this, new ValueChangedEventArgs<TKey>(Key));
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"检测值变更或者触发值变更事件，发生未知异常{ex}");
                    }
                    finally
                    {
                        _dict[Key] = value;
                    }
                }
            }
        }
    }
}
```
旁白：
1.定义值变更事件OnValueChanged 和变更时传递的事件参数`ValueChangedEventArgs<TKey>`
2.如何定义值变更，也就是如何判定值类型、引用类型的相等性         
#equal、hashcode#
3.DictionaryWapper的表征实现也得益于C#索引器特性
订阅值变更事件
```csharp
var _dictionaryWapper = new DictionaryWapper<string, string>(new Dictionary<string, string> { });
_dictionaryWapper.OnValueChanged += new EventHandler<ValueChangedEventArgs<string>>(OnConfigUsedChanged);
//----
public static void OnConfigUsedChanged(object sender, ValueChangedEventArgs<string> e)
{
   Console.WriteLine($"字典KEY：{e.Key}的值发生了变更，请注意...");          
}
```
最后像正常Dictionary一样为DictionaryWapper添加键值对:
```csharp
 _dictionaryWapper[$"{dbConfig}:{connectionConfig.Provider}"] = connection.ConnectionString;
```

## 总结
通过本文，重温了C## event 、索引器的用法，基础不牢，地动山摇。

## 资料
[https://mp.weixin.qq.com/s/0m1FA4USkncFCFT6viVwJg](https://mp.weixin.qq.com/s/0m1FA4USkncFCFT6viVwJg) | 面试官：C#如何实现带值变更通知能力的Dictionary？
