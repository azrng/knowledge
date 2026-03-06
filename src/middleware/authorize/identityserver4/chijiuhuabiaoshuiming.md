---
title: 持久化表说明
lang: zh-CN
date: 2022-05-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: chijiuhuabiaoshuiming
slug: sv80q1
docsId: '44892889'
---
多个上下文：有两种类型的数据需要持久化到数据库中

#### 官方自带上下文

##### ConfigurationDbContext
配置数据(资源、客户端、身份)
![image.png](/common/1620442383916-8bb2f13d-a760-4c42-93cd-182f68a9ef45.png)
生成迁移文件
```powershell
add-migration InitialIdentityServerConfigurationDbMigration -c ConfigurationDbContext -o Data/Migrations/IdentityServer/ConfigurationDb
```

##### PersistedGrantDbContext
使用中产生的操作数据(令牌、代码和用户授权信息)
![image.png](/common/1620442413509-597667a4-cd08-49d7-8655-3a8a1ad86cab.png)
生成迁移文件
```powershell
add-migration InitialIdentityServerPersistedGrantDbMigration -c PersistedGrantDbContext -o Data/Migrations/IdentityServer/PersistedGrantDb
```

#### 扩展库

##### ApplicationDbContext
![image.png](/common/1620443537213-f303ba9e-d877-42fe-9aa6-30096b524b21.png)

#### 总结
```sql
add-migration InitialIdentityServerPersistedGrantDbMigration -c PersistedGrantDbContext -o Data/Migrations/IdentityServer/PersistedGrantDb 
add-migration InitialIdentityServerConfigurationDbMigration -c ConfigurationDbContext -o Data/Migrations/IdentityServer/ConfigurationDb
add-migration AppDbMigration -c ApplicationDbContext -o Data
update-database -c PersistedGrantDbContext
update-database -c ConfigurationDbContext
update-database -c ApplicationDbContext
```
