---
title: Lucene.net
lang: zh-CN
date: 2023-10-04
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: lucene_net
slug: fhty12
docsId: '66006395'
---

## 介绍
Lucene是apache软件基金会发布的一个开放源代码的全文检索引擎工具包，是一个全文检索引擎架构，提供了完整的创建索引和查询索引，以及部分文本分析的引擎。Lucene.net是Apache软件基金会赞助的开源项目，基于Apache License协议。

Lucene是根据关健字来搜索的文本搜索工具，只能在某个网站内部搜索文本内容，不能跨网站搜索。

Lucene.net并不是一个爬行搜索引擎，也不会自动地索引内容。我们得先将要索引的文档中的文本抽取出来，然后再将其加到Lucene.net索引中。标准的步骤是先初始化一个Analyzer、打开一个IndexWriter、然后再将文档一个接一个地加进去。一旦完成这些步骤，索引就可以在关闭前得到优化，同时所做的改变也会生效。这个过程可能比开发者习惯的方式更加手工化一些，但却在数据的索引上给予你更多的灵活性，而且其效率也很高。

> 注意：不支持分布式


### 为什么要用Lucence
Lucene又不是搜索引擎，仅仅是在网站内部进行文本的搜索。那我们为什么要学他呢？？？并且通过SQL也可以实现站内搜索，那么为什么要学Lucence？
（1）SQL只能针对数据库表搜索，不能直接针对硬盘上的文本搜索
（2）SQL没有相关度排名
（3）SQL搜索结果没有关健字高亮显示
（4）SQL需要数据库的支持，数据库本身需要内存开销较大，例如：Oracle
（5）SQL搜索有时较慢，尤其是数据库不在本地时，超慢，例如：Oracle

## 快速入门
我们的SQL使用的是数据库中的内存，在硬盘中为DBF文件...那么我们Lucene内部又是什么东西呢？？Lucene中存的就是一系列的二进制压缩文件和一些控制文件，它们位于计算机的硬盘上，这些内容统称为索引库，索引库有二部份组成：

- 原始记录
   - 存入到索引库中的原始文本，例如：我是张三
- 词汇表
   - 按照一定的拆分策略（即分词器）将原始记录中的每个字符拆开后，存入一个供将来搜索的表

Lucene存放数据的地方我们通常称之为索引库，索引库又分为两部分组成：原始记录和词汇表。

### 原始记录和词汇表
当我们想要把数据存到索引库的时候，我们首先存入的是将数据存到原始记录上面去....
又由于我们给用户使用的时候，用户使用的是关键字来进行查询我们的具体记录。因此，我们需要把我们原始存进的数据进行拆分！将拆分出来的数据存进词汇表中。
词汇表就是类似于我们在学Oracle中的索引表，拆分的时候会给出对应的索引值。
一旦用户根据关键字来进行搜索，那么程序就先去查询词汇表中有没有该关键字，如果有该关键字就定位到原始记录表中，将符合条件的原始记录返回给用户查看。

关于词汇表关键字的来源是如何从原始记录表拆分的，可以指定用哪种算法来将数据拆分，比如标准分词算法，一个一个汉字进行拆分。

## 操作

### 获取索引目录
```csharp
/// <summary>
/// 获取索引目录
/// </summary>
/// <param name="index">索引类型</param>
/// <returns>索引目录</returns>
private LcStore.Directory GetLuceneDirectory(IndexType index)
{
    var indexPath = string.Empty;
    try
    {
        var dirPath = ConfigHelper.GetAppSetting("LuceneIndexPath");

        var indexName = Enum.EnumHelper.GetEnumDescription(index);

        indexPath = Path.Combine(dirPath, indexName);

        return LcStore.FSDirectory.Open(indexPath);
    }
    catch (Exception ex)
    {
        NLogger.Write($"获取索引目录失败" + Environment.NewLine +
                      $"路径：{indexPath}" + Environment.NewLine +
                      $"异常信息：{ex}",
                     "Lucene", "x", "x",
                     CustomException.UnknownError, CustomLogLevel.Error);
        throw new Exception("获取索引目录异常，详情请查看相关日志");
    }
}
```

### 盘古分词
```csharp
/// <summary>
/// 盘古分词
/// </summary>
/// <param name="keyword">语句</param>
/// <returns>词组集合</returns>
public string[] GetSplitKeywords(string keyword)
{
    try
    {
        string ret = null;
        var reader = new StringReader(keyword);
        var ts = PanguAnalyzer.TokenStream(keyword, reader);
        var hasNext = ts.IncrementToken();
        Lucene.Net.Analysis.Tokenattributes.ITermAttribute ita;
        while (hasNext)
        {
            ita = ts.GetAttribute<Lucene.Net.Analysis.Tokenattributes.ITermAttribute>();
            ret += ita.Term + "|";
            hasNext = ts.IncrementToken();
        }
        ts.CloneAttributes();
        reader.Close();
        PanguAnalyzer.Close();

        if (string.IsNullOrWhiteSpace(ret)) return null;

        ret = ret.Substring(0, ret.Length - 1);
        return ret.Split('|');
    }
    catch (Exception ex)
    {
        NLogger.Write("分词异常" + Environment.NewLine +
                      $"关键词：{keyword}" + Environment.NewLine +
                      $"异常信息：{ex}",
                     "Lucene", "x", "x",
                     CustomException.UnknownError, CustomLogLevel.Error);
        throw new Exception("分词出现异常，详情请查看相关日志");
    }
}
```

### 创建索引或者追加索引
```csharp
/// <summary>
        /// 创建索引或追加索引
        /// </summary>
        /// <param name="dataList">数据集合</param>
        /// <param name="index">索引类型</param>
        public void CreateOrAppendIndexes(List<Document> dataList, IndexType index)
        {
            if (dataList == null || dataList.Count == 0)
                return;

            IndexWriter writer;
            var directory = GetLuceneDirectory(index);
            try
            {
                //false表示追加（true表示删除之前的重新写入）
                writer = new IndexWriter(directory, PanguAnalyzer, false, IndexWriter.MaxFieldLength.LIMITED);
            }
            catch
            {
                //false表示追加（true表示删除之前的重新写入）
                writer = new IndexWriter(directory, PanguAnalyzer, true, IndexWriter.MaxFieldLength.LIMITED);
            }
            writer.MergeFactor = 1000;
            //writer.SetMaxBufferedDocs(1000);
            foreach (var doc in dataList)
            {
                writer.AddDocument(doc);
            }
            writer.Optimize();

            writer.Dispose();
            directory.Dispose();
        }
```

## 资料
[https://mp.weixin.qq.com/s/lLz2tq4xQTjDb9PtjaHKlw](https://mp.weixin.qq.com/s/lLz2tq4xQTjDb9PtjaHKlw) | 使用Lucene.Net实现全文检索
[https://segmentfault.com/a/1190000013822385](https://segmentfault.com/a/1190000013822385) | Lucene就是这么简单 - SegmentFault 思否
