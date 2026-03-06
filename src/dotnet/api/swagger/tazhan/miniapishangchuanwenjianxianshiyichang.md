---
title: MiniApi上传文件显示异常
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: miniapishangchuanwenjianxianshiyichang
slug: ffg5gb
docsId: '96097728'
---

## 目的
该方法的目的是：在miniapi中上传文件使用HttpRequest不支持swagger显示，所以提供该方法让swagger显示

## 操作
```csharp
/// <summary>
/// 文件上传操作过滤器
/// </summary>
public class FileUploadOperationFilter : IOperationFilter
{
    //在 OpenAPI 3.0 中，文件上传的请求可以用下列结构描述（https://swagger.io/docs/specification/describing-request-body/file-upload/）

    /// <summary>
    ///该方法的目的是：在miniapi中上传文件使用HttpRequest不支持swagger显示，所以提供该方法让swagger显示
    /// </summary>
    /// <param name="operation"></param>
    /// <param name="context"></param>
    /// <exception cref="NotImplementedException"></exception>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        const string FileUploadContentType = "multipart/form-data";
        if (operation.RequestBody == null ||
            !operation.RequestBody.Content.Any(x => x.Key.Equals(FileUploadContentType, StringComparison.InvariantCultureIgnoreCase)))
        {
            return;
        }

        if (context.ApiDescription.ParameterDescriptions[0].Type != typeof(HttpRequest))
            return;

        operation.RequestBody = new OpenApiRequestBody
        {
            Description = "HttpRequest",
            Content = new Dictionary<string, OpenApiMediaType>
                {
                    {
                        FileUploadContentType, new OpenApiMediaType
                        {
                            Schema = new OpenApiSchema
                            {
                                Type = "object",
                                Required = new HashSet<string>{ "file" },
                                Properties = new Dictionary<string, OpenApiSchema>
                                {
                                    {
                                        "file", new OpenApiSchema()
                                        {
                                            Type = "string",
                                            Format = "binary"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        };
    }
}
```
在配置swagger的时候去设置
```csharp
//显示文件上传的选项
c.OperationFilter<FileUploadOperationFilter>();
```
