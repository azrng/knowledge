---
title: Lucene-SearchExtensions
lang: zh-CN
date: 2022-10-11
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: lucene-searchextensions
slug: kvuesr
docsId: '96432694'
---

## 概述
使用勤快哥封装的第三方全文检索包SearchExtensions，该包基于EntityFrameworkCore和Lucene.NET实现的全文检索搜索引擎，可轻松实现高性能的全文检索。可以轻松应用于任何基于EntityFrameworkCore的实体框架数据库。

## 操作
安装nuget包
```csharp
PM> Install-Package Masuit.LuceneEFCore.SearchEngine_int
PM> Install-Package Masuit.LuceneEFCore.SearchEngine_long
PM> Install-Package Masuit.LuceneEFCore.SearchEngine_string
PM> Install-Package Masuit.LuceneEFCore.SearchEngine_Guid
#根据你的项目情况，选择对应的后缀版本，提供了4个主键版本的库，后缀为int的代表主键是基于int自增类型的，后缀为Guid的代表主键是基于Guid类型的...
```
这里我为了测试直接使用guid的包
```csharp
<PackageReference Include="Masuit.LuceneEFCore.SearchEngine_guid" Version="1.2.0" />
```

### 数据库上下文
```csharp
public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.TrackAll);
    }

    public virtual DbSet<Post> Post { get; set; }
}
```
新建实体类
```csharp
/// <summary>
/// 文章
/// </summary>
[Table("Post")]
public class Post : LuceneIndexableBaseEntity
{
    public Post()
    {
        PostDate = DateTime.Now;
    }

    /// <summary>
    /// 标题
    /// </summary>
    [Required(ErrorMessage = "文章标题不能为空！"), LuceneIndex]
    public string Title { get; set; }

    /// <summary>
    /// 作者
    /// </summary>
    [Required, MaxLength(24, ErrorMessage = "作者名最长支持24个字符！"), LuceneIndex]
    public string Author { get; set; }

    /// <summary>
    /// 内容
    /// </summary>
    [Required(ErrorMessage = "文章内容不能为空！"), LuceneIndex(IsHtml = true)]
    public string Content { get; set; }

    /// <summary>
    /// 发表时间
    /// </summary>
    public DateTime PostDate { get; set; }

    /// <summary>
    /// 作者邮箱
    /// </summary>
    [Required(ErrorMessage = "作者邮箱不能为空！"), LuceneIndex]
    public string Email { get; set; }

    /// <summary>
    /// 标签
    /// </summary>
    [StringLength(256, ErrorMessage = "标签最大允许255个字符"), LuceneIndex]
    public string Label { get; set; }

    /// <summary>
    /// 文章关键词
    /// </summary>
    [StringLength(256, ErrorMessage = "文章关键词最大允许255个字符"), LuceneIndex]
    public string Keyword { get; set; }
}
```
> 注意：
> 实体必须继承自LuceneIndexableBaseEntity
> 需要被检索的字段需要被LuceneIndexAttribute所标记

LuceneIndexAttribute对应的4个自定义参数
1.Name：自定义索引字段名，默认为空；
2.Index：索引行为，默认为Field.Index.ANALYZED；
3.Store：是否被存储到索引库，默认为Field.Store.YES；
4.IsHtml：是否是html，默认为false，若标记为true，则在索引解析时会先清空其中的html标签。

注入数据库上下文，因为我要连接MySQL数据库，所以需要提前安装nuget包
```csharp
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="6.0.2" />
```
注册服务
```csharp
var connect = "";
builder.Services.AddDbContext<DataContext>(db =>
{
    db.UseMySql(connect, ServerVersion.AutoDetect(connect));
});
```

### 搜索引擎配置
```csharp
// 依赖注入搜索引擎，并配置索引库路径
builder.Services.AddSearchEngine<DataContext>(new LuceneIndexerOptions
{
    Path = "lucene"
});
```

### 使用方法
```csharp
[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    private readonly ISearchEngine<DataContext> _searchEngine;
    private readonly ILuceneIndexer _luceneIndexer;

    public HomeController(ISearchEngine<DataContext> searchEngine, ILuceneIndexer luceneIndexer)
    {
        _searchEngine = searchEngine;
        _luceneIndexer = luceneIndexer;
    }

    /// <summary>
    /// 搜索
    /// </summary>
    /// <param name="s">关键词</param>
    /// <param name="page">第几页</param>
    /// <param name="size">页大小</param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> Index(string s, int page, int size)
    {
        //var result = _searchEngine.ScoredSearch<Post>(new SearchOptions(s, page, size, "Title,Content,Email,Author"));
        var result = _searchEngine.ScoredSearch<Post>(new SearchOptions(s, page, size, typeof(Post)));
        return Ok(result);
    }

    /// <summary>
    /// 创建索引
    /// </summary>
    [HttpGet]
    public void CreateIndex()
    {
        //_searchEngine.CreateIndex();//扫描所有数据表，创建符合条件的库的索引
        _searchEngine.CreateIndex(new List<string>() { nameof(Post) });//创建指定的数据表的索引
    }

    /// <summary>
    /// 添加索引
    /// </summary>
    [HttpPost]
    public void AddIndex(Post p)
    {
        // 添加到数据库并更新索引
        _searchEngine.Context.Post.Add(p);
        _searchEngine.SaveChanges();

        //_luceneIndexer.Add(p); //单纯的只添加索引库
    }

    /// <summary>
    /// 删除索引
    /// </summary>
    [HttpDelete]
    public void DeleteIndex(Post post)
    {
        //从数据库删除并更新索引库
        Post p = _searchEngine.Context.Post.Find(post.Id);
        _searchEngine.Context.Post.Remove(p);
        _searchEngine.SaveChanges();

        //_luceneIndexer.Delete(p);// 单纯的从索引库移除
    }

    /// <summary>
    /// 更新索引库
    /// </summary>
    /// <param name="post"></param>
    [HttpPatch]
    public void UpdateIndex(Post post)
    {
        //从数据库更新并同步索引库
        Post p = _searchEngine.Context.Post.Find(post.Id);
        // update...
        _searchEngine.Context.Post.Update(p);
        _searchEngine.SaveChanges();

        //_luceneIndexer.Update(p);// 单纯的更新索引库
    }
}
```
要在执行任何CRUD操作后更新索引，只需从ISearchEngine调用SaveChanges()方法，而不是从DataContext调用SaveChanges()。 这才会更新索引，然后会自动调用DataContexts的SaveChanges()方法。如果直接调用DataContexts的SaveChanges()方法，只会保存到数据库，而不会更新索引库。

搜索返回`IScoredSearchResultCollection<T>`，其中包括执行搜索所花费的时间，命中总数以及每个包含的对象的结果集以及在搜索中匹配度的数量。
特别注意：单元测试中使用内存RAM目录进行索引和搜索，但这仅用于测试目的，真实生产环境应使用物理磁盘的目录。

## 资料
[https://github.com/ldqk/Masuit.LuceneEFCore.SearchEngine](https://github.com/ldqk/Masuit.LuceneEFCore.SearchEngine) | ldqk/Masuit.LuceneEFCore.SearchEngine: 基于EntityFrameworkCore和Lucene.NET实现的全文检索搜索引擎

一个基于EFCore+Lucene实现的全文搜索引擎库：https://mp.weixin.qq.com/s/CwhQszMOAvnAJ7qb3j7mBg
