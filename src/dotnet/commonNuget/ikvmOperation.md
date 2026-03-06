---
title: IKVM操作
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: false
category:
  - dotNet
tag:
  - ikvm
---

## IKVM是什么？

从GitHub摘抄说明：IKVM 是 Microsoft .NET 平台的 Java 实现。它可用于快速轻松地：

- 在 .NET Framework 或 .NET Core 上执行已编译的 Java 代码（字节码）
- 将字节码转换为 .NET 程序集，以在 .NET 项目中直接访问其 API

**无需将源代码移植**到 .NET 即可完成这些任务。

GitHub文档地址：https://github.com/ikvmnet/ikvm

## 用法

### 直接引用jar包

例如我们有一个netjar.jar包想将其引入到项目中，那么我们可以在项目中创建一个jar的文件号，然后将netjar.jar文件放进去，然后修改项目文件

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>net6.0</TargetFramework>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="IKVM" Version="8.2.1" />
    </ItemGroup>

    <ItemGroup>
        <IkvmReference Include="jar/netjar.jar" >
            <AssemblyName>netjar</AssemblyName>
            <AssemblyVersion>1.0.0.4</AssemblyVersion>
        </IkvmReference>
    </ItemGroup>

</Project>
```

在 `.csproj` 中添加 `IkvmReference` , 再添加 Include 为 jar/netjar.jar，并指定 `AssemblyName`  编译后的 就是 netjar.dll ，`AssemblyVersion` 必须是 1.0.0.0 这种 4位数的版本号会给dll加上版本信息

IkvmReference的说明：https://github.com/ikvmnet/ikvm#attributes-and-elements

### Maven源引用

> 推荐一个maven源给跟我一样不会java的.Net开发者：https://mvnrepository.com/  可以在这个里面搜索包等
>

对比直接引用的方法，我们需要多安装一个IKVM.Maven.Sdk的Nuget包，默认是有一个Maven源的，然后我们只需要修改`.csproj`项目文件进行配置`MavenReference`即可

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>net6.0</TargetFramework>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="IKVM" Version="8.7.1"/>
        <PackageReference Include="IKVM.Maven.Sdk" Version="1.6.1"/>
    </ItemGroup>

    <ItemGroup>
        <MavenReference Include="mssql-jdbc">
            <groupId>com.microsoft.sqlserver</groupId>
            <artifactId>mssql-jdbc</artifactId>
            <version>12.4.2.jre8</version>
        </MavenReference>

        <!-- <MavenReference Include="com.microsoft.sqlserver:mssql-jdbc" Version="12.4.2.jre8" />-->
    </ItemGroup>

</Project>
```

使用说明：https://github.com/ikvmnet/ikvm-maven#readme

其中MavenReference内容可以参考上面的maven源搜索出来的内容，比如：https://mvnrepository.com/artifact/com.microsoft.sqlserver/mssql-jdbc/12.4.1.jre8

![image-20231124231530451](/common/image-20231124231530451.png)

#### 设置自定义源

默认已经包含了源，也可以通过修改项目文件来设置自定义源

> 引用阿里云的源
>
> https://maven.aliyun.com/nexus/content/groups/public/
>
> https://maven.aliyun.com/repository/public

```xml
<PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>

    <MavenDefaultRepositories Condition="'$(MavenDefaultRepositories)' == '' ">central=https://maven.aliyun.com/nexus/content/groups/public/</MavenDefaultRepositories>
    <MavenRepositories Condition=" '$(MavenRepositories)' == '' ">$(MavenDefaultRepositories);$(MavenAdditionalRepositories)</MavenRepositories>
</PropertyGroup>
```

## 操作示例

### 使用hutool序列化对象

下面演示调用java序列化的jar包来序列化(仅为了演示效果)，新建项目(此处我使用的是.Net6框架的项目)，引用nuget包

```xml
<ItemGroup>
	<PackageReference Include="IKVM" Version="8.6.4" />
	<PackageReference Include="IKVM.Maven.Sdk" Version="1.5.5" />
</ItemGroup>
```

引用mvaen的包，修改项目文件如下

