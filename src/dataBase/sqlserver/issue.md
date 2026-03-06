---
title: 问题
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: putong
slug: xr5aw5p8w0fxq2rg
docsId: '140756729'
---

## CPU占用高
SQLSERVER排查CPU占用高的情况 - 马会东 - 博客园
[https://www.cnblogs.com/duanweishi/p/13856924.html](https://www.cnblogs.com/duanweishi/p/13856924.html)

## 数据库显示为单个用户，无法操作的问题

运行：
```sql
USE master;
GO
DECLARE @SQL VARCHAR(MAX);
SET @SQL=''
SELECT @SQL=@SQL+'; KILL '+RTRIM(SPID)
FROM master..sysprocesses
WHERE dbid=DB_ID('DataBaseName');
EXEC(@SQL);
GO

ALTER DATABASE DataBaseName SET MULTI_USER;
```


原理：先kill占用了数据库的那个进程，然后设置数据库为多用户模式即可。

## docker部署连接sqlserver2008 ssl错误

大致错误信息如下

```
A connection was successfully established with the server, but then an error occurred during the pre-login handshake. (provider: TCP Provider, error: 35 - An internal exception was caught)

// 或者

SSL Handshake failed with OpenSSL error - SSL_ERROR_SSL.
```

原因：

由于进行镜像的安全级别提高了,默认采用了TLSv1.2版本，导致无法访问旧版本的数据库,而程序所使用的 SQL Server 数据库版本比较低不支持 TLSv1.2



解决方案：

在dockerfile文件增加下面的参数

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["WebApplication8/WebApplication8.csproj", "WebApplication8/"]
RUN dotnet restore "./WebApplication8/./WebApplication8.csproj"
COPY . .
WORKDIR "/src/WebApplication8"
RUN dotnet build "./WebApplication8.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./WebApplication8.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final

RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf   👈
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf 👈

WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplication8.dll"]
```

参考资料：https://www.cnblogs.com/printertool/p/14084385.html
