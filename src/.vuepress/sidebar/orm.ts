
// orm

export const ormSidebar = [
    "readme.md",
    {
        text: "ADO.NET",
        prefix: "/orm/adoNet/",
        collapsible: true,
        children: [
            "readme.md",
            "operation.md",
            "dbhelper.md",
            "dongruandaimashengchengqi.md",
            "issue.md"
        ]
    },
    {
        text: "ODBC",
        prefix: "/orm/odbc/",
        collapsible: true,
        children: [
            "readme.md",
            "odbcSqlServer.md",
        ]
    },
    {
        text: "Dapper",
        prefix: "/orm/dapper/",
        collapsible: true,
        children:
            [
                "readme.md",
                "dapperCqrs.md",
                "parameter.md",
                "component.md",
                {
                    text: "分库分表",
                    prefix: "/orm/dapper/splitDbTable/",
                    collapsible: true,
                    children:
                        ["coreData.md", "lnskyDB.md"]
                }]
    },
    {
        text: "Sqlsugar",
        prefix: "/orm/sqlsugar/",
        collapsible: true,
        children: [
            "jianjie.md",
            "operation.md",
            {
                text: "问题汇总", prefix: "/orm/sqlsugar/wentihuizong/",
                collapsible: true,
                children: [
                    "wentihuizong.md",
                    "parametercountmismatch.md"
                ]
            }]
    },
    "ef.md",
    {
        text: "EFCore",
        prefix: "/orm/efcore/",
        collapsible: true,
        children: ["readme.md",
            {
                text: "基础知识",
                prefix: "/orm/efcore/base/",
                collapsible: true,
                children: [
                    "baseOperation.md",
                    "dbDrive.md",
                    "domainConfig.md",
                    "domainRelation.md",
                    "iqueryable.md",
                    "genSql.md",
                    "batchOperator.md",
                    "savechanges.md",
                    "transaction.md",
                    "loadMethod.md",
                    "dbFunction.md",
                ]
            },
            "exceptionHande.md",
            "encryptData.md",
            "temporalTable.md",
            "multiLevelCache.md",
            {
                text: "进阶",
                prefix: "/orm/efcore/upgrade/",
                collapsible: true,
                children: [
                    "expressionTree.md",
                    "fenkufenbiao.md",
                    "douxiefenli.md",
                    "efcoreConcurrency.md",
                    "xianshibianyichaxun.md"
                ]
            },
            {
                text: "迁移数据",
                prefix: "/orm/efcore/migration/",
                collapsible: true,
                children: [
                    "efCoreCli.md",
                    "codeFirst.md",
                    "dbFirst.md",
                    "migratorPackage.md"
                ]
            },
            "commonTools.md",
            "commonClass.md",
            "refactor.md",
            "issue.md",
            {
                text: "摘抄", prefix: "/orm/efcore/extract/",
                collapsible: true,
                children:
                    [
                        "entityFrameworkEarlier.md"
                    ]
            },]
    },
    {
        text: "Linq2db", prefix: "/orm/linq2db/", collapsible: true,
        children: ["jieshao.md"]
    }, {
        text: "SqlKata", prefix: "/orm/sqlkata/",
        collapsible: true, children: ["shuiming.md"]
    }, {
        text: "Insql", prefix: "/orm/insql/", collapsible: true,
        children: ["shuiming.md"]
    },
    {
        text: "MongoDBDriver", prefix: "/orm/mongodbdriver/",
        collapsible: true, children: ["shuiming.md"]
    }
];