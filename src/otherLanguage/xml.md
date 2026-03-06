---
title: XML
lang: zh-CN
date: 2023-09-13
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - XML
---

## 概述
* XML 指可扩展标记语言。  
* XML 被设计用来传输和存储数据。  
* XML 是一种很像HTML的标记语言。  
* XML 的设计宗旨是传输数据，而不是显示数据。
* XML 标签没有被预定义。您需要自行定义标签。
* XML 被设计为具有自我描述性。
* XML 是 W3C 的推荐标准。

## 用途
xml把数据从html分离
xml简化数据共享
xml简化数据传输
xml简化平台变更

## 基础格式
```xml
<?xml version="1.0" encoding="UTF-8"?> 
<note>
  <to>Tove</to> 
  <from>Jani</from>
  <heading>Reminder</heading> 
  <body>Don't forget me this weekend!</body>
</note>
```

## 基础操作

### 写入XML字符串

```csharp
var aa = "<?xml version=\"1.0\" encoding=\"utf-8\"?><School><BOOK><name>323</name></BOOK></School> ";
var xdoc = new XmlDocument();
xdoc.LoadXml(aa);
xdoc.Save("c:\\aa.xml");
```

### 创建XML文件

```csharp
//通过代码来创建xml文档
//1.引用命名空间
//2.创建xml文档对象
XmlDocument doc = new XmlDocument();

//3.创建第一行描述信息，并且添加到doc文档中
XmlDeclaration dec = doc.CreateXmlDeclaration("1.0", "utf-8", null); //最后一个参数如果为null，说明不在声明独立的属性
doc.AppendChild(dec);

//4.创建根节点
XmlElement books = doc.CreateElement("BOOKS");

//将根节点添加到文档中
doc.AppendChild(books);

//5.给根节点books创建子节点
XmlElement book1 = doc.CreateElement("BOOK");

//将book添加到根节点上
books.AppendChild(book1);

//6.给book1添加子节点
XmlElement name1 = doc.CreateElement("NAME");
name1.InnerText = "黎明";
book1.AppendChild(name1);

XmlElement price1 = doc.CreateElement("Price");
price1.InnerText = "70";
book1.AppendChild(price1);

XmlElement des1 = doc.CreateElement("Des");
des1.InnerText = "好看";
book1.AppendChild(des1);

//创建第二本书
XmlElement book2 = doc.CreateElement("BOOK");
books.AppendChild(book2);

XmlElement name2 = doc.CreateElement("NAME");
name2.InnerText = "黎明之后";
book2.AppendChild(name2);

XmlElement price2 = doc.CreateElement("Price");
price2.InnerText = "90";
book2.AppendChild(price2);

XmlElement des2 = doc.CreateElement("Des");
des2.InnerText = "好看呀";
book2.AppendChild(des2);
var path = "c:\\books.xml";
doc.Save(path);
```

### 创建带命名空间XML

```csharp
var doc = new XmlDocument();
var dec = doc.CreateXmlDeclaration("1.0", "utf-8", "yes");
doc.AppendChild(dec);

XmlElement order = doc.CreateElement("Order");
doc.AppendChild(order);

XmlElement customerName = doc.CreateElement("CustomerName");
customerName.InnerText = "张三";
order.AppendChild(customerName);

//XmlElement shuxing = doc.CreateElement("shuxing");
////添加属性
//shuxing.SetAttribute("ID","1");
//customerName.AppendChild(shuxing);

XmlElement customerNumber = doc.CreateElement("CustomerNumber");
customerNumber.InnerText = "1010101";
order.AppendChild(customerNumber);

XmlElement items = doc.CreateElement("Items");
order.AppendChild(items);

XmlElement orderItem1 = doc.CreateElement("OrderItem");

//给节点添加属性
orderItem1.SetAttribute("Name", "单反");
orderItem1.SetAttribute("Count", "1120");
items.AppendChild(orderItem1);

XmlElement orderItem2 = doc.CreateElement("OrderItem");

//给节点添加属性
orderItem2.SetAttribute("Name", "书");
orderItem2.SetAttribute("Count", "30");
items.AppendChild(orderItem2);

XmlElement orderItem3 = doc.CreateElement("OrderItem");

//给节点添加属性
orderItem3.SetAttribute("Name", "手机");
orderItem3.SetAttribute("Count", "2000");
items.AppendChild(orderItem3);

var path = "c:\\Order.xml";
doc.Save(path);
```

### 追加内容

