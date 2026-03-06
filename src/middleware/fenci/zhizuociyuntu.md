---
title: 制作词云图
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: zhizuociyuntu
slug: tpnbk6
docsId: '66006295'
---

## 词云简介
“词云”由美国西北大学新闻学副教授、新媒体专业主任里奇·戈登（Rich Gordon）于2006年最先使用，是通过形成“关键词云层”或“关键词渲染”，对文本中出现频率较高的“关键词”的视觉上的突出。

## Sdcb.WordCloud

**Sdcb.WordCloud** 是一个多功能、跨平台的库，用于根据词频生成文字云图片、`SVG`或`JSON`数据。它利用`SkiaSharp`进行图形操作，确保了高性能和质量，而不依赖于`System.Drawing`。这使得它成为在各种平台上运行的应用程序的绝佳选择，包括GUI库可能不可用的服务器端场景。

仓库地址：https://github.com/sdcb/Sdcb.WordCloud

- **跨平台兼容性**：在不同操作系统上工作，无需依赖于 `System.Drawing`。
- **多种输出格式**：支持生成图片、SVG或JSON数据的文字云。
- **灵活配置**：通过各种选项自定义您的文字云，包括文本方向、字体和遮罩。
- **开源**：在MIT许可下自由提供，欢迎贡献和修改。



点亮.NET的文字云艺术之光：Sdcb.WordCloud 2.0：https://mp.weixin.qq.com/s/3u8aPcppa1Z0-KA1OnTPjA



### 示例

```csharp
void Main()
{
	TextOrientations[] orientations =
 [
	 TextOrientations.PreferHorizontal, // 默认
	 TextOrientations.PreferVertical,
	 TextOrientations.HorizontalOnly,
	 TextOrientations.VerticalOnly,
	 TextOrientations.Random,
 ];
	foreach (var o in orientations)
	{
		WordCloud wc = WordCloud.Create(new WordCloudOptions(300, 300, MakeDemoScore())
		{
			TextOrientation = o,
		});
		byte[] pngBytes = wc.ToSKBitmap().Encode(SKEncodedImageFormat.Png, 50).AsSpan().ToArray();

		MemoryStream ms = new MemoryStream(pngBytes);
		var image = System.Drawing.Image.FromStream(ms);
		image.Dump();
		//File.WriteAllBytes($"{o}.png", pngBytes);
	}
}

IEnumerable<WordScore> MakeDemoScore()
{
	var aa = new List<string> { "小", "黄", "爷", "真", "牛", "蛙" };
	var list = new List<WordScore>();
	foreach (var element in aa)
	{
		list.Add(new WordScore(element, new Random().Next(1, 8)));
	}
	return list;
}
```

