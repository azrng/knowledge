---
title: 生成CSharp类
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - class
  - 生成
filename: cSharpStandard
docsId: '12dbe131-f0f9-47c4-887d-efea272647b9'
# 是否显示到列表
article: false
---

## MySQL

```c#
public class TableToolService
{
    private readonly NameToolService _nameToolService;

    public TableToolService()
    {
        _nameToolService = new NameToolService();
    }

    /// <summary>
    /// 获取建表语句
    /// </summary>
    /// <param name="connectionStr"></param>
    /// <returns></returns>
    public List<string> LoadCreateTableSql(string connectionStr)
    {
        using var conn = new MySqlConnection(connectionStr);
        var tableInfo = new List<string>();
        var tables = conn.Query<string>("SHOW TABLES").ToList();
        foreach (var table in tables)
        {
            var createTableStr = conn.QueryFirstOrDefault($"SHOW CREATE TABLE {table}");
            if (createTableStr is null)
                continue;
            var createTable = JsonObject.Parse(JsonSerializer.Serialize(createTableStr))["Create Table"].ToString();
            tableInfo.Add(createTable);
        }
        return tableInfo;
    }
    /// <summary>
    /// 将表转换成对应的实体类
    /// </summary>
    /// <param name="createTableSql"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public (string table, string entityStr) TableToEntity(string createTableSql, string context = "")
    {
        var sql = createTableSql;
        //获取建表语句中的所有字段
        var tableFields = sql.Substring(sql.IndexOf("(") + 1, sql.LastIndexOf(")") - sql.IndexOf("(")).TrimEnd(')')
            .TrimStart();
        //将列分隔
        var lines = tableFields.Split(new string[] { ",\r\n", ",\n" }, StringSplitOptions.RemoveEmptyEntries).Select(x => Regex.Replace(x, @"\r\n?|\n", string.Empty).Trim())
            .ToArray();
        lines = lines.Where(x => !x.StartsWith("KEY")).Where(x => !x.StartsWith("UNIQUE KEY")).ToArray();
        //找到主键列 
        var primaryField = lines.FirstOrDefault(x => x.StartsWith("PRIMARY", StringComparison.OrdinalIgnoreCase));
        //提取主键参数
        var keys = new List<string>();
        if (!string.IsNullOrEmpty(primaryField))
        {
            lines = lines.Where(x => !x.StartsWith("PRIMARY")).ToArray();
            var keyItems = primaryField.Substring(primaryField.IndexOf("(", StringComparison.Ordinal) + 1).TrimEnd(')')
                .TrimStart().Split(',');
            if (keyItems.Length > 0)
            {
                keys.AddRange(keyItems.Select(x => x.Replace("`", "")));
            }
        }

        var entityStr = new List<string>();
        foreach (var line in lines)
        {
            var column = line.Trim();

            var parts = column.Split(' ').Select(x => x.Replace("`", "")).ToArray();

            var columnName = parts[0];

            //判断该字段是否为空
            var isNullable = !column.Contains("NOT NULL");

            var columnType = ConvertType(parts[1].ToLower());
            columnType += isNullable ? "?" : "";


            var filedColumn = "";
            if (keys.Contains(columnName))
            {
                if (keys.Count > 1)
                {
                    var index = keys.IndexOf(columnName);
                    filedColumn = $"\t[Key,Column(\"{columnName}\",Order={index + 1})]";
                }
                else
                {
                    filedColumn = $"\t[Key,Column(\"{columnName}\")]";
                }
            }
            else
            {
                filedColumn = $"\t[Column(\"{columnName}\")]";
            }

            filedColumn += Environment.NewLine;
            filedColumn += $"\t public {columnType} {_nameToolService.ConvertToPascalCase(columnName)} {{get;set;}}";

            entityStr.Add(filedColumn);
        }

        var tableName = sql
            .Substring(sql.IndexOf("TABLE") + 5, sql.IndexOf("(") - sql.IndexOf("TABLE") - 5).TrimEnd('(')
            .Replace("`", "")
            .Trim();

        string entityClassCode;
        if (string.IsNullOrEmpty(context))
        {
            entityClassCode = $"[Table(\"{tableName}\")]";
        }
        else
        {
            entityClassCode = $"[Table(\"{tableName}\"),DbContext(typeof({context}))]";
        }
        entityClassCode += Environment.NewLine;
        entityClassCode += $"public class  {_nameToolService.ConvertToPascalCase(tableName)}Entity{Environment.NewLine}{{";

        foreach (var columnDeclaration in entityStr)
        {
            entityClassCode += Environment.NewLine + columnDeclaration;
        }

        entityClassCode += Environment.NewLine + "}";

        return ($"{_nameToolService.ConvertToPascalCase(tableName)}Entity", entityClassCode);
    }

    /// <summary>
    /// 将类型转换成对应的C# 类型
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    string ConvertType(string type)
    {
        var newType = type switch
        {
            not null when type.Equals("date", StringComparison.OrdinalIgnoreCase) ||
                          type.Equals("datetime", StringComparison.OrdinalIgnoreCase) => "DateTime",
            not null when type.StartsWith("int", StringComparison.OrdinalIgnoreCase) || type.StartsWith("tinyint", StringComparison.OrdinalIgnoreCase) => "int",
            not null when type.StartsWith("bigint", StringComparison.OrdinalIgnoreCase) => "long",
            not null when type.StartsWith("bit", StringComparison.OrdinalIgnoreCase) => "bool",
            not null when type.Equals("text", StringComparison.OrdinalIgnoreCase) || type.StartsWith("varchar") =>
                "string",
            not null when type.StartsWith("decimal", StringComparison.OrdinalIgnoreCase) => "decimal",
            not null when type.StartsWith("double", StringComparison.OrdinalIgnoreCase) => "double",
            _ => type
        };
        return newType;
    }
}
```

