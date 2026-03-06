---
title: .Net操作
lang: zh-CN
date: 2025-02-27
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - qdrant
---

## 数据集内容备份

安装nuget包

```
<PackageReference Include="Qdrant.Client" Version="1.15.0" />
```

```csharp
public class QdrantService : IServiceStart
{
    private readonly QdrantClient _client;
    private readonly IJsonSerializer _jsonSerializer;

    public QdrantService(IJsonSerializer jsonSerializer)
    {
        _jsonSerializer = jsonSerializer;
        _client = new QdrantClient("172.16.120.21", 8126);
    }

    public async Task RunAsync()
    {
        await ExportCollectionToJsonAsync("indicator202505211236", "exe.json");
    }

    public async Task ExportCollectionToJsonAsync(string collectionName, string outputPath)
    {
        // 获取所有点（分页处理）
        var collection = new IndicatorCollectionDto(collectionName);
        var offset = (ulong)0;

        while (true)
        {
            var batch = await _client.ScrollAsync(collectionName: collectionName,
                offset: offset,
                limit: 1000);

            foreach (var point in batch.Result)
            {
                collection.Items.Add(new IndicatorInfoDto(point.Payload["Id"].StringValue, point.Payload["Name"].StringValue));
            }

            if (batch.NextPageOffset is null || batch.NextPageOffset?.HasNum == false)
                break;

            offset = batch.NextPageOffset?.Num ?? 0;
        }

        var str = _jsonSerializer.ToJson(collection);

        // // 写入 JSON 文件
        await File.WriteAllTextAsync(outputPath, str);
    }

    public string Title => "导出数据";
}
```
