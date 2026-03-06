---
title: 概述
lang: zh-CN
date: 2023-09-10
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: gadvre
docsId: '34172340'
---

## 全文引擎对比
- Lucene是一个基于Java开发的全文检索基础包，使用起来繁杂，且默认不支持分布式检索
- Solr是基于Lucene开发的一个搜索工具。抽象度更高，使用更简单，且提供一个控制面板。
- ElasticSearch也是基于Lucene开发的。同样是高度抽象，并提供了一个非常强大的DSL检索功能，可以很方便的检索出数据。
- Solr和ES的区别主要在于：ES有强大的实时检索能力而不怎么掉速，Solr创建索引的同时，检索速度会下降。如果不考虑实时检索，Solr的速度更快。Solr社区更成熟。ES使用更方便更现代化。
- Sphinx是俄罗斯人开发的一个全文检索引擎，使用C++开发。性能比Java开发的es和solr高，但是在社区繁荣度上，比ES和solr差很多。比如中文分词器，sphinx的coreseek插件已经停更了。sphinx有个非常好的地方就是可以作为MySQL插件使用。

## 中间件

- [Elasticsearch .NET](https://github.com/elastic/elasticsearch-net) -      Elasticsearch.Net & NEST
- [PlainElastic.Net](https://github.com/Yegoroff/PlainElastic.Net) - ElasticSearch的Plain      .Net客户端
- [SolrNet](https://github.com/mausch/SolrNet) - .Net的Solr客户端
- [SolrExpress](https://github.com/solr-express/solr-express))      - 一个简单而轻量的查询.NET库，用于Solr，以受控，可构建和故障快速的方式
- [Lucene.net](http://lucenenet.apache.org/) - Lucene.Net是Lucene搜索引擎库的一个端口，用C＃编写，并针对.NET运行时用户

## 资料
[https://mp.weixin.qq.com/s/OYlWX0EkvxBRxdlG2Ypj4w](https://mp.weixin.qq.com/s/OYlWX0EkvxBRxdlG2Ypj4w) | .NET 使用 Jieba.NET 库实现中文分词匹配