```csharp
var path = "c:\\books.xml";

//追加XML文档
var doc = new XmlDocument();
XmlElement books;
if (System.IO.File.Exists(path))
{
    //如果文件存在 加载XML
    doc.Load(path);

    //获得文件的根节点
    books = doc.DocumentElement;
}
else
{
    //如果文件不存在
    //创建第一行
    XmlDeclaration dec = doc.CreateXmlDeclaration("1.0", "utf-8", null);
    doc.AppendChild(dec);

    //创建跟节点
    books = doc.CreateElement("Books");
    doc.AppendChild(books);
}

//5、给根节点Books创建子节点
XmlElement book1 = doc.CreateElement("Book");

//将book添加到根节点
books.AppendChild(book1);

//6、给Book1添加子节点
XmlElement name1 = doc.CreateElement("Name");
name1.InnerText = "c#开发大全";
book1.AppendChild(name1);

XmlElement price1 = doc.CreateElement("Price");
price1.InnerText = "110";
book1.AppendChild(price1);

XmlElement des1 = doc.CreateElement("Des");
des1.InnerText = "看不懂";
book1.AppendChild(des1);
doc.Save(path);
```

### 基础读取

```csharp
//将xml加载进来
var path = "c:\\xmlString.xml";
var document = XDocument.Load(path);

//获取到xml的根元素进行操作
var root = document.Root;
var ele = root.Element("BOOK");

//获取name标签的值
var shuxing = ele.Element("name");

//获取name的值
var name = shuxing.Value;
```

使用Linq去读取节点

```csharp
var xmlString = """
                <Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <Header>
                        <Action s:mustUnderstand="1" xmlns="http://www.w3.org/2005/08/addressing">
                            urn:hl7-org:v3/DocumentV2Service/HIPMessageServerResponse
                        </Action>
                    </Header>
                    <Body>
                        <HIPMessageServerResponse xmlns="urn:hl7-org:v3">
                            <HIPMessageServerResult>
                                <RCMR_IN000030UV01 ITSVersion="XML_1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3" xsi:schemaLocation="urn:hl7-org:v3 ../multicacheschemas/RCMR_IN000030UV01.xsd">
                                    <id root="2.16.156.10011.2.5.1.1" extension="c045b149-9384-4361-a454-19ba37d7dbe5" />
                                </RCMR_IN000030UV01>
                            </HIPMessageServerResult>
                        </HIPMessageServerResponse>
                    </Body>
                </Envelope>
                """;
var doc = XDocument.Parse(xmlString);

// 使用linq读取节点
var rcmr = doc
           .Descendants()
           .FirstOrDefault(e => e.Name.LocalName == "RCMR_IN000030UV01");
```

### 循环读取

```csharp
var path = "c:\\books.xml";
var doc = new XmlDocument();
//加载要读取的XML
doc.Load(path);

//获得根节点
var books = doc.DocumentElement;

//获得子节点 返回节点的集合
var childNodes = books.ChildNodes;

foreach (XmlNode item in childNodes)
{
    Console.WriteLine(item.InnerText);
}
```

循环读取并取值

```csharp
string xml = "<ROWID>
<row>
<patName>刘XX</patName>
<sex>1</sex>
<age>50岁</age>
<examId>16377042||8</examId>
<patientId>16543990</patientId>
<lodgeDept>消化内科</lodgeDept>
<lodgeDoctor>陆XX</lodgeDoctor>
<bedNo>+28</bedNo>
<outHosNo>OP0013927016</outHosNo>
<inHosNo></inHosNo>
<birthday>1968-12-10</birthday>
<clinicDiag>测试临床诊断</clinicDiag>
<OEORIDate>2019-08-18</OEORIDate>
</row>
<row>
<patName>刘XX</patName>
<sex>1</sex>
<age>50岁</age>
<examId>16377042||7</examId>
<patientId>16543990</patientId>
<lodgeDept>消化内科</lodgeDept>
<lodgeDoctor>陆XX</lodgeDoctor>
<bedNo>无床号</bedNo>
<outHosNo>OP0013927016</outHosNo>
<inHosNo></inHosNo>
<birthday>1968-12-10</birthday>
<clinicDiag>慢性胃炎；肠道功能紊乱</clinicDiag>
<OEORIDate>2019-08-08</OEORIDate>
</row>
</ROWID>";


XmlDocument xmldoc = new XmlDocument();
xmldoc.LoadXml(xml);
DateTime date = Convert.ToDateTime("2018-01-01");
XmlNodeList PatInfo = xmldoc.SelectNodes("ROWID//row");
foreach (XmlElement element in PatInfo)
{
    DateTime dt = Convert.ToDateTime(element.GetElementsByTagName("OEORIDate")[0].InnerText);
    if (dt>date)
    {
        date = Convert.ToDateTime(element.GetElementsByTagName("OEORIDate")[0].InnerText);

        textBox1.Text = element.GetElementsByTagName("patientId")[0].InnerText;

        textBox2.Text = element.GetElementsByTagName("patName")[0].InnerText;
    }              
}
```

### 读取带属性的xml文件

```csharp
string path = System.Web.HttpContext.Current.Server.MapPath("Order.xml");
//读取带属性的XML文档
XmlDocument doc = new XmlDocument();
doc.Load(path);
XmlNodeList xnl = doc.SelectNodes("/Order/Items/OrderItem");
foreach (XmlNode node in xnl)
{
   Console.WriteLine(node.Attributes["Name"].Value);
   Console.WriteLine(node.Attributes["Count"].Value);
}
```

