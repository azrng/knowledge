---
title: 基本操作
lang: zh-CN
date: 2021-07-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: jibencaozuo
slug: xyk7pt
docsId: '49028245'
---
这里用的是 DataStax 提供的 **CassandraCSharpDriver** 客户端。

## 操作

### 写入
```csharp
var cluster = Cassandra.Cluster.Builder()
                        .AddContactPoints("127.0.0.1")
                        .WithDefaultKeyspace("messaging")
                        .Build();

var inqId = "xxxxxx";
var sendTime = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
var senderId = "xxxx";
var senderRole = 1;
var msgType = 1;
var msgBody = "zzzz";

string INSERT_SQL = @" INSERT INTO messages(inq_id, send_time, sender_id, sender_role, msg_type, msg_body)
VALUES (?, ?, ?, ?, ?, ?) ";

var session = cluster.Connect();

var stmt = session.Prepare(INSERT_SQL).Bind(inqId, sendTime, senderId, senderRole, msgType, msgBody));

session.Execute(stmt);
```

### 读取
```csharp
var cluster = Cassandra.Cluster.Builder()
                .AddContactPoints("127.0.0.1")
                .WithDefaultKeyspace("messaging")
                .Build();

var inqId = "xxxxxx";

string GET_MSG_SQL = @" SELECT * FROM messages WHERE inq_id = ? ";

var session = cluster.Connect();

var stmt = session.Prepare(GET_MSG_SQL).Bind(inqId);

var rowset = session.Execute(stmt);

Console.WriteLine("患者\t\t\t\t\t医生");

foreach (var row in rowset)
{
    // 解析从 cassandra 中返回的行
    var msg_body = row.GetValue<string>("msg_body");
    var sender_role = row.GetValue<sbyte>("sender_role");

    if (sender_role == 0)
    {
        Console.WriteLine($"{msg_body}\t\t\t\t\t");
    }
    else
    {
        Console.WriteLine($"\t\t\t\t\t{msg_body}");
    }
}
```

## 参考文档
> 聊一聊关于聊天记录的存储：[https://mp.weixin.qq.com/s/xY3jE079iwPksnMZzMt72w](https://mp.weixin.qq.com/s/xY3jE079iwPksnMZzMt72w)