[一次小而美的重构：使用 C# 在 Avalonia 中生成真正好看的词云](https://www.cnblogs.com/deali/p/18848662)

## WordCloudSharp

网上大部分文章介绍的是使用Python的jieba、wordcloud的库生成词云图，本文则介绍在C#中如何使用jieba.NET、WordCloudSharp库生成词云图，后者是前者的.NET实现。

### 准备工作
创建一个C#的控制台项目，通过NuGet添加引用对jieba.NET、WordCloudSharp的引用，使用方法可以参考以下链接：

- jieba.NET：https://github.com/anderscui/jieba.NET
- WordCloudSharp：https://github.com/AmmRage/WordCloudSharp

安装之后，在packages\jieba.NET目录下找到Resources目录，将整个Resources目录拷贝到程序集所在目录，这里面是jieba.NET运行所需的词典及其它数据文件。

### 基本算法
算法主要步骤如下：

- 提取关键词：基于TF-IDF算法、TextRank算法提取文本的关键词，按权重大小选取部分关键词。
- 统计关键词词频：先将文本分词，统计每个词的词频，再筛选出关键词的词频。
- 生成词云图：根据关键词及其词频信息在蒙版图片的基础上生成词图。

注：本文采用TF-IDF算法提取关键词，蒙版图目前只支持黑白图片。
TF-IDF（词频-逆文档频率）算法是一种统计方法，用以评估一字词对于一个文件集或一个语料库中的其中一份文件的重要程度。字词的重要性随着它在文件中出现的次数成正比增加，但同时会随着它在语料库中出现的频率成反比下降。

### 算法实现
使用JiebaNet.Analyser.TfidfExtractor.ExtractTagsWithWeight(string text, int count = 20, IEnumerable allowPos = null)从指定文本中抽取关键词的同时得到其权重，代码如下：
```csharp
/// <summary>
/// 从指定文本中抽取关键词的同时得到其权重
/// </summary>
/// <param name="text"></param>
/// <returns></returns>
static WordWeightPair[] ExtractTagsWithWeight(string text)
{
    var extractor = new TfidfExtractor();
    var wordWeight = extractor.ExtractTagsWithWeight(text, 50);
    StringBuilder sbr = new StringBuilder();
    sbr.Append("词语");
    sbr.Append(",");
    sbr.Append("权重");
    sbr.AppendLine(",");
    foreach (var item in wordWeight)
    {
        sbr.Append(item.Word);
        sbr.Append(",");
        sbr.Append(item.Weight);
        sbr.AppendLine(",");
    }
    string filename = "关键词权重统计.csv";
    File.WriteAllText(filename, sbr.ToString(), Encoding.UTF8);
    Console.WriteLine("关键词提取完成：" + filename);
    return wordWeight.ToArray();
}
```
使用**JiebaNet.Segmenter.Common**下的**Counter类**统计词频，其实现来自Python标准库的Counter类（具体接口和实现细节略有不同），代码如下：
```csharp
/// <summary>
/// 分词并统计词频：默认为精确模式，同时也使用HMM模型
/// </summary>
/// <param name="text"></param>
/// <param name="wordWeightAry"></param>
/// <returns></returns>
static KeyValuePair<string, int>[] Counter(string text, WordWeightPair[] wordWeightAry)
{
    var segmenter = new JiebaSegmenter();
    var segments = segmenter.Cut(text);
    var freqs = new Counter<string>(segments);
    KeyValuePair<string, int>[] countAry = new KeyValuePair<string, int>[wordWeightAry.Length];
    for (int i = 0; i < wordWeightAry.Length; i++)
    {
        string key = wordWeightAry[i].Word;
        countAry[i] = new KeyValuePair<string, int>(key, freqs[key]);
    }
    StringBuilder sbr = new StringBuilder();
    sbr.Append("词语");
    sbr.Append(",");
    sbr.Append("词频");
    sbr.AppendLine(",");
    foreach (var pair in countAry)
    {
        sbr.Append(pair.Key);
        sbr.Append(",");
        sbr.Append(pair.Value);
        sbr.AppendLine(",");
    }
    string filename = "词频统计结果.csv";
    File.WriteAllText(filename, sbr.ToString(), Encoding.UTF8);
    Console.WriteLine("词频统计完成：" + filename);
    return countAry;
}
```
使用**WordCloudSharp**生成词云图，蒙版图必须使用黑白图片，记得手动引用**System.Drawing**，代码如下：
```csharp
/// <summary>
/// 创建词云图
/// </summary>
/// <param name="countAry"></param>
static void CreateWordCloud(KeyValuePair<string, int>[] countAry)
{            
    string markPath = "mask.jpg";
    string resultPath = "result.jpg";
    Console.WriteLine("开始生成图片，读取蒙版：" + markPath);
    Image mask = Image.FromFile(markPath);
    //使用蒙版图片
    var wordCloud = new WordCloud(mask.Width, mask.Height, mask: mask, allowVerical: true, fontname: "YouYuan");
    //不使用蒙版图片
    //var wordCloud = new WordCloud(1000, 1000,false, null,-1,1,null, false);
    var result = wordCloud.Draw(countAry.Select(it => it.Key).ToList(), countAry.Select(it => it.Value).ToList());
    result.Save(resultPath);
    Console.WriteLine("图片生成完成，保存图片：" + resultPath);
}
```

### 运行测试
以本文为分析文本生成词云图，代码如下：
```csharp
static void Main(string[] args)
{
    string text = File.ReadAllText("待处理数据.txt");
    var wordWeight = ExtractTagsWithWeight(text);
    var wordFreqs = Counter(text, wordWeight);
    CreateWordCloud(wordFreqs);
    Console.Read();
}
```
在得到关键词的词频信息后，通**过在线工具网站生成词云图片会更加方便一点**，如词云文字、图悦等。

## 资料
[https://mp.weixin.qq.com/s/bqKGfiKG7jWsT-IlUjmG0w](https://mp.weixin.qq.com/s/bqKGfiKG7jWsT-IlUjmG0w) | C#中使用jieba.NET、WordCloudSharp制作词云图
