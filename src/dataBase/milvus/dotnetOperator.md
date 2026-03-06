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
  - milvus
---

## 依赖包选择

使用Milvus.Client依赖包

## 创建集合

```csharp
private async Task<MilvusCollection> CreateCollection(string url, string useName, string password)
{
    var milvusClient = new MilvusClient(url, useName, password);
    var collectionName = "movies";
    var collection = await milvusClient.HasCollectionAsync(collectionName);
    if (collection)
        return milvusClient.GetCollection(collectionName);
    var schema = new CollectionSchema
    {
        Fields =
        {
            FieldSchema.Create<long>("movie_id", isPrimaryKey: true),
            FieldSchema.CreateVarchar("movie_name", maxLength: 200),
            FieldSchema.CreateFloatVector("movie_description", dimension: 2)
        }
    };

    var dimension = 16; //128;

    return await milvusClient.CreateCollectionAsync(collectionName: collectionName, schema: schema,
        shardsNum: dimension);
}
```

## 插入数据

```csharp
private async Task InsertData(string url, string useName, string password)
{
    var collectionName = "movies";
    var milvusClient = new MilvusClient(url, useName, password);
    var collection = milvusClient.GetCollection(collectionName);
    var movieIds = new[] { 1L, 2L, 3L, 4L, 5L };
    var movieNames = new[] { "狮子王", "盗梦空间", "玩具总动员", "低俗小说", "怪物史莱克" };
    var movieDescriptions = new ReadOnlyMemory<float>[]
    {
        new[] { 0.10022575f, 0.23998135f },
        new[] { 0.10327095f, -0.2563685f },
        new[] { 0.095857024f, 0.201278f },
        new[] { 0.106827796f, -0.21676421f },
        new[] { 0.09568083f, 0.21177962f }
    };

    //插入数据
    await collection.InsertAsync([
        FieldData.Create("movie_id", movieIds),
        FieldData.Create("movie_name", movieNames),
        FieldData.CreateFloatVector("movie_description", movieDescriptions)
    ]);

    // 给电影描述的嵌入向量插入索引
    await collection.CreateIndexAsync(
        fieldName: "movie_description",
        indexType: IndexType.Flat,
        metricType: SimilarityMetricType.L2,
        indexName: "movie_idx");
}
```

## 搜索

```csharp
var collection = await CreateCollection(url, useName, password); // 方法在上面
await InsertData(url, useName, password); // 方法在上面
await collection.LoadAsync();
await collection.WaitForCollectionLoadAsync();
var parameters = new SearchParameters
{
    OutputFields = { "movie_name" },
    ConsistencyLevel = ConsistencyLevel.Strong,
    ExtraParameters = { ["nprobe"] = "1024" }
};
var results = await collection.SearchAsync(
    vectorFieldName: "movie_description",
    vectors: new ReadOnlyMemory<float>[] { new[] { 0.12217915f, -0.034832448f } },
    SimilarityMetricType.L2,
    limit: 3,
    parameters);
```