### 修改xml属性的值

```csharp
string path = System.Web.HttpContext.Current.Server.MapPath("Order.xml");
//改变属性的值
XmlDocument doc = new XmlDocument();
doc.Load(path);
XmlNode xn = doc.SelectSingleNode("/Order/Items/OrderItem[@Name='单反']");
//把name为单反的那个修改为了电脑
xn.Attributes["Count"].Value = "2000";
xn.Attributes["Name"].Value = "电脑";
doc.Save(path);
Console.WriteLine("保存成功");
```

### 删除xml节点

```csharp
string path = System.Web.HttpContext.Current.Server.MapPath("Order.xml");
XmlDocument doc = new XmlDocument();
doc.Load(path);
XmlNode xn = doc.SelectSingleNode("/Order/Items");
xn.RemoveAll();
doc.Save(path);
Console.WriteLine("删除成功");
Console.ReadKey();
```

## XmlDocument

* 读写能力：XmlDocument提供了完整的读写能力，允许创建、修改、删除XML文档中的节点。这使得它成为构建、编辑XML文档的理想选择。

* 灵活性：支持更多的DOM（文档对象模型）操作，如添加、删除、替换节点等，适用于需要动态修改XML结构的场景。

* 性能与内存：对于频繁修改或需要高度交互操作的较小XML文档来说，XmlDocument是合适的。然而，处理大型文档时，由于 保持整个文档在内存中的完整结构，可能会导致较高的内存消耗和较慢的查询速度。

* 兼容性：由于其全面的DOM支持，XmlDocument与W3C DOM标准更加兼容，适合需要广泛DOM操作功能的应用。

### 命名空间读取

通过XPath读取带命名空间的xml内容

```csharp
var xmlContent = File.ReadAllText(@"E:\temp\esb.xml");

var doc = new XmlDocument();
doc.LoadXml(xmlContent);

var root = doc.DocumentElement;
// Add the namespace.
var nsmgr = new XmlNamespaceManager(doc.NameTable);
nsmgr.AddNamespace("soap", root.NamespaceURI);

var xmlPath = "/soap:RCMR_IN000030UV01/soap:controlActProcess/soap:subject";

var nodes = root.SelectNodes(xmlPath, nsmgr);
var list = new List<DocumentRetrieveResultBo>();
for (int i = 0; i < nodes.Count; i++)
{
    // soap:clinicalDocument代表从当前节点再次做xpath，如果加/或者//就是绝对路径匹配
	var effectiveTime = nodes[i].SelectSingleNode($"soap:clinicalDocument/soap:effectiveTime/@value", nsmgr);
}
```

## XPathDocument

* 只读：XPathDocument主要用于读取XML数据，它是不可编辑的，即一旦创建就无法修改XML内容。这使得它在处理大型XML文档时更为高效，因为它可以优化存储结构以提高查询性能。
* 性能优化：特别设计用于XPath查询，提供了快速的XPath查询支持。由于其内部实现是基于XPath数据模型的，因此在执行XPath查询时速度较快。
* 内存占用低：相比XmlDocument，XPathDocument在处理大型文档时通常占用更少的内存，因为它是为快速读取和查询而优化的。
* 排序与节点创建：不支持直接在文档中创建新节点或进行排序操作，它主要用于查询和读取。

### 命名空间读取

通过XPath读取带命名空间的xml内容

```csharp
string xmlFilePath = @"E:\temp\esb.xml";

// 读取XML文件内容
string xmlContent = File.ReadAllText(xmlFilePath);

// 创建XmlNamespaceManager以处理命名空间
XmlNamespaceManager nsManager = new XmlNamespaceManager(new NameTable());
nsManager.AddNamespace("soap", "urn:hl7-org:v3");

// 解析XML内容
using (StringReader stringReader = new StringReader(xmlContent))
{
	// 创建XPathDocument对象
	XPathDocument xpathDoc = new XPathDocument(stringReader);

	// 创建XPath导航器
	XPathNavigator nav = xpathDoc.CreateNavigator();

	// 使用XPath表达式选取controlActProcess元素
	XPathNodeIterator iterator = nav.Select("/soap:RCMR_IN000030UV01/soap:controlActProcess/soap:subject", nsManager);
	iterator.Count.Dump();

	for (int i = 0; i < iterator.Count; i++)
	{
		var curr = iterator.MoveNext();
        // soap:clinicalDocument代表从当前节点再次做xpath，如果加/或者//就是绝对路径匹配
		var effectiveTime = iterator.Current.SelectSingleNode($"soap:clinicalDocument/soap:effectiveTime/@value", nsManager);

		effectiveTime?.Value.Dump();
	}
}
```

## XML Path

XPath语法：[https://www.runoob.com/xpath/xpath-syntax.html](https://www.runoob.com/xpath/xpath-syntax.html)
