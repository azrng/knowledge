
// 软件设计

export const softwareDesignSidebar =
    [
        "readme.md",
        {
            text: "认识系统",
            prefix: "/softwareDesign/seeSystem/",
            collapsible: true,
            children: [
                "quanxianjitong.md",
                {
                    text: "MES系统",
                    prefix: "/softwareDesign/seeSystem/mesSystem/",
                    collapsible: true,
                    children: [
                        "readme.md"
                    ]
                },
                "wmsSystem.md",
                "erpSystem.md",
            ]
        },
        {
            text: "系统设计",
            prefix: "/softwareDesign/systemDesign/",
            collapsible: true,
            children: [
                "overviewOfSoftwareArchitecture.md",
                "understandingComplexBusiness.md",
                "clientTryOut.md",
                "systemLogOperation.md",
                "loginSecurity.md",
                "licenseAuth.md",
                "softLicence.md",
                "oneTimePassword.md",
                "pipelineMethodCompletesComplexProcess.md"
            ]
        },
        "umlClass.md",
        "codeThought.md",
        {
            text: "高质量代码",
            prefix: "/softwareDesign/highQualityCode/",
            collapsible: true,
            children: [
                "shuiming.md",
                {
                    text: "面向对象",
                    prefix: "/softwareDesign/highQualityCode/mianxiangduixiang/",
                    collapsible: true,
                    children: [
                        "mianxiangduixiang.md",
                        "mianxiangduixianghemianxiangguocheng.md",
                        "mianxiangduixiangfenxi.md",
                        "leizhijiandeguanji.md"
                    ]
                },
                "designPrinciples.md",
                {
                    text: "设计模式",
                    prefix: "/softwareDesign/highQualityCode/designMode/",
                    collapsible: true,
                    children: [
                        "overview.md",
                        {
                            text: "创建型",
                            prefix: "/softwareDesign/highQualityCode/designMode/chuangjianxing/",
                            collapsible: true,
                            children: [
                                "singletonMode.md",
                                "factoryMode.md",
                                "jianzaozhemoshi.md",
                                "yuanxingmoshi.md"
                            ]
                        },
                        {
                            text: "结构型",
                            prefix: "/softwareDesign/highQualityCode/designMode/jiegouxing/",
                            collapsible: true,
                            children: [
                                "dailimoshi.md",
                                "qiaojiemoshi.md",
                                "zhuangshiqimoshi.md",
                                "kuopeiqimoshi.md",
                                "menmianmoshi.md",
                                "zugemoshi.md",
                                "xiangyuanmoshi.md"
                            ]
                        },
                        {
                            text: "行为型",
                            prefix: "/softwareDesign/highQualityCode/designMode/hangweixing/",
                            collapsible: true,
                            children: [
                                "guanchazhemoshi.md",
                                "mobanmoshi.md",
                                "celvemoshi.md",
                                "zhizelianmoshi.md",
                                "zhuangtaimoshi.md",
                                "diedaiqimoshi.md",
                                "fangwenzhemoshi.md",
                                "beiwanglumoshi.md",
                                "minglingmoshi.md",
                                "jieshiqimoshi.md",
                                "zhongjiezhemoshi.md"
                            ]
                        }
                    ]
                },
                {
                    text: "规范与重构",
                    prefix: "/softwareDesign/highQualityCode/guifanyuchonggou/",
                    collapsible: true,
                    children: [
                        "chonggougaishu.md",
                        "mingmingfangfa.md",
                        "bianmaguifan.md",
                        "jieou.md",
                        "chucuodefanhuizhi.md"
                    ]
                },
                "ruhepingjiadaimahaohuai.md"
            ]
        },
        "xuqiufenxihesheji.md",
        {
            text: "DDD领域驱动",
            prefix: "/softwareDesign/domainDrivenDesign/",
            collapsible: true,
            children: [
                "readme.md",
                "clearArchitecture.md",
                {
                    text: "常用概念",
                    prefix: "/softwareDesign/domainDrivenDesign/commonConcept/",
                    collapsible: true,
                    children: [
                        "readme.md",
                        "modelDesignMode.md",
                        "dddzhizhiduixiang.md",
                        "dddzhishiti.md"
                    ]
                },
                "codingPractice.md"
            ]
        },
        "openSourceProject.md",
        {
            text: "开源框架",
            prefix: "/softwareDesign/openSourceFrame/",
            collapsible: true,
            children: [
                "manyTenant.md",
                "wtm.md",
                {
                    text: "ABP",
                    prefix: "/softwareDesign/openSourceFrame/abp/",
                    collapsible: true,
                    children: [
                        "shuiming.md",
                        "mokuaiheyilai.md",
                        "changyongmingling.md"
                    ]
                }
            ]
        },
        "baseTheory.md"
    ];