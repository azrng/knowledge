---
title: WebForm缓存处理
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: webformhuancunchuli
slug: oyvelu
docsId: '31541436'
---
第一种缓存：
服务器端缓存  在ASP.NET中页面缓存的使用方法非常的简单，只需要在aspx页的顶部加这样一句声明即可：
    <%@ OutputCache Duration="60" VaryByParam="none" %> 
     Duration：缓存时间，单位是s；
     VaryByParam：分号分隔的字符串列表，用于使输出缓存发生变化。默认情况下，这些字符串对应于使用 GET 方法特性发送的查询字符串值，或者使用 POST 方法发送的参数。将该特性设置为多个参数时，对于每个指定参数组合，输出缓存都包含一个不同版本的请求文档。
**varyByParam="none"** 当 VaryByParam 设置为 none 时，将不考虑任何参数；无论提供什么附加参数，都将向所有用户发送相同的页：
 **VaryByParam =“*”**对于每个唯一的请求参数组合，将缓存一个唯一页
第二种缓存
客户端缓存 从cache中获取
```csharp
public void Bind()
        {
            DataTable dt = new DataTable();           
            if (this.Cache["Keys"] == null)
            {
                string connstring = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
                SqlConnection conn = new SqlConnection(connstring);
                conn.Open();
                string sql = "select top 100000 * from SF_InstanceActivity";
                SqlDataAdapter da = new SqlDataAdapter(sql, conn);
                da.Fill(dt);
                conn.Close();
                // Go get the data from the database
                this.Cache.Insert("Keys", dt, null, DateTime.Now.AddHours(2), TimeSpan.Zero);
            }
            else
            {
               dt = this.Cache["Keys"] as DataTable;
            }
            ASPxGridView1.DataSource = dt;
            ASPxGridView1.DataBind();
        }
```
 
 
 
参考文章：[https://www.cnblogs.com/Gxiaopan/p/4187204.html](https://www.cnblogs.com/Gxiaopan/p/4187204.html)
