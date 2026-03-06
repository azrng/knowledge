---
title: 说明
lang: zh-CN
date: 2023-02-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: mwqqzx63euku7uo8
docsId: '113295565'
---

## 大小优化

### Nginx压缩
通过nginx开启gzip压缩，配置如下
```csharp
http
{
 ...
   #是否启动gzip压缩,on代表启动,off代表开启
    gzip on;
   #如果文件大于1k就启动压缩
    gzip_min_length  1k;
   #以16k为单位,按照原始数据的大小以4倍的方式申请内存空间,一般此项不要修改
    gzip_buffers     4 16k;
    gzip_http_version 1.1;
   #压缩的等级,数字选择范围是1-9,数字越小压缩的速度越快,消耗cpu就越大
    gzip_comp_level 2;
   #需要压缩的常见静态资源
    gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml application/octet-stream;
    gzip_vary on;
    gzip_proxied   expired no-cache no-store private auth;
   #由于nginx的压缩发生在浏览器端而微软的ie6很坑爹,会导致压缩后图片看不见所以该选项是禁止ie6发生压缩
    gzip_disable   "MSIE [1-6]\.";
...
}
```
重启nginx
```csharp
#用来测试配置文件
nginx -t
  
nginx -s reload
```

### Brotli压缩
发布 Blazor WebAssembly 应用时，将在发布过程中对输出内容进行静态压缩，从而减小应用的大小，并免去运行时压缩的开销。使用Brotli压缩算法。
在 wwwroot/index.html 文件中，在 Blazor 的 `<script>` 标记上将 autostart 设置为 false，阻止默认启动加载程序集
```csharp
<script src="_framework/blazor.webassembly.js" autostart="false"></script>
```
在 Blazor 的 `<script>` 标记之后和结束 `</body>` 标记之前，添加以下 JavaScript 代码 `<script>` 块：
```csharp
<script type="module">
  import { BrotliDecode } from './decode.min.js';
  Blazor.start({
    loadBootResource: function (type, name, defaultUri, integrity) {
      if (type !== 'dotnetjs' && location.hostname !== 'localhost') {
        return (async function () {
          const response = await fetch(defaultUri + '.br', { cache: 'no-cache' });
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const originalResponseBuffer = await response.arrayBuffer();
          const originalResponseArray = new Int8Array(originalResponseBuffer);
          const decompressedResponseArray = BrotliDecode(originalResponseArray);
          const contentType = type === 
            'dotnetwasm' ? 'application/wasm' : 'application/octet-stream';
          return new Response(decompressedResponseArray, 
            { headers: { 'content-type': contentType } });
        })();
      }
    }
  });
</script>
```
注意：如果在不支持静态压缩文件内容协商的静态托管解决方案（例如 GitHub 页面）上进行托管，那么需要将docode文件保存到项目中([https://github.com/google/brotli/blob/master/js/decode.min.js](https://github.com/google/brotli/blob/master/js/decode.min.js))

### 延迟加载程序集
[https://www.cnblogs.com/hejiale010426/p/17076817.html](https://www.cnblogs.com/hejiale010426/p/17076817.html)

## 参考资料
Blazor WebAssembly的初次访问慢的优化：[https://www.cnblogs.com/chenyishi/p/17039437.html](https://www.cnblogs.com/chenyishi/p/17039437.html)
压缩方案：[https://learn.microsoft.com/zh-cn/aspnet/core/blazor/host-and-deploy/webassembly?view=aspnetcore-7.0#compression-1](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/host-and-deploy/webassembly?view=aspnetcore-7.0#compression-1)
剪裁：[https://learn.microsoft.com/zh-cn/dotnet/core/deploying/trimming/trimming-options?pivots=dotnet-7-0](https://learn.microsoft.com/zh-cn/dotnet/core/deploying/trimming/trimming-options?pivots=dotnet-7-0)
