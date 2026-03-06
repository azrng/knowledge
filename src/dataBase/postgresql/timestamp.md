---
title: 时间处理
lang: zh-CN
date: 2023-08-26
publish: true
author: azrng
isOriginal: false
category:
  - dataBase
tag:
  - pgsql
filename: shijianchuli
slug: muobmz
docsId: '90825728'
---

## 数据库层次

### 时间类型
对于pg数据库有两个时间类型`timestamp`和`timestamptz`，其中`timestamp`是`timestamp without time zone`的别名，`timestamptz`是`timestamp with time zone`的别名。

1. `timestamp`应存储所在时区的本地时间
2. `timestamptz`应存储utc时间

### 时区
对于pg数据库来说，数据库时区又分为服务器时区和客户端时区，对于使用者来说，客户端时区更重要。客户端时区的生命周期是连接(`session`)，因此每个连接都可以使用不同的时区或者随时切换到其他时区。可以使用`set time zone '所属时区';`来切换`session`的时区。

### 时间转换
`timestamp`和`timestamptz`可以相互转换，转换的结果和`session`的时区有关，例子中采用ISO 8601标准的时间字符串进行转换测试：

1.  `session`时区为utc，将`timestamp`和`timestamptz`互转，因为本地时区和utc时区相同，因此转换后的结果显示相同。 
```sql
set time zone 'UTC';
select '2000-01-01T01:00:00Z'::timestamptz::timestamp;
--输出 2000-01-01 01:00:00.000000
select '2000-01-01T01:00:00Z'::timestamp::timestamptz;
--输出 2000-01-01 01:00:00.000000
```

2.  `session`时区为东八区，将`timestamp`和`timestamptz`互转，因为本地时区和utc时区不相同，注意转换后会自动计算时区差异。 
```sql
set time zone 'Asia/Shanghai';
select '2000-01-01T01:00:00Z'::timestamptz::timestamp;
--输出 2000-01-01 09:00:00.000000
select '2000-01-01T01:00:00Z'::timestamp::timestamptz;
--输出 2000-01-01 01:00:00.000000 +08:00
```

### 隐式转换
注意，time会发生隐式转换，不同的类型进行赋值操作时，或者将A类型插入到B类型的列中，都会发生隐式转换，其中时间相关的隐式转换的结果和`session`的时区相关。例如
```sql
-- 注意不仅仅是赋值，例如对表的更新/插入都可能发生隐式转换
-- 例如update table set time = '2000-01-01',这里的'2000-01-01'就会隐式转换成time字段定义的类型
-- 例如修改表的定义，从timestamp修改到timestamptz
do
$$
    declare
        time1 timestamp;
        time2 timestamptz;
        time3 timestamptz;
    begin
        set time zone 'Asia/Shanghai';
        select '2000-01-01' into time1;
        select '2000-01-01' into time2;
        select '2000-01-01 +00' into time3;
        raise notice 'time1:timestamp:%',time1;
        raise notice 'time2:timestamptz:%',time2;
        raise notice 'time3:timestamptz:%',time3;
    end;
$$;
-- time1:timestamp:2000-01-01 00:00:00
-- time2:timestamptz:2000-01-01 00:00:00+08
-- time3:timestamptz:2000-01-01 08:00:00+08
```

1. 如果字符串转换到`timestamp`，无论字符串是否带有时区信息，对结果都无影响，timestamp会忽略字符串中的时区信息。
2. 如果字符串转换到`timestamptz`，如果字符串中无时区信息，会被当作本地时间对待，转换的结果和`session`的时区设置有关，如果字符串中有时区信息，会根据字符串中的时区信息进行转换，实际结果和`session`时区无关，展示结果和`session`时区有关。
3. `timestamp`和`timestamptz`隐式转换结果和`session`的时区相关
4. 查询`timestamptz`时，会根据`session`的时区进行展示，如2000-01-01 00:00:00，如果在东一区就会显示为2000-01-01 01:00:00 +01

### 其他
注意DataGrip连接pg数据库时，默认`session`是0时区，因此如果数据库字段是`timestamp`类型，执行`update table set xx=now();`时，时间会少8小时，这个结果是正确的，因为对于utc的客户端`session`来说，本地时间就是utc时间。
你可以右键数据库连接-Properties，在弹出的页面上切换到Options选项卡，进行`session`时区的修改。

