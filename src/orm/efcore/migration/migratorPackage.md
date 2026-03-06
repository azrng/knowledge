---
title: 其它迁移组件
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: migratorPackage
slug: oqdkuxm0ugtag5hg
docsId: '120363655'
---

## FluentMigrator
数据库迁移的组件

## Evolve

适用于 .NET 和 .NET Core 项目的数据库迁移工具

文档：https://evolve-db.netlify.app/

仓库地址：https://github.com/lecaillon/Evolve

https://mp.weixin.qq.com/s/j5lJOH8PqQxW-0dLYaao3Q | .NET的数据库版本管理工具 Evolve

## 奇淫技巧

### 迁移和生成数据库确认

如果你本机代码连接了多个数据库，就增加了一层迁移生成数据库前的确认操作，防止执行到不该执行的数据库

```csharp
/// <summary>
/// 迁移前的确认
/// 该文件逻辑会在命令上生成迁移文件或者更新数据库前的时候被触发
/// </summary>
/// <remarks>https://dev.to/vanenshi/how-i-saved-my-production-database-with-one-simple-console-message-4fjm</remarks>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<OpenDbContext>
{
    public OpenDbContext CreateDbContext(string[] args)
    {
        var conn = "Host=localhost;Username=postgres;Password=123456;Database=azrng";
        var dbBuild = new DbContextOptionsBuilder();
        dbBuild.UseNpgsql(conn);
        // ... Some code to generate dbContextBuilder
        var context = new OpenDbContext(dbBuild.Options);

        // This is where magic happends
        var pendingMigrations = context.Database.GetPendingMigrations();
        Console.WriteLine("*********************************************\n");

        Console.WriteLine("该命令将使用以下详细信息应用迁移");

        Console.Write("连接字符串: ");
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine(conn);
        Console.ResetColor();

        Console.Write("迁移:\n\t");
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine(string.Join("\n\t", value: pendingMigrations.ToArray()));
        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine("*********************************************");

        Console.WriteLine("你确认吗? (Y/N)");
        var userInput = (Console.ReadLine());

        if (userInput is "Y" or "y")
            return context;

        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("失败!");
        Environment.Exit(1);
        return null;
    }
}
```

### 实体类注释生成列备注信息

实现效果：将实体类上面的注释映射到数据库的列备注信息上面。
大致思路：将项目生成xml文件，然后在迁移的时候，通过反射来读取到实体类信息，并去xml中解析。
示例获取实体类备注信息

```csharp
using System.Xml;

namespace Repository.Database
{
    public class DatabaseContext : DbContext
    {

        public static string GetEntityComment(string typeName, string? fieldName = null, List<string>? baseTypeNames = null)
        {
            var path = Path.Combine(AppContext.BaseDirectory, "Repository.xml");
            XmlDocument xml = new();
            xml.Load(path);
            XmlNodeList memebers = xml.SelectNodes("/doc/members/member")!;

            Dictionary<string, string> fieldList = new();

            if (fieldName == null)
            {
                var matchKey = "T:" + typeName;

                foreach (object m in memebers)
                {
                    if (m is XmlNode node)
                    {
                        var name = node.Attributes!["name"]!.Value;

                        var summary = node.InnerText.Trim();

                        if (name == matchKey)
                        {
                            fieldList.Add(name, summary);
                        }
                    }
                }

                return fieldList.FirstOrDefault(t => t.Key.ToLower() == matchKey.ToLower()).Value ?? typeName.ToString().Split(".").ToList().LastOrDefault()!;
            }
            else
            {

                foreach (object m in memebers)
                {
                    if (m is XmlNode node)
                    {
                        string name = node.Attributes!["name"]!.Value;

                        var summary = node.InnerText.Trim();

                        var matchKey = "P:" + typeName + ".";
                        if (name.StartsWith(matchKey))
                        {
                            name = name.Replace(matchKey, "");

                            fieldList.Remove(name);

                            fieldList.Add(name, summary);
                        }

                        if (baseTypeNames != null)
                        {
                            foreach (var baseTypeName in baseTypeNames)
                            {
                                if (baseTypeName != null)
                                {
                                    matchKey = "P:" + baseTypeName + ".";
                                    if (name.StartsWith(matchKey))
                                    {
                                        name = name.Replace(matchKey, "");
                                        fieldList.Add(name, summary);
                                    }
                                }
                            }
                        }
                    }
                }

                return fieldList.FirstOrDefault(t => t.Key.ToLower() == fieldName.ToLower()).Value ?? fieldName;
            }
        }
    }

}

```

在对 DatabaseContext.OnModelCreating 方法稍加改造即可就能实现我们本次的目的。

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{

    foreach (var entity in modelBuilder.Model.GetEntityTypes())
    {
        modelBuilder.Entity(entity.Name, builder =>
        {

#if DEBUG
            //设置表的备注
            builder.ToTable(t => t.HasComment(GetEntityComment(entity.Name)));

            List<string> baseTypeNames = new();
            var baseType = entity.ClrType.BaseType;
            while (baseType != null)
            {
                baseTypeNames.Add(baseType.FullName!);
                baseType = baseType.BaseType;
            }
#endif

            foreach (var property in entity.GetProperties())
            {

#if DEBUG
                //设置字段的备注
                property.SetComment(GetEntityComment(entity.Name, property.Name, baseTypeNames));
#endif

                //设置字段的默认值 
                var defaultValueAttribute = property.PropertyInfo?.GetCustomAttribute<DefaultValueAttribute>();
                if (defaultValueAttribute != null)
                {
                    property.SetDefaultValue(defaultValueAttribute.Value);
                }
            }
        });
    }
}
```

然后迁移的时候就会发现已经带有列备注信息了。
参考文档：[https://www.cnblogs.com/berkerdong/p/16985681.html](https://www.cnblogs.com/berkerdong/p/16985681.html)

