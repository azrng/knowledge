---
title: Redis数据类型
lang: zh-CN
date: 2023-08-08
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: redisshujuleixing
slug: sxi0zo
docsId: '31906479'
---

## 数据结构
一种数据结构类型对应多种数据结构来实现
![](/common/1615016591442-f0fdd49f-c1c1-4dd0-9ef0-0467826a16e1.png)
例如，String、Set 在存储 int 数据时，会采用整数编码存储。Hash、ZSet 在元素数量比较少时（可配置），会采用压缩列表（ziplist）存储，在存储比较多的数据时，才会转换为哈希表和跳表。

## String字符串
一个键对应一个值，值是字符串
```csharp
					//存储单个
                    client.Set<string>("aa", "aa");//默认是序列化后然后存储的
                    var value = client.GetValue("aa");//这种方式还得序列化
                    var value2 = client.Get<string>("aa");//推荐这种

                    //批量写入
                    var dic = new Dictionary<string, string> {
                        { "id","001"},
                        { "name","lisi"},
                        { "address","南京"}
                    };
                    client.SetAll(dic);


                    //批量读取
                    var list = client.GetAll<string>(new string[] { "id", "name", "address" });

                    //设置过期时间
                    client.Set<string>("bbb", "bbb", TimeSpan.FromSeconds(10));
                    //指定时间过期
                    client.Set<string>("ccc", "ccc", DateTime.Now.AddDays(1));

                    //追加
                    client.AppendToValue("zhuijia", "I");
                    client.AppendToValue("zhuijia", "Love");
                    client.AppendToValue("zhuijia", "You");
                    var zhuijia = client.Get<string>("zhuijia");

                    //获取之前的值，然后赋值新的
                    client.Set<string>("name", "lisi");
                    var oldValue = client.GetAndSetValue("name", "wangwu");
                    var newValue = client.Get<string>("name");

                    //自增自减少

                    //自增然后返回结果
                    var a = client.Increment("count", 1);
                    client.Increment("count", 1);
                    client.Increment("count", 1);
                    Console.WriteLine(client.Get<int>("count"));

                    //自减返回结果
                    var b = client.Decrement("countb", 1);
                    client.Decrement("countb", 1);
                    client.Decrement("countb", 1);
                    Console.WriteLine(client.Get<int>("countb"));

                    //add和set
                    //如果已经存在就添加不进去，不存在就可以添加
                    Console.WriteLine(client.Add<string>("addvalue", "name"));//true
                    Console.WriteLine(client.Add<string>("addvalue", "name2"));//false
                    Console.WriteLine(client.Add<string>("addvalue", "name3"));//false
                    //直接替换值
                    Console.WriteLine(client.Set<string>("setvalue", "name"));//true
                    Console.WriteLine(client.Set<string>("setvalue", "name2"));//true
                    Console.WriteLine(client.Set<string>("setvalue", "name3"));//true

                    //判断数据库中是否存在key
                    Console.WriteLine(client.ContainsKey("name"));
                    Console.WriteLine(client.ContainsKey("abc"));

                    //判断这个key是哪种类型
                    client.Set<string>("name", "123");
                    var type = client.GetEntryType("name");
```

## Hash哈希
存储结构类似
![image.png](/common/1614566647851-9a4c1cf8-9a2d-43eb-b5b7-8953b94bfbee.png)
![image.png](/common/1622630545320-a298077b-7791-40cb-bda7-21540a9ca576.png)