## npgsql驱动层面

### 默认时区
npgsql连接数据库的`session`使用的默认时区是由pg数据库返回的，公司部署的pg库都部署为`Asia/Shanghai`，可以通过连接字符串中的Timezone进行控制 [https://www.npgsql.org/doc/connection-string-parameters.html](https://www.npgsql.org/doc/connection-string-parameters.html)

### 默认时间映射
从6.0开始npgsql默认将`Kind`信息为`UTC`的`DateTime`映射为`timestamptz`,将`Kind`信息为`Local/Unspecified`的`DateTime`映射为`timestamp`,可以使用`AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);`恢复之前版本的行为。参考 [https://www.npgsql.org/doc/types/datetime.html](https://www.npgsql.org/doc/types/datetime.html)
从PG数据库读取数据的行为发生了如下改变

| PostgreSQL type | .NET Native Type |
| --- | --- |
| timestamp | DateTime (Unspecified) |
| timestamptz | DateTime (Utc) |

发送到PG数据库的行为发生了如下改变

| PostgreSQL type | Default .NET types | NpgsqlDbType | DbType |
| --- | --- | --- | --- |
| timestamp | DateTime (Local/Unspecified) | Timestamp | DateTime, DateTime2 |
| timestamptz | DateTime (Utc), DateTimeOffset | TimestampTz | DateTimeOffset |

以上的影响用代码表示，如下
```csharp
new NpgsqlParameter("@p1", DbType.DateTime) { Value = DateTime.UtcNow }
//6.0后等价于
new NpgsqlParameter("@p1", NpgsqlDbType.TimestampTz) { Value = DateTime.UtcNow }
```
```csharp
new NpgsqlParameter("@p1", DbType.DateTime) { Value = DateTime.Now }
//6.0后等价于
new NpgsqlParameter("@p1", NpgsqlDbType.Timestamp) { Value = DateTime.Now }
```
如果直接操作`NpgsqlDbType`，当`DateTime`的`Kind`属性不满足要求的话，会得到一个异常
例如dapper等SqlHelper最底层都是使用ado.net的抽象进行数据库操作，因此他们的DateTime都会映射到DbType.DateTime,所以都会受到此变更影响
如果原来数据库设计就满足timestamp，timestamptz的存储约定，则由于npgsql驱动会根据传入的时间类型切换发送到数据库的时间类型，因此只要`session`的时区格式正确，则不影响结果，以东八区举例：

1. 字段类型是timestamptz，传入DateTime.Now，则数据库收到的数据类型是timestamp，值是东八区时间，存入timestamptz字段时，`session`是东八区，会发生隐式转换，存入正确的utc时间
2. 字段类型是timestamptz，传入DateTime.UtcNow，则数据库收到的数据类型是timestamptz，值是utc时间，直接存入timestamptz的字段中
3. 字段类型是timestamp，传入DateTime.Now，则数据库收到的数据类型是timestamp，值是东八区时间，直接存入timestamp字段中
4. 字段类型是timestamp，传入DateTime.UtcNow，则数据库收到的数据类型是timestamptz，值是utc，存入timestamp字段时根据`session`的时区发生隐式转换，转换为东八区时间存入。

### 对于EF的影响
对于EF来说，因为存在模型映射中已经固定了映射，因此不存在根据DateTime的`Kind`属性进行动态类型映射，对于6.0的EF来说，`DateTime`默认映射为`NpgsqlDbType.TimestampTz`，也可以手动修改模型绑定将其映射到`NpgsqlDbType.Timestamp`，因此要么全部使用UTC时间，要么全部使用本地时间。

## npgsql6 迁移

### 原始数据库设计字段类型为timestamp，存储的时间是UTC时间

-  方案1：按照数据库约定，修改字段为timestamptz，建议使用此方案
修改数据库字段类型为timestamptz 
```sql
-- 注意先将session的time zone切换到utc，否则转换类型时，字段将发生隐式转换，将目前存储的时间转换为utc时间
SET timezone TO 'UTC';
alter table mdm.code_system alter column "CreateTime" type timestamptz;
-- 注意，如果有视图引用被修改的字段，则无法修改，应先删除视图，修改完成后再创建视图
```

-  方案2：不遵循约定，依然使用timestamp，依然存储UTC时间，在代码中修改UTC时间的Kind属性（不建议） 
```csharp
// Ado.Net
new SqlParameter("@time", SqlDbType.DateTime2) { Value = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified) };

//EF，将DateTime映射到timestamp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    //保存前将时间转换为Unspecified，读取时将时间转换为UTC
    var converter = new ValueConverter<DateTime, DateTime>(
                v => DateTime.SpecifyKind(v.ToUniversalTime(),DateTimeKind.Unspecified),
                v => DateTime.SpecifyKind(v,DateTimeKind.Utc));
    modelBuilder.Entity<Table>(c =>
            {
                c.Property(x => x.Time).HasColumnType("timestamp").HasConversion(converter);
            });
}

// Dapper,写和读时统一处理，写时转换Unspecified，读时转换Utc
public class NullableDateTimeLocalHandler : SqlMapper.TypeHandler<DateTime?>
{
    public override void SetValue(IDbDataParameter parameter, DateTime? value)
    {
        if (value.HasValue)
        {
            value = DateTime.SpecifyKind(value.Value.ToUniversalTime(), DateTimeKind.Unspecified);
        }
        //参考npgsql源码中的GlobalTypeMapper类中的DbTypeToNpgsqlDbType方法，DateTime2映射为NpgsqlDbType.Timestamp
        parameter.DbType = DbType.DateTime2;
        parameter.Value = value;
    }

    public override DateTime? Parse(object value)
    {
        if (value is DBNull)
        {
            return null;
        }
        return DateTime.SpecifyKind((DateTime)value, DateTimeKind.Utc);
    }
}

//全局执行一遍即可
//注意需要移除原来的Mapping映射
 SqlMapper.RemoveTypeMap(typeof(DateTime));
 SqlMapper.RemoveTypeMap(typeof(DateTime?));
 SqlMapper.AddTypeHandler(new NullableDateTimeLocalHandler());
```


-  方案3：使用npgsql的开关回到旧版行为，EF和dapper中依然建议使用converter统一处理时间字段 
```csharp
// 启动后执行，参考EnableLegacyTimestampBehaviorTest.cs
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
```

### 原始数据库设计字段类型为timestamp，存储的时间是本地时间
由于此方案是满足数据约定的，因此只需要修改EF中的字段类型映射，并注意以下几点

1. 需要设定C#服务容器所属时区为东八区
2. 读取数据时，DateTime的Kind为Unspecified，如果使用EF最好使用统一的converter进行转换，转换到Local
3. DataGrip中默认的`session`是UTC，而npgsql默认`session`是数据库配置的时区，注意数据库管理工具中执行sql和程序执行sql中的now()函数的区别。

## 其他

### 查询指定类型的字段，生成架构修改的sql
```sql
-- 查询出所有的without time zone类型的字段，输出修改表架构的sql
    do
    $$
        declare
            my_cursor  REFCURSOR;
            schemaname text;
            tablename  text;
            attname    text;
        begin
            open my_cursor for SELECT t.schemaname,
                                    t.tablename,
                                    a.attname
                            FROM pg_class AS c,
                                    pg_attribute AS a,
                                    pg_tables as t
                            WHERE c.relname = t.tablename
                                AND a.attrelid = c.oid
                                AND a.attnum > 0
                                AND t.schemaname not like 'pg%'
                                AND format_type(a.atttypid, a.atttypmod) like '%without time zone';
            LOOP
                FETCH NEXT FROM my_cursor INTO schemaname, tablename,attname;
                EXIT WHEN NOT FOUND;
                --execute 'alter table "' || schemaname || '"."' || tablename || '" alter column "' || attname ||
                --        '" type timestamp with time zone';
                raise notice 'alter table "%"."%" alter column "%" type timestamptz;', schemaname,tablename,attname;
            end loop;
            CLOSE my_cursor;
        end;
    $$;
```
