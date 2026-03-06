---
title: 注释说明
lang: zh-CN
date: 2023-10-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zhushishuiming
slug: msgsu0
docsId: '30113035'
---
示例：
```csharp
/// <summary>
/// 添加热力图
/// </summary>
/// <remarks>
/// Sample request:
/// ```
///  POST /hotmap
///  {
///      "displayName": "演示名称1",
///      "matchRule": 0,
///      "matchCondition": "https://www.cnblogs.com/JulianHuang/",
///      "targetUrl": "https://www.cnblogs.com/JulianHuang/",
///      "versions": [
///      {
///         "versionName": "ver2020",
///         "startDate": "2020-12-13T10:03:09",
///         "endDate": "2020-12-13T10:03:09",
///          "offlinePageUrl": "3fa85f64-5717-4562-b3fc-2c963f66afa6",  //  没有绑定图片和离线网页的对应属性传 null
///          "pictureUrl": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
///          "createDate": "2020-12-13T10:03:09"
///      }
///    ]
///  }
///```
/// </remarks>
/// <param name="createHotmapInput"></param>
/// <returns></returns>
[Consumes("application/json")]
[Produces("text/plan")]
[ProducesResponseType(typeof(Boolean), 200)]
[HttpPost]
public async Task<bool> AddHotmapAsync([FromBody] CreateHotmapInput createHotmapInput)
{
     var model = ObjectMapper.Map<CreateHotmapInput, Hotmap>(createHotmapInput);
     model.ProfileId = CurrentUser.TenantId;
     return await _hotmaps.InsertAsync(model)!=null;
}
```
通过给API添加XML注释：**remarks**
注意如果注释内容包含代码，可以使用Markdown的代码语法```,在注释里面优雅显示代码。
通过Consumes,Produces特性指示action接收和返回的数据类型，也就是[媒体类型](http://mp.weixin.qq.com/s?__biz=MzI4NTU0NjYwOA==&mid=2247484721&idx=1&sn=e244dc59b0ba3fba69de333d73436219&chksm=ebebc42edc9c4d381732099da3a6afc60dbafdd2461027035b1185d7c3d770ba42f5db06127c&scene=21#wechat_redirect)。
Consumes、Produces是指示请求/响应支持的[content-type](http://mp.weixin.qq.com/s?__biz=MzI4NTU0NjYwOA==&mid=2247484721&idx=1&sn=e244dc59b0ba3fba69de333d73436219&chksm=ebebc42edc9c4d381732099da3a6afc60dbafdd2461027035b1185d7c3d770ba42f5db06127c&scene=21#wechat_redirect)的过滤器，位于Microsoft.AspNetCore.Mvc命名空间下。
通过ProducesResponseType特性指示API响应的预期内容、状态码
 
API文档显示：
代码注释、约束请求的content-type、指示响应出的content-type
