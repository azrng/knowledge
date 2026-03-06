
// 数据库

export const dataBaseSidebar = [
  "readme.md",
  {
    text: "基础操作",
    prefix: "/dataBase/commonOperator/",
    collapsible: true,
    children: [
      "dbDesign.md",
      "index.md",
      "transaction.md",
      "executeOrder.md",
      "dbPool.md"
    ]
  },
  {
    text: "扩展",
    prefix: "/dataBase/extend/",
    collapsible: true,
    children: [
      "jiejuefangan.md",
      "sqlOptimize.md",
      "fenkufenbiao.md",
      "cacheDbConsistency.md",
      "shujukuqianyi.md",
      {
        text: "小工具",
        prefix: "/dataBase/extend/tools/",
        collapsible: true,
        children: ["dbtool.md"]
      }]
  },
  {
    text: "SQL Server",
    prefix: "/dataBase/sqlserver/",
    collapsible: true,
    children: ["readme.md",
      {
        text: "基础知识",
        prefix: "/dataBase/sqlserver/base/",
        collapsible: true,
        children: [
          "dataType.md",
          "operation.md",
          "functions.md",
          "hierarchyid.md"]
      },
      "dbhelper.md",
      "tazhan.md",
      {
        text: "安装",
        prefix: "/dataBase/sqlserver/install/",
        collapsible: true,
        children: [
          "windowsInstall.md",
          "linuxInstall.md",
          "dockerInstall.md"
        ]
      },
      "issue.md",
      "dingshibeifenjihua.md"
    ]
  },
  {
    text: "MySQL",
    prefix: "/dataBase/mysql/",
    collapsible: true,
    children: [
      "readme.md",
      "baseContent.md",
      {
        text: "基础知识",
        prefix: "/dataBase/mysql/jichuzhishi/",
        collapsible: true,
        children: [
          "utf8heutf8mb4deoubie.md",
          "shujubiao.md",
          "fenoubiao.md",
          "mysqlshujuleixing.md",
          "liecaozuo.md",
          "chaxunshuju.md",
          "zhihangyugou.md",
          "hanshu.md",
          "suoyin.md",
          "yaoshutiaojian.md",
          "cunchuguocheng.md",
          "zhihangshunxu.md",
          "suo.md",
          "shiwu.md"]
      },
      {
        text: "MySQL函数",
        prefix: "/dataBase/mysql/mysqlhanshu/",
        collapsible: true,
        children: ["mysqlhanshu.md",
          "shujuleixing.md",
          "duibi.md"]
      },
      {
        text: "数据库优化记录",
        prefix: "/dataBase/mysql/shujukuyouhuajilu/",
        collapsible: true,
        children: ["shujukuyouhuajilu.md",
          "jianbiaoyugouyouhua.md",
          "chaxunsql.md",
          "douxiefenli.md",
          "jinshencaozuo.md"]
      },
      "codeOperator.md",
      {
        text: "进阶",
        prefix: "/dataBase/mysql/jinjie/",
        collapsible: true,
        children: [
          "zhucongfuzhi.md",
          "federated.md"
        ]
      },
      {
        text: "执行计划",
        prefix: "/dataBase/mysql/zhihangjihua/",
        collapsible: true,
        children: ["jiancesuoyinshifoushengxiao.md"]
      },
      {
        text: "脚本",
        prefix: "/dataBase/mysql/jiaoben/",
        collapsible: true,
        children: ["mysqlbeifenjiaoben.md",
          "mysqldumpOperator.md",]
      },
      {
        text: "安装",
        prefix: "/dataBase/mysql/install/",
        collapsible: true,
        children: [
          "readme.md",
          "windowInstall.md",
          "linuxInstall.md",
          "dockerInstall.md"
        ]
      },
      {
        text: "遇到的问题",
        prefix: "/dataBase/mysql/yudaodewenti/",
        collapsible: true,
        children: ["issue.md",
          "netFrameworkUse.md",
          "diguichubulaishangji.md"]
      }]
  },
  {
    text: "PostgreSQL",
    prefix: "/dataBase/postgresql/",
    collapsible: true,
    children: [
      "readme.md",
      "baseContent.md",
      "columnType",
      "timestamp.md",
      "transaction.md",
      "method.md",
      "extension.md",
      "explainPlan.md",
      "systemOperator.md",
      "script.md",
      "install.md"]
  },
  {
    text: "Oracle",
    prefix: "/dataBase/oracle/",
    collapsible: true,
    children: ["shuiming.md",
      "jichucaozuo.md",
      "changyongshujuleixing.md",
      "hanshu.md",
      "dblink.md",
      {
        text: "dotNet操作",
        prefix: "/dataBase/oracle/dotnetcaozuo/",
        collapsible: true,
        children: ["dotnetcaozuo.md",
          "oraclehelper.md"]
      },
      {
        text: "数据库备份和还原",
        prefix: "/dataBase/oracle/shujukubeifenhehaiyuan/",
        collapsible: true,
        children: ["shujukubeifenhehaiyuan.md",
          "fuwuqidingshijihua.md"]
      },
      {
        text: "安装",
        prefix: "/dataBase/oracle/anzhuang/",
        collapsible: true,
        children: ["winx64_12201_clientanzhuang.md",
          "oracleinstallclient12_2anzhuangjiaocheng.md"]
      },
      {
        text: "Oracle使用问题",
        prefix: "/dataBase/oracle/oracleshiyongwenti/",
        collapsible: true,
        children: ["oracleshiyongwenti.md",
          "11gchuangjianshujuku.md"]
      }]
  },
  {
    text: "Redis",
    prefix: "/dataBase/redis/",
    collapsible: true,
    children: [
      "readme.md",
      {
        text: "简单介绍",
        prefix: "/dataBase/redis/jianchanjieshao/",
        collapsible: true,
        children: [
          "neicunyouhua.md",
          "chijiuhua.md"]
      },
      {
        text: "Redis数据类型",
        prefix: "/dataBase/redis/redisshujuleixing/",
        collapsible: true,
        children: ["redisshujuleixing.md",
          "zifuchuan.md",
          "hashleixing.md",
          "jigesortedset.md",
          "jigeset.md",
          "liebiaolist.md",
          "hyperloglog.md"]
      },
      "jichumingling.md",
      "redisfabudingyue.md",
      "duolufuyong.md",
      "redisxiaoxiduilie.md",
      "quanwenjiansuo.md",
      {
        text: "组件",
        prefix: "/dataBase/redis/zujian/",
        collapsible: true,
        children: ["jianchanshiyong.md",
          "freeredis.md",
          {
            text: "StackExchange",
            prefix: "/dataBase/redis/zujian/stackexchange/",
            collapsible: true,
            children: ["shuiming.md",
              "redishelper.md",
              "stackexchange_redis.md"]
          },
          "redisom.md",
          "nrejson.md",
          "csredis.md"]
      },
      {
        text: "安装",
        prefix: "/dataBase/redis/anzhuang/",
        collapsible: true,
        children: [
          "bushufangan.md",
          "windowskehuduan.md",
          "linuxanzhuangredis.md",
          "docker-composebushuredis.md"
        ]
      },
      "issue.md"
    ]
  },
  {
    text: "MongoDB",
    prefix: "/dataBase/mongodb/",
    collapsible: true,
    children: ["jieshao.md",
      "gainianjiexi.md",
      "shiyongchangjing.md",
      "jibencaozuo.md",
      "daimacaozuo.md",
      "zhihangjihua.md",
      {
        text: "linux安装",
        prefix: "/dataBase/mongodb/linuxanzhuang/",
        collapsible: true,
        children: ["linuxanzhuang.md",
          "windowsanzhuang.md",
          "docker-composebushumongodb.md"]
      }]
  },
  {
    text: "SQLite",
    prefix: "/dataBase/sqlite/",
    collapsible: true,
    children: [
      "readme.md",
      "baseContent.md",
      "sqlitefts5.md"]
  },
  {
    text: "达梦数据库",
    prefix: "/dataBase/dameng/",
    collapsible: true,
    children: [
      "readme.md",
      "connect.md"
    ]
  },
  {
    text: "Elasticsearch",
    prefix: "/dataBase/elasticsearch/",
    collapsible: true,
    children: ["readme.md"]
  },
  {
    text: "Clickhouse",
    prefix: "/dataBase/clickhouse/",
    collapsible: true,
    children: [
      "readme.md",
      "baseContent.md"
    ]
  },
  {
    text: "Qdrant",
    prefix: "/dataBase/qdrant/",
    collapsible: true,
    children: [
      "readme.md",
      "dotnetOperator.md",
      "install.md"
    ]
  },
  {
    text: "Milvus",
    prefix: "/dataBase/milvus/",
    collapsible: true,
    children: [
      "readme.md",
      "dotnetOperator.md",
      "install.md"
    ]
  },
  {
    text: "Neo4j",
    prefix: "/dataBase/neo4j/",
    collapsible: true,
    children: [
      "readme.md"
    ]
  },
    {
    text: "DockDb",
    prefix: "/dataBase/dockdb/",
    collapsible: true,
    children: [
      "readme.md"
    ]
  },
  {
    text: "Cassandra",
    prefix: "/dataBase/cassandra/",
    collapsible: true,
    children: ["readme.md",
      "baseContent.md"]
  },
  {
    text: "IndexedDB",
    prefix: "/dataBase/indexeddb/",
    collapsible: true,
    children: ["readme.md"]
  },
  {
    text: "KingBaseEs",
    prefix: "/dataBase/kingBaseEs/",
    collapsible: true,
    children: ["readme.md"]
  },
  {
    text: "LiteDB",
    prefix: "/dataBase/litedb/",
    collapsible: true,
    children: ["readme.md"]
  },
  {
    text: "中间件",
    prefix: "/dataBase/middleware/",
    collapsible: true,
    children: [
      "sqlAudit.md"
    ]
  }];