---
title: 加密存储数据
lang: zh-CN
date: 2023-03-05
publish: true
author: MY IO
isOriginal: false
category:
  - orm
tag:
  - 无
filename: jiamicunchushuju
slug: xthx1q
docsId: '66778839'
---

## 目的
针对某些数据字段要保存敏感数据的情况，比如银行卡号，我们需要使用一种机制保证存储到数据库的数据是加密的，避免数据泄露风险，但是又能够正常读取出来显示。
下面我们用MySql演示如何操作。

## 操作
创建一个ConsoleApp1，然后引用下列NuGet包：

- EntityFrameworkCore.DataEncryption
- Pomelo.EntityFrameworkCore.MySql

假设数据表User已创建好，包含3个字段:

- Id 主键
- Name 姓名
- BankCard 银行账户

创建User类，在BankCard上我们加了EncryptedAttribute,表示这个字段需要加密:
```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    [Encrypted]
    public string BankCard { get; set; }
}
```
创建DefaultDbContext，在构造函数创建IEncryptionProvider实例，并在OnModelCreating方法中UseEncryption:
```csharp
public class DefaultDbContext: DbContext
    {
        private readonly byte[] _encryptionKey = ...;
        private readonly byte[] _encryptionIV = ...;
        private readonly IEncryptionProvider _provider;
        public DefaultDbContext()
        {
            this._provider = new AesProvider(this._encryptionKey, this._encryptionIV);
        }

        public DbSet<User> User { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseEncryption(this._provider);
            base.OnModelCreating(modelBuilder);
        }
    }
```
现在，让我们增加几个User：
```csharp
DefaultDbContext context = new DefaultDbContext();

User zhangsan = new User { Id = 1, Name = "张三", BankCard = "12345" };
User lisi = new User { Id = 2, Name = "李四", BankCard = "67890" };
context.User.AddRange(zhangsan, lisi);
context.SaveChanges();

var users = context.User.ToList();
foreach (var user in users)
{
    Console.WriteLine($"{user.Id} {user.Name} {user.BankCard}");
}
```
可以看到输出正常,但是数据库中已经加密。

## 总结
使用这种方式的好处在于，可以实现统一的数据库数据加解密规则，不需要单独在仓储中处理了，方便快速实现业务。

## 资料
[https://mp.weixin.qq.com/s/BkUUU5-Olsfpg1XsgBUt5A](https://mp.weixin.qq.com/s/BkUUU5-Olsfpg1XsgBUt5A) | 暴库也不怕！EF Core加密存储数据