底层结构分为ziplist(如果总长度小于512，并且单个元素长度小于64用这个)和hastTable
```csharp
string hashId = "stu";
                    //新增
                    client.SetEntryInHash(hashId, "name", "zhangsan");
                    //查询
                    Console.WriteLine(client.GetValueFromHash(hashId, "name"));
                    client.SetEntryInHash(hashId, "id", "001");
                    Console.WriteLine(client.GetValueFromHash(hashId, "id"));

                    //批量的操作
                    var stu = new Dictionary<string, string>();
                    stu.Add("name", "zhangsan");
                    stu.Add("sex", "男");
                    client.SetRangeInHash(hashId, stu);//id的值不会被替换

                    //批量读取
                    var dic = client.GetAllEntriesFromHash(hashId);

                    //如果存在相同的k/v的时候，则新增失败，返回false，否则新增成功
                    Console.WriteLine(client.SetEntryInHashIfNotExists(hashId, "name", "clay"));

                    //存储对象  必须有id，并且key是Id的值
                    client.StoreAsHash<UserInfo>(new UserInfo { Id = "aaa", Name = "bbb" });
                    var bb = client.GetFromHash<UserInfo>("aaa");

                    //读取hash里面key的总数,key列表
                    var stu2 = new Dictionary<string, string>();
                    stu2.Add("name", "zhagnsan");
                    stu2.Add("id", "001");
                    client.SetRangeInHash("stu2", stu2);
                    Console.WriteLine(client.GetHashCount("stu2"));
                    var keys = client.GetHashKeys("stu2");//获取所有的key
                    var values = client.GetHashValues("stu2");//获取所有的值
                    //删除hash数据集中指定key的数据
                    client.RemoveEntryFromHash("stu2", "name");
                    Console.WriteLine(client.GetHashCount("stu2"));
                    //判断hash中是否包含执行的key数据
                    Console.WriteLine(client.HashContainsEntry("stu2","name"));
                    //追加值
                    client.IncrementValueInHash("stu2", "number", 1);
                    var getHashStu2 = client.GetAllEntriesFromHash("stu2");
```

## List集合
![image.png](/common/1622630649055-ae3ae4f4-9d46-4d79-aa8e-7015418775b6.png)
底层数据结构：单行链表
```csharp
					//添加
                    var libai = new UserInfo { Id = "001", Name = "李白" };
                    client.AddItemToList("list", JsonConvert.SerializeObject(libai));
                    var caocao = new UserInfo { Id = "002", Name = "曹操" };
                    client.AddItemToList("list", JsonConvert.SerializeObject(caocao));

                    //追加  从左侧向list添加
                    var liubei = new UserInfo { Id = "003", Name = "刘备" };
                    client.PushItemToList("list", JsonConvert.SerializeObject(liubei));

                    // 从右侧向list添加
                    var guanyu = new UserInfo { Id = "004", Name = "关羽" };
                    client.PrependItemToList("list", JsonConvert.SerializeObject(guanyu));

                    //设置过期时间
                    client.ExpireEntryAt("list", DateTime.Now.AddSeconds(2));
                    Console.WriteLine(client.GetListCount("list"));//4
                    Thread.Sleep(3 * 1000);
                    Console.WriteLine(client.GetListCount("list"));//4  正常应该是0的 这个延迟没有起作用

                    //批量操作
                    client.AddRangeToList("list2", new List<string> { "00", "11", "222", "333" });
                    //根据下标读取  参数是开始下标到结束的下标
                    var values = client.GetRangeFromList("list2", 1, 2);

                    //list 队列    后进的先出
                    var libai = new UserInfo { Id = "001", Name = "李白" };
                    client.AddItemToList("list", JsonConvert.SerializeObject(libai));
                    var caocao = new UserInfo { Id = "002", Name = "曹操" };
                    client.AddItemToList("list", JsonConvert.SerializeObject(caocao));
                    var liubei = new UserInfo { Id = "003", Name = "刘备" };
                    client.AddItemToList("list", JsonConvert.SerializeObject(liubei));
                    //移除尾部并返回结果
                    Console.WriteLine(client.RemoveEndFromList("list"));
                    Console.WriteLine(client.RemoveEndFromList("list"));
                    Console.WriteLine(client.RemoveEndFromList("list"));
                    Console.WriteLine(client.RemoveEndFromList("list"));
                    //移除头部，并返回结果
                    Console.WriteLine(client.RemoveStartFromList("list"));
                    Console.WriteLine(client.RemoveStartFromList("list"));
                    Console.WriteLine(client.RemoveStartFromList("list"));

                    //扩展
                    //从一个list的尾部移除一个元素，然后把这个数据添加到另一个list头部，并返回移动的值
                    Console.WriteLine(client.PopAndPushItemBetweenLists("list","newlist"));

                    //获取当前key的过期时间
                    Console.WriteLine(client.GetTimeToLive("list"));
                    //修改指定下标的值
                    client.SetItemInList("list", 0, "aaa");
```

