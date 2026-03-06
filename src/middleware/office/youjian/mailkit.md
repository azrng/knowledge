---
title: MailKit
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: mailkit
slug: noghmb
docsId: '74881263'
---

## 介绍
使用 MimeKit 强大的 MIME 解析器解析任何消息。正确处理任何字符编码。
官网地址：[http://www.mimekit.net/](http://www.mimekit.net/)
仓库地址：[https://github.com/jstedfast/MimeKit](https://github.com/jstedfast/MimeKit)

| Protocol(协议) | Standard Port（标准端口） | SSL Port（ssl端口） |
| --- | --- | --- |
| SMTP | 25 or 587 | 465 |
| POP3 | 110 | 995 |
| IMAP | 143 | 993 |

通过 MailKit 使用 SMTP 协议连接到邮件服务器是用于发送电子邮件的，并不直接支持获取收件箱。
如果您需要访问和操作收件箱中的邮件，您应该使用 IMAP 协议或 POP3 协议。MailKit 提供了 ImapClient 和 Pop3Client 类来支持这两种协议。

### MimeKit和MailKit
MimeKit和MailKit都是C#语言编写的开源邮件库，但它们的功能和用途略有不同。
MimeKit是一个专门用于处理电子邮件消息的库，它提供了创建、解析和操作电子邮件消息的API。MimeKit支持各种邮件格式，包括MIME、S/MIME、PGP和TNEF等。MimeKit还提供了对电子邮件消息的验证和签名功能。

MailKit则是一个用于发送和接收电子邮件的库，它基于MimeKit构建。MailKit支持各种邮件协议，包括SMTP、POP3、IMAP和Exchange Web Services等。MailKit提供了发送和接收电子邮件的API，以及对邮件服务器的连接和身份验证的支持。

因此，MimeKit和MailKit可以说是相互依存的关系，MimeKit提供了电子邮件消息的处理功能，而MailKit则基于MimeKit提供了邮件发送和接收的功能。

## 操作
引用nuget包
```csharp
<PackageReference Include="MailKit" Version="2.7.0" />
```

### 发送邮件
通过smtp协议进行发送邮件。

示例：通过网易邮箱用户名和授权码给第三方邮箱发送文本消息邮件
```csharp
static void SendEmail(string username, string password)
{
    var message = new MimeMessage();
    //发送人
    message.From.Add(new MailboxAddress("老张", username));
    message.To.Add(new MailboxAddress("老王", "itzhangyunpeng@outlook.com"));
    message.Subject = "Test Email";

    message.Body = new TextPart("plain")
    {
        Text = "这是一个测试邮件."
    };

    using var client = new SmtpClient();
    client.Connect("smtp.163.com", 465, SecureSocketOptions.SslOnConnect);
    client.Authenticate(username, password);

    client.Send(message);
    client.Disconnect(true);
}
```
资料：
创建消息：[http://www.mimekit.net/docs/html/Creating-Messages.htm](http://www.mimekit.net/docs/html/Creating-Messages.htm)

### 获取收件箱
通过imap协议进行获取收件箱内容

示例：获取网易邮箱的收件箱列表内容
```csharp
static void GetEmailList(string username, string password)
{
    var server = "imap.163.com";
    var port = 993;
    // 创建IMAP客户端
    using var client = new ImapClient();
    // 连接到服务器
    client.Connect(server, port, true);

    // 登录邮箱
    client.Authenticate(username, password);

    // 添加邮箱客户端识别
    var clientImplementation = new ImapImplementation
    {
        Name = "netcore demo",
        Version = "1.0.1"
    };
    var serverImplementation = client.Identify(clientImplementation);

    // 打开收件箱
    var inbox = client.Inbox;
    //打开文件夹并设置为读的方式
    inbox.Open(FolderAccess.ReadOnly);

    #region 构建搜索条件

    // 查询未读邮件
    //var uids = inbox.Search(SearchQuery.NotSeen);

    //// 搜索收件箱中的邮件
    //var uids = inbox.Search(SearchQuery.All);

    // 查询发件时间在6月13号之后的邮件
    var query = SearchQuery.DeliveredAfter(DateTime.Parse("2023-06-13"));
    var uids = inbox.Search(query);

    #endregion

    // 遍历搜索结果
    foreach (var uid in uids)
    {
        // 获取邮件消息
        var message = inbox.GetMessage(uid);

        // 打印邮件主题和发件人
        Console.WriteLine("Subject: {0}", message.Subject);
        Console.WriteLine("   From: {0}", message.From);
        Console.WriteLine("   Date: {0}", message.Date);

        // 读取邮件正文
        //if (message.Body is TextPart text)
        //{
        //    Console.WriteLine("   Body: {0}", text);
        //}
        //else if (message.Body is MultipartAlternative multi)
        //{
        //    Console.WriteLine("   Body: {0}", multi.TextBody);
        //}

        // 打印邮件附件
        //foreach (var attachment in message.Attachments)
        //{
        //    Console.WriteLine("Attachment: {0}," ,attachment.FileName);
        //}
        Console.WriteLine("--------------------------------------------------------------------");
    }

    // 关闭收件箱和IMAP客户端
    inbox.Close();
    client.Disconnect(true);
}
```

#### 收件箱筛选参数
筛选条件参数：[http://www.mimekit.net/docs/html/T_MailKit_Search_SearchQuery.htm](http://www.mimekit.net/docs/html/T_MailKit_Search_SearchQuery.htm)
获取未读邮件
```csharp
var inbox = client.Inbox;
inbox.Open(FolderAccess.ReadWrite);
var uids = inbox.Search(SearchQuery.NotSeen);

// 修改状态为已读
inbox.SetFlags(uid, MessageFlags.Seen, true);
```
根据时间筛选
```csharp
// 查询发件时间在6月13号之后的邮件
var query = SearchQuery.DeliveredAfter(DateTime.Parse("2023-06-13"));

// 指定日期DeliveredOn

// 在xxx之前的日期DeliveredBefore
```
根据内容筛选
```csharp
// 由于服务器里面的邮件都是加密过的，所以searchquery中的大部分查询条件都是没法用的，比如subjectContains，fromContains等等
var query = SearchQuery.SubjectContains("11");
```
对于 MailKit 的 Fetch 方法中使用 SearchQuery 进行筛选条件时，如果你发现 SearchQuery.SubjectContains("11") 不生效，可能有以下几个原因：
1. 邮件服务器不支持搜索功能：并非所有的邮件服务器都支持在 IMAP 协议中进行搜索操作。请确保你连接的邮件服务器支持 IMAP 搜索功能。你可以尝试连接其他支持搜索功能的邮件服务器进行测试。
2. 邮件的主题字段不包含指定的内容：搜索操作是基于邮件中的字段进行匹配的。如果指定的邮件主题字段中没有包含 "11" 字符串，那么搜索就不会返回结果。可以检查邮件的实际主题内容，或者尝试使用其他字段进行筛选。
3. 邮件服务器的搜索行为不符合预期：不同的邮件服务器实现搜索功能时可能会有一些差异，有些服务器可能对搜索操作的行为有自己的规则和限制。你可以查阅你所使用的邮件服务器的文档或者联系该邮件服务器的技术支持以了解更多关于搜索操作的信息。

Fetch
```csharp
var uids = inbox.Search(query);

//获取指定消息uid的消息摘要。
var emSummarys = inbox.Fetch(uids, MessageSummaryItems.UniqueId
    | MessageSummaryItems.Full | MessageSummaryItems.BodyStructure);
foreach (var item in emSummarys)
{
}
```

### 获取发件箱
```csharp
var server = "imap.163.com";
var port = 993;
// 创建IMAP客户端
using var client = new ImapClient();
// 连接到服务器
client.Connect(server, port, true);

// 登录邮箱
client.Authenticate(username, password);

// 添加邮箱客户端识别
var clientImplementation = new ImapImplementation
{
    Name = "netcore demo",
    Version = "1.0.1"
};
var serverImplementation = client.Identify(clientImplementation);

// 获取已发送文件夹
var sentFolder = client.GetFolder(SpecialFolder.Sent);
//打开文件夹并设置为读的方式
sentFolder.Open(FolderAccess.ReadWrite);

// 查询发件时间在6月13号之后的邮件
var query = SearchQuery.DeliveredAfter(DateTime.Parse("2023-06-23"));

var uids = sentFolder.Search(query);

// 下面取邮件内容和获取收件箱类似
```

### 下载邮件附件
```csharp
var attachments = message.Attachments;
if (attachments.Any())
{
    foreach (var attachment in attachments)
        DownloadAttachment(attachment);
}

private static void DownloadAttachment(MimeEntity attachment)
{
    if (attachment is MessagePart)
    {
        var fileName = attachment.ContentDisposition?.FileName;
        var rfc822 = (MessagePart)attachment;

        if (string.IsNullOrEmpty(fileName))
            fileName = "attached-message.eml";

        var path = Path.Combine(DIRECTORY, fileName);
        using (var stream = File.Create(path))
            rfc822.Message.WriteTo(stream);
    }
    else
    {
        var part = (MimePart)attachment;
        var fileName = part.FileName;

        var path = Path.Combine(DIRECTORY, fileName);
        using (var stream = File.Create(path))
            part.Content.DecodeTo(stream);
    }
}
```

### 移动邮件
```csharp
// 移动到删除文件夹
client.Inbox.MoveTo(uid, client.GetFolder(SpecialFolder.Trash));
```

### 删除邮件
```csharp
// 将邮件标记为删除然后删除
client.Inbox.AddFlags(uid, MessageFlags.Deleted, true);
client.Inbox.Expunge();
```

### 乱码处理
如果你在使用过程中发现了乱码问题，那是因为缺少中文字符集，这个时候就需要安装nuget包
```csharp
dotnet add package System.Text.Encoding.CodePages
```
并且注册字符集
```csharp
//注册字符集，缺失字符集，一些中文编码数据为乱码
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
```
