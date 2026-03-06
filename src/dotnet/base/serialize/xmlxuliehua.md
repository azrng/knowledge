---
title: XML序列化
lang: zh-CN
date: 2023-07-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xmlxuliehua
slug: qdi3od
docsId: '65746977'
---

## 概述

xml path：[https://www.freeformatter.com/xpath-tester.html#before-output](https://www.freeformatter.com/xpath-tester.html#before-output)

## 概念

### xmlns
在XML文档中，xmlns属性是用来定义命名空间的。命名空间是一种将不同XML元素分组的机制，以避免命名冲突。它允许在XML文档中使用相同名称的元素，而不会产生冲突。
```markdown
<PRPA_IN201306UV02 xmlns="urn:hl7-org:v3">
    <acknowledgement>
        <acknowledgementDetail>
            <!-- 元素内容 -->
        </acknowledgementDetail>
    </acknowledgement>
</PRPA_IN201306UV02>
```
在上面的XML示例中，xmlns="urn:hl7-org:v3"定义了默认的命名空间为urn:hl7-org:v3。这意味着在整个XML文档中，如果没有其他显式的命名空间声明，所有元素都属于该命名空间。

## 操作

### xml序列化
```csharp
// xml序列化，目标类型必须具有无参构造函数，只会序列化public属性
var xmlFormatter = new XmlSerializer(typeof(Person));
using (var stream = new MemoryStream())
using (var fs = new FileStream(@"C:\Users\xfh\Desktop\stream.xml", FileMode.OpenOrCreate))
using (var sr = new StreamReader(stream))
using (var sw = new StreamWriter(fs))
{
    // 序列化
    xmlFormatter.Serialize(stream, p);
    stream.Position = 0;
    // 写入XML文件中
    while (sr.EndOfStream == false)
    {
        var content = sr.ReadLine();
        sw.WriteLine(content);
    }
    stream.Position = 0;
    // 反序列化
    var newP3 = (Person)xmlFormatter.Deserialize(stream);
}
```

### 去除样式
去除xml文本的样式，只留下文本内容
```csharp
var xmlString = File.ReadAllText("D:\\temp\\2222222.txt");

var xmlTxt = new StringBuilder();
// 创建 XmlTextReader 对象
using (var reader = new XmlTextReader(new StringReader(xmlString)))
{
    reader.WhitespaceHandling = WhitespaceHandling.None;
    while (reader.Read())
    {
        if (reader.NodeType == XmlNodeType.Text)
        {
            xmlTxt.Append(reader.Value.Replace("<", "&lt;").Replace(">", "&gt;"));
        }
    }
}

Console.WriteLine(xmlTxt);
```

### 读取节点

#### 带命名空间
```csharp
string xml = @"<PRPA_IN201306UV02 xmlns=""urn:hl7-org:v3"">
                  <acknowledgement typeCode=""AE"">
                      <acknowledgementDetail>
                          <text value=""未查询到数据"" />
                      </acknowledgementDetail>
                      <acknowledgementDetail>
                          <text value=""数据已过期"" />
                      </acknowledgementDetail>
                  </acknowledgement>
              </PRPA_IN201306UV02>";

XmlDocument xmlDoc = new XmlDocument();
xmlDoc.LoadXml(xml);

// 设置带有命名空间的 XmlNamespaceManager
XmlNamespaceManager nsMgr = new XmlNamespaceManager(xmlDoc.NameTable);
nsMgr.AddNamespace("ns", "urn:hl7-org:v3");

// 查询所有text节点的值 如果是单个的需要使用SelectSingleNode
XmlNodeList textNodes = xmlDoc.SelectNodes("//ns:text", nsMgr);
foreach (XmlNode textNode in textNodes)
{
	string textValue = textNode.Attributes["value"].Value;
	Console.WriteLine("text值为：" + textValue);
}
```

### 公共类
```json
    public class XSerializer
    {
        /// <summary>
        /// 将对象序列化为xml字符串
        /// </summary>
        /// <typeparam name="T">类型<peparam>
        /// <param name="t">对象</param>
        public static string ObjectToXml<T>(T t) where T : class
        {
            XmlSerializer formatter = new XmlSerializer(typeof(T));
            using (MemoryStream stream = new MemoryStream())
            {
                XmlSerializerNamespaces namespaces = new XmlSerializerNamespaces();
                namespaces.Add(string.Empty, string.Empty);
                formatter.Serialize(stream, t, namespaces);
                string result = Encoding.UTF8.GetString(stream.ToArray());
                return result;
            }
        }
        /// <summary>
        /// 序列化成XML 清空格式
        /// </summary>
        public static string ObjectToXml<T>(T t, Encoding encoding) where T : class
        {
            XmlSerializer formatter = new XmlSerializer(typeof(T));
            using MemoryStream stream = new MemoryStream();
            XmlSerializerNamespaces namespaces = new XmlSerializerNamespaces();
            namespaces.Add(string.Empty, string.Empty);
            XmlTextWriter xmlTextWriter = new XmlTextWriter(stream, encoding);
            xmlTextWriter.Formatting = System.Xml.Formatting.None;
            formatter.Serialize(xmlTextWriter, t, namespaces);
            xmlTextWriter.Flush();
            xmlTextWriter.Close();
            string result = encoding.GetString(stream.ToArray());
            return result;
        }

        /// <summary>
        /// 字符串转换为对象
        /// </summary>
        public static T XmlToObject<T>(string xml) where T : class
        {
            XmlSerializer formatter = new XmlSerializer(typeof(T));
            using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(xml)))
            {
                T result = formatter.Deserialize(ms) as T;
                return result;
            }
        }
    }

```
