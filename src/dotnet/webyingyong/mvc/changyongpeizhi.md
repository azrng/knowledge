---
title: 常用配置
lang: zh-CN
date: 2023-09-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: changyongpeizhi
slug: pkwl3yru7olz3f1n
docsId: '140513040'
---

### 视图实时预览
需要在nuget上安装**Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation组件**
然后需要再在service中注册
```csharp
services.AddRazorPages().AddRazorRuntimeCompilation();
```
然后开启Razor运行时编译。

如果遇到错误如：Cannot find compilation library location for package 'System.Security.Cryptography.Pkcs'
那么需要修改项目csproj文件在PropertyGroup下增加
```csharp
<GenerateRuntimeConfigDevFile>true</GenerateRuntimeConfigDevFile>
```

## 页面使用母版页后js不生效
原因是在母版页中，为了提高效率，会将css放在母版页上方，所以子页面样式是正常的，但是母版页js是在下方的，导致子页面在运行的时候js还为加载，这个时候需要我们做以下操作
```csharp
在母版页中，标记：
  @await RenderSectionAsync("Scripts", required: false)
    
 在子页面中将js文件包含在以下代码中，就可以解决js还未加载的情况
 @section Scripts{
    <script type="text/javascript">
        alert("测试")
    </script>
}
```