```xml
<Project Sdk="Microsoft.NET.Sdk">

	<PropertyGroup>
		<OutputType>Exe</OutputType>
		<TargetFramework>net6.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>

		<MavenDefaultRepositories Condition="'$(MavenDefaultRepositories)' == '' ">central=https://maven.aliyun.com/nexus/content/groups/public/</MavenDefaultRepositories>
		<MavenRepositories Condition=" '$(MavenRepositories)' == '' ">$(MavenDefaultRepositories);$(MavenAdditionalRepositories)</MavenRepositories>
	</PropertyGroup>

	<ItemGroup>
		<PackageReference Include="IKVM" Version="8.6.4" />
		<PackageReference Include="IKVM.Maven.Sdk" Version="1.5.5" />
	</ItemGroup>


	<ItemGroup>
		<MavenReference Include="cn.hutool">
			<groupId>cn.hutool</groupId>
			<artifactId>hutool-all</artifactId>
			<version>5.6.6</version>
		</MavenReference>
	</ItemGroup>
    
</Project>
```

序列化对象

```c#
using cn.hutool.json;

var userInfo = new UserInfo { UserName = "admin", Password = "123456" };

var result = JSONUtil.toJsonStr(userInfo);
Console.WriteLine(result);

public class UserInfo
{
    /// <summary>
    /// 用户名
    /// </summary>
    public string UserName;

    /// <summary>
    /// 密码
    /// </summary>
    public string Password;
}
```

### 使用jdbc连接sqlserver2008

> 该示例是当时连接sqlserver2008一直报错(数据库版本太低了)，java组那边说他们连接不报错，所以想操作试试搞的

新建一个.Net6的控制台项目，然后引用nuget包(IKVM.Maven.Sdk是使用maven源用到的，直接引入jar包可以不安装)

```
<ItemGroup>
    <PackageReference Include="IKVM" Version="8.7.1"/>
    <PackageReference Include="IKVM.Maven.Sdk" Version="1.6.1"/>
</ItemGroup>
```

这个时候就需要找一个连接数据库的包，经过搜索后可以使用mssql-jdbc(也可以采用直接下载jar包放到项目目录内的方法，不使用maven)，那么可以引入一下

```
<ItemGroup>
    <MavenReference Include="mssql-jdbc">
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <version>12.4.2.jre8</version>
    </MavenReference>

    <!--简化写法-->
    <!--<MavenReference Include="com.microsoft.sqlserver:mssql-jdbc" Version="12.4.2.jre8" />-->
</ItemGroup>
```

这时候如果项目生成不报错了，那么说明包等下载好、引用好了，开始编写代码，代码虽然简单，但是还是花费了一番功夫的

```c#
try
{
    var url = "jdbc:sqlserver://192.168.1.54:1433;DatabaseName=manage;Encrypt=false";
    var userName = "sa";
    var pwd = "admin123";
    DriverManager.registerDriver(new SQLServerDriver());
    var connection = DriverManager.getConnection(url, userName, pwd);
    var stmt = connection.createStatement();
    var rs = stmt.executeQuery("select @@version");
    while (rs.next())
    {
        Console.WriteLine(rs.getString(1));
    }

    Console.WriteLine("conn success");
}
catch (Exception ex)
{
    Console.WriteLine($"message:{ex.Message} stackTrace:{ex.StackTrace}");
}
```

经过我的瞎蒙以及查阅资料终于写出来了上面查询数据库版本号的代码，然后启动项目查看输出

![image-20231122232453826](/common/image-20231122232453826.png)

测试一下容器部署，选中项目右键新建dockerfile文件如下(默认生成的)

```dockerfile
FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["JavaConsoleApp/JavaConsoleApp.csproj", "JavaConsoleApp/"]
RUN dotnet restore "JavaConsoleApp/JavaConsoleApp.csproj"
COPY . .
WORKDIR "/src/JavaConsoleApp"
RUN dotnet build "JavaConsoleApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "JavaConsoleApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JavaConsoleApp.dll"]
```

虽有警告，但是可以正常连接

![image-20231123123451650](/common/image-20231123123451650.png)

这里不得不说，他这组件要求还怪宽松，看过我上个文章的人就知道，我使用.Net组件连接sqlserver2008(甲方的数据库，版本低还不能升级)还需要再dockefile中配置其它。

## 参考资料

maven文档：https://github.com/ikvmnet/ikvm-maven

java操作数据库：https://blog.csdn.net/qq_37917691/article/details/108262286

maven.apache.org：https://maven.apache.org/
