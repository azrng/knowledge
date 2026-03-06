---
title: 基本操作
lang: zh-CN
date: 2023-07-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: jibencaozuo
slug: lwgm45
docsId: '30252338'
---

### 连接
```csharp
-- 不需要账号密码的连接字符串
mongodb://localhost:27017

-- 需要账号密码的连接字符串
mongodb://root:123456@localhost/spark?authSource=admin
```

- mongodb://：这是指明使用 MongoDB 协议的标识符。
- root:123456@：这部分表示用户名和密码，其中root是用户名，123456是密码。提示：在实际应用中应该使用更强大和安全的密码。
- localhost：这是 MongoDB 服务器的主机名或 IP 地址。在这种情况下，它是指在本地主机上运行的 MongoDB 实例。
- /spark：这是数据库的名称，它指定要连接到的具体数据库。
- ?authSource=admin：这是可选的连接参数，指定要进行身份验证的数据库。在这里，它指定使用admin数据库进行身份验证。

连接字符串文档：[https://www.mongodb.com/docs/drivers/csharp/current/fundamentals/connection/connect/](https://www.mongodb.com/docs/drivers/csharp/current/fundamentals/connection/connect/)

### 创建集合
使用 db.createCollection() 命令创建一个新的集合。指定集合的名称作为参数。例如，创建名为 mycollection 的集合：
```csharp
db.createCollection("mycollection")
```
集合创建成功后，可以使用db.collectionName.insertMany() 命令或其他适当的方法导入数据。下面是使用 insertMany() 导入数据的示例：
```csharp
db.mycollection.insertMany([
  { name: "John", age: 25, city: "New York" },
  { name: "Emma", age: 30, city: "London" },
  { name: "Michael", age: 35, city: "Paris" }
])
```

### 查询

- 查询总数：db.getCollection("QrcodeRecord").count();
- 查询全部：db.getCollection("bar").find()
- 带条件查询：
```csharp
where in 操作
 db.getCollection('shelf_core_inventory').find({
   "location.locationCode":"CKGB16",
   "shelf.shelfTypeEnum":{"$in":["C0",]},
   "shelf.shelfCode":{"$in":["C0.001","C1.001","C1.002","C1.003"]}
    });

-- 查询集合所有
db.users.find() select * from users

-- 根据id查询
db.Accounts.find({"_id":"62a3e6aad25715026d1a2938"})


db.users.find({"age" : 27}) select * from users where age = 27

db.users.find({"username" : "joe", "age" : 27}) select * from users where "username" = "joe" and age = 27

db.users.find({}, {"username" : 1, "email" : 1}) select username, email from users

db.users.find({}, {"username" : 1, "_id" : 0}) // no case  // 即时加上了列筛选，_id也会返回；必须显式的阻止_id返回

db.users.find({"age" : {"$gte" : 18, "$lte" : 30}}) select * from users where age >=18 and age <= 30 // $lt(<) $lte(<=) $gt(>) $gte(>=)

db.users.find({"username" : {"$ne" : "joe"}}) select * from users where username <> "joe"

db.users.find({"ticket_no" : {"$in" : [725, 542, 390]}}) select * from users where ticket_no in (725, 542, 390)

db.users.find({"ticket_no" : {"$nin" : [725, 542, 390]}}) select * from users where ticket_no not in (725, 542, 390)

db.users.find({"$or" : [{"ticket_no" : 725}, {"winner" : true}]}) select * form users where ticket_no = 725 or winner = true

db.users.find({"id_num" : {"$mod" : [5, 1]}}) select * from users where (id_num mod 5) = 1

db.users.find({"$not": {"age" : 27}}) select * from users where not (age = 27)

db.users.find({"username" : {"$in" : [null], "$exists" : true}}) select * from users where username is null // 如果直接通过find({"username" : null})进行查询，那么连带"没有username"的纪录一并筛选出来

db.users.find({"name" : /joey?/i}) // 正则查询，value是符合PCRE的表达式

db.food.find({fruit : {$all : ["apple", "banana"]}}) // 对数组的查询, 字段fruit中，既包含"apple",又包含"banana"的纪录

db.food.find({"fruit.2" : "peach"}) // 对数组的查询, 字段fruit中，第3个(从0开始)元素是peach的纪录

db.food.find({"fruit" : {"$size" : 3}}) // 对数组的查询, 查询数组元素个数是3的记录，$size前面无法和其他的操作符复合使用

db.users.findOne(criteria, {"comments" : {"$slice" : 10}}) // 对数组的查询，只返回数组comments中的前十条，还可以{"$slice" : -10}， {"$slice" : [23, 10]}; 分别返回最后10条，和中间10条

db.people.find({"name.first" : "Joe", "name.last" : "Schmoe"})  // 嵌套查询

db.blog.find({"comments" : {"$elemMatch" : {"author" : "joe", "score" : {"$gte" : 5}}}}) // 嵌套查询，仅当嵌套的元素是数组时使用,

db.foo.find({"$where" : "this.x + this.y == 10"}) // 复杂的查询，$where当然是非常方便的，但效率低下。对于复杂查询，考虑的顺序应当是 正则 -> MapReduce -> $where

db.foo.find({"$where" : "function() { return this.x + this.y == 10; }"}) // $where可以支持javascript函数作为查询条件

db.foo.find().sort({"x" : 1}).limit(1).skip(10); // 返回第(10, 11]条，按"x"进行排序; 三个limit的顺序是任意的，应该尽量避免skip中使用large-number
```

### 添加
```csharp
插入带当前时间的数据：db.QrcodeRecord.insert({CourseId:'222',UserId:'222',CreateTime:new Date()});
```
 

#### 导入报错
将json文档导入集合报错：mongodb  $oid is not valid for storage
```csharp
db.Tags.insertMany([
  {
    "_id": {
      "$oid": "62a39d27025ca1ba8f1f1c1e"
    },
    "Name": "Groceries"
  }
]);
```
需要将其修改为下面的样子
```csharp
db.Tags.insertMany([
  {
    "_id": ObjectId("62a39d27025ca1ba8f1f1c1e"),
    "Name": "Groceries"
  }
]);
```


### 导入数据库
/**
 * 导入到数据库
 * mongoimport: 导入,
 * --db: 数据库database,
 * demo: 数据库的名称,
 * --collection: 集合collections,
 * goods: 集合的名称,
 * --file: 文件，后面是要导入的文件路径
 */
 
mongoimport --db demo --collection goods --file E:\nodeJs\goods.json


mongoimport --host localhost --port 27017 --username ezsonaruser --password 123456 --db ezsonar_25 --collection host_locations_test --file /root/shaql/host_locations.json
 
 