## Set去重集合
自动去重的集合，底层结构分为两种，intzset和HashTable
如果值不是数字，并且长度不超过512，这个时候会默认选择intzset，其他情况使用HashTable
![image.png](/common/1622630743655-9416e8ab-a38a-4e2e-ae78-3ee69ffeab82.png)
值不能重复
```csharp
         //自动去重的集合（list是一个可以重复的集合）
                    var libai = new UserInfo { Id = "001", Name = "lisi" };
                    client.AddItemToSet("setid", JsonConvert.SerializeObject(libai));
                    client.AddItemToSet("setid", JsonConvert.SerializeObject(libai));
                    client.AddItemToSet("setid", JsonConvert.SerializeObject(libai));
                    //输出数量
                    Console.WriteLine(client.GetSetCount("setid"));

                    //添加数组
                    client.AddRangeToSet("setids", new List<string> { "001", "002", "002", "003" });
                    Console.WriteLine(client.GetSetCount("setids"));
                    //获取所有值
                    var sets = client.GetAllItemsFromSet("setids");

                    //随机抽奖  随机获取集合中的任意一个元素值并返回结果
                    Console.WriteLine(client.GetRandomItemFromSet("setids"));
                    Console.WriteLine(client.GetRandomItemFromSet("setids"));
                    Console.WriteLine(client.GetRandomItemFromSet("setids"));
                    Console.WriteLine(client.GetRandomItemFromSet("setids"));

                    //随机删除集合中的元素并返回结果
                    Console.WriteLine(client.PopItemFromSet("setids"));

                    //根据我们的值去删除指定元素
                    client.RemoveItemFromSet("setids", "001");

                    //从一个集合中移动到另一个新的集合中
                    client.MoveBetweenSets("setid", "newsetid", "001");

                    //交叉并补
                    client.AddRangeToSet("a", new List<string> { "001", "002", "003" });
                    client.AddRangeToSet("b", new List<string> { "002", "003", "004" });
                    var jjlist = client.GetIntersectFromSets("a", "b");//交集
                    var bingjiList = client.GetUnionFromSets("a", "b");//并集
```

## Zset：自动去重有序集合
自动去重的有序集合，自动排序
底层结构zipList：有序集合保存的元素数量小于128，所有元素的长度小于64字节。
![image.png](/common/1622630820370-40f33194-dc98-40ca-a5fd-e3fb372e9fad.png)
自动去重带排序字段集合
```csharp
					 //添加
                    client.AddItemToSortedSet("zsetid", "a",200);
                    client.AddItemToSortedSet("zsetid", "b",100);

                    //批量添加
                    client.AddRangeToSortedSet("zsetid2", new List<string> { "aa", "bb", "cc" }, 10);

                    //获取
                    var zsetlist1 = client.GetAllItemsFromSortedSet("zsetid2");//正序
                    var zsetlist2 = client.GetAllItemsFromSortedSetDesc("zsetid2");//倒叙

                    //根据下标获取  从下标索引开始   取一个
                    var dic = client.GetRangeFromSortedSet("zsetid2",1,1);
                    //获取并返回分数
                    var dic2 = client.GetRangeWithScoresFromSortedSet("zsetid2", 1, 1);
```

## BitMaps

## HyperLogLoss

## Streams

